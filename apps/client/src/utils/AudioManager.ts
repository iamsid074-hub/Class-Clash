/**
 * Singleton Audio Manager for CLASHA
 * Handles global background music playback with smooth Fade-In / Fade-Out transitions
 * and independent SFX/Dare volume controls.
 */

export class AudioManager {
  private static bgAudio: HTMLAudioElement | null = null;
  private static isInitialized = false;
  private static musicVolume = 0.7; // BG Music Volume (0-1)
  private static sfxVolume = 0.9; // SFX & Dare Volume (0-1)
  private static isMusicEnabled = true;
  private static fadeInterval: NodeJS.Timeout | null = null;

  /**
   * Initialize Global Background Music
   */
  public static initBgMusic(): void {
    if (this.isInitialized && this.bgAudio) return;

    // Load saved settings from localStorage if available
    try {
      const saved = localStorage.getItem('clasha_game_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.isBgMusicEnabled === 'boolean') {
          this.isMusicEnabled = parsed.isBgMusicEnabled;
        }
        if (typeof parsed.musicVolume === 'number') {
          this.musicVolume = parsed.musicVolume / 100;
        }
        if (typeof parsed.sfxVolume === 'number') {
          this.sfxVolume = parsed.sfxVolume / 100;
        }
      }
    } catch {
      // default settings
    }

    try {
      this.bgAudio = new Audio('/sounds/bg_music.mp3');
      this.bgAudio.loop = true;
      this.bgAudio.volume = 0; // Start muted for smooth fade-in
      this.isInitialized = true;

      // Browser Autoplay Policy listener
      const handleFirstInteraction = () => {
        if (this.isMusicEnabled && this.bgAudio) {
          this.fadeIn(1500);
        }
        window.removeEventListener('click', handleFirstInteraction);
        window.removeEventListener('keydown', handleFirstInteraction);
        window.removeEventListener('pointerdown', handleFirstInteraction);
      };

      window.addEventListener('click', handleFirstInteraction);
      window.addEventListener('keydown', handleFirstInteraction);
      window.addEventListener('pointerdown', handleFirstInteraction);

      // Attempt immediate fade-in if allowed
      if (this.isMusicEnabled) {
        this.fadeIn(1200);
      }
    } catch (err) {
      console.warn('Failed to initialize background music:', err);
    }
  }

  private static clearFadeTimer() {
    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
      this.fadeInterval = null;
    }
  }

  /**
   * Smooth Audio Fade-In Transition
   */
  public static fadeIn(durationMs: number = 1200): void {
    if (!this.bgAudio || !this.isMusicEnabled) return;
    this.clearFadeTimer();

    const targetVol = Math.max(0, Math.min(1, this.musicVolume));
    this.bgAudio.volume = 0;

    this.bgAudio.play().catch(() => {
      // Deferred until user interaction
    });

    const stepMs = 30;
    const totalSteps = Math.max(1, durationMs / stepMs);
    const volumeStep = targetVol / totalSteps;
    let currentStep = 0;

    this.fadeInterval = setInterval(() => {
      currentStep++;
      if (!this.bgAudio) {
        this.clearFadeTimer();
        return;
      }

      const nextVol = Math.min(targetVol, currentStep * volumeStep);
      this.bgAudio.volume = nextVol;

      if (currentStep >= totalSteps) {
        this.clearFadeTimer();
        this.bgAudio.volume = targetVol;
      }
    }, stepMs);
  }

  /**
   * Smooth Audio Fade-Out Transition
   */
  public static fadeOut(durationMs: number = 800): void {
    if (!this.bgAudio || this.bgAudio.paused) return;
    this.clearFadeTimer();

    const startVol = this.bgAudio.volume;
    const stepMs = 30;
    const totalSteps = Math.max(1, durationMs / stepMs);
    const volumeStep = startVol / totalSteps;
    let currentStep = 0;

    this.fadeInterval = setInterval(() => {
      currentStep++;
      if (!this.bgAudio) {
        this.clearFadeTimer();
        return;
      }

      const nextVol = Math.max(0, startVol - currentStep * volumeStep);
      this.bgAudio.volume = nextVol;

      if (currentStep >= totalSteps) {
        this.clearFadeTimer();
        this.bgAudio.pause();
        this.bgAudio.volume = Math.max(0, Math.min(1, this.musicVolume));
      }
    }, stepMs);
  }

  /**
   * Enable or Disable Background Music with smooth Fade-In / Fade-Out
   */
  public static setMusicEnabled(enabled: boolean): void {
    this.isMusicEnabled = enabled;

    if (!this.bgAudio) {
      this.initBgMusic();
      return;
    }

    if (enabled) {
      this.fadeIn(1200);
    } else {
      this.fadeOut(800);
    }
  }

  /**
   * Update Background Music Volume (0 to 100)
   */
  public static setMusicVolume(volume: number): void {
    this.musicVolume = Math.max(0, Math.min(1, volume / 100));
    if (this.bgAudio && !this.bgAudio.paused && !this.fadeInterval) {
      this.bgAudio.volume = this.musicVolume;
    }
  }

  /**
   * Update Sound Effects & Dare Timer Volume (0 to 100)
   */
  public static setSfxVolume(volume: number): void {
    this.sfxVolume = Math.max(0, Math.min(1, volume / 100));
  }

  /**
   * Get current SFX volume for playing sound effects
   */
  public static getSfxVolume(): number {
    return this.sfxVolume;
  }
}
