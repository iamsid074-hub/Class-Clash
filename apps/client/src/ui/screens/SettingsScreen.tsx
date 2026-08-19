import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../state/useGameStore';
import { ArrowLeft, Volume2, Music, Info, Tag, ChevronRight, CheckCircle } from 'lucide-react';
import { ClassClashLogo } from '../components/ClassClashLogo';
import { AudioManager } from '../../utils/AudioManager';

export interface GameSettings {
  bgMusicTrack: string;
  isBgMusicEnabled: boolean;
  musicVolume: number;
  sfxVolume: number;
}

const DEFAULT_SETTINGS: GameSettings = {
  bgMusicTrack: 'CLASHA_THEME',
  isBgMusicEnabled: true,
  musicVolume: 75,
  sfxVolume: 90,
};

type SettingsTab = 'MENU' | 'SOUND' | 'ABOUT' | 'VERSION';

const Ios26Toggle: React.FC<{ checked: boolean; onChange: (v: boolean) => void }> = ({ checked, onChange }) => (
  <button
    type="button"
    className="btn-press-effect"
    onClick={() => onChange(!checked)}
    style={{
      width: '54px',
      height: '32px',
      borderRadius: '50px',
      background: checked ? '#ff0066' : 'rgba(218, 170, 195, 0.4)',
      border: 'none',
      cursor: 'pointer',
      position: 'relative',
      transition: 'background 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: checked ? '0 4px 14px rgba(255, 0, 102, 0.35)' : 'none',
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
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
      }}
    />
  </button>
);

export const SettingsScreen: React.FC = () => {
  const { setScreen, triggerGateTransition } = useGameStore();
  const [activeTab, setActiveTab] = useState<SettingsTab>('MENU');

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

    if (key === 'isBgMusicEnabled') {
      AudioManager.setMusicEnabled(value as boolean);
    } else if (key === 'musicVolume') {
      AudioManager.setMusicVolume(value as number);
    } else if (key === 'sfxVolume') {
      AudioManager.setSfxVolume(value as number);
    }
  };

  const handleBackNavigation = () => {
    if (activeTab !== 'MENU') {
      setActiveTab('MENU');
    } else {
      triggerGateTransition(() => {
        setScreen('MAIN_MENU');
      }, 'MAIN MENU', 'CLASHA');
    }
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
        background: 'radial-gradient(circle at 50% 30%, rgba(255, 238, 245, 0.98) 0%, rgba(255, 204, 226, 0.98) 100%)',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        overflow: 'auto',
        color: '#2b0017',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Outfit', sans-serif",
      }}
    >
      {/* 1. TOP LIGHT PINK & WHITE GLASSMORPHIC HEADER */}
      <div
        style={{
          width: '100%',
          padding: '20px 48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxSizing: 'border-box',
          background: 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(25px)',
          borderBottom: '2px solid rgba(255, 102, 163, 0.3)',
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
            onClick={handleBackNavigation}
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
              boxShadow: '0 6px 20px rgba(255, 0, 102, 0.4)',
              transition: 'all 0.2s ease',
            }}
          >
            <ArrowLeft size={18} />
            <span>{activeTab === 'MENU' ? 'BACK TO MENU' : 'BACK TO SETTINGS'}</span>
          </button>
          <ClassClashLogo size={0.7} />
        </div>

        {/* Center: Title ONLY (No Subtitle Above) */}
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontSize: '2.4rem',
              fontWeight: 900,
              fontStyle: 'italic',
              color: '#2b0017',
              fontFamily: "'Kanit', sans-serif",
              lineHeight: 1,
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
                color: '#00a843',
                fontWeight: 900,
                fontSize: '0.85rem',
                background: 'rgba(0, 200, 83, 0.12)',
                padding: '6px 14px',
                borderRadius: '50px',
                border: '1.5px solid #00c853',
              }}
            >
              <CheckCircle size={16} /> SAVED
            </div>
          )}
        </div>
      </div>

      {/* 2. MAIN PAGE BODY: MENU OR SUB-PAGES */}
      <div
        style={{
          flex: 1,
          maxWidth: '640px',
          width: '100%',
          margin: '36px auto',
          padding: '0 24px',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
        }}
      >
        {/* VIEW A: MAIN SETTINGS MENU LIST (CLICKABLE SECTIONS) */}
        {activeTab === 'MENU' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', textAlign: 'left' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 900, color: '#e6005c', letterSpacing: '0.15em', paddingLeft: '6px', textTransform: 'uppercase' }}>
              SELECT PREFERENCE CATEGORY
            </div>

            <div
              style={{
                background: '#ffffff',
                borderRadius: '24px',
                border: '2px solid #ff66a3',
                boxShadow: '0 12px 36px rgba(255, 102, 163, 0.18)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Item 1: SOUND */}
              <button
                type="button"
                className="btn-press-effect"
                onClick={() => setActiveTab('SOUND')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '22px 28px',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '1px solid rgba(255, 102, 163, 0.2)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'rgba(255, 0, 102, 0.1)', border: '1.5px solid #ff0066', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Volume2 size={22} color="#ff0066" />
                  </div>
                  <div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, fontStyle: 'italic', color: '#2b0017', fontFamily: "'Kanit', sans-serif" }}>
                      SOUND
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#7a003c', fontWeight: 700, opacity: 0.8 }}>
                      Background music track, music toggle & SFX volume
                    </div>
                  </div>
                </div>
                <ChevronRight size={22} color="#ff0066" />
              </button>

              {/* Item 2: ABOUT */}
              <button
                type="button"
                className="btn-press-effect"
                onClick={() => setActiveTab('ABOUT')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '22px 28px',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '1px solid rgba(255, 102, 163, 0.2)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'rgba(255, 0, 102, 0.1)', border: '1.5px solid #ff0066', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Info size={22} color="#ff0066" />
                  </div>
                  <div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, fontStyle: 'italic', color: '#2b0017', fontFamily: "'Kanit', sans-serif" }}>
                      ABOUT
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#7a003c', fontWeight: 700, opacity: 0.8 }}>
                      Game information, genre & studio details
                    </div>
                  </div>
                </div>
                <ChevronRight size={22} color="#ff0066" />
              </button>

              {/* Item 3: VERSION */}
              <button
                type="button"
                className="btn-press-effect"
                onClick={() => setActiveTab('VERSION')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '22px 28px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'rgba(255, 0, 102, 0.1)', border: '1.5px solid #ff0066', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Tag size={22} color="#ff0066" />
                  </div>
                  <div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, fontStyle: 'italic', color: '#2b0017', fontFamily: "'Kanit', sans-serif" }}>
                      VERSION
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#7a003c', fontWeight: 700, opacity: 0.8 }}>
                      App build release & architecture status
                    </div>
                  </div>
                </div>
                <ChevronRight size={22} color="#ff0066" />
              </button>
            </div>
          </div>
        )}

        {/* VIEW B: SUB-PAGE 1 - SOUND SETTINGS */}
        {activeTab === 'SOUND' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 900, color: '#e6005c', letterSpacing: '0.15em', paddingLeft: '6px', textTransform: 'uppercase' }}>
              SOUND PREFERENCES
            </div>

            <div
              style={{
                background: '#ffffff',
                borderRadius: '24px',
                border: '2px solid #ff66a3',
                padding: '32px 36px',
                boxShadow: '0 12px 36px rgba(255, 102, 163, 0.18)',
                display: 'flex',
                flexDirection: 'column',
                gap: '26px',
              }}
            >
              {/* Official Active Track Badge */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Music size={20} color="#ff0066" />
                  <span style={{ fontSize: '0.95rem', fontWeight: 900, color: '#2b0017' }}>
                    CURRENT BACKGROUND MUSIC TRACK
                  </span>
                </div>
                <div
                  style={{
                    padding: '16px 20px',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, #ff0066 0%, #ff3385 100%)',
                    border: '2px solid #ffffff',
                    color: '#ffffff',
                    fontWeight: 900,
                    fontSize: '0.95rem',
                    fontStyle: 'italic',
                    fontFamily: "'Kanit', sans-serif",
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: '0 6px 20px rgba(255, 0, 102, 0.35)',
                  }}
                >
                  <span>🎵 CLASHA OFFICIAL CUTE NEON THEME</span>
                  <span style={{ fontSize: '0.78rem', background: 'rgba(255, 255, 255, 0.25)', padding: '4px 10px', borderRadius: '50px' }}>
                    ACTIVE
                  </span>
                </div>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid rgba(255, 102, 163, 0.2)', margin: 0 }} />

              {/* Music Toggle */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#2b0017' }}>BACKGROUND MUSIC</div>
                  <div style={{ fontSize: '0.8rem', color: '#7a003c', fontWeight: 700, opacity: 0.8 }}>Smooth Fade-In & Fade-Out background music</div>
                </div>
                <Ios26Toggle
                  checked={settings.isBgMusicEnabled}
                  onChange={(val) => updateSetting('isBgMusicEnabled', val)}
                />
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid rgba(255, 102, 163, 0.2)', margin: 0 }} />

              {/* Background Music Volume Slider */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Music size={20} color="#ff0066" />
                    <span style={{ fontSize: '0.95rem', fontWeight: 900, color: '#2b0017' }}>BACKGROUND MUSIC VOLUME</span>
                  </div>
                  <span style={{ color: '#ff0066', fontWeight: 900, fontSize: '0.95rem' }}>{settings.musicVolume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.musicVolume}
                  onChange={(e) => updateSetting('musicVolume', Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#ff0066', cursor: 'pointer', height: '8px' }}
                />
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid rgba(255, 102, 163, 0.2)', margin: 0 }} />

              {/* Effect, Dare & SFX Volume Slider */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Volume2 size={20} color="#ff0066" />
                    <span style={{ fontSize: '0.95rem', fontWeight: 900, color: '#2b0017' }}>EFFECT, DARE & SFX VOLUME</span>
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
        )}

        {/* VIEW C: SUB-PAGE 2 - ABOUT */}
        {activeTab === 'ABOUT' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 900, color: '#e6005c', letterSpacing: '0.15em', paddingLeft: '6px', textTransform: 'uppercase' }}>
              ABOUT CLASHA
            </div>

            <div
              style={{
                background: '#ffffff',
                borderRadius: '24px',
                border: '2px solid #ff66a3',
                padding: '32px 36px',
                boxShadow: '0 12px 36px rgba(255, 102, 163, 0.18)',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem', color: '#7a003c', fontWeight: 800 }}>GAME TITLE</span>
                <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#2b0017', fontStyle: 'italic', fontFamily: "'Kanit', sans-serif" }}>CLASHA</span>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid rgba(255, 102, 163, 0.2)', margin: 0 }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem', color: '#7a003c', fontWeight: 800 }}>GENRE</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 900, color: '#2b0017' }}>ESPORTS DARE CABIN PARTY BATTLE</span>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid rgba(255, 102, 163, 0.2)', margin: 0 }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem', color: '#7a003c', fontWeight: 800 }}>DEVELOPER & STUDIO</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 900, color: '#ff0066' }}>CLASHA ESPORTS LABS</span>
              </div>
            </div>
          </div>
        )}

        {/* VIEW D: SUB-PAGE 3 - VERSION */}
        {activeTab === 'VERSION' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 900, color: '#e6005c', letterSpacing: '0.15em', paddingLeft: '6px', textTransform: 'uppercase' }}>
              APPLICATION VERSION
            </div>

            <div
              style={{
                background: '#ffffff',
                borderRadius: '24px',
                border: '2px solid #ff66a3',
                padding: '32px 36px',
                boxShadow: '0 12px 36px rgba(255, 102, 163, 0.18)',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem', color: '#7a003c', fontWeight: 800 }}>APPLICATION VERSION</span>
                <span style={{ fontSize: '1.05rem', fontWeight: 900, color: '#2b0017' }}>v1.0.4</span>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid rgba(255, 102, 163, 0.2)', margin: 0 }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem', color: '#7a003c', fontWeight: 800 }}>BUILD ARCHITECTURE</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 900, color: '#2b0017' }}>iOS 26 VISION-CYBER EDITION</span>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid rgba(255, 102, 163, 0.2)', margin: 0 }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem', color: '#7a003c', fontWeight: 800 }}>UPDATE STATUS</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#007029', background: 'rgba(0, 200, 83, 0.12)', padding: '6px 14px', borderRadius: '50px', border: '1.5px solid #00c853' }}>
                  ✓ UP TO DATE (LATEST RELEASE)
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
