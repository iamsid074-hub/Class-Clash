export interface ProcessedInput {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  jump: boolean;
  sprint: boolean;
  forwardInput: number;
  strafeInput: number;
  cameraAngle: number;
}

export class InputController {
  private static keys: { [key: string]: boolean } = {};
  private static isInitialized = false;
  private static cameraAngle = 0;

  public static init(): void {
    if (this.isInitialized) return;
    this.isInitialized = true;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent scrolling when using arrow keys or Space inside game
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        if (document.activeElement === document.body || document.activeElement?.tagName === 'CANVAS') {
          e.preventDefault();
        }
      }
      this.keys[e.code] = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      this.keys[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
  }

  public static setCameraAngle(angle: number): void {
    this.cameraAngle = angle;
  }

  public static setVirtualKey(code: string, isPressed: boolean): void {
    this.keys[code] = isPressed;
  }

  public static getProcessedInput(): ProcessedInput {
    const W = this.keys['KeyW'] || this.keys['ArrowUp'] || false;
    const S = this.keys['KeyS'] || this.keys['ArrowDown'] || false;
    const A = this.keys['KeyA'] || this.keys['ArrowLeft'] || false;
    const D = this.keys['KeyD'] || this.keys['ArrowRight'] || false;
    const jump = this.keys['Space'] || false;
    const sprint = this.keys['ShiftLeft'] || this.keys['ShiftRight'] || false;

    // Calculate raw directional inputs with cancellation (W+S = 0, A+D = 0)
    let forwardInput = 0;
    if (W && !S) forwardInput = 1;
    if (S && !W) forwardInput = -1;

    let strafeInput = 0;
    if (D && !A) strafeInput = 1;
    if (A && !D) strafeInput = -1;

    // Normalize diagonal movement vector so W+D speed equals W speed
    const magnitude = Math.hypot(strafeInput, forwardInput);
    if (magnitude > 0) {
      strafeInput /= magnitude;
      forwardInput /= magnitude;
    }

    return {
      forward: W,
      backward: S,
      left: A,
      right: D,
      jump,
      sprint,
      forwardInput,
      strafeInput,
      cameraAngle: this.cameraAngle,
    };
  }
}
