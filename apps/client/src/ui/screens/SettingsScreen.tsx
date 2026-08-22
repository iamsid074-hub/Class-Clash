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
  HelpCircle,
  FileText,
  Mail,
  Send,
  Copy,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  UserCheck,
  Activity,
  EyeOff,
  Scale,
  RefreshCw,
  Database,
  Share2,
  Cookie,
  FileLock,
} from 'lucide-react';
import { AudioManager } from '../../utils/AudioManager';
import { SupabaseAuthService, UserProfile } from '../../networking/supabaseClient';

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
  const { displayName, setScreen, triggerGateTransition } = useGameStore();
  const [activeTab, setActiveTab] = useState<
    'sound' | 'tracks' | 'support' | 'faq' | 'about' | 'terms' | 'privacy' | 'version'
  >('sound');

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [settings, setSettings] = useState<GameSettings>(() => {
    try {
      const saved = localStorage.getItem('clasha_game_settings');
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [showSavedFeedback, setShowSavedFeedback] = useState(false);

  // Support ticket form state
  const [supportSubject, setSupportSubject] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [supportCategory, setSupportCategory] = useState('Account & Login');
  const [ticketSent, setTicketSent] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  useEffect(() => {
    SupabaseAuthService.getSavedSession().then((p) => {
      if (p) setUserProfile(p);
    });
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('clasha_game_settings', JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  const userEmail = userProfile?.email || 'anshu@classclash.io';

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

  const handleCopySupportEmail = () => {
    navigator.clipboard.writeText('clasha@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMessage.trim()) return;
    setTicketSent(true);
    setTimeout(() => {
      setSupportSubject('');
      setSupportMessage('');
      setTicketSent(false);
    }, 4000);
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {/* Brand Header */}
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

          {/* Section 1: AUDIO & SOUND */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
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
                    padding: '10px 14px',
                    borderRadius: '12px',
                    background: isActive ? '#ff0066' : 'transparent',
                    color: isActive ? '#ffffff' : '#1c1c1e',
                    border: 'none',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: isActive ? '0 4px 12px rgba(255, 0, 102, 0.3)' : 'none',
                    fontFamily: APPLE_FONT,
                    textAlign: 'left',
                  }}
                >
                  <Icon size={17} color={isActive ? '#ffffff' : '#8e8e93'} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Section 2: ASSISTANCE & SUPPORT */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8e8e93', letterSpacing: '0.08em', paddingLeft: '12px', marginBottom: '4px', fontFamily: APPLE_FONT }}>
              ASSISTANCE & SUPPORT
            </div>

            {[
              { id: 'support', label: 'Support & Ticket', icon: HelpCircle },
              { id: 'faq', label: 'CLASHA FAQ', icon: HelpCircle },
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
                    padding: '10px 14px',
                    borderRadius: '12px',
                    background: isActive ? '#ff0066' : 'transparent',
                    color: isActive ? '#ffffff' : '#1c1c1e',
                    border: 'none',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: isActive ? '0 4px 12px rgba(255, 0, 102, 0.3)' : 'none',
                    fontFamily: APPLE_FONT,
                    textAlign: 'left',
                  }}
                >
                  <Icon size={17} color={isActive ? '#ffffff' : '#8e8e93'} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Section 3: ABOUT & LEGAL */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8e8e93', letterSpacing: '0.08em', paddingLeft: '12px', marginBottom: '4px', fontFamily: APPLE_FONT }}>
              ABOUT & LEGAL
            </div>

            {[
              { id: 'about', label: 'About Us', icon: Info },
              { id: 'terms', label: 'Terms & Conditions', icon: FileText },
              { id: 'privacy', label: 'Privacy Policy', icon: Shield },
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
                    padding: '10px 14px',
                    borderRadius: '12px',
                    background: isActive ? '#ff0066' : 'transparent',
                    color: isActive ? '#ffffff' : '#1c1c1e',
                    border: 'none',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: isActive ? '0 4px 12px rgba(255, 0, 102, 0.3)' : 'none',
                    fontFamily: APPLE_FONT,
                    textAlign: 'left',
                  }}
                >
                  <Icon size={17} color={isActive ? '#ffffff' : '#8e8e93'} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Back Button */}
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
      {/* 2. RIGHT MAIN CONTENT AREA                                     */}
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
        <div style={{ maxWidth: '840px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
          
          {/* Header Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#8e8e93', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                GAME SETTINGS & PREFERENCES
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1c1c1e', letterSpacing: '-0.02em', marginTop: '2px' }}>
                {activeTab === 'sound' && 'Sound & Audio Settings'}
                {activeTab === 'tracks' && 'Background Music Tracks'}
                {activeTab === 'support' && 'Support & Ticket Submission'}
                {activeTab === 'faq' && 'CLASHA FAQ'}
                {activeTab === 'about' && 'About Us'}
                {activeTab === 'terms' && 'Terms & Conditions'}
                {activeTab === 'privacy' && 'Privacy Policy'}
                {activeTab === 'version' && 'Application Version'}
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

          {/* TAB 1: SOUND & AUDIO */}
          {activeTab === 'sound' && (
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
                  gap: '24px',
                }}
              >
                {/* Active Track Badge */}
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

                {/* Music Volume */}
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

                {/* SFX Volume */}
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
              ))}
            </div>
          )}

          {/* TAB 3: SUPPORT & TICKET */}
          {activeTab === 'support' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Row 1: Direct Support Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '20px' }}>
                <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '24px', padding: '28px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#ff0066', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>
                    DIRECT EMAIL ASSISTANCE
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1c1c1e', marginBottom: '8px' }}>
                    clasha@gmail.com
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#8e8e93', marginBottom: '18px', lineHeight: 1.5 }}>
                    Reach out directly for account recovery, room issues, or feedback.
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={handleCopySupportEmail}
                      style={{
                        padding: '10px 18px',
                        borderRadius: '12px',
                        background: '#f2f2f7',
                        border: 'none',
                        color: '#1c1c1e',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontFamily: APPLE_FONT,
                      }}
                    >
                      <Copy size={15} /> {copiedEmail ? 'Copied!' : 'Copy Email'}
                    </button>
                    <a
                      href="mailto:clasha@gmail.com"
                      style={{
                        padding: '10px 18px',
                        borderRadius: '12px',
                        background: '#ff0066',
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontFamily: APPLE_FONT,
                      }}
                    >
                      <Mail size={15} /> Open Mail App
                    </a>
                  </div>
                </div>

                <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '24px', padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#34c759' }} />
                    <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#34c759' }}>24/7 Support Live</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#8e8e93', fontWeight: 500 }}>
                    Under 2 hours average response time for all submitted tickets.
                  </div>
                </div>
              </div>

              {/* Ticket Form */}
              <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '24px', padding: '32px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1c1c1e', marginBottom: '20px' }}>
                  Submit Support Ticket
                </div>

                {ticketSent ? (
                  <div style={{ background: 'rgba(52, 199, 89, 0.1)', border: '1px solid rgba(52, 199, 89, 0.3)', borderRadius: '18px', padding: '24px', textAlign: 'center', color: '#34c759', fontWeight: 700 }}>
                    <Check size={32} color="#34c759" style={{ margin: '0 auto 10px auto', display: 'block' }} />
                    <div style={{ fontSize: '1.1rem' }}>Ticket Submitted!</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 500, marginTop: '6px', color: '#1c1c1e' }}>
                      We will contact you directly at <strong>clasha@gmail.com</strong>.
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleTicketSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#8e8e93', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
                          CATEGORY
                        </label>
                        <select
                          value={supportCategory}
                          onChange={(e) => setSupportCategory(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            borderRadius: '12px',
                            border: '1px solid #e5e5ea',
                            background: '#ffffff',
                            color: '#1c1c1e',
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            outline: 'none',
                            fontFamily: APPLE_FONT,
                          }}
                        >
                          <option value="Account & Login">Account & Login</option>
                          <option value="Multiplayer Room">Multiplayer Room Issue</option>
                          <option value="Gameplay Bug">Gameplay Bug</option>
                          <option value="General Inquiry">General Inquiry</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#8e8e93', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
                          YOUR EMAIL
                        </label>
                        <input
                          type="email"
                          readOnly
                          value={userEmail}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            borderRadius: '12px',
                            border: '1px solid #e5e5ea',
                            background: '#f2f2f7',
                            color: '#8e8e93',
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            outline: 'none',
                            boxSizing: 'border-box',
                            fontFamily: APPLE_FONT,
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#8e8e93', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
                        SUBJECT
                      </label>
                      <input
                        type="text"
                        required
                        value={supportSubject}
                        onChange={(e) => setSupportSubject(e.target.value)}
                        placeholder="Brief summary of your issue..."
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          borderRadius: '12px',
                          border: '1px solid #e5e5ea',
                          background: '#ffffff',
                          color: '#1c1c1e',
                          fontWeight: 600,
                          fontSize: '0.9rem',
                          outline: 'none',
                          boxSizing: 'border-box',
                          fontFamily: APPLE_FONT,
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#8e8e93', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
                        DESCRIPTION
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={supportMessage}
                        onChange={(e) => setSupportMessage(e.target.value)}
                        placeholder="Describe your request..."
                        style={{
                          width: '100%',
                          padding: '14px 16px',
                          borderRadius: '16px',
                          border: '1px solid #e5e5ea',
                          background: '#ffffff',
                          color: '#1c1c1e',
                          fontWeight: 500,
                          fontSize: '0.9rem',
                          outline: 'none',
                          boxSizing: 'border-box',
                          resize: 'vertical',
                          fontFamily: APPLE_FONT,
                        }}
                      />
                    </div>

                    <button
                      type="submit"
                      style={{
                        padding: '14px 28px',
                        borderRadius: '14px',
                        background: '#ff0066',
                        border: 'none',
                        color: '#ffffff',
                        fontWeight: 800,
                        fontSize: '0.95rem',
                        cursor: 'pointer',
                        fontFamily: APPLE_FONT,
                        boxShadow: '0 4px 14px rgba(255, 0, 102, 0.3)',
                      }}
                    >
                      Submit Ticket
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: FAQ */}
          {activeTab === 'faq' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { q: '❓ How do I create & join a Cabin Room?', a: 'Click CREATE ROOM on Main Menu to host a cabin with custom ID & Password. Other players join via JOIN ROOM using the exact ID and Password.' },
                { q: '❓ How does real-time synchronization work?', a: 'All cabin state, rosters, voting rounds, and player lists are synchronized live via WebSocket connection hosted on server.' },
                { q: '❓ What if a player enters wrong room password?', a: 'The system verifies room ID & password server-side and displays an inline alert without allowing unauthorized entry.' },
                { q: '❓ Direct Email Contact for Assistance?', a: 'You can email clasha@gmail.com anytime for account recovery or support inquiries.' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#ffffff',
                    borderRadius: '20px',
                    border: '1px solid #e5e5ea',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                    padding: '24px 28px',
                  }}
                >
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#1c1c1e', marginBottom: '8px' }}>
                    {item.q}
                  </div>
                  <div style={{ fontSize: '0.88rem', color: '#8e8e93', lineHeight: 1.5, fontWeight: 500 }}>
                    {item.a}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 5: ABOUT US */}
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

              {/* Creator Signature Card */}
              <div
                style={{
                  background: '#ffffff',
                  borderRadius: '20px',
                  border: '1px solid #e5e5ea',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
                  padding: '24px 32px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1c1c1e' }}>
                  Made by <span style={{ color: '#ff0066', fontWeight: 900 }}>ANSHU</span> with ❤️
                </div>
                <div style={{ fontSize: '0.8rem', color: '#8e8e93', marginTop: '4px', fontWeight: 500 }}>
                  CLASHA Official Architecture & Game Design
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: TERMS & CONDITIONS */}
          {activeTab === 'terms' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { title: '1. In-Class & Academic Usage Disclaimer', text: 'If playing during school or college classes, it is 100% personal user risk and responsibility. Game Owner holds zero liability for academic consequences.' },
                { title: '2. Dares & Game Prompts Liability Waiver', text: 'Whatever dare or prompt appears in game — the Game Owner holds absolute ZERO liability. All actions are performed at user’s own sole risk.' },
                { title: '3. Game Owner Role & Exclusion of Liability', text: 'Game Owner (ANSHU) is strictly software architect. Owner is not responsible for user behavior or chat content.' },
                { title: '4. Voluntary Participation & Account Freedom', text: 'Participation is 100% voluntary. Users may delete account or refrain from playing anytime.' },
                { title: '5. Code of Conduct & Fair Play', text: 'Harassment, toxic behavior, exploiting glitches, or cheating will result in an immediate account ban.' },
                { title: '6. Full Legal Indemnification', text: 'Users agree to indemnify and hold completely harmless the Game Owner (ANSHU) from any claims or damages.' },
              ].map((term, i) => (
                <div
                  key={i}
                  style={{
                    background: '#ffffff',
                    borderRadius: '20px',
                    border: '1px solid #e5e5ea',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                    padding: '24px 28px',
                  }}
                >
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#1c1c1e', marginBottom: '6px' }}>
                    {term.title}
                  </div>
                  <div style={{ fontSize: '0.88rem', color: '#8e8e93', lineHeight: 1.5, fontWeight: 500 }}>
                    {term.text}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 7: PRIVACY POLICY */}
          {activeTab === 'privacy' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { title: '1. Minimal Information We Collect', text: 'CLASHA only collects essential gameplay data: Display Name, Account Email, Leaderboard Scores. We NEVER access contacts, location, or sensitive device data.' },
                { title: '2. Purpose & Usage of Data', text: 'Your data is strictly used for account authentication, cabin matchmaking, global standings, and support inquiries.' },
                { title: '3. Zero Third-Party Selling', text: 'We NEVER sell or monetize personal user data to third parties, advertisers, or data brokers.' },
                { title: '4. Cloud Security & Encryption', text: 'Account data is secured via Supabase SSL encryption and password hashing standards.' },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    background: '#ffffff',
                    borderRadius: '20px',
                    border: '1px solid #e5e5ea',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                    padding: '24px 28px',
                  }}
                >
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#1c1c1e', marginBottom: '6px' }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: '0.88rem', color: '#8e8e93', lineHeight: 1.5, fontWeight: 500 }}>
                    {item.text}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 8: APP VERSION */}
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
