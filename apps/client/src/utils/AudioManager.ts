/**
 * Singleton Audio Manager for CLASHA
 * Handles global background music playback & sound effects across all screens
 */

export class AudioManager {
  private static bgAudio: HTMLAudioElement | null = null;
  private static isInitialized = false;
  private static musicVolume = 0.7;
  private static masterVolume = 0.85;
  private static isMusicEnabled = true;
  private static hasUserInteracted = false;

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
        if (typeof parsed.masterVolume === 'number') {
          this.masterVolume = parsed.masterVolume / 100;
        }
      }
    } catch {
      // default settings
    }

    try {
      this.bgAudio = new Audio('/sounds/bg_music.mp3');
      this.bgAudio.loop = true;
      this.bgAudio.volume = this.calculateEffectiveVolume();
      this.isInitialized = true;

      // Browser Autoplay Policy listener
      const handleFirstInteraction = () => {
        this.hasUserInteracted = true;
        if (this.isMusicEnabled && this.bgAudio && this.bgAudio.paused) {
          this.bgAudio.play().catch((err) => {
            console.warn('Audio play deferred until next interaction:', err);
          });
        }
        window.removeEventListener('click', handleFirstInteraction);
        window.removeEventListener('keydown', handleFirstInteraction);
        window.removeEventListener('pointerdown', handleFirstInteraction);
      };

      window.addEventListener('click', handleFirstInteraction);
      window.addEventListener('keydown', handleFirstInteraction);
      window.addEventListener('pointerdown', handleFirstInteraction);

      // Attempt immediate play if allowed
      if (this.isMusicEnabled) {
        this.bgAudio.play().catch(() => {
          // Autoplay blocked until interaction
        });
      }
    } catch (err) {
      console.warn('Failed to initialize background music:', err);
    }
  }

  private static calculateEffectiveVolume(): number {
    return Math.max(0, Math.min(1, this.musicVolume * this.masterVolume));
  }

  /**
   * Enable or Disable Background Music
   */
  public static setMusicEnabled(enabled: boolean): void {
    this.isMusicEnabled = enabled;

    if (!this.bgAudio) {
      this.initBgMusic();
      return;
    }

    if (enabled) {
      this.bgAudio.play().catch(() => {
        // Deferred until interaction
      });
    } else {
      this.bgAudio.pause();
    }
  }

  /**
   * Update Background Music Volume (0 to 100)
   */
  public static setMusicVolume(volume: number): void {
    this.musicVolume = Math.max(0, Math.min(1, volume / 100));
    if (this.bgAudio) {
      this.bgAudio.volume = this.calculateEffectiveVolume();
    }
  }

  /**
   * Update Master Volume (0 to 100)
   */
  public static setMasterVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume / 100));
    if (this.bgAudio) {
      this.bgAudio.volume = this.calculateEffectiveVolume();
    }
  }
}
