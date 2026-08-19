// Game Configuration Constants

export const SERVER_CONFIG = {
  TICK_RATE: 30, // 30Hz simulation update loop
  SNAPSHOT_INTERVAL: 1000 / 30,
  CLIENT_INTERPOLATION_BUFFER_MS: 100,
  DISCONNECT_TIMEOUT_MS: 30000,
  MAX_MATCH_DURATION_SEC: 180,
  MAX_TEAM_SIZE: 4,
  TEAMS_PER_MATCH: 2,
  PLAYERS_PER_MATCH: 8,
};

export const GAME_RULES = {
  FINISH_POINTS: [100, 90, 80, 70, 60, 50, 40, 30],
  TEAM_COMPLETION_BONUS: 100,
  FALL_RESPAWN_Y: -15,
  COUNTDOWN_SECONDS: 5,
};

export const TEAM_COLORS = [
  { name: 'Neon Pink', hex: '#ff007f', accent: '#ff66b3' },
  { name: 'Sakura White', hex: '#ffffff', accent: '#ff99cc' },
  { name: 'Hot Rose', hex: '#ff1493', accent: '#ff80bf' },
  { name: 'Electric Magenta', hex: '#e60073', accent: '#ff4da6' },
  { name: 'Flamingo Squad', hex: '#ff66a3', accent: '#ffffff' },
  { name: 'Pearl Syndicate', hex: '#f0f4f8', accent: '#ff3399' },
  { name: 'Crystal Rose', hex: '#ff3385', accent: '#ffe6f2' },
  { name: 'Blush Enforcers', hex: '#ff80ab', accent: '#ffffff' },
];

export const MAP_IDS = {
  SKY_FACTORY: 'sky_factory',
} as const;
