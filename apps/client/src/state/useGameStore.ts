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
  | 'SETTINGS'
  | 'WINTER_DOOM';

interface GameStore {
  screen: GameScreen;
  setScreen: (screen: GameScreen) => void;

  isConnected: boolean;
  setIsConnected: (connected: boolean) => void;

  isJoiningCabin: boolean;
  setIsJoiningCabin: (joining: boolean) => void;

  roomCode: string;
  setRoomCode: (code: string) => void;

  roomPassword: string;
  setRoomPassword: (pass: string) => void;

  cabinName: string;
  setCabinName: (name: string) => void;

  cabinTemplate: string;
  setCabinTemplate: (template: string) => void;

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
    cabinName?: string;
    cabinTemplate?: string;
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
  gateShutterBg: string | null;
  activeFullscreenVideo: { src: string; title: string; onComplete?: () => void } | null;
  playFullscreenVideo: (src: string, title?: string, onComplete?: () => void) => void;
  stopFullscreenVideo: () => void;
  errorMessage: string | null;
  setErrorMessage: (msg: string | null) => void;
  triggerGateTransition: (
    onMidpoint?: () => void,
    title?: string,
    subhead?: string,
    shutterBg?: string | null,
    onComplete?: () => void
  ) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  screen: 'AUTH',
  setScreen: (screen) => set({ screen }),

  isGateActive: false,
  isGateClosed: false,
  gateTitle: 'ENTER ARENA',
  gateSubhead: 'CLASHA',
  gateShutterBg: null,
  activeFullscreenVideo: null,

  playFullscreenVideo: (src, title = 'CLASHA EXPLAINER', onComplete) => {
    set({
      activeFullscreenVideo: { src, title, onComplete },
    });
  },

  stopFullscreenVideo: () => {
    const current = get().activeFullscreenVideo;
    set({ activeFullscreenVideo: null });
    if (current?.onComplete) {
      current.onComplete();
    }
  },

  errorMessage: null,
  setErrorMessage: (errorMessage) => set({ errorMessage }),

  triggerGateTransition: (onMidpoint, title = 'ENTER ARENA', subhead = 'CLASHA', shutterBg = null, onComplete) => {
    // Step 0: Mount gates off-screen in open position with locked title, subhead & custom shutterBg
    set({ isGateActive: true, isGateClosed: false, gateTitle: title, gateSubhead: subhead, gateShutterBg: shutterBg || null });

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

    // Step 4: Unmount transition overlay (2150ms), reset shutterBg, and call onComplete after animation finishes
    setTimeout(() => {
      set({ isGateActive: false, gateShutterBg: null });
      if (onComplete) onComplete();
    }, 2150);
  },

  isConnected: false,
  setIsConnected: (isConnected) => set({ isConnected }),

  isJoiningCabin: false,
  setIsJoiningCabin: (isJoiningCabin) => set({ isJoiningCabin }),

  roomCode: '',
  setRoomCode: (roomCode) => set({ roomCode }),

  roomPassword: '',
  setRoomPassword: (roomPassword) => set({ roomPassword }),

  cabinName: '',
  setCabinName: (cabinName) => set({ cabinName }),

  cabinTemplate: 'cabin_1',
  setCabinTemplate: (cabinTemplate) => set({ cabinTemplate }),

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
    // Lightweight placeholder — real state comes from server ROOM_STATE
    set({
      roomCode: data.roomCode,
      roomPassword: data.roomPassword || '',
    });
  },

  updateRoomState: (data) =>
    set((state) => ({
      roomCode: data.roomCode,
      roomPassword: data.roomPassword || state.roomPassword,
      cabinName: data.cabinName || state.cabinName,
      cabinTemplate: data.cabinTemplate || state.cabinTemplate || 'cabin_1',
      playerId: data.playerId || state.playerId,
      players: data.players,
      teams: data.teams,
      tournament: data.tournament || state.tournament,
      errorMessage: null,
      isJoiningCabin: false,
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
