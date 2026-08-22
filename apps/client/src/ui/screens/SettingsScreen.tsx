import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../state/useGameStore';
import {
  ArrowLeft,
  Volume2,
  Music,
  Info,
  Tag,
  CheckCircle,
  Play,
  Check,
  Zap,
  Shield,
  Layers,
  Sparkles,
  Sliders,
  Radio,
} from 'lucide-react';
import { AudioManager } from '../../utils/AudioManager';

const APPLE_FONT = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Inter', 'Plus Jakarta Sans', sans-serif";

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

const Ios26Toggle: React.FC<{ checked: boolean; onChange: (v: boolean) => void }> = ({ checked, onChange }) => (
  <button
    type="button"
    className="btn-press-effect"
    onClick={() => onChange(!checked)}
    style={{
      width: '52px',
      height: '30px',
      borderRadius: '50px',
      background: checked ? '#ff0066' : '#e5e5ea',
      border: 'none',
      cursor: 'pointer',
      position: 'relative',
      transition: 'background 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: checked ? '0 3px 10px rgba(255, 0, 102, 0.3)' : 'none',
    }}
  >
    <div
      style={{
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        background: '#ffffff',
        position: 'absolute',
        top: '3px',
        left: checked ? '25px' : '3px',
        transition: 'left 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.18)',
      }}
    />
  </button>
);

export const SettingsScreen: React.FC = () => {
  const { setScreen, triggerGateTransition } = useGameStore();
  const [activeTab, setActiveTab] = useState<'sound' | 'tracks' | 'about' | 'version'>('sound');

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
        background: '#f2f2f7',
        display: 'flex',
        overflow: 'hidden',
        color: '#1c1c1e',
        fontFamily: APPLE_FONT,
      }}
    >
      {/* ------------------------------------------------------------- */}
      {/* 1. iOS SIDEBAR NAVIGATION (270px width matching ProfileScreen)  */}
      {/* ------------------------------------------------------------- */}
      <div
        style={{
          width: '270px',
          height: '100%',
          borderRight: '1px solid #e5e5ea',
          background: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '28px 18px',
          boxSizing: 'border-box',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {/* Brand Header with Original Misery Logo Font */}
          <div style={{ paddingLeft: '6px' }}>
            <div
              style={{
                fontSize: '1.25rem',
                fontWeight: 900,
                fontStyle: 'italic',
                fontFamily: "'Misery', 'QUARTZO', 'Kanit', sans-serif",
                letterSpacing: '0.04em',
                lineHeight: 1,
              }}
            >
              <span style={{ color: '#1c1c1e' }}>CLA</span>
              <span style={{ color: '#ff0066' }}>SHA</span>
            </div>
          </div>

          {/* Section 1: AUDIO PREFERENCES */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8e8e93', letterSpacing: '0.08em', paddingLeft: '12px', marginBottom: '4px', fontFamily: APPLE_FONT }}>
              AUDIO PREFERENCES
            </div>

            {[
              { id: 'sound', label: 'Sound & Volume', icon: Volume2 },
              { id: 'tracks', label: 'Music Tracks', icon: Music },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id as any)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '12px',
                    background: isActive ? '#ff0066' : 'transparent',
                    color: isActive ? '#ffffff' : '#1c1c1e',
                    border: 'none',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.92rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: isActive ? '0 4px 12px rgba(255, 0, 102, 0.3)' : 'none',
                    fontFamily: APPLE_FONT,
                    textAlign: 'left',
                  }}
                >
                  <Icon size={18} color={isActive ? '#ffffff' : '#8e8e93'} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Section 2: SYSTEM & ABOUT */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8e8e93', letterSpacing: '0.08em', paddingLeft: '12px', marginBottom: '4px', fontFamily: APPLE_FONT }}>
              SYSTEM & ABOUT
            </div>

            {[
              { id: 'about', label: 'About Game', icon: Info },
              { id: 'version', label: 'App Version', icon: Tag },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id as any)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '12px',
                    background: isActive ? '#ff0066' : 'transparent',
                    color: isActive ? '#ffffff' : '#1c1c1e',
                    border: 'none',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.92rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: isActive ? '0 4px 12px rgba(255, 0, 102, 0.3)' : 'none',
                    fontFamily: APPLE_FONT,
                    textAlign: 'left',
                  }}
                >
                  <Icon size={18} color={isActive ? '#ffffff' : '#8e8e93'} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Back to Main Menu Button */}
        <button
          type="button"
          onClick={handleBackToMenu}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            width: '100%',
            padding: '12px 14px',
            borderRadius: '12px',
            background: '#f2f2f7',
            color: '#1c1c1e',
            border: 'none',
            fontWeight: 600,
            fontSize: '0.9rem',
            cursor: 'pointer',
            transition: 'background 0.15s ease',
            fontFamily: APPLE_FONT,
          }}
        >
          <ArrowLeft size={16} color="#8e8e93" />
          <span>Back to Game</span>
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. RIGHT MAIN CONTENT AREA (Matching ProfileScreen layout)    */}
      {/* ------------------------------------------------------------- */}
      <div
        style={{
          flex: 1,
          height: '100%',
          overflowY: 'auto',
          padding: '36px 44px',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ maxWidth: '820px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
          
          {/* Header Row: Tab Title & Feedback Badge */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#8e8e93', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                GAME PREFERENCES
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1c1c1e', letterSpacing: '-0.02em', marginTop: '2px' }}>
                {activeTab === 'sound' && 'Sound & Audio Settings'}
                {activeTab === 'tracks' && 'Background Music Tracks'}
                {activeTab === 'about' && 'About CLASHA Game'}
                {activeTab === 'version' && 'Application Release Info'}
              </div>
            </div>

            {/* Saved Toast Badge */}
            {showSavedFeedback && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#34c759',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  background: 'rgba(52, 199, 89, 0.12)',
                  padding: '6px 14px',
                  borderRadius: '50px',
                  border: '1px solid rgba(52, 199, 89, 0.3)',
                }}
              >
                <CheckCircle size={15} /> Saved
              </div>
            )}
          </div>

          {/* TAB 1: SOUND & AUDIO SETTINGS */}
          {activeTab === 'sound' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Card 1: Master Controls */}
              <div
                style={{
                  background: '#ffffff',
                  borderRadius: '20px',
                  border: '1px solid #e5e5ea',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
                  padding: '28px 32px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px',
                }}
              >
                {/* Current Active Music Track Badge */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#8e8e93', letterSpacing: '0.04em' }}>
                    ACTIVE BACKGROUND MUSIC TRACK
                  </div>
                  <div
                    style={{
                      padding: '16px 20px',
                      borderRadius: '14px',
                      background: 'linear-gradient(135deg, #ff0066 0%, #ff3385 100%)',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: '0.95rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      boxShadow: '0 4px 14px rgba(255, 0, 102, 0.3)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Radio size={20} color="#ffffff" />
                      <span>CLASHA OFFICIAL NEON CUTE THEME</span>
                    </div>
                    <span style={{ fontSize: '0.72rem', background: 'rgba(255, 255, 255, 0.25)', padding: '3px 10px', borderRadius: '50px', fontWeight: 700 }}>
                      ACTIVE
                    </span>
                  </div>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid #e5e5ea', margin: 0 }} />

                {/* Music Toggle */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '0.98rem', fontWeight: 700, color: '#1c1c1e' }}>Background Music</div>
                    <div style={{ fontSize: '0.82rem', color: '#8e8e93', fontWeight: 500, marginTop: '2px' }}>
                      Enable or mute lobby & cabin background music
                    </div>
                  </div>
                  <Ios26Toggle
                    checked={settings.isBgMusicEnabled}
                    onChange={(val) => updateSetting('isBgMusicEnabled', val)}
                  />
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid #e5e5ea', margin: 0 }} />

                {/* Music Volume Slider */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Music size={18} color="#ff0066" />
                      <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1c1c1e' }}>Music Volume</span>
                    </div>
                    <span style={{ color: '#ff0066', fontWeight: 800, fontSize: '0.92rem' }}>{settings.musicVolume}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.musicVolume}
                    onChange={(e) => updateSetting('musicVolume', Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#ff0066', cursor: 'pointer', height: '6px' }}
                  />
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid #e5e5ea', margin: 0 }} />

                {/* SFX & Dare Sound Volume Slider */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Volume2 size={18} color="#ff0066" />
                      <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1c1c1e' }}>SFX & Dare Sound Effects</span>
                    </div>
                    <span style={{ color: '#ff0066', fontWeight: 800, fontSize: '0.92rem' }}>{settings.sfxVolume}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.sfxVolume}
                    onChange={(e) => updateSetting('sfxVolume', Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#ff0066', cursor: 'pointer', height: '6px' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MUSIC TRACKS */}
          {activeTab === 'tracks' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { id: 'CLASHA_THEME', name: 'CLASHA Official Neon Theme', genre: 'Synthwave / Cyberpop', duration: '2:45', active: true },
                { id: 'CYBER_RUNNER', name: 'Cyber Runner Hype Arena', genre: 'Dnb / Electro', duration: '3:12', active: false },
                { id: 'MIDNIGHT_CABIN', name: 'Midnight Cabin Chill', genre: 'Lo-Fi Chill Hop', duration: '2:20', active: false },
              ].map((track) => (
                <div
                  key={track.id}
                  style={{
                    background: '#ffffff',
                    borderRadius: '20px',
                    border: track.active ? '2px solid #ff0066' : '1px solid #e5e5ea',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
                    padding: '20px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '12px',
                        background: track.active ? '#ff0066' : '#f2f2f7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Music size={22} color={track.active ? '#ffffff' : '#8e8e93'} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#1c1c1e' }}>{track.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#8e8e93', fontWeight: 500, marginTop: '2px' }}>
                        {track.genre} • {track.duration}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {track.active ? (
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: '#ff0066',
                          background: 'rgba(255, 0, 102, 0.08)',
                          padding: '6px 14px',
                          borderRadius: '50px',
                          border: '1px solid rgba(255, 0, 102, 0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <Check size={14} /> Active Track
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => updateSetting('bgMusicTrack', track.id)}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '10px',
                          background: '#f2f2f7',
                          color: '#1c1c1e',
                          border: 'none',
                          fontWeight: 700,
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          fontFamily: APPLE_FONT,
                        }}
                      >
                        Select
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: ABOUT GAME */}
          {activeTab === 'about' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div
                style={{
                  background: '#ffffff',
                  borderRadius: '20px',
                  border: '1px solid #e5e5ea',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
                  padding: '28px 32px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', color: '#8e8e93', fontWeight: 600 }}>Game Title</span>
                  <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#1c1c1e', fontStyle: 'italic', fontFamily: "'Misery', 'QUARTZO', 'Kanit', sans-serif" }}>
                    CLASHA
                  </span>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid #e5e5ea', margin: 0 }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', color: '#8e8e93', fontWeight: 600 }}>Genre</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1c1c1e' }}>
                    3D Multiplayer Cabin Dare Party
                  </span>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid #e5e5ea', margin: 0 }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', color: '#8e8e93', fontWeight: 600 }}>Developer & Studio</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#ff0066' }}>
                    CLASHA Esports Labs
                  </span>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid #e5e5ea', margin: 0 }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', color: '#8e8e93', fontWeight: 600 }}>Graphics Engine</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1c1c1e' }}>
                    WebGL 2.0 • Three.js 3D
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: APP VERSION */}
          {activeTab === 'version' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div
                style={{
                  background: '#ffffff',
                  borderRadius: '20px',
                  border: '1px solid #e5e5ea',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
                  padding: '28px 32px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', color: '#8e8e93', fontWeight: 600 }}>App Release Version</span>
                  <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1c1c1e' }}>v1.4.2-PROD</span>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid #e5e5ea', margin: 0 }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', color: '#8e8e93', fontWeight: 600 }}>Build Architecture</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1c1c1e' }}>
                    iOS 26 Vision-Cyber Edition
                  </span>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid #e5e5ea', margin: 0 }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', color: '#8e8e93', fontWeight: 600 }}>Server Connection</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#34c759', background: 'rgba(52, 199, 89, 0.12)', padding: '5px 14px', borderRadius: '50px', border: '1px solid rgba(52, 199, 89, 0.3)' }}>
                    ● Connected (WebSocket Live)
                  </span>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid #e5e5ea', margin: 0 }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', color: '#8e8e93', fontWeight: 600 }}>Update Status</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#34c759', background: 'rgba(52, 199, 89, 0.12)', padding: '5px 14px', borderRadius: '50px', border: '1px solid rgba(52, 199, 89, 0.3)' }}>
                    ✓ Up To Date
                  </span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
