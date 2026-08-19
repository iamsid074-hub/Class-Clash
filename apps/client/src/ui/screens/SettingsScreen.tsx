import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../state/useGameStore';
import { ArrowLeft, Volume2, CheckCircle, RefreshCw } from 'lucide-react';
import { ClassClashLogo } from '../components/ClassClashLogo';

export interface GameSettings {
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  muteVoiceChat: boolean;
}

const DEFAULT_SETTINGS: GameSettings = {
  masterVolume: 85,
  musicVolume: 70,
  sfxVolume: 90,
  muteVoiceChat: false,
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
            SYSTEM PREFERENCES
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
            AUDIO SETTINGS
          </div>
        </div>

        {/* Right: Auto-save Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {showSavedFeedback && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontWeight: 800, fontSize: '0.85rem' }}>
              <CheckCircle size={16} /> SAVED
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

      {/* 2. SETTINGS CONTENT CARD - PURE AUDIO & SOUND ONLY */}
      <div
        style={{
          flex: 1,
          maxWidth: '680px',
          width: '100%',
          margin: '50px auto',
          padding: '0 24px',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1.5px solid rgba(255, 255, 255, 0.14)',
            borderRadius: '28px',
            padding: '36px 40px',
            display: 'flex',
            flexDirection: 'column',
            gap: '28px',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.5)',
            textAlign: 'left',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(255, 0, 102, 0.15)', border: '1px solid #ff0066', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Volume2 size={24} color="#ff0066" />
            </div>
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, fontStyle: 'italic', color: '#ffffff', fontFamily: "'Kanit', sans-serif" }}>
                AUDIO & SOUND CONTROLS
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'rgba(255, 255, 255, 0.6)' }}>
                Customize master volume, background music, and dare sound effects
              </div>
            </div>
          </div>

          {/* Master Volume */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.92rem', fontWeight: 900, letterSpacing: '0.04em' }}>
              <span>MASTER VOLUME</span>
              <span style={{ color: '#ff0066', fontWeight: 900 }}>{settings.masterVolume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.masterVolume}
              onChange={(e) => updateSetting('masterVolume', Number(e.target.value))}
              style={{ width: '100%', accentColor: '#ff0066', cursor: 'pointer', height: '8px' }}
            />
          </div>

          {/* Music Volume */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.92rem', fontWeight: 900, letterSpacing: '0.04em' }}>
              <span>BACKGROUND MUSIC</span>
              <span style={{ color: '#ff0066', fontWeight: 900 }}>{settings.musicVolume}%</span>
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

          {/* SFX Volume */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.92rem', fontWeight: 900, letterSpacing: '0.04em' }}>
              <span>DARE & SFX SOUND EFFECTS</span>
              <span style={{ color: '#ff0066', fontWeight: 900 }}>{settings.sfxVolume}%</span>
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

          {/* Mute Voice Chat Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 900 }}>MUTE VOICE CHAT</div>
              <div style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.55)', fontWeight: 600 }}>Silence incoming audio from players</div>
            </div>
            <button
              type="button"
              onClick={() => updateSetting('muteVoiceChat', !settings.muteVoiceChat)}
              style={{
                width: '56px',
                height: '30px',
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
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: '#ffffff',
                  position: 'absolute',
                  top: '3px',
                  left: settings.muteVoiceChat ? '29px' : '3px',
                  transition: 'all 0.2s ease',
                }}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
