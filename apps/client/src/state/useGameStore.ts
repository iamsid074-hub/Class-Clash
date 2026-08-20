import { create } from 'zustand';
import {
  PlayerState,
  Team,
  TournamentState,
  MatchSnapshot,
  MapConfig,
  Matchup,
} from '@class-clash/shared';

export type GameScreen =
  | 'AUTH'
  | 'MAIN_MENU'
  | 'CREATE_TEAM'
  | 'JOIN_TEAM'
  | 'TEAM_CABIN'
  | 'SOCIAL_LOBBY'
  | 'MATCHMAKING_SHUFFLE'
  | 'RACING_HUD'
  | 'RESULTS'
  | 'BRACKET'
  | 'CHAMPION'
  | 'LEADERBOARD'
  | 'PROFILE'
  | 'SETTINGS';

interface GameStore {
  screen: GameScreen;
  setScreen: (screen: GameScreen) => void;

  isConnected: boolean;
  setIsConnected: (connected: boolean) => void;

  roomCode: string;
  setRoomCode: (code: string) => void;

  roomPassword: string;
  setRoomPassword: (pass: string) => void;

  playerId: string;
  setPlayerId: (id: string) => void;

  displayName: string;
  setDisplayName: (name: string) => void;

  players: Record<string, PlayerState>;
  teams: Record<string, Team>;
  tournament: TournamentState | null;

  currentMatchup: Matchup | null;
  currentMap: MapConfig | null;

  latestSnapshot: MatchSnapshot | null;
  lastMatchResult: any | null;
  soloGameState: any | null;

  updateSoloGameState: (state: any) => void;

  initializeLocalRoom: (data: { roomCode: string; roomPassword?: string; displayName: string; isHost: boolean }) => void;

  updateRoomState: (data: {
    roomCode: string;
    roomPassword?: string;
    playerId?: string;
    players: Record<string, PlayerState>;
    teams: Record<string, Team>;
    tournament: TournamentState | null;
  }) => void;

  setMatchStart: (data: { matchup: Matchup; map: MapConfig }) => void;
  setMatchSnapshot: (snapshot: MatchSnapshot) => void;
  setMatchResults: (data: any) => void;
  isGateActive: boolean;
  isGateClosed: boolean;
  gateTitle: string;
  gateSubhead: string;
  errorMessage: string | null;
  setErrorMessage: (msg: string | null) => void;
  triggerGateTransition: (onMidpoint?: () => void, title?: string, subhead?: string) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  screen: 'AUTH',
  setScreen: (screen) => set({ screen }),

  isGateActive: false,
  isGateClosed: false,
  gateTitle: 'ENTER ARENA',
  gateSubhead: 'CLASHA',
  errorMessage: null,
  setErrorMessage: (errorMessage) => set({ errorMessage }),

  triggerGateTransition: (onMidpoint, title = 'ENTER ARENA', subhead = 'CLASHA') => {
    // Step 0: Mount gates off-screen in open position with locked title & subhead
    set({ isGateActive: true, isGateClosed: false, gateTitle: title, gateSubhead: subhead });

    // Step 1: Slam gates shut into center (30ms -> 450ms)
    setTimeout(() => {
      set({ isGateClosed: true });
    }, 30);

    // Step 2: Switch screen at midpoint when gates are 100% closed (500ms)
    setTimeout(() => {
      if (onMidpoint) onMidpoint();
    }, 500);

    // Step 3: Retract gates open (1600ms -> 2100ms)
    setTimeout(() => {
      set({ isGateClosed: false });
    }, 1600);

    // Step 4: Unmount transition overlay (2150ms)
    setTimeout(() => {
      set({ isGateActive: false });
    }, 2150);
  },

  isConnected: false,
  setIsConnected: (isConnected) => set({ isConnected }),

  roomCode: '',
  setRoomCode: (roomCode) => set({ roomCode }),

  roomPassword: '',
  setRoomPassword: (roomPassword) => set({ roomPassword }),

  playerId: '',
  setPlayerId: (playerId) => set({ playerId }),

  displayName: `Racer_${Math.floor(Math.random() * 900 + 100)}`,
  setDisplayName: (displayName) => set({ displayName }),

  players: {},
  teams: {},
  tournament: null,

  currentMatchup: null,
  currentMap: null,

  latestSnapshot: null,
  lastMatchResult: null,
  soloGameState: null,

  updateSoloGameState: (data) =>
    set((state) => ({
      soloGameState: state.soloGameState ? { ...state.soloGameState, ...data } : data,
    })),

  initializeLocalRoom: (data) => {
    const localId = get().playerId || `player_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const newPlayer: PlayerState = {
      id: localId,
      displayName: data.displayName || 'Racer',
      avatar: data.isHost ? 'avatar_cyber' : 'avatar_neon',
      teamId: null,
      position: { x: 0, y: 1.5, z: 0 },
      rotationY: 0,
      velocity: { x: 0, y: 0, z: 0 },
      status: 'IDLE',
      isGrounded: true,
      isReady: false,
      connectionStatus: 'CONNECTED',
      score: 0,
      ping: 20,
    };

    set((state) => ({
      roomCode: data.roomCode,
      roomPassword: data.roomPassword || state.roomPassword,
      playerId: localId,
      players: Object.keys(state.players).length > 0 ? state.players : { [localId]: newPlayer },
      teams: state.teams,
      soloGameState: state.soloGameState || {
        roomCode: data.roomCode,
        isLocked: false,
        currentRound: 1,
        totalRounds: 3,
        phase: 'LOBBY',
        phaseTimeRemaining: 180,
        selectedPlayerId: null,
        leaderPlayerId: null,
        proposals: [],
        winningProposal: null,
        chatMessages: [],
        championPlayerId: null,
      },
    }));
  },

  updateRoomState: (data) =>
    set((state) => ({
      roomCode: data.roomCode,
      roomPassword: data.roomPassword || state.roomPassword,
      playerId: data.playerId || state.playerId,
      players: data.players,
      teams: data.teams,
      tournament: data.tournament || state.tournament,
      errorMessage: null,
      screen:
        data.tournament?.stage === 'CHAMPION'
          ? 'CHAMPION'
          : data.roomCode
          ? 'TEAM_CABIN'
          : state.screen,
    })),

  setMatchStart: (data) =>
    set({
      currentMatchup: data.matchup,
      currentMap: data.map,
      screen: 'MATCHMAKING_SHUFFLE',
    }),

  setMatchSnapshot: (snapshot) => set({ latestSnapshot: snapshot }),

  setMatchResults: (data) =>
    set({
      lastMatchResult: data,
      screen: 'RESULTS',
    }),
}));
