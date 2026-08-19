// Shared Game Data Types & Protocols - CLASHA

export type ConnectionStatus = 'CONNECTED' | 'RECONNECTING' | 'DISCONNECTED';

export type PlayerStateStatus =
  | 'IDLE'
  | 'RUNNING'
  | 'JUMPING'
  | 'FALLING'
  | 'STUMBLING'
  | 'STUNNED'
  | 'RESPAWNING'
  | 'FINISHED'
  | 'ELIMINATED'
  | 'DISCONNECTED';

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface PlayerState {
  id: string;
  displayName: string;
  avatar: string;
  teamId: string | null;
  position: Vector3D;
  rotationY: number;
  velocity: Vector3D;
  status: PlayerStateStatus;
  isGrounded: boolean;
  isReady: boolean;
  connectionStatus: ConnectionStatus;
  finishTimeMs?: number;
  finishRank?: number;
  score: number;
  ping: number;
  isBot?: boolean;
}

// -------------------------------------------------------------
// SOLO SOCIAL PARTY GAME PHASE & CHALLENGE DATA STRUCTURES
// -------------------------------------------------------------
export type SoloGamePhase =
  | 'LOBBY'
  | 'CABIN_FREE_ROAM'
  | 'PLAYER_SELECTION'
  | 'DISCUSSION_AND_VOTING'
  | 'LEADER_SELECTION'
  | 'LEADER_CONFIRMATION'
  | 'CHALLENGE_EXECUTION'
  | 'ROUND_RESULT'
  | 'GAME_OVER_CHAMPION';

export interface ChallengeProposal {
  id: string;
  proposerId: string;
  proposerName: string;
  text: string;
  votesCount: number;
  voterIds: string[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
}

export interface SoloGameState {
  roomCode: string;
  isLocked: boolean;
  currentRound: number; // 1, 2, 3
  totalRounds: number; // 3
  phase: SoloGamePhase;
  phaseTimeRemaining: number; // seconds
  selectedPlayerId: string | null;
  leaderPlayerId: string | null;
  proposals: ChallengeProposal[];
  winningProposal: ChallengeProposal | null;
  chatMessages: ChatMessage[];
  championPlayerId: string | null;
}

export type TeamStatus =
  | 'WAITING'
  | 'READY'
  | 'MATCHED'
  | 'RACING'
  | 'FINISHED'
  | 'ADVANCED'
  | 'ELIMINATED'
  | 'CHAMPION';

export interface TeamMember {
  id: string;
  displayName: string;
  avatar: string;
  isCaptain: boolean;
  isReady: boolean;
}

export interface Team {
  id: string;
  code: string;
  name: string;
  color: string;
  accentColor: string;
  captainId: string;
  members: TeamMember[];
  status: TeamStatus;
  cabinIndex: number;
  wins: number;
  losses: number;
  points: number;
}

export type TournamentStage =
  | 'LOBBY'
  | 'MATCHMAKING'
  | 'QUARTER_FINALS'
  | 'SEMI_FINALS'
  | 'FINALS'
  | 'CHAMPION';

export interface Matchup {
  id: string;
  roundName: string;
  team1Id: string;
  team2Id: string;
  winnerTeamId?: string;
  isBye?: boolean;
  status: 'PENDING' | 'COUNTDOWN' | 'IN_PROGRESS' | 'COMPLETED';
  team1Score?: number;
  team2Score?: number;
}

export interface TournamentBracketNode {
  id: string;
  stage: TournamentStage;
  matchup: Matchup;
  nextMatchupId?: string;
}

export interface TournamentState {
  id: string;
  code: string;
  stage: TournamentStage;
  teams: Record<string, Team>;
  bracket: TournamentBracketNode[];
  currentMatchupId?: string;
  championTeamId?: string;
}

export type ObstacleType =
  | 'ROTATING_BAR'
  | 'MOVING_PLATFORM'
  | 'FALLING_PLATFORM'
  | 'SWINGING_HAMMER'
  | 'CONVEYOR'
  | 'BOUNCE_PAD'
  | 'FINISH_LINE';

export interface ObstacleConfig {
  id: string;
  type: ObstacleType;
  position: Vector3D;
  rotation?: Vector3D;
  dimensions: Vector3D;
  speed?: number;
  axis?: 'x' | 'y' | 'z';
  range?: number;
  delay?: number;
}

export interface CheckpointConfig {
  id: string;
  order: number;
  position: Vector3D;
  dimensions: Vector3D;
}

export interface MapConfig {
  id: string;
  name: string;
  theme: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  maxDurationSec: number;
  spawnPointsTeam1: Vector3D[];
  spawnPointsTeam2: Vector3D[];
  checkpoints: CheckpointConfig[];
  finishLine: { position: Vector3D; dimensions: Vector3D };
  respawnY: number;
  obstacles: ObstacleConfig[];
}

export interface PlayerInputPayload {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  jump: boolean;
  sprint: boolean;
  rotationY: number;
  sequence: number;
}

export interface MatchSnapshot {
  matchId: string;
  sequence: number;
  timestamp: number;
  players: Record<string, PlayerState>;
  obstacles: Record<string, { position: Vector3D; rotationY: number }>;
}

// Network Message Types
export type ClientMessageType =
  | 'JOIN_ROOM'
  | 'CREATE_TEAM'
  | 'JOIN_TEAM'
  | 'LEAVE_TEAM'
  | 'TOGGLE_READY'
  | 'START_TOURNAMENT'
  | 'START_SOLO_GAME'
  | 'SUBMIT_PROPOSAL'
  | 'VOTE_PROPOSAL'
  | 'CONFIRM_CHALLENGE'
  | 'COMPLETE_CHALLENGE'
  | 'SEND_CHAT'
  | 'PLAYER_INPUT'
  | 'PING'
  | 'ADD_BOTS'
  | 'SKIP_PHASE'
  | 'UPDATE_PLAYER';

export type ServerMessageType =
  | 'ROOM_STATE'
  | 'SOLO_GAME_STATE'
  | 'TEAM_UPDATED'
  | 'TOURNAMENT_UPDATED'
  | 'MATCH_FOUND'
  | 'MATCH_START'
  | 'MATCH_SNAPSHOT'
  | 'PLAYER_FINISHED'
  | 'MATCH_RESULTS'
  | 'PONG'
  | 'ERROR_NOTIFICATION';

export interface NetworkMessage<T = any> {
  type: ClientMessageType | ServerMessageType;
  payload: T;
}
