import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../state/useGameStore';
import { ArrowLeft, Volume2, VolumeX, Monitor, Sliders, Shield, RefreshCw, CheckCircle, Moon, Sun, Sparkles } from 'lucide-react';
import { ClassClashLogo } from '../components/ClassClashLogo';

export interface GameSettings {
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  muteVoiceChat: boolean;
  graphicsQuality: 'ULTRA' | 'HIGH' | 'MEDIUM';
  tvScanlinesOverlay: boolean;
  motionBlur: boolean;
  fpsLimit: 60 | 120 | 240;
  streamerMode: boolean;
  cameraSensitivity: number;
  autoOpenChat: boolean;
}

const DEFAULT_SETTINGS: GameSettings = {
  masterVolume: 85,
  musicVolume: 70,
  sfxVolume: 90,
  muteVoiceChat: false,
  graphicsQuality: 'ULTRA',
  tvScanlinesOverlay: true,
  motionBlur: false,
  fpsLimit: 120,
  streamerMode: false,
  cameraSensitivity: 50,
  autoOpenChat: true,
};

export const SettingsScreen: React.FC = () => {
  const { setScreen, triggerGateTransition } = useGameStore();

  const [settings, setSettings] = useState<GameSettings>(() => {
    try {
      const saved = localStorage.getItem('clasha_game_settings');
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [showSavedFeedback, setShowSavedFeedback] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('clasha_game_settings', JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  const updateSetting = <K extends keyof GameSettings>(key: K, value: GameSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setShowSavedFeedback(true);
    setTimeout(() => setShowSavedFeedback(false), 1500);
  };

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    setShowSavedFeedback(true);
    setTimeout(() => setShowSavedFeedback(false), 1500);
  };

  const handleBackToMenu = () => {
    triggerGateTransition(() => {
      setScreen('MAIN_MENU');
    }, 'MAIN MENU', 'CLASHA');
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 10,
        background: 'linear-gradient(135deg, #09040e 0%, #150921 50%, #20092d 100%)',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        overflow: 'auto',
        color: '#ffffff',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* 1. TOP GLASSMORPHIC HEADER */}
      <div
        style={{
          width: '100%',
          padding: '20px 48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxSizing: 'border-box',
          background: 'rgba(15, 10, 25, 0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        {/* Left: Back Button & Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <button
            type="button"
            className="hud-interactive btn-press-effect"
            onClick={handleBackToMenu}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 24px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #ff0066 0%, #ff3385 100%)',
              border: '2px solid #ffffff',
              color: '#ffffff',
              fontWeight: 900,
              fontSize: '0.95rem',
              fontStyle: 'italic',
              fontFamily: "'Kanit', sans-serif",
              cursor: 'pointer',
              boxShadow: '0 8px 25px rgba(255, 0, 102, 0.45)',
              transition: 'transform 0.2s ease',
            }}
          >
            <ArrowLeft size={18} /> BACK TO MENU
          </button>
          <ClassClashLogo size={0.7} />
        </div>

        {/* Center: Title */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 900, color: '#ff0066', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            SYSTEM & PREFERENCES
          </div>
          <div
            style={{
              fontSize: '2.2rem',
              fontWeight: 900,
              fontStyle: 'italic',
              color: '#ffffff',
              fontFamily: "'Kanit', sans-serif",
              lineHeight: 1,
              marginTop: '2px',
            }}
          >
            GAME SETTINGS
          </div>
        </div>

        {/* Right: Reset & Auto-save Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {showSavedFeedback && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontWeight: 800, fontSize: '0.85rem' }}>
              <CheckCircle size={16} /> SETTINGS SAVED
            </div>
          )}

          <button
            type="button"
            className="btn-press-effect"
            onClick={handleReset}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '14px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={16} /> RESET DEFAULTS
          </button>
        </div>
      </div>

      {/* 2. SETTINGS CONTENT GRID */}
      <div
        style={{
          flex: 1,
          maxWidth: '1200px',
          width: '100%',
          margin: '0 auto',
          padding: '40px 48px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '32px',
          boxSizing: 'border-box',
        }}
      >
        {/* SECTION 1: AUDIO & SOUND EFFECTS */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1.5px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '24px',
            padding: '28px 32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.4)',
            textAlign: 'left',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Volume2 size={24} color="#ff0066" />
            <div>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, fontStyle: 'italic', color: '#ffffff', fontFamily: "'Kanit', sans-serif" }}>
                AUDIO & SOUND
              </div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'rgba(255, 255, 255, 0.6)' }}>
                Master volume, music, and sound effects controls
              </div>
            </div>
          </div>

          {/* Master Volume */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: 800 }}>
              <span>MASTER VOLUME</span>
              <span style={{ color: '#ff0066' }}>{settings.masterVolume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.masterVolume}
              onChange={(e) => updateSetting('masterVolume', Number(e.target.value))}
              style={{ width: '100%', accentColor: '#ff0066', cursor: 'pointer' }}
            />
          </div>

          {/* Music Volume */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: 800 }}>
              <span>BACKGROUND MUSIC</span>
              <span style={{ color: '#ff0066' }}>{settings.musicVolume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.musicVolume}
              onChange={(e) => updateSetting('musicVolume', Number(e.target.value))}
              style={{ width: '100%', accentColor: '#ff0066', cursor: 'pointer' }}
            />
          </div>

          {/* SFX Volume */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: 800 }}>
              <span>DARE & SFX SOUND EFFECTS</span>
              <span style={{ color: '#ff0066' }}>{settings.sfxVolume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.sfxVolume}
              onChange={(e) => updateSetting('sfxVolume', Number(e.target.value))}
              style={{ width: '100%', accentColor: '#ff0066', cursor: 'pointer' }}
            />
          </div>

          {/* Mute Voice Chat Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div>
              <div style={{ fontSize: '0.92rem', fontWeight: 800 }}>MUTE VOICE CHAT</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)' }}>Silence incoming player audio</div>
            </div>
            <button
              type="button"
              onClick={() => updateSetting('muteVoiceChat', !settings.muteVoiceChat)}
              style={{
                width: '52px',
                height: '28px',
                borderRadius: '50px',
                background: settings.muteVoiceChat ? '#ff0066' : 'rgba(255, 255, 255, 0.15)',
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.2s ease',
              }}
            >
              <div
                style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  background: '#ffffff',
                  position: 'absolute',
                  top: '3px',
                  left: settings.muteVoiceChat ? '27px' : '3px',
                  transition: 'all 0.2s ease',
                }}
              />
            </button>
          </div>
        </div>

        {/* SECTION 2: GRAPHICS & DISPLAY */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1.5px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '24px',
            padding: '28px 32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.4)',
            textAlign: 'left',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Monitor size={24} color="#ff0066" />
            <div>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, fontStyle: 'italic', color: '#ffffff', fontFamily: "'Kanit', sans-serif" }}>
                GRAPHICS & DISPLAY
              </div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'rgba(255, 255, 255, 0.6)' }}>
                Visual performance & rendering fidelity
              </div>
            </div>
          </div>

          {/* Quality Preset Selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '0.88rem', fontWeight: 800 }}>GRAPHICS PRESET</div>
            <div style={{ display: 'flex', gap: '10px' }}>
              {(['MEDIUM', 'HIGH', 'ULTRA'] as const).map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => updateSetting('graphicsQuality', q)}
                  style={{
                    flex: 1,
                    padding: '10px 0',
                    borderRadius: '12px',
                    background: settings.graphicsQuality === q ? '#ff0066' : 'rgba(255, 255, 255, 0.08)',
                    border: settings.graphicsQuality === q ? '2px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#ffffff',
                    fontWeight: 900,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* TV Scanlines Overlay Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '0.92rem', fontWeight: 800 }}>LED TV SCANLINES OVERLAY</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)' }}>Enable CRT esports screen lines</div>
            </div>
            <button
              type="button"
              onClick={() => updateSetting('tvScanlinesOverlay', !settings.tvScanlinesOverlay)}
              style={{
                width: '52px',
                height: '28px',
                borderRadius: '50px',
                background: settings.tvScanlinesOverlay ? '#ff0066' : 'rgba(255, 255, 255, 0.15)',
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.2s ease',
              }}
            >
              <div
                style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  background: '#ffffff',
                  position: 'absolute',
                  top: '3px',
                  left: settings.tvScanlinesOverlay ? '27px' : '3px',
                  transition: 'all 0.2s ease',
                }}
              />
            </button>
          </div>

          {/* Motion Blur Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '0.92rem', fontWeight: 800 }}>MOTION BLUR</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)' }}>Cinematic speed blur effect</div>
            </div>
            <button
              type="button"
              onClick={() => updateSetting('motionBlur', !settings.motionBlur)}
              style={{
                width: '52px',
                height: '28px',
                borderRadius: '50px',
                background: settings.motionBlur ? '#ff0066' : 'rgba(255, 255, 255, 0.15)',
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.2s ease',
              }}
            >
              <div
                style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  background: '#ffffff',
                  position: 'absolute',
                  top: '3px',
                  left: settings.motionBlur ? '27px' : '3px',
                  transition: 'all 0.2s ease',
                }}
              />
            </button>
          </div>
        </div>

        {/* SECTION 3: GAMEPLAY & PRIVACY */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1.5px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '24px',
            padding: '28px 32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.4)',
            textAlign: 'left',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Sliders size={24} color="#ff0066" />
            <div>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, fontStyle: 'italic', color: '#ffffff', fontFamily: "'Kanit', sans-serif" }}>
                GAMEPLAY & PRIVACY
              </div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'rgba(255, 255, 255, 0.6)' }}>
                Camera sensitivity & room protection
              </div>
            </div>
          </div>

          {/* Streamer Mode Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '0.92rem', fontWeight: 800 }}>STREAMER MODE</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)' }}>Hide room pass & codes on screen</div>
            </div>
            <button
              type="button"
              onClick={() => updateSetting('streamerMode', !settings.streamerMode)}
              style={{
                width: '52px',
                height: '28px',
                borderRadius: '50px',
                background: settings.streamerMode ? '#ff0066' : 'rgba(255, 255, 255, 0.15)',
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.2s ease',
              }}
            >
              <div
                style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  background: '#ffffff',
                  position: 'absolute',
                  top: '3px',
                  left: settings.streamerMode ? '27px' : '3px',
                  transition: 'all 0.2s ease',
                }}
              />
            </button>
          </div>

          {/* Camera Sensitivity */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: 800 }}>
              <span>CAMERA SENSITIVITY</span>
              <span style={{ color: '#ff0066' }}>{settings.cameraSensitivity}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={settings.cameraSensitivity}
              onChange={(e) => updateSetting('cameraSensitivity', Number(e.target.value))}
              style={{ width: '100%', accentColor: '#ff0066', cursor: 'pointer' }}
            />
          </div>
        </div>

        {/* SECTION 4: SYSTEM & CACHE */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1.5px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '24px',
            padding: '28px 32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.4)',
            textAlign: 'left',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Shield size={24} color="#ff0066" />
            <div>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, fontStyle: 'italic', color: '#ffffff', fontFamily: "'Kanit', sans-serif" }}>
                SYSTEM & STORAGE
              </div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'rgba(255, 255, 255, 0.6)' }}>
                Client build specs & local data management
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.8)', fontWeight: 700 }}>
            <div>CLIENT ENGINE: <span style={{ color: '#ffffff', fontWeight: 900 }}>CLASHA v1.0.4 HIGH-OCTANE</span></div>
            <div>RENDER ENGINE: <span style={{ color: '#ffffff', fontWeight: 900 }}>THREE.JS / WEBGL 2.0</span></div>
            <div>WEBSOCKET REGION: <span style={{ color: '#00c853', fontWeight: 900 }}>ASIA-SOUTH (DELHI NODE)</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};
