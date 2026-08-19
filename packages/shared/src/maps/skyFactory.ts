import { MapConfig } from '../types.js';

export const SKY_FACTORY_MAP: MapConfig = {
  id: 'sky_factory',
  name: 'Skybreak Run',
  theme: 'Floating Skybreak Arena above Clouds',
  difficulty: 'MEDIUM',
  maxDurationSec: 180,
  respawnY: -15,
  spawnPointsTeam1: [
    { x: -5, y: 1.5, z: -8 },
    { x: -2, y: 1.5, z: -8 },
    { x: 2, y: 1.5, z: -8 },
    { x: 5, y: 1.5, z: -8 },
  ],
  spawnPointsTeam2: [
    { x: -5, y: 1.5, z: -12 },
    { x: -2, y: 1.5, z: -12 },
    { x: 2, y: 1.5, z: -12 },
    { x: 5, y: 1.5, z: -12 },
  ],
  checkpoints: [
    { id: 'cp1', order: 1, position: { x: 0, y: 1.5, z: 30 }, dimensions: { x: 18, y: 5, z: 3 } },
    { id: 'cp2', order: 2, position: { x: 0, y: 1.5, z: 85 }, dimensions: { x: 18, y: 5, z: 3 } },
    { id: 'cp3', order: 3, position: { x: 0, y: 1.5, z: 150 }, dimensions: { x: 18, y: 5, z: 3 } },
    { id: 'cp4', order: 4, position: { x: 0, y: 1.5, z: 220 }, dimensions: { x: 18, y: 5, z: 3 } },
  ],
  finishLine: {
    position: { x: 0, y: 1.5, z: 285 },
    dimensions: { x: 20, y: 8, z: 4 },
  },
  obstacles: [
    // SECTION 2: Moving Steps (Sideways Platforms)
    {
      id: 'platform_mov_1',
      type: 'MOVING_PLATFORM',
      position: { x: -5, y: 1, z: 25 },
      dimensions: { x: 5, y: 0.6, z: 5 },
      speed: 2.0,
      axis: 'x',
      range: 6,
    },
    {
      id: 'platform_mov_2',
      type: 'MOVING_PLATFORM',
      position: { x: 5, y: 1, z: 40 },
      dimensions: { x: 5, y: 0.6, z: 5 },
      speed: -2.2,
      axis: 'x',
      range: 6,
    },

    // SECTION 3: Rotating Arms Sweepers
    {
      id: 'bar_1',
      type: 'ROTATING_BAR',
      position: { x: 0, y: 1.2, z: 55 },
      dimensions: { x: 12, y: 0.8, z: 0.8 },
      speed: 2.5,
      axis: 'y',
    },
    {
      id: 'bar_2',
      type: 'ROTATING_BAR',
      position: { x: 0, y: 1.2, z: 70 },
      dimensions: { x: 14, y: 0.8, z: 0.8 },
      speed: -3.0,
      axis: 'y',
    },

    // SECTION 4: Conveyor Section
    {
      id: 'conveyor_1',
      type: 'CONVEYOR',
      position: { x: -4, y: 1, z: 95 },
      dimensions: { x: 5, y: 0.4, z: 20 },
      speed: -3.5, // pushes backward
    },
    {
      id: 'conveyor_2',
      type: 'CONVEYOR',
      position: { x: 4, y: 1, z: 95 },
      dimensions: { x: 5, y: 0.4, z: 20 },
      speed: -3.5,
    },

    // SECTION 5: Falling Tiles Floor
    {
      id: 'fall_plat_1',
      type: 'FALLING_PLATFORM',
      position: { x: -3, y: 1, z: 125 },
      dimensions: { x: 4, y: 0.6, z: 4 },
      speed: 1.0,
    },
    {
      id: 'fall_plat_2',
      type: 'FALLING_PLATFORM',
      position: { x: 3, y: 1, z: 135 },
      dimensions: { x: 4, y: 0.6, z: 4 },
      speed: 1.0,
    },

    // SECTION 6: Bounce Valley
    {
      id: 'bounce_1',
      type: 'BOUNCE_PAD',
      position: { x: 0, y: 1, z: 165 },
      dimensions: { x: 4, y: 0.5, z: 4 },
      speed: 16.0,
    },

    // SECTION 7: Swinging Padded Hammers
    {
      id: 'hammer_1',
      type: 'SWINGING_HAMMER',
      position: { x: -3, y: 4, z: 190 },
      dimensions: { x: 1.2, y: 4, z: 2.2 },
      speed: 2.2,
      axis: 'z',
      range: 1.0,
    },
    {
      id: 'hammer_2',
      type: 'SWINGING_HAMMER',
      position: { x: 3, y: 4, z: 205 },
      dimensions: { x: 1.2, y: 4, z: 2.2 },
      speed: 2.8,
      axis: 'z',
      range: 1.0,
      delay: 0.4,
    },

    // SECTION 9: Final Rotating Circular Platform & Sweepers
    {
      id: 'final_spinner_1',
      type: 'ROTATING_BAR',
      position: { x: 0, y: 1.5, z: 245 },
      dimensions: { x: 16, y: 1.0, z: 1.0 },
      speed: 3.5,
      axis: 'y',
    },

    // SECTION 10: Final Climb Moving Walls
    {
      id: 'moving_wall_1',
      type: 'MOVING_PLATFORM',
      position: { x: -4, y: 2.5, z: 268 },
      dimensions: { x: 6, y: 4, z: 1 },
      speed: 3.0,
      axis: 'x',
      range: 4,
    },
  ],
};
