/**
 * Singleton Audio Manager for CLASHA
 * Handles global background music playback with smooth Fade-In / Fade-Out transitions,
 * button click sound effects, shutter swish sound effects, and independent SFX/Dare volume controls.
 */

export class AudioManager {
  private static bgAudio: HTMLAudioElement | null = null;
  private static isInitialized = false;
  private static musicVolume = 0.7; // BG Music Volume (0-1)
  private static sfxVolume = 0.9; // SFX & Dare Volume (0-1)
  private static isMusicEnabled = true;
  private static fadeInterval: NodeJS.Timeout | null = null;
  private static audioCtx: AudioContext | null = null;
  private static isClickListenerBound = false;

  private static getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  /**
   * Play Authentic Apple iOS Soft Haptic Click/Pop Sound Effect (Web Audio API)
   * Ultra-subtle, premium, soft organic Apple haptic audio feedback.
   */
  public static playClick(): void {
    try {
      const ctx = this.getAudioContext();
      if (!ctx || this.sfxVolume <= 0) return;

      const now = ctx.currentTime;
      const duration = 0.018; // 18ms ultra-subtle Apple haptic click

      // Soft Sine wave oscillator for Apple iOS wood-like haptic pop
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      // Pitch sweep mimicking iOS native click resonance (880Hz -> 420Hz)
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(420, now + duration);

      // Very soft, subtle volume matching iOS UI design
      const vol = Math.min(1, Math.max(0, this.sfxVolume * 0.14));
      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.002);
    } catch {
      // Audio context fallback
    }
  }

  private static shutterAudio: HTMLAudioElement | null = null;

  /**
   * Play Custom Winter Doom Shutter Sound Effect (/sounds/winterdoom.shuttersound.mp3)
   * Plays ONCE when shutter closes.
   */
  public static playWinterDoomShutterSound(): void {
    try {
      if (!this.shutterAudio) {
        this.shutterAudio = new Audio('/sounds/winterdoom.shuttersound.mp3');
      }
      this.shutterAudio.currentTime = 0;
      this.shutterAudio.volume = Math.max(0, Math.min(1, this.sfxVolume * 0.95));
      this.shutterAudio.play().catch(() => {
        // Autoplay policy fallback
      });
    } catch (err) {
      console.warn('Failed to play custom shutter sound effect:', err);
    }
  }

  /**
   * Play Futuristic Metal Shutter Swish / Whoosh Sound Effect (Web Audio API)
   */
  public static playShutterSwish(): void {
    try {
      const ctx = this.getAudioContext();
      if (!ctx || this.sfxVolume <= 0) return;

      const now = ctx.currentTime;
      const duration = 0.45; // 450ms metallic swish sound

      // Noise buffer for air turbulence swish
      const bufferSize = ctx.sampleRate * duration;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      // Bandpass filter sweep for high-to-low heavy swish
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(400, now);
      filter.frequency.exponentialRampToValueAtTime(2600, now + duration * 0.4);
      filter.frequency.exponentialRampToValueAtTime(180, now + duration);
      filter.Q.value = 2.5;

      const gain = ctx.createGain();
      const vol = Math.min(1, Math.max(0, this.sfxVolume * 0.45));
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(vol, now + duration * 0.25);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      noise.connect(filter);
      filter.connect(gain);

      // Low-frequency metallic sub boom sweep
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + duration);

      oscGain.gain.setValueAtTime(0.001, now);
      oscGain.gain.linearRampToValueAtTime(vol * 0.5, now + duration * 0.2);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(oscGain);
      oscGain.connect(gain);

      gain.connect(ctx.destination);

      noise.start(now);
      noise.stop(now + duration);
      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // Audio context fallback
    }
  }

  /**
   * Bind global button click listener for automatic UI click sound effects
   */
  public static initClickSoundListener(): void {
    if (typeof window === 'undefined' || this.isClickListenerBound) return;
    this.isClickListenerBound = true;

    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const button = target.closest('button, [role="button"], a, input[type="submit"], input[type="button"], .btn-press-effect');
      if (button) {
        AudioManager.playClick();
      }
    };
    window.addEventListener('click', handleGlobalClick, { capture: true });
  }

  /**
   * Initialize Global Background Music & SFX Listeners
   */
  public static initBgMusic(): void {
    this.initClickSoundListener();

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

  private static cabin2Audio: HTMLAudioElement | null = null;
  private static cabin2FadeInterval: NodeJS.Timeout | null = null;
  private static isCabin2SoundEnabled = true;

  public static setCabin2SoundEnabled(enabled: boolean): void {
    this.isCabin2SoundEnabled = enabled;
    if (!enabled && this.cabin2Audio && !this.cabin2Audio.paused) {
      this.stopCabin2Sound();
    }
  }

  /**
   * Play Cabin 2 Ambient Sound with smooth Fade-In and turn OFF main homepage background music
   */
  public static playCabin2Sound(): void {
    if (!this.isCabin2SoundEnabled) return;

    // Stop/Fade out main BG music first
    this.fadeOut(600);

    if (this.cabin2FadeInterval) {
      clearInterval(this.cabin2FadeInterval);
      this.cabin2FadeInterval = null;
    }

    try {
      if (!this.cabin2Audio) {
        this.cabin2Audio = new Audio('/sounds/cabin2sound.mp3');
        this.cabin2Audio.loop = true;
      }

      this.cabin2Audio.volume = 0;
      this.cabin2Audio.play().catch(() => {
        // Audio autoplay policy fallback
      });

      const targetVol = Math.max(0, Math.min(1, this.musicVolume));
      const durationMs = 1200;
      const stepMs = 30;
      const totalSteps = Math.max(1, durationMs / stepMs);
      const volumeStep = targetVol / totalSteps;
      let currentStep = 0;

      this.cabin2FadeInterval = setInterval(() => {
        currentStep++;
        if (!this.cabin2Audio) {
          if (this.cabin2FadeInterval) clearInterval(this.cabin2FadeInterval);
          return;
        }

        const nextVol = Math.min(targetVol, currentStep * volumeStep);
        this.cabin2Audio.volume = nextVol;

        if (currentStep >= totalSteps) {
          if (this.cabin2FadeInterval) clearInterval(this.cabin2FadeInterval);
          this.cabin2Audio.volume = targetVol;
        }
      }, stepMs);
    } catch (err) {
      console.warn('Failed to play Cabin 2 ambient sound:', err);
    }
  }

  /**
   * Stop Cabin 2 Ambient Sound with smooth Fade-Out and restore main background music
   */
  public static stopCabin2Sound(): void {
    if (this.cabin2FadeInterval) {
      clearInterval(this.cabin2FadeInterval);
      this.cabin2FadeInterval = null;
    }

    if (!this.cabin2Audio || this.cabin2Audio.paused) {
      this.fadeIn(1200);
      return;
    }

    const startVol = this.cabin2Audio.volume;
    const durationMs = 800;
    const stepMs = 30;
    const totalSteps = Math.max(1, durationMs / stepMs);
    const volumeStep = startVol / totalSteps;
    let currentStep = 0;

    this.cabin2FadeInterval = setInterval(() => {
      currentStep++;
      if (!this.cabin2Audio) {
        if (this.cabin2FadeInterval) clearInterval(this.cabin2FadeInterval);
        return;
      }

      const nextVol = Math.max(0, startVol - currentStep * volumeStep);
      this.cabin2Audio.volume = nextVol;

      if (currentStep >= totalSteps) {
        if (this.cabin2FadeInterval) clearInterval(this.cabin2FadeInterval);
        this.cabin2Audio.pause();
        this.cabin2Audio.currentTime = 0;
        // Resume main BG music
        this.fadeIn(1200);
      }
    }, stepMs);
  }
}
