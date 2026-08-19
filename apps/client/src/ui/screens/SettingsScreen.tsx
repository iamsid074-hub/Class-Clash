import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../state/useGameStore';
import { ArrowLeft, Music, Volume2, CheckCircle, Info, Tag, Sliders, ShieldCheck } from 'lucide-react';
import { ClassClashLogo } from '../components/ClassClashLogo';

export interface GameSettings {
  bgMusicTrack: string;
  isBgMusicEnabled: boolean;
  sfxVolume: number;
}

const DEFAULT_SETTINGS: GameSettings = {
  bgMusicTrack: 'DEFAULT_1',
  isBgMusicEnabled: true,
  sfxVolume: 90,
};

const MUSIC_TRACKS = [
  { id: 'DEFAULT_1', label: 'Default Track 1' },
  { id: 'CYBER_NEON', label: 'Cyber Neon Beat' },
  { id: 'CHILL_SYNTH', label: 'Chill Synthwave' },
  { id: 'LOFI_ARENA', label: 'Lo-Fi Arena' },
];

const Ios26Toggle: React.FC<{ checked: boolean; onChange: (v: boolean) => void }> = ({ checked, onChange }) => (
  <button
    type="button"
    className="btn-press-effect"
    onClick={() => onChange(!checked)}
    style={{
      width: '54px',
      height: '32px',
      borderRadius: '50px',
      background: checked ? '#34c759' : 'rgba(255, 255, 255, 0.18)',
      border: 'none',
      cursor: 'pointer',
      position: 'relative',
      transition: 'background 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: checked ? '0 2px 10px rgba(52, 199, 89, 0.4)' : 'none',
    }}
  >
    <div
      style={{
        width: '26px',
        height: '26px',
        borderRadius: '50%',
        background: '#ffffff',
        position: 'absolute',
        top: '3px',
        left: checked ? '25px' : '3px',
        transition: 'left 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.35)',
      }}
    />
  </button>
);

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
    setTimeout(() => setShowSavedFeedback(false), 1400);
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
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Outfit', sans-serif",
      }}
    >
      {/* 1. TOP iOS 26 GLASSMORPHIC HEADER */}
      <div
        style={{
          width: '100%',
          padding: '20px 48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxSizing: 'border-box',
          background: 'rgba(15, 10, 25, 0.75)',
          backdropFilter: 'blur(30px) saturate(180%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        {/* Left: iOS 26 Back Button & Logo */}
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
              borderRadius: '18px',
              background: 'linear-gradient(135deg, #ff0066 0%, #ff3385 100%)',
              border: '2px solid #ffffff',
              color: '#ffffff',
              fontWeight: 900,
              fontSize: '0.95rem',
              fontStyle: 'italic',
              fontFamily: "'Kanit', sans-serif",
              cursor: 'pointer',
              boxShadow: '0 8px 25px rgba(255, 0, 102, 0.45)',
              transition: 'all 0.2s ease',
            }}
          >
            <ArrowLeft size={18} /> BACK TO MENU
          </button>
          <ClassClashLogo size={0.7} />
        </div>

        {/* Center: Title */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#ff0066', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            iOS 26 SYSTEM CONTROL
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
            SETTINGS
          </div>
        </div>

        {/* Right: Saved Feedback Badge */}
        <div style={{ minWidth: '120px', display: 'flex', justifyContent: 'flex-end' }}>
          {showSavedFeedback && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: '#34c759',
                fontWeight: 900,
                fontSize: '0.85rem',
                background: 'rgba(52, 199, 89, 0.15)',
                padding: '6px 14px',
                borderRadius: '50px',
                border: '1px solid rgba(52, 199, 89, 0.3)',
              }}
            >
              <CheckCircle size={16} /> SAVED
            </div>
          )}
        </div>
      </div>

      {/* 2. iOS 26 GROUPED SETTINGS CARDS CONTAINER */}
      <div
        style={{
          flex: 1,
          maxWidth: '640px',
          width: '100%',
          margin: '36px auto',
          padding: '0 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '28px',
          boxSizing: 'border-box',
        }}
      >
        {/* CARD 1: SOUND SECTION */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 900, color: '#ff0066', letterSpacing: '0.15em', paddingLeft: '8px', textTransform: 'uppercase' }}>
            SOUND
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              backdropFilter: 'blur(30px) saturate(180%)',
              border: '1.5px solid rgba(255, 255, 255, 0.14)',
              borderRadius: '24px',
              padding: '24px 28px',
              display: 'flex',
              flexDirection: 'column',
              gap: '22px',
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.45)',
            }}
          >
            {/* 1.1 Background Music Selection */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Music size={20} color="#ff0066" />
                <span style={{ fontSize: '0.95rem', fontWeight: 900, color: '#ffffff', letterSpacing: '0.02em' }}>
                  BACKGROUND MUSIC TRACK
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '2px' }}>
                {MUSIC_TRACKS.map((track) => {
                  const isSelected = settings.bgMusicTrack === track.id;
                  return (
                    <button
                      key={track.id}
                      type="button"
                      className="btn-press-effect"
                      onClick={() => updateSetting('bgMusicTrack', track.id)}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '16px',
                        background: isSelected
                          ? 'linear-gradient(135deg, #ff0066 0%, #ff3385 100%)'
                          : 'rgba(255, 255, 255, 0.08)',
                        border: isSelected ? '2px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.15)',
                        color: '#ffffff',
                        fontWeight: 900,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        textAlign: 'center',
                        boxShadow: isSelected ? '0 6px 20px rgba(255, 0, 102, 0.4)' : 'none',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {track.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid rgba(255, 255, 255, 0.1)', margin: 0 }} />

            {/* 1.2 Background Music ON / OFF Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 900 }}>BACKGROUND MUSIC</div>
                <div style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.55)', fontWeight: 600 }}>Enable or disable lobby & arena background music</div>
              </div>
              <Ios26Toggle
                checked={settings.isBgMusicEnabled}
                onChange={(val) => updateSetting('isBgMusicEnabled', val)}
              />
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid rgba(255, 255, 255, 0.1)', margin: 0 }} />

            {/* 1.3 Effect, Dare & SFX Volume Slider */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Volume2 size={20} color="#ff0066" />
                  <span style={{ fontSize: '0.95rem', fontWeight: 900 }}>EFFECT, DARE & SFX VOLUME</span>
                </div>
                <span style={{ color: '#ff0066', fontWeight: 900, fontSize: '0.95rem' }}>{settings.sfxVolume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.sfxVolume}
                onChange={(e) => updateSetting('sfxVolume', Number(e.target.value))}
                style={{ width: '100%', accentColor: '#ff0066', cursor: 'pointer', height: '8px' }}
              />
            </div>
          </div>
        </div>

        {/* CARD 2: ABOUT SECTION */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 900, color: '#ff0066', letterSpacing: '0.15em', paddingLeft: '8px', textTransform: 'uppercase' }}>
            ABOUT
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              backdropFilter: 'blur(30px) saturate(180%)',
              border: '1.5px solid rgba(255, 255, 255, 0.14)',
              borderRadius: '24px',
              padding: '20px 28px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.45)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.65)', fontWeight: 800 }}>GAME TITLE</span>
              <span style={{ fontSize: '1rem', fontWeight: 900, color: '#ffffff', fontStyle: 'italic', fontFamily: "'Kanit', sans-serif" }}>CLASHA</span>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid rgba(255, 255, 255, 0.1)', margin: 0 }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.65)', fontWeight: 800 }}>GENRE</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 900, color: '#ffffff' }}>ESPORTS DARE CABIN PARTY BATTLE</span>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid rgba(255, 255, 255, 0.1)', margin: 0 }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.65)', fontWeight: 800 }}>DEVELOPER & STUDIO</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 900, color: '#ff0066' }}>CLASHA ESPORTS LABS</span>
            </div>
          </div>
        </div>

        {/* CARD 3: VERSION SECTION */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 900, color: '#ff0066', letterSpacing: '0.15em', paddingLeft: '8px', textTransform: 'uppercase' }}>
            VERSION
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              backdropFilter: 'blur(30px) saturate(180%)',
              border: '1.5px solid rgba(255, 255, 255, 0.14)',
              borderRadius: '24px',
              padding: '20px 28px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.45)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.65)', fontWeight: 800 }}>APPLICATION VERSION</span>
              <span style={{ fontSize: '1rem', fontWeight: 900, color: '#ffffff' }}>v1.0.4</span>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid rgba(255, 255, 255, 0.1)', margin: 0 }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.65)', fontWeight: 800 }}>BUILD ARCHITECTURE</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 900, color: '#ffffff' }}>iOS 26 VISION-CYBER EDITION</span>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid rgba(255, 255, 255, 0.1)', margin: 0 }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.65)', fontWeight: 800 }}>UPDATE STATUS</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#34c759', background: 'rgba(52, 199, 89, 0.15)', padding: '4px 12px', borderRadius: '50px', border: '1px solid rgba(52, 199, 89, 0.3)' }}>
                ✓ UP TO DATE (LATEST RELEASE)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
