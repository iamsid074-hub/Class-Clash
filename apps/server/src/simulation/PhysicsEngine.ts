import {
  PlayerState,
  PlayerInputPayload,
  MapConfig,
  Vector3D,
  GAME_RULES,
} from '@class-clash/shared';

export class PhysicsEngine {
  // Configurable Character & Physics Constants
  public static readonly PLAYER_HEIGHT = 1.6;
  public static readonly PLAYER_RADIUS = 0.4;
  public static readonly GROUND_CHECK_DISTANCE = 0.15;
  public static readonly MAX_STEP_HEIGHT = 0.3;
  public static readonly MAX_SLOPE_ANGLE = 45;
  public static readonly FALL_LIMIT = -15;

  private static GRAVITY = -24;
  private static JUMP_IMPULSE = 11;
  private static MOVE_SPEED = 9;
  private static SPRINT_SPEED = 13;

  public static updatePlayer(
    player: PlayerState,
    input: PlayerInputPayload,
    delta: number,
    map: MapConfig
  ): void {
    if (
      player.status === 'FINISHED' ||
      player.status === 'ELIMINATED' ||
      player.status === 'DISCONNECTED'
    ) {
      return;
    }

    // Respawn state freeze check
    if (player.status === 'RESPAWNING') {
      return;
    }

    const speed = input.sprint ? this.SPRINT_SPEED : this.MOVE_SPEED;

    // Calculate WASD directional input with cancellation & diagonal normalization
    let forwardInput = 0;
    if (input.forward && !input.backward) forwardInput = 1;
    if (input.backward && !input.forward) forwardInput = -1;

    let strafeInput = 0;
    if (input.right && !input.left) strafeInput = 1;
    if (input.left && !input.right) strafeInput = -1;

    const length = Math.hypot(strafeInput, forwardInput);

    if (length > 0) {
      const normStrafe = strafeInput / length;
      const normForward = forwardInput / length;

      // Camera-relative direction transformation
      const sin = Math.sin(input.rotationY);
      const cos = Math.cos(input.rotationY);

      const moveX = normStrafe * cos + normForward * sin;
      const moveZ = -normStrafe * sin + normForward * cos;

      player.velocity.x = moveX * speed;
      player.velocity.z = moveZ * speed;

      // Character rotates smoothly toward movement direction
      player.rotationY = Math.atan2(moveX, moveZ);
      player.status = player.isGrounded ? 'RUNNING' : 'JUMPING';
    } else {
      player.velocity.x *= 0.75; // Smooth deceleration
      player.velocity.z *= 0.75;
      if (player.isGrounded) {
        player.status = 'IDLE';
      }
    }

    // Jumping - Only allowed when grounded
    if (input.jump && player.isGrounded) {
      player.velocity.y = this.JUMP_IMPULSE;
      player.isGrounded = false;
      player.status = 'JUMPING';
    }

    // Apply gravity ONLY when airborne
    if (!player.isGrounded) {
      player.velocity.y += this.GRAVITY * delta;
    }

    // Update position
    player.position.x += player.velocity.x * delta;
    player.position.y += player.velocity.y * delta;
    player.position.z += player.velocity.z * delta;

    // -------------------------------------------------------------
    // ACCURATE PIECEWISE GROUND HEIGHT EVALUATION (RAMPS + DECKS)
    // -------------------------------------------------------------
    let highestGroundY = -999;

    if (Math.abs(player.position.x) <= 10.5) {
      const z = player.position.z;
      let surfaceY = -999;

      if (z >= -20 && z <= 0) {
        // Section 1: Start Arena Platform Top
        surfaceY = 0.6;
      } else if (z > 0 && z <= 26) {
        // Section 2: Initial Ascent Ramp (Rises from 0.6m to 7.1m)
        const t = z / 26;
        surfaceY = 0.6 + t * 6.5;
      } else if (z > 26 && z <= 71) {
        // Section 3: Cannon Hazard Deck Top
        surfaceY = 7.6;
      } else if (z > 71 && z <= 119) {
        // Section 4 -> 5: Ascending Ramp UP (Rises from 7.6m to 18.1m)
        const t = (z - 71) / 48;
        surfaceY = 7.6 + t * 10.5;
      } else if (z > 119 && z <= 190) {
        // Section 6: High Elevated Speedway Top
        surfaceY = 22.6;
      } else if (z > 190 && z <= 285) {
        // Section 8 -> 9: Mountain Peak Ramp (Rises from 22.6m to 49.4m)
        const t = (z - 190) / 95;
        surfaceY = 22.6 + t * 26.8;
      } else if (z > 285 && z <= 340) {
        // Section 11: Grand Finish Arena Top
        surfaceY = 52.6;
      }

      if (surfaceY !== -999) {
        highestGroundY = Math.max(highestGroundY, surfaceY);
      }
    }

    // Check collisions with map obstacles (Moving Platforms, Conveyors, Bounce Pads)
    for (const obstacle of map.obstacles) {
      if (
        obstacle.type === 'MOVING_PLATFORM' ||
        obstacle.type === 'FALLING_PLATFORM'
      ) {
        const halfX = obstacle.dimensions.x / 2 + this.PLAYER_RADIUS;
        const halfZ = obstacle.dimensions.z / 2 + this.PLAYER_RADIUS;

        if (
          Math.abs(player.position.x - obstacle.position.x) < halfX &&
          Math.abs(player.position.z - obstacle.position.z) < halfZ
        ) {
          const platformTopY = obstacle.position.y + obstacle.dimensions.y / 2;
          if (
            player.position.y <= platformTopY + 0.6 &&
            player.position.y >= platformTopY - 1.2 &&
            player.velocity.y <= 0
          ) {
            highestGroundY = Math.max(highestGroundY, platformTopY);

            // Inherit horizontal platform motion when standing on moving platform
            const time = Date.now() / 1000;
            const platformSpeed = obstacle.speed || 2.0;
            const platformDx = Math.cos(time * platformSpeed) * 5.5 * delta;
            player.position.x += platformDx;
          }
        }
      } else if (obstacle.type === 'CONVEYOR') {
        const halfX = obstacle.dimensions.x / 2 + this.PLAYER_RADIUS;
        const halfZ = obstacle.dimensions.z / 2 + this.PLAYER_RADIUS;

        if (
          Math.abs(player.position.x - obstacle.position.x) < halfX &&
          Math.abs(player.position.z - obstacle.position.z) < halfZ
        ) {
          const conveyorTopY = obstacle.position.y + obstacle.dimensions.y / 2;
          if (
            player.position.y <= conveyorTopY + 0.6 &&
            player.position.y >= conveyorTopY - 0.8
          ) {
            highestGroundY = Math.max(highestGroundY, conveyorTopY);
            // Push player backward along conveyor speed
            player.position.z -= (obstacle.speed || 4.5) * delta;
          }
        }
      } else if (obstacle.type === 'BOUNCE_PAD') {
        const halfX = obstacle.dimensions.x / 2;
        const halfZ = obstacle.dimensions.z / 2;

        if (
          Math.abs(player.position.x - obstacle.position.x) < halfX &&
          Math.abs(player.position.z - obstacle.position.z) < halfZ &&
          Math.abs(player.position.y - obstacle.position.y) < 1.2
        ) {
          player.velocity.y = obstacle.speed || 16;
          player.isGrounded = false;
        }
      } else if (obstacle.type === 'ROTATING_BAR') {
        // Rotating arm knockback
        const distToBarCenter = Math.hypot(
          player.position.x - obstacle.position.x,
          player.position.z - obstacle.position.z
        );
        const barHalfLength = obstacle.dimensions.x / 2;

        if (
          distToBarCenter < barHalfLength &&
          Math.abs(player.position.y - obstacle.position.y) < 1.2
        ) {
          const knockAngle = Math.atan2(
            player.position.z - obstacle.position.z,
            player.position.x - obstacle.position.x
          );
          player.velocity.x = Math.cos(knockAngle) * 14;
          player.velocity.z = Math.sin(knockAngle) * 14;
          player.velocity.y = 7;
          player.status = 'STUMBLING';
        }
      }
    }

    // Ground Snapping & Grounded State Evaluation
    if (
      highestGroundY > -900 &&
      player.position.y <= highestGroundY + this.GROUND_CHECK_DISTANCE &&
      player.velocity.y <= 0
    ) {
      player.position.y = highestGroundY;
      player.velocity.y = 0; // Stop downward vertical velocity while grounded!
      player.isGrounded = true;

      if (player.status === 'JUMPING' || player.status === 'FALLING') {
        player.status = 'IDLE';
      }
    } else {
      player.isGrounded = false;
      if (player.velocity.y < 0 && player.status !== 'STUMBLING') {
        player.status = 'FALLING';
      }
    }

    // Fall Zone Respawn Check (below FALL_LIMIT)
    if (player.position.y < this.FALL_LIMIT) {
      this.respawnPlayer(player, map);
    }

    // Finish Line Detection
    const finish = map.finishLine;
    if (
      Math.abs(player.position.x - finish.position.x) < finish.dimensions.x / 2 &&
      Math.abs(player.position.z - finish.position.z) < finish.dimensions.z / 2 &&
      player.position.y >= finish.position.y - 1
    ) {
      player.status = 'FINISHED';
    }
  }

  public static respawnPlayer(player: PlayerState, map: MapConfig): void {
    player.status = 'RESPAWNING';

    // Find latest passed checkpoint or start spawn
    const passedCheckpoints = map.checkpoints.filter(
      (cp) => player.position.z >= cp.position.z
    );
    const targetCheckpoint =
      passedCheckpoints.length > 0
        ? passedCheckpoints[passedCheckpoints.length - 1]
        : null;

    if (targetCheckpoint) {
      player.position = {
        x: targetCheckpoint.position.x,
        y: 0.8, // Spawn slightly above floor (Y = 0.6 + 0.2)
        z: targetCheckpoint.position.z,
      };
    } else {
      const spawns = map.spawnPointsTeam1;
      const spawn = spawns[Math.floor(Math.random() * spawns.length)];
      player.position = { x: spawn.x, y: 0.8, z: spawn.z };
    }

    player.velocity = { x: 0, y: 0, z: 0 };
    player.isGrounded = true;

    setTimeout(() => {
      if (player.status === 'RESPAWNING') {
        player.status = 'IDLE';
      }
    }, 800);
  }
}
