import { PlayerState, PlayerInputPayload, MapConfig } from '@class-clash/shared';
import { PhysicsEngine } from './PhysicsEngine.js';

export class BotController {
  private static botSequenceCounter = 1;

  public static generateBotInput(player: PlayerState, map: MapConfig): PlayerInputPayload {
    const targetZ = map.finishLine.position.z;
    const targetX = 0;

    const diffX = targetX - player.position.x;
    const diffZ = targetZ - player.position.z;

    let forward = diffZ > 0.5;
    let backward = false;
    let left = diffX < -1.5;
    let right = diffX > 1.5;
    let jump = false;

    // Check upcoming obstacles and slow down / time jumps
    for (const obstacle of map.obstacles) {
      const distZ = obstacle.position.z - player.position.z;
      const distX = Math.abs(obstacle.position.x - player.position.x);

      if (distZ > 0 && distZ < 6.0 && distX < 6.0) {
        if (obstacle.type === 'ROTATING_BAR') {
          // Slow down near sweeper bar and jump when close
          if (distZ < 3.2) {
            jump = Math.random() < 0.6; // 60% jump success rate
          }
        } else if (obstacle.type === 'MOVING_PLATFORM') {
          // Pause slightly before jumping on moving platform
          if (distZ < 2.0 && Math.random() < 0.35) {
            forward = false;
          }
        } else if (obstacle.type === 'FALLING_PLATFORM') {
          // Jump over falling floor tiles
          if (distZ < 2.5) {
            jump = true;
          }
        }
      }
    }

    // Relaxed testing pace (occasional pause to allow human testing)
    if (Math.random() < 0.2) {
      forward = false;
    }

    return {
      forward,
      backward,
      left,
      right,
      jump,
      sprint: false, // Zero sprint for bots during testing
      rotationY: Math.atan2(diffX, diffZ > 0 ? diffZ : 1),
      sequence: ++this.botSequenceCounter,
    };
  }

  public static updateBots(
    players: Record<string, PlayerState>,
    delta: number,
    map: MapConfig
  ): void {
    for (const id of Object.keys(players)) {
      const player = players[id];
      if (player.isBot && player.status !== 'FINISHED' && player.status !== 'ELIMINATED') {
        const input = this.generateBotInput(player, map);
        PhysicsEngine.updatePlayer(player, input, delta, map);
      }
    }
  }
}
