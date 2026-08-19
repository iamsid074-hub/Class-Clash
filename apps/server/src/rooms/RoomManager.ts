import { WebSocket } from 'ws';
import {
  PlayerState,
  Team,
  TournamentState,
  MatchSnapshot,
  NetworkMessage,
  TEAM_COLORS,
  SKY_FACTORY_MAP,
  PlayerInputPayload,
} from '@class-clash/shared';
import { PhysicsEngine } from '../simulation/PhysicsEngine.js';
import { BotController } from '../simulation/BotController.js';
import { TournamentManager } from '../tournament/TournamentManager.js';

import { SoloGameManager } from './SoloGameManager.js';

export interface RoomClient {
  socket: WebSocket;
  playerId: string;
}

export class Room {
  public code: string;
  public password?: string;
  public players: Record<string, PlayerState> = {};
  public teams: Record<string, Team> = {};
  public clients: Map<string, WebSocket> = new Map();
  public tournament: TournamentState | null = null;
  public soloGameManager: SoloGameManager;

  public isMatchActive = false;
  public matchSequence = 0;
  public matchStartTime = 0;
  public finishedPlayers: PlayerState[] = [];
  private simulationInterval: NodeJS.Timeout | null = null;

  constructor(code: string) {
    this.code = code;
    this.soloGameManager = new SoloGameManager(code, this.players, (state) => {
      this.broadcast({
        type: 'SOLO_GAME_STATE',
        payload: state,
      });
    });
    this.soloGameManager.startJoinWindow();
  }

  public createTeam(captainId: string, teamName: string): Team {
    const colorIndex = Object.keys(this.teams).length % TEAM_COLORS.length;
    const color = TEAM_COLORS[colorIndex];

    // Generate unique 4-character team code
    const teamCode = Math.random().toString(36).substring(2, 6).toUpperCase();

    const team: Team = {
      id: `team_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      code: teamCode,
      name: teamName.trim() || `TEAM ${color.name.toUpperCase()}`,
      color: color.hex,
      accentColor: color.accent,
      captainId,
      members: [],
      status: 'WAITING',
      cabinIndex: Object.keys(this.teams).length,
      wins: 0,
      losses: 0,
      points: 0,
    };

    this.teams[team.id] = team;
    this.joinTeam(captainId, team.id);
    return team;
  }

  public joinTeam(playerId: string, teamId: string): boolean {
    const player = this.players[playerId];
    const team = this.teams[teamId];
    if (!player || !team) return false;

    // Check capacity (max 4 players per team)
    if (team.members.length >= 4) return false;

    // Remove from previous team if any
    if (player.teamId && this.teams[player.teamId]) {
      this.leaveTeam(playerId);
    }

    player.teamId = teamId;
    team.members.push({
      id: player.id,
      displayName: player.displayName,
      avatar: player.avatar,
      isCaptain: team.captainId === player.id,
      isReady: player.isReady,
    });

    return true;
  }

  public leaveTeam(playerId: string): void {
    const player = this.players[playerId];
    if (!player || !player.teamId) return;

    const team = this.teams[player.teamId];
    if (team) {
      team.members = team.members.filter((m) => m.id !== playerId);
      if (team.captainId === playerId && team.members.length > 0) {
        team.captainId = team.members[0].id;
        team.members[0].isCaptain = true;
      } else if (team.members.length === 0) {
        delete this.teams[team.id];
      }
    }
    player.teamId = null;
  }

  public addBotsToFillTeams(): void {
    // TESTING MODE: Bot auto-filling disabled so solo testing can take place without bot clutter
    return;
  }

  public startTournament(): void {
    this.addBotsToFillTeams();

    // Create 4 initial teams if needed for full tournament demonstration
    if (Object.keys(this.teams).length < 4) {
      const needed = 4 - Object.keys(this.teams).length;
      for (let i = 0; i < needed; i++) {
        const tempCaptainId = `bot_captain_${i}_${Date.now()}`;
        this.players[tempCaptainId] = {
          id: tempCaptainId,
          displayName: `CPU Captain ${i + 1}`,
          avatar: 'avatar_bot_cap',
          teamId: null,
          position: { x: 0, y: 0, z: 0 },
          rotationY: 0,
          velocity: { x: 0, y: 0, z: 0 },
          status: 'IDLE',
          isGrounded: true,
          isReady: true,
          connectionStatus: 'CONNECTED',
          score: 0,
          ping: 15,
          isBot: true,
        };
        const teamName = `RIVAL SQUAD ${i + 1}`;
        const botTeam = this.createTeam(tempCaptainId, teamName);
        this.addBotsToFillTeams();
      }
    }

    this.tournament = TournamentManager.createTournament(this.code, this.teams);
    this.broadcast({
      type: 'TOURNAMENT_UPDATED',
      payload: this.tournament,
    });

    // Start 1st matchup
    setTimeout(() => {
      this.startCurrentMatch();
    }, 2000);
  }

  public startCurrentMatch(): void {
    if (!this.tournament || !this.tournament.currentMatchupId) return;

    const node = this.tournament.bracket.find((b) => b.id === this.tournament?.currentMatchupId);
    if (!node) return;

    const team1 = this.teams[node.matchup.team1Id];
    const team2 = this.teams[node.matchup.team2Id];

    if (!team1 || !team2) return;

    this.isMatchActive = true;
    this.matchSequence = 0;
    this.matchStartTime = Date.now();
    this.finishedPlayers = [];

    // Position players on Sky Factory spawn points
    let idx1 = 0;
    let idx2 = 0;

    for (const player of Object.values(this.players)) {
      if (player.teamId === team1.id) {
        const spawn = SKY_FACTORY_MAP.spawnPointsTeam1[idx1 % 4];
        player.position = { ...spawn };
        player.velocity = { x: 0, y: 0, z: 0 };
        player.status = 'IDLE';
        idx1++;
      } else if (player.teamId === team2.id) {
        const spawn = SKY_FACTORY_MAP.spawnPointsTeam2[idx2 % 4];
        player.position = { ...spawn };
        player.velocity = { x: 0, y: 0, z: 0 };
        player.status = 'IDLE';
        idx2++;
      }
    }

    this.broadcast({
      type: 'MATCH_START',
      payload: {
        matchup: node.matchup,
        map: SKY_FACTORY_MAP,
        team1,
        team2,
      },
    });

    this.startSimulationLoop();
  }

  public handlePlayerInput(playerId: string, input: PlayerInputPayload): void {
    const player = this.players[playerId];
    if (player && this.isMatchActive) {
      PhysicsEngine.updatePlayer(player, input, 1 / 30, SKY_FACTORY_MAP);
    }
  }

  private startSimulationLoop(): void {
    if (this.simulationInterval) clearInterval(this.simulationInterval);

    this.simulationInterval = setInterval(() => {
      if (!this.isMatchActive) {
        if (this.simulationInterval) clearInterval(this.simulationInterval);
        return;
      }

      this.matchSequence++;

      // Update bot physics
      BotController.updateBots(this.players, 1 / 30, SKY_FACTORY_MAP);

      // Check finished players
      for (const player of Object.values(this.players)) {
        if (player.status === 'FINISHED' && !this.finishedPlayers.includes(player)) {
          player.finishTimeMs = Date.now() - this.matchStartTime;
          player.finishRank = this.finishedPlayers.length + 1;
          this.finishedPlayers.push(player);

          this.broadcast({
            type: 'PLAYER_FINISHED',
            payload: {
              player,
              rank: player.finishRank,
              finishTimeMs: player.finishTimeMs,
            },
          });
        }
      }

      // Broadcast 30Hz snapshot
      const snapshot: MatchSnapshot = {
        matchId: this.tournament?.currentMatchupId || 'match',
        sequence: this.matchSequence,
        timestamp: Date.now(),
        players: this.players,
        obstacles: {},
      };

      this.broadcast({
        type: 'MATCH_SNAPSHOT',
        payload: snapshot,
      });

      // TESTING MODE: Automatic endMatch popup disabled so user can test uninterrupted
      // if (this.finishedPlayers.length >= requiredFinishCount || (Date.now() - this.matchStartTime) / 1000 > 300) {
      //   this.endMatch();
      // }
    }, 1000 / 30);
  }

  private endMatch(): void {
    this.isMatchActive = false;
    if (this.simulationInterval) clearInterval(this.simulationInterval);

    if (!this.tournament || !this.tournament.currentMatchupId) return;

    const node = this.tournament.bracket.find((b) => b.id === this.tournament?.currentMatchupId);
    if (!node) return;

    const team1 = this.teams[node.matchup.team1Id];
    const team2 = this.teams[node.matchup.team2Id];

    const result = TournamentManager.calculateMatchResult(
      node.matchup,
      team1,
      team2,
      this.finishedPlayers
    );

    node.matchup.team1Score = result.team1Score;
    node.matchup.team2Score = result.team2Score;

    TournamentManager.advanceBracket(this.tournament, node.id, result.winningTeamId);

    this.broadcast({
      type: 'MATCH_RESULTS',
      payload: {
        matchup: node.matchup,
        result,
        tournament: this.tournament,
      },
    });
  }

  public broadcast(message: NetworkMessage): void {
    const data = JSON.stringify(message);
    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  }
}

export class RoomManager {
  private static rooms: Record<string, Room> = {};

  public static getOrCreateRoom(code: string): Room {
    const formattedCode = code.trim().toUpperCase();
    if (!this.rooms[formattedCode]) {
      this.rooms[formattedCode] = new Room(formattedCode);
    }
    return this.rooms[formattedCode];
  }

  public static getRoom(code: string): Room | null {
    return this.rooms[code.trim().toUpperCase()] || null;
  }
}
