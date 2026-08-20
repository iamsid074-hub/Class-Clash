import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../state/useGameStore';
import {
  User,
  LogOut,
  Lock,
  HelpCircle,
  Info,
  FileText,
  Shield,
  HelpCircle as FaqIcon,
  Trophy,
  BarChart2,
  Check,
  ArrowLeft,
  Mail,
  Send,
  Copy,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Gamepad2,
  AlertTriangle,
  ShieldAlert,
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
import { SupabaseAuthService, UserProfile } from '../../networking/supabaseClient';

const APPLE_FONT = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Inter', 'Plus Jakarta Sans', sans-serif";

export const ProfileScreen: React.FC = () => {
  const { displayName, setDisplayName, setScreen, triggerGateTransition } = useGameStore();
  const [profileNameInput, setProfileNameInput] = useState(displayName || '2eosV3');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Support ticket state
  const [supportSubject, setSupportSubject] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [supportCategory, setSupportCategory] = useState('Account & Login');
  const [ticketSent, setTicketSent] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Live 10-Day Countdown Timer state for Upcoming Tournament
  const [timeLeft, setTimeLeft] = useState({
    days: 9,
    hours: 23,
    minutes: 59,
    seconds: 59,
  });

  useEffect(() => {
    SupabaseAuthService.getSavedSession().then((p) => {
      if (p) setUserProfile(p);
    });
  }, []);

  useEffect(() => {
    // Target time: 10 Days from now
    const targetDate = Date.now() + (9 * 24 * 60 * 60 * 1000 + 23 * 60 * 60 * 1000 + 59 * 60 * 1000 + 59 * 1000);

    const updateCountdown = () => {
      const diff = Math.max(0, targetDate - Date.now());
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ days: d, hours: h, minutes: m, seconds: s });
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  const matchesPlayed = userProfile?.matchesPlayed || 0;
  const points = userProfile?.leaderboardPoints || 0;
  const userEmail = userProfile?.email || 'anshu@classclash.io';

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

  const handleSaveAndReturn = () => {
    if (profileNameInput.trim()) {
      setDisplayName(profileNameInput.trim());
    }
    setSavedSuccess(true);
    setTimeout(() => {
      triggerGateTransition(() => {
        setScreen('MAIN_MENU');
      }, 'MAIN MENU', 'CLASHA');
    }, 400);
  };

  const handleBackToMenu = () => {
    triggerGateTransition(() => {
      setScreen('MAIN_MENU');
    }, 'MAIN MENU', 'CLASHA');
  };

  const handleLogout = async () => {
    await SupabaseAuthService.signOut();
    triggerGateTransition(() => {
      setScreen('AUTH');
    }, 'LOGGED OUT', 'CLASHA');
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
      {/* 1. iOS SIDEBAR NAVIGATION */}
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
          {/* Brand Header with Original Kanit Italic Logo Font (Balanced Medium Size) */}
          <div style={{ paddingLeft: '6px' }}>
            <div
              style={{
                fontSize: '1.25rem',
                fontWeight: 900,
                fontStyle: 'italic',
                fontFamily: "'Kanit', sans-serif",
                letterSpacing: '0.04em',
                lineHeight: 1,
              }}
            >
              <span style={{ color: '#1c1c1e' }}>CLA</span>
              <span style={{ color: '#ff0066' }}>SHA</span>
            </div>
          </div>

          {/* Section 1: MY ACCOUNT */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8e8e93', letterSpacing: '0.08em', paddingLeft: '12px', marginBottom: '4px', fontFamily: APPLE_FONT }}>
              MY ACCOUNT
            </div>

            {[
              { id: 'profile', label: 'Profile', icon: User },
              { id: 'stats', label: 'Statistics', icon: BarChart2 },
              { id: 'tournament', label: 'Tournament Status', icon: Trophy },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: '9999px',
                    background: isActive ? '#007aff' : 'transparent',
                    border: 'none',
                    color: isActive ? '#ffffff' : '#1c1c1e',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: APPLE_FONT,
                    textTransform: 'none',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: isActive ? '0 6px 16px rgba(0, 122, 255, 0.3)' : 'none',
                  }}
                >
                  <Icon size={17} color={isActive ? '#ffffff' : '#007aff'} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Section 2: ASSISTANCE & LEGAL */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8e8e93', letterSpacing: '0.08em', paddingLeft: '12px', marginBottom: '4px', fontFamily: APPLE_FONT }}>
              ASSISTANCE & LEGAL
            </div>

            {[
              { id: 'support', label: 'Support', icon: HelpCircle },
              { id: 'about', label: 'About Us', icon: Info },
              { id: 'terms', label: 'Terms & Conditions', icon: FileText },
              { id: 'privacy', label: 'Privacy Policy', icon: Shield },
              { id: 'faq', label: 'CLASHA FAQ', icon: FaqIcon },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: '9999px',
                    background: isActive ? '#007aff' : 'transparent',
                    border: 'none',
                    color: isActive ? '#ffffff' : '#1c1c1e',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: APPLE_FONT,
                    textTransform: 'none',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: isActive ? '0 6px 16px rgba(0, 122, 255, 0.3)' : 'none',
                  }}
                >
                  <Icon size={17} color={isActive ? '#ffffff' : '#8e8e93'} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom User Account Footer Card */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            borderRadius: '24px',
            background: '#f2f2f7',
            border: '1px solid #e5e5ea',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '9999px',
                background: '#007aff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
              }}
            >
              <User size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1c1c1e', fontFamily: APPLE_FONT, textTransform: 'none' }}>
                {profileNameInput || displayName || '2eosV3'}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#8e8e93', fontFamily: APPLE_FONT, textTransform: 'none' }}>
                {userEmail}
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Log Out"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#8e8e93',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. MAIN CONTENT AREA */}
      {/* ------------------------------------------------------------- */}
      <div
        style={{
          flex: 1,
          height: '100%',
          overflowY: 'auto',
          padding: '36px 48px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        {/* TOP RIGHT iOS CIRCULAR BACK BUTTON */}
        <button
          onClick={handleBackToMenu}
          title="Back to Menu"
          style={{
            position: 'absolute',
            top: '28px',
            right: '36px',
            width: '44px',
            height: '44px',
            borderRadius: '9999px',
            background: '#ffffff',
            border: '1px solid #e5e5ea',
            color: '#1c1c1e',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.2s ease',
            zIndex: 40,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#007aff';
            e.currentTarget.style.color = '#ffffff';
            e.currentTarget.style.transform = 'scale(1.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#ffffff';
            e.currentTarget.style.color = '#1c1c1e';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <ArrowLeft size={20} strokeWidth={2.5} />
        </button>

        {/* User Profile Header Banner */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            width: '100%',
            maxWidth: '1000px',
            background: '#ffffff',
            border: '1px solid #e5e5ea',
            borderRadius: '32px',
            padding: '26px 36px',
            boxSizing: 'border-box',
            marginBottom: '28px',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.03)',
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '9999px',
              background: 'linear-gradient(135deg, #007aff 0%, #5856d6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(0, 122, 255, 0.35)',
              flexShrink: 0,
            }}
          >
            <User size={46} color="#ffffff" strokeWidth={2} />
          </div>

          <div style={{ textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1c1c1e', letterSpacing: '-0.03em', fontFamily: APPLE_FONT, textTransform: 'none' }}>
                {profileNameInput || displayName || '2eosV3'}
              </span>
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '9999px',
                  background: '#007aff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Check size={13} color="#ffffff" strokeWidth={3} />
              </div>
            </div>
            <div style={{ fontSize: '0.9rem', color: '#8e8e93', marginTop: '2px', fontWeight: 500, fontFamily: APPLE_FONT, textTransform: 'none' }}>
              {userEmail}
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* TAB 1: PROFILE / PERSONAL DETAILS */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'profile' && (
          <div style={{ width: '100%', maxWidth: '1000px', textAlign: 'left' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1c1c1e', marginBottom: '20px', letterSpacing: '-0.02em', fontFamily: APPLE_FONT, textTransform: 'none' }}>
              Personal Details
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '20px',
                width: '100%',
                marginBottom: '28px',
              }}
            >
              {/* FULL NAME */}
              <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '28px', padding: '22px 26px' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8e8e93', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px', fontFamily: APPLE_FONT }}>
                  FULL NAME
                </div>
                <input
                  type="text"
                  value={profileNameInput}
                  onChange={(e) => setProfileNameInput(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    borderRadius: '16px',
                    border: '1px solid #d1d1d6',
                    background: '#ffffff',
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: '#1c1c1e',
                    outline: 'none',
                    boxSizing: 'border-box',
                    fontFamily: APPLE_FONT,
                  }}
                />
              </div>

              {/* EMAIL */}
              <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '28px', padding: '22px 26px' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8e8e93', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px', fontFamily: APPLE_FONT }}>
                  EMAIL
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1c1c1e', fontFamily: APPLE_FONT, textTransform: 'none' }}>
                  {userEmail}
                </div>
              </div>

              {/* ACCOUNT STATUS */}
              <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '28px', padding: '22px 26px' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8e8e93', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px', fontFamily: APPLE_FONT }}>
                  ACCOUNT STATUS
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#34c759', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: APPLE_FONT, textTransform: 'none' }}>
                  <CheckCircle2 size={18} color="#34c759" /> Active
                </div>
              </div>

              {/* JOINED */}
              <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '28px', padding: '22px 26px' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8e8e93', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px', fontFamily: APPLE_FONT }}>
                  JOINED
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1c1c1e', fontFamily: APPLE_FONT, textTransform: 'none' }}>
                  August 2026
                </div>
              </div>

              {/* LEADERBOARD RANKING */}
              <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '28px', padding: '22px 26px' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8e8e93', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px', fontFamily: APPLE_FONT }}>
                  LEADERBOARD RANKING
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#007aff', fontFamily: APPLE_FONT, textTransform: 'none' }}>
                  {points > 100 ? '#1 Ranked' : points > 0 ? '#3 Ranked' : '#12 Ranked'}
                </div>
              </div>

              {/* NATIONALITY */}
              <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '28px', padding: '22px 26px' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8e8e93', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px', fontFamily: APPLE_FONT }}>
                  NATIONALITY
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1c1c1e', fontFamily: APPLE_FONT, textTransform: 'none' }}>
                  Indian
                </div>
              </div>

              {/* MATCHES PLAYED */}
              <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '28px', padding: '22px 26px' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8e8e93', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px', fontFamily: APPLE_FONT }}>
                  MATCHES PLAYED
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1c1c1e', fontFamily: APPLE_FONT, textTransform: 'none' }}>
                  {matchesPlayed} Rounds
                </div>
              </div>

              {/* LEADERBOARD POINTS */}
              <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '28px', padding: '22px 26px' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8e8e93', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px', fontFamily: APPLE_FONT }}>
                  LEADERBOARD POINTS
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1c1c1e', fontFamily: APPLE_FONT, textTransform: 'none' }}>
                  {points} Points
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSaveAndReturn}
              style={{
                width: '100%',
                padding: '18px 36px',
                borderRadius: '9999px',
                background: '#007aff',
                border: 'none',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '1rem',
                cursor: 'pointer',
                fontFamily: APPLE_FONT,
                textTransform: 'none',
                boxShadow: '0 8px 24px rgba(0, 122, 255, 0.35)',
                transition: 'all 0.2s ease',
              }}
            >
              {savedSuccess ? 'Saved!' : 'Save & Return to Menu'}
            </button>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 2: DETAILED STATISTICS */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'stats' && (
          <div style={{ width: '100%', maxWidth: '1000px', textAlign: 'left' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1c1c1e', marginBottom: '20px', letterSpacing: '-0.02em', fontFamily: APPLE_FONT, textTransform: 'none' }}>
              Statistics
            </div>

            {/* 4 Super-Rounded Cards Row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '16px',
                width: '100%',
                marginBottom: '28px',
              }}
            >
              <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '28px', padding: '22px' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8e8e93', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: APPLE_FONT }}>
                  MATCHES PLAYED
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1c1c1e', marginTop: '6px', fontFamily: APPLE_FONT, textTransform: 'none', letterSpacing: '-0.03em' }}>
                  {matchesPlayed} Rounds
                </div>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '28px', padding: '22px' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8e8e93', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: APPLE_FONT }}>
                  TOTAL SCORE
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1c1c1e', marginTop: '6px', fontFamily: APPLE_FONT, textTransform: 'none', letterSpacing: '-0.03em' }}>
                  {points} PTS
                </div>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '28px', padding: '22px' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8e8e93', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: APPLE_FONT }}>
                  WIN RATE
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1c1c1e', marginTop: '6px', fontFamily: APPLE_FONT, textTransform: 'none', letterSpacing: '-0.03em' }}>
                  {matchesPlayed > 0 ? '70%' : '0%'}
                </div>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '28px', padding: '22px' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8e8e93', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: APPLE_FONT }}>
                  GLOBAL RANKING
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#007aff', marginTop: '6px', fontFamily: APPLE_FONT, textTransform: 'none', letterSpacing: '-0.03em' }}>
                  {points > 100 ? '#1' : points > 0 ? '#3' : '#12'}
                </div>
              </div>
            </div>

            {/* Performance Breakdown Card */}
            <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '32px', padding: '28px 32px', marginBottom: '28px' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1c1c1e', marginBottom: '18px', fontFamily: APPLE_FONT, textTransform: 'none' }}>
                Performance Metrics
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid #f2f2f7' }}>
                  <span style={{ color: '#8e8e93', fontSize: '0.9rem', fontWeight: 500, fontFamily: APPLE_FONT }}>Best Session Accuracy</span>
                  <span style={{ color: '#1c1c1e', fontSize: '0.9rem', fontWeight: 700, fontFamily: APPLE_FONT }}>98.5% Accuracy</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid #f2f2f7' }}>
                  <span style={{ color: '#8e8e93', fontSize: '0.9rem', fontWeight: 500, fontFamily: APPLE_FONT }}>Average Score Per Round</span>
                  <span style={{ color: '#1c1c1e', fontSize: '0.9rem', fontWeight: 700, fontFamily: APPLE_FONT }}>20.0 Points</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid #f2f2f7' }}>
                  <span style={{ color: '#8e8e93', fontSize: '0.9rem', fontWeight: 500, fontFamily: APPLE_FONT }}>Identity Verification</span>
                  <span style={{ color: '#34c759', fontSize: '0.9rem', fontWeight: 700, fontFamily: APPLE_FONT }}>✓ Verified Player</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#8e8e93', fontSize: '0.9rem', fontWeight: 500, fontFamily: APPLE_FONT }}>Division Tier</span>
                  <span style={{ color: '#007aff', fontSize: '0.9rem', fontWeight: 700, fontFamily: APPLE_FONT }}>Tier 1 Champions League</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleBackToMenu}
              style={{
                width: '100%',
                padding: '18px 36px',
                borderRadius: '9999px',
                background: '#ffffff',
                border: '1px solid #e5e5ea',
                color: '#1c1c1e',
                fontWeight: 700,
                fontSize: '1rem',
                cursor: 'pointer',
                fontFamily: APPLE_FONT,
                textTransform: 'none',
              }}
            >
              Return to Main Menu
            </button>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 3: TOURNAMENT STATUS */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'tournament' && (
          <div style={{ width: '100%', maxWidth: '1000px', textAlign: 'left' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1c1c1e', marginBottom: '20px', letterSpacing: '-0.02em', fontFamily: APPLE_FONT, textTransform: 'none' }}>
              Tournament Status
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '32px', padding: '36px', marginBottom: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#007aff', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px', fontFamily: APPLE_FONT }}>
                    UPCOMING CHAMPIONSHIP
                  </div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1c1c1e', letterSpacing: '-0.02em', fontFamily: APPLE_FONT, textTransform: 'none' }}>
                    Winter Doom Tournament
                  </div>
                </div>

                <div
                  style={{
                    background: matchesPlayed >= 10 && points >= 50 ? '#e4f9ec' : '#fff3e0',
                    color: matchesPlayed >= 10 && points >= 50 ? '#34c759' : '#ff9500',
                    padding: '8px 20px',
                    borderRadius: '9999px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    fontFamily: APPLE_FONT,
                    textTransform: 'none',
                  }}
                >
                  {matchesPlayed >= 10 && points >= 50 ? 'Qualified' : 'In Progress'}
                </div>
              </div>

              {/* LARGE 10-DAY COUNTDOWN TIMER */}
              <div style={{ marginBottom: '32px' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#8e8e93', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '14px', textAlign: 'center', fontFamily: APPLE_FONT }}>
                  REGISTRATION UNLOCK COUNTDOWN
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', textAlign: 'center' }}>
                  <div style={{ background: '#f2f2f7', border: '1px solid #e5e5ea', borderRadius: '24px', padding: '22px 8px' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1c1c1e', lineHeight: 1, fontFamily: APPLE_FONT }}>
                      {String(timeLeft.days).padStart(2, '0')}
                    </div>
                    <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8e8e93', marginTop: '8px', fontFamily: APPLE_FONT }}>DAYS</div>
                  </div>

                  <div style={{ background: '#f2f2f7', border: '1px solid #e5e5ea', borderRadius: '24px', padding: '22px 8px' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1c1c1e', lineHeight: 1, fontFamily: APPLE_FONT }}>
                      {String(timeLeft.hours).padStart(2, '0')}
                    </div>
                    <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8e8e93', marginTop: '8px', fontFamily: APPLE_FONT }}>HOURS</div>
                  </div>

                  <div style={{ background: '#f2f2f7', border: '1px solid #e5e5ea', borderRadius: '24px', padding: '22px 8px' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1c1c1e', lineHeight: 1, fontFamily: APPLE_FONT }}>
                      {String(timeLeft.minutes).padStart(2, '0')}
                    </div>
                    <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8e8e93', marginTop: '8px', fontFamily: APPLE_FONT }}>MINUTES</div>
                  </div>

                  <div style={{ background: '#f2f2f7', border: '1px solid #e5e5ea', borderRadius: '24px', padding: '22px 8px' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#007aff', lineHeight: 1, fontFamily: APPLE_FONT }}>
                      {String(timeLeft.seconds).padStart(2, '0')}
                    </div>
                    <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8e8e93', marginTop: '8px', fontFamily: APPLE_FONT }}>SECONDS</div>
                  </div>
                </div>
              </div>

              {/* Requirements Checklist */}
              <div style={{ background: '#f2f2f7', borderRadius: '24px', padding: '24px', marginBottom: '28px' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1c1c1e', marginBottom: '14px', fontFamily: APPLE_FONT, textTransform: 'none' }}>
                  Qualification Requirements
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', fontWeight: 500, color: '#1c1c1e', fontFamily: APPLE_FONT }}>
                    <Check size={18} color={matchesPlayed >= 10 ? '#34c759' : '#ff9500'} />
                    <span>10+ Matches Played (Current: {matchesPlayed} Rounds)</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', fontWeight: 500, color: '#1c1c1e', fontFamily: APPLE_FONT }}>
                    <Check size={18} color={points >= 50 ? '#34c759' : '#ff9500'} />
                    <span>50+ Leaderboard Points (Current: {points} Points)</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', fontWeight: 500, color: '#1c1c1e', fontFamily: APPLE_FONT }}>
                    <Check size={18} color="#34c759" />
                    <span>Identity Verification Completed (Status: Verified)</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                disabled
                style={{
                  width: '100%',
                  padding: '18px 28px',
                  borderRadius: '9999px',
                  background: '#e5e5ea',
                  border: 'none',
                  color: '#8e8e93',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  fontFamily: APPLE_FONT,
                  textTransform: 'none',
                }}
              >
                <Lock size={18} color="#8e8e93" />
                <span>Registration Locked (Opens in 10 Days)</span>
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 4: SUPPORT */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'support' && (
          <div style={{ width: '100%', maxWidth: '1000px', textAlign: 'left' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1c1c1e', marginBottom: '20px', letterSpacing: '-0.02em', fontFamily: APPLE_FONT, textTransform: 'none' }}>
              Support Center
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '20px', marginBottom: '24px' }}>
              {/* Left Contact Card */}
              <div
                style={{
                  background: '#ffffff',
                  border: '1px solid #e5e5ea',
                  borderRadius: '32px',
                  padding: '26px 32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.03)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div
                    style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '9999px',
                      background: '#007aff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      boxShadow: '0 6px 18px rgba(0, 122, 255, 0.3)',
                      flexShrink: 0,
                    }}
                  >
                    <Mail size={24} color="#ffffff" />
                  </div>

                  <div>
                    <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8e8e93', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: APPLE_FONT }}>
                      SUPPORT EMAIL
                    </div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1c1c1e', marginTop: '2px', fontFamily: APPLE_FONT, textTransform: 'none' }}>
                      clasha@gmail.com
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={handleCopySupportEmail}
                    style={{
                      padding: '12px 20px',
                      borderRadius: '9999px',
                      background: '#f2f2f7',
                      border: '1px solid #e5e5ea',
                      color: '#1c1c1e',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontFamily: APPLE_FONT,
                      textTransform: 'none',
                    }}
                  >
                    {copiedEmail ? <Check size={16} color="#34c759" /> : <Copy size={16} />}
                    <span>{copiedEmail ? 'Copied' : 'Copy'}</span>
                  </button>

                  <a
                    href="mailto:clasha@gmail.com"
                    style={{
                      padding: '12px 20px',
                      borderRadius: '9999px',
                      background: '#007aff',
                      border: 'none',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontFamily: APPLE_FONT,
                      textTransform: 'none',
                      boxShadow: '0 4px 14px rgba(0, 122, 255, 0.3)',
                    }}
                  >
                    <Send size={15} color="#ffffff" />
                    <span>Email</span>
                  </a>
                </div>
              </div>

              {/* Right Support Status Badge */}
              <div
                style={{
                  background: '#ffffff',
                  border: '1px solid #e5e5ea',
                  borderRadius: '32px',
                  padding: '26px 32px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.03)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#34c759' }} />
                  <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#34c759', fontFamily: APPLE_FONT, textTransform: 'none' }}>24/7 Support Live</span>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#8e8e93', fontWeight: 500, fontFamily: APPLE_FONT, textTransform: 'none' }}>
                  Under 2 hours average response time.
                </div>
              </div>
            </div>

            {/* Row 2: 2-Column Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
              {/* Left Column: Direct Ticket Form */}
              <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '32px', padding: '32px' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1c1c1e', marginBottom: '20px', fontFamily: APPLE_FONT, textTransform: 'none' }}>
                  Submit Support Ticket
                </div>

                {ticketSent ? (
                  <div style={{ background: '#e4f9ec', border: '1px solid #a7f3d0', borderRadius: '24px', padding: '24px', textAlign: 'center', color: '#15803d', fontWeight: 700, fontFamily: APPLE_FONT }}>
                    <Check size={32} color="#34c759" style={{ margin: '0 auto 10px auto', display: 'block' }} />
                    <div style={{ fontSize: '1.1rem' }}>Ticket Submitted!</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 500, marginTop: '6px', color: '#166534' }}>
                      We will contact you directly at <strong>clasha@gmail.com</strong>.
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleTicketSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8e8e93', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px', display: 'block', fontFamily: APPLE_FONT }}>
                          CATEGORY
                        </label>
                        <select
                          value={supportCategory}
                          onChange={(e) => setSupportCategory(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            borderRadius: '18px',
                            border: '1px solid #d1d1d6',
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
                          <option value="Tournament Inquiry">Tournament Inquiry</option>
                          <option value="General Inquiry">General Inquiry</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8e8e93', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px', display: 'block', fontFamily: APPLE_FONT }}>
                          YOUR EMAIL
                        </label>
                        <input
                          type="email"
                          readOnly
                          value={userEmail}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            borderRadius: '18px',
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
                      <label style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8e8e93', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px', display: 'block', fontFamily: APPLE_FONT }}>
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
                          borderRadius: '18px',
                          border: '1px solid #d1d1d6',
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
                      <label style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8e8e93', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px', display: 'block', fontFamily: APPLE_FONT }}>
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
                          borderRadius: '20px',
                          border: '1px solid #d1d1d6',
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
                        padding: '16px 32px',
                        borderRadius: '9999px',
                        background: '#007aff',
                        border: 'none',
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        cursor: 'pointer',
                        fontFamily: APPLE_FONT,
                        textTransform: 'none',
                        boxShadow: '0 6px 20px rgba(0, 122, 255, 0.35)',
                      }}
                    >
                      Submit Ticket
                    </button>
                  </form>
                )}
              </div>

              {/* Right Column: Quick FAQ List */}
              <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '32px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1c1c1e', fontFamily: APPLE_FONT, textTransform: 'none' }}>
                  Frequently Asked Questions
                </div>

                <div style={{ padding: '16px', borderRadius: '20px', background: '#f2f2f7' }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1c1c1e', marginBottom: '4px', fontFamily: APPLE_FONT, textTransform: 'none' }}>
                    ❓ How to join cabin room?
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#8e8e93', lineHeight: 1.4, fontFamily: APPLE_FONT, textTransform: 'none' }}>
                    Main Menu -&gt; Join Room -&gt; Enter Room ID &amp; Password.
                  </div>
                </div>

                <div style={{ padding: '16px', borderRadius: '20px', background: '#f2f2f7' }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1c1c1e', marginBottom: '4px', fontFamily: APPLE_FONT, textTransform: 'none' }}>
                    ❓ How to qualify for Winter Doom?
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#8e8e93', lineHeight: 1.4, fontFamily: APPLE_FONT, textTransform: 'none' }}>
                    Complete 10+ rounds and earn 50+ points before 10-day unlock.
                  </div>
                </div>

                <div style={{ padding: '16px', borderRadius: '20px', background: '#f2f2f7' }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1c1c1e', marginBottom: '4px', fontFamily: APPLE_FONT, textTransform: 'none' }}>
                    ❓ Direct Email Contact
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#8e8e93', lineHeight: 1.4, fontFamily: APPLE_FONT, textTransform: 'none' }}>
                    Email us anytime at <strong>clasha@gmail.com</strong> for assistance.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 5: ABOUT CLASHA */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'about' && (
          <div style={{ width: '100%', maxWidth: '1000px', textAlign: 'left' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1c1c1e', marginBottom: '20px', letterSpacing: '-0.02em', fontFamily: APPLE_FONT, textTransform: 'none' }}>
              About CLASHA
            </div>

            {/* Main Overview Banner Card */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e5e5ea',
                borderRadius: '32px',
                padding: '32px 36px',
                marginBottom: '24px',
                boxShadow: '0 4px 24px rgba(0, 0, 0, 0.03)',
              }}
            >
              <div style={{ fontSize: '0.88rem', color: '#8e8e93', fontWeight: 600, fontFamily: APPLE_FONT, textTransform: 'none', marginBottom: '12px' }}>
                Version 1.0.4 • Created August 2026
              </div>

              <div style={{ fontSize: '0.95rem', color: '#3a3a3c', lineHeight: 1.6, fontFamily: APPLE_FONT, textTransform: 'none' }}>
                CLASHA is an interactive real-time multiplayer Party Cabin &amp; Challenge Clash game. Players enter private or public party cabins using Room Codes &amp; Passwords, propose challenges, participate in live voting &amp; elimination rounds, and compete for Champion glory on the global leaderboard.
              </div>
            </div>

            {/* 2x2 Details Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>
              <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '28px', padding: '24px 28px' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#007aff', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px', fontFamily: APPLE_FONT }}>
                  GAME CONCEPT &amp; MECHANICS
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1c1c1e', marginBottom: '8px', fontFamily: APPLE_FONT, textTransform: 'none' }}>
                  Party Cabin Challenge Battles
                </div>
                <div style={{ fontSize: '0.85rem', color: '#8e8e93', lineHeight: 1.5, fontFamily: APPLE_FONT, textTransform: 'none' }}>
                  Built around multi-round Cabin Battles featuring Cabin Lobby, Proposal, Voting, and Champion Elimination phases. Powered by real-time server synchronization, team scoring, and fallback offline mode.
                </div>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '28px', padding: '24px 28px' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#007aff', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px', fontFamily: APPLE_FONT }}>
                  DEVELOPMENT &amp; CREATOR
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1c1c1e', marginBottom: '8px', fontFamily: APPLE_FONT, textTransform: 'none' }}>
                  Architected by ANSHU
                </div>
                <div style={{ fontSize: '0.85rem', color: '#8e8e93', lineHeight: 1.5, fontFamily: APPLE_FONT, textTransform: 'none' }}>
                  Designed and created by <strong>ANSHU</strong> in <strong>August 2026</strong>. Built using React, Three.js rendering engine, Colyseus multiplayer framework, and Supabase cloud infrastructure.
                </div>
              </div>
            </div>

            {/* LARGE FREESTANDING SIGNATURE CREATOR FOOTER */}
            <div
              style={{
                width: '100%',
                marginTop: '40px',
                paddingTop: '20px',
                paddingBottom: '30px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <div
                style={{
                  fontSize: '1.85rem',
                  fontWeight: 900,
                  color: '#1c1c1e',
                  letterSpacing: '-0.03em',
                  fontFamily: APPLE_FONT,
                  textTransform: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  flexWrap: 'wrap',
                }}
              >
                <span>Made by</span>
                <span
                  style={{
                    background: 'linear-gradient(135deg, #007aff 0%, #5856d6 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 900,
                  }}
                >
                  ANSHU
                </span>
                <span>Crafted From</span>
                <span style={{ fontSize: '1.8rem', display: 'inline-block', filter: 'drop-shadow(0 2px 8px rgba(255, 45, 85, 0.4))' }}>
                  ❤️
                </span>
              </div>

              <div style={{ fontSize: '0.78rem', color: '#8e8e93', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: APPLE_FONT }}>
                CLASHA OFFICIAL ARCHITECTURE &amp; DESIGN
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 6: TERMS & CONDITIONS */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'terms' && (
          <div style={{ width: '100%', maxWidth: '1000px', textAlign: 'left' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1c1c1e', marginBottom: '8px', letterSpacing: '-0.02em', fontFamily: APPLE_FONT, textTransform: 'none' }}>
              Terms &amp; Conditions
            </div>
            <div style={{ fontSize: '0.88rem', color: '#8e8e93', marginBottom: '24px', fontFamily: APPLE_FONT, textTransform: 'none' }}>
              Official User Agreement, Liability Waivers &amp; Rules of Conduct for CLASHA.
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
              {/* Section 1: In-Class Responsibility */}
              <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '28px', padding: '26px 30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <AlertTriangle size={20} color="#ff9500" />
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1c1c1e', fontFamily: APPLE_FONT, textTransform: 'none' }}>
                    1. In-Class &amp; Academic Usage Disclaimer
                  </div>
                </div>
                <div style={{ fontSize: '0.9rem', color: '#3a3a3c', lineHeight: 1.6, fontFamily: APPLE_FONT, textTransform: 'none' }}>
                  If a user chooses to play CLASHA during school, college, or university classes or lectures, it is <strong>100% the user's personal responsibility and risk</strong>. The Game Owner (ANSHU) and CLASHA platform hold <strong>ZERO liability</strong> for any disciplinary action, academic consequences, or school policy violations resulting from playing during class.
                </div>
              </div>

              {/* Section 2: Dares & Proposals Liability Waiver */}
              <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '28px', padding: '26px 30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <ShieldAlert size={20} color="#ff3b30" />
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1c1c1e', fontFamily: APPLE_FONT, textTransform: 'none' }}>
                    2. Dares, Challenges &amp; Game Prompts Liability Waiver
                  </div>
                </div>
                <div style={{ fontSize: '0.9rem', color: '#3a3a3c', lineHeight: 1.6, fontFamily: APPLE_FONT, textTransform: 'none' }}>
                  Whatever dare, challenge, proposal, task, or prompt appears or is assigned within the game — the Game Owner holds <strong>absolute ZERO responsibility or liability</strong>. Every single action, choice, or dare performed by the user is strictly at the user's own sole risk, personal judgment, and discretion.
                </div>
              </div>

              {/* Section 3: Game Owner Liability Exclusion */}
              <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '28px', padding: '26px 30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <ShieldCheck size={20} color="#007aff" />
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1c1c1e', fontFamily: APPLE_FONT, textTransform: 'none' }}>
                    3. Game Owner Role &amp; Absolute Exclusion of Liability
                  </div>
                </div>
                <div style={{ fontSize: '0.9rem', color: '#3a3a3c', lineHeight: 1.6, fontFamily: APPLE_FONT, textTransform: 'none' }}>
                  The Game Owner (ANSHU) is strictly the software architect and creator. The Owner is not responsible for user behavior, multiplayer cabin interactions, chat messages, or how players use the app. All gameplay and interactions are conducted entirely at the user's own risk.
                </div>
              </div>

              {/* Section 4: Voluntary Participation & Freedom */}
              <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '28px', padding: '26px 30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <Trash2 size={20} color="#34c759" />
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1c1c1e', fontFamily: APPLE_FONT, textTransform: 'none' }}>
                    4. Voluntary Participation &amp; Account Deletion Freedom
                  </div>
                </div>
                <div style={{ fontSize: '0.9rem', color: '#3a3a3c', lineHeight: 1.6, fontFamily: APPLE_FONT, textTransform: 'none' }}>
                  Participation in CLASHA is completely voluntary. The Game Owner does not force or compel anyone to play. If any user does not wish to play or does not agree with these terms, they are free to refrain from playing or delete their account at any time without restriction.
                </div>
              </div>

              {/* Section 5: Code of Conduct & Fair Play */}
              <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '28px', padding: '26px 30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <UserCheck size={20} color="#5856d6" />
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1c1c1e', fontFamily: APPLE_FONT, textTransform: 'none' }}>
                    5. Multiplayer Code of Conduct &amp; Fair Play
                  </div>
                </div>
                <div style={{ fontSize: '0.9rem', color: '#3a3a3c', lineHeight: 1.6, fontFamily: APPLE_FONT, textTransform: 'none' }}>
                  Players must maintain respectful behavior in party cabin chats and lobbies. Harassment, toxic behavior, exploiting glitches, or manipulating leaderboard points will result in an immediate account ban.
                </div>
              </div>

              {/* Section 6: Physical Safety & Health Disclaimer */}
              <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '28px', padding: '26px 30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <Activity size={20} color="#ff2d55" />
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1c1c1e', fontFamily: APPLE_FONT, textTransform: 'none' }}>
                    6. Health, Physical Safety &amp; Non-Hazard Disclaimer
                  </div>
                </div>
                <div style={{ fontSize: '0.9rem', color: '#3a3a3c', lineHeight: 1.6, fontFamily: APPLE_FONT, textTransform: 'none' }}>
                  CLASHA is strictly a virtual digital application. Users must <strong>NEVER attempt any physically dangerous, harmful, or illegal acts</strong> in real life. The Game Owner is <strong>100% immune and free from any liability</strong> regarding personal injury, health conditions, or property damage.
                </div>
              </div>

              {/* Section 7: Personal Data Security & Chat Privacy */}
              <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '28px', padding: '26px 30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <EyeOff size={20} color="#af52de" />
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1c1c1e', fontFamily: APPLE_FONT, textTransform: 'none' }}>
                    7. Personal Data Security &amp; Chat Privacy Warning
                  </div>
                </div>
                <div style={{ fontSize: '0.9rem', color: '#3a3a3c', lineHeight: 1.6, fontFamily: APPLE_FONT, textTransform: 'none' }}>
                  Players are strongly advised <strong>NEVER to share passwords, phone numbers, bank details, or private credentials</strong> in multiplayer cabin chats. The Game Owner is not responsible for any information voluntarily disclosed by users to third parties in chat rooms.
                </div>
              </div>

              {/* Section 8: Full Legal Indemnification */}
              <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '28px', padding: '26px 30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <Scale size={20} color="#007aff" />
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1c1c1e', fontFamily: APPLE_FONT, textTransform: 'none' }}>
                    8. Complete Legal Indemnification of Game Owner
                  </div>
                </div>
                <div style={{ fontSize: '0.9rem', color: '#3a3a3c', lineHeight: 1.6, fontFamily: APPLE_FONT, textTransform: 'none' }}>
                  By accessing or playing CLASHA, all users explicitly agree to <strong>indemnify, defend, and hold completely harmless the Game Owner (ANSHU)</strong> from any claims, legal suits, losses, liabilities, damages, or costs resulting from the user's access or misuse of the app.
                </div>
              </div>

              {/* Section 9: Agreement Modifications */}
              <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '28px', padding: '26px 30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <RefreshCw size={20} color="#8e8e93" />
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1c1c1e', fontFamily: APPLE_FONT, textTransform: 'none' }}>
                    9. Agreement Updates &amp; Support Contact
                  </div>
                </div>
                <div style={{ fontSize: '0.9rem', color: '#3a3a3c', lineHeight: 1.6, fontFamily: APPLE_FONT, textTransform: 'none' }}>
                  The Game Owner reserves the right to modify these terms at any time. Continued use of CLASHA constitutes full acceptance of the updated terms. For legal inquiries or support, contact <strong>clasha@gmail.com</strong>.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 7: PRIVACY POLICY */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'privacy' && (
          <div style={{ width: '100%', maxWidth: '1000px', textAlign: 'left' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1c1c1e', marginBottom: '8px', letterSpacing: '-0.02em', fontFamily: APPLE_FONT, textTransform: 'none' }}>
              Privacy Policy
            </div>
            <div style={{ fontSize: '0.88rem', color: '#8e8e93', marginBottom: '24px', fontFamily: APPLE_FONT, textTransform: 'none' }}>
              How CLASHA Collects, Protects, and Handles User Data &amp; Privacy.
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
              {/* Section 1: Information We Collect */}
              <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '28px', padding: '26px 30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <Database size={20} color="#007aff" />
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1c1c1e', fontFamily: APPLE_FONT, textTransform: 'none' }}>
                    1. Minimal Information We Collect
                  </div>
                </div>
                <div style={{ fontSize: '0.9rem', color: '#3a3a3c', lineHeight: 1.6, fontFamily: APPLE_FONT, textTransform: 'none' }}>
                  CLASHA only collects essential gameplay data required to provide real-time multiplayer cabins: Display Name, Account Email, Leaderboard Scores, and Match Statistics. We <strong>NEVER access, request, or store sensitive identity documents, bank details, device contacts, or location tracking</strong>.
                </div>
              </div>

              {/* Section 2: How Data is Used */}
              <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '28px', padding: '26px 30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <FileLock size={20} color="#34c759" />
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1c1c1e', fontFamily: APPLE_FONT, textTransform: 'none' }}>
                    2. Purpose &amp; Usage of Your Data
                  </div>
                </div>
                <div style={{ fontSize: '0.9rem', color: '#3a3a3c', lineHeight: 1.6, fontFamily: APPLE_FONT, textTransform: 'none' }}>
                  Your data is strictly utilized for account authentication, party cabin matchmaking, global leaderboard rankings, and resolving support requests submitted to <strong>clasha@gmail.com</strong>. We do NOT build advertising profiles or track user activity across external websites.
                </div>
              </div>

              {/* Section 3: Third-Party Selling Disclaimer */}
              <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '28px', padding: '26px 30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <Share2 size={20} color="#ff3b30" />
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1c1c1e', fontFamily: APPLE_FONT, textTransform: 'none' }}>
                    3. Zero Third-Party Selling or Monetization
                  </div>
                </div>
                <div style={{ fontSize: '0.9rem', color: '#3a3a3c', lineHeight: 1.6, fontFamily: APPLE_FONT, textTransform: 'none' }}>
                  <strong>We NEVER sell, rent, trade, or monetize your personal data</strong> to any third-party advertisers, marketing agencies, or data brokers. All user data remains confidential and protected under strict access protocols.
                </div>
              </div>

              {/* Section 4: Data Encryption & Security */}
              <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '28px', padding: '26px 30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <ShieldCheck size={20} color="#5856d6" />
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1c1c1e', fontFamily: APPLE_FONT, textTransform: 'none' }}>
                    4. Cloud Infrastructure &amp; Encryption
                  </div>
                </div>
                <div style={{ fontSize: '0.9rem', color: '#3a3a3c', lineHeight: 1.6, fontFamily: APPLE_FONT, textTransform: 'none' }}>
                  Session authentication and profile records are secured using SSL/TLS encryption and stored on cloud database infrastructure (Supabase &amp; Colyseus). We employ automated security safeguards to prevent unauthorized access.
                </div>
              </div>

              {/* Section 5: Cookies & Local Storage */}
              <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '28px', padding: '26px 30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <Cookie size={20} color="#ff9500" />
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1c1c1e', fontFamily: APPLE_FONT, textTransform: 'none' }}>
                    5. Local Storage &amp; Cookie Usage
                  </div>
                </div>
                <div style={{ fontSize: '0.9rem', color: '#3a3a3c', lineHeight: 1.6, fontFamily: APPLE_FONT, textTransform: 'none' }}>
                  CLASHA utilizes minimal browser LocalStorage strictly to store local sound settings, session authentication tokens, and user preferences. We do <strong>NOT use tracking cookies or third-party web beacons</strong>.
                </div>
              </div>

              {/* Section 6: Data Deletion & User Rights */}
              <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '28px', padding: '26px 30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <Trash2 size={20} color="#ff2d55" />
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1c1c1e', fontFamily: APPLE_FONT, textTransform: 'none' }}>
                    6. Complete Data Control &amp; Account Deletion Rights
                  </div>
                </div>
                <div style={{ fontSize: '0.9rem', color: '#3a3a3c', lineHeight: 1.6, fontFamily: APPLE_FONT, textTransform: 'none' }}>
                  You have full rights over your data. If you wish to purge your gameplay records, delete your account, or request a copy of your stored data, email support anytime at <strong>clasha@gmail.com</strong>.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 8: CLASHA FAQ */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'faq' && (
          <div style={{ width: '100%', maxWidth: '1000px', textAlign: 'left' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1c1c1e', marginBottom: '8px', letterSpacing: '-0.02em', fontFamily: APPLE_FONT, textTransform: 'none' }}>
              CLASHA FAQ &amp; Help
            </div>
            <div style={{ fontSize: '0.88rem', color: '#8e8e93', marginBottom: '24px', fontFamily: APPLE_FONT, textTransform: 'none' }}>
              Frequently Asked Questions to help solve all your gameplay, cabin, and account doubts.
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
              {/* FAQ Item 1 */}
              <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '28px', padding: '24px 28px' }}>
                <div style={{ fontSize: '1.02rem', fontWeight: 700, color: '#1c1c1e', marginBottom: '8px', fontFamily: APPLE_FONT, textTransform: 'none', display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ color: '#007aff' }}>❓</span> What is CLASHA and how do I play?
                </div>
                <div style={{ fontSize: '0.88rem', color: '#8e8e93', lineHeight: 1.5, fontFamily: APPLE_FONT, textTransform: 'none' }}>
                  CLASHA is a real-time multiplayer Party Cabin game. You create or join a Cabin room using a Room Code &amp; Password, propose challenges, vote in rounds, earn points, and climb the leaderboard!
                </div>
              </div>

              {/* FAQ Item 2 */}
              <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '28px', padding: '24px 28px' }}>
                <div style={{ fontSize: '1.02rem', fontWeight: 700, color: '#1c1c1e', marginBottom: '8px', fontFamily: APPLE_FONT, textTransform: 'none', display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ color: '#007aff' }}>❓</span> How to create or join a Party Cabin?
                </div>
                <div style={{ fontSize: '0.88rem', color: '#8e8e93', lineHeight: 1.5, fontFamily: APPLE_FONT, textTransform: 'none' }}>
                  On Main Menu, tap <strong>Create Room</strong> to host a cabin, or tap <strong>Join Room</strong> and enter the Room Code &amp; Password given by your friend.
                </div>
              </div>

              {/* FAQ Item 3 */}
              <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '28px', padding: '24px 28px' }}>
                <div style={{ fontSize: '1.02rem', fontWeight: 700, color: '#1c1c1e', marginBottom: '8px', fontFamily: APPLE_FONT, textTransform: 'none', display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ color: '#007aff' }}>❓</span> How are points &amp; ranks calculated?
                </div>
                <div style={{ fontSize: '0.88rem', color: '#8e8e93', lineHeight: 1.5, fontFamily: APPLE_FONT, textTransform: 'none' }}>
                  Points are awarded for winning voting rounds and completing cabin challenges. Your total points automatically update your Global Leaderboard ranking.
                </div>
              </div>

              {/* FAQ Item 4 */}
              <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '28px', padding: '24px 28px' }}>
                <div style={{ fontSize: '1.02rem', fontWeight: 700, color: '#1c1c1e', marginBottom: '8px', fontFamily: APPLE_FONT, textTransform: 'none', display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ color: '#007aff' }}>❓</span> What if a player disconnects?
                </div>
                <div style={{ fontSize: '0.88rem', color: '#8e8e93', lineHeight: 1.5, fontFamily: APPLE_FONT, textTransform: 'none' }}>
                  CLASHA syncs room state automatically. Disconnected players can rejoin using the same Room Code &amp; Password while the cabin round continues.
                </div>
              </div>

              {/* FAQ Item 5 */}
              <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '28px', padding: '24px 28px' }}>
                <div style={{ fontSize: '1.02rem', fontWeight: 700, color: '#1c1c1e', marginBottom: '8px', fontFamily: APPLE_FONT, textTransform: 'none', display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ color: '#007aff' }}>❓</span> How do I enter Winter Doom Tournament?
                </div>
                <div style={{ fontSize: '0.88rem', color: '#8e8e93', lineHeight: 1.5, fontFamily: APPLE_FONT, textTransform: 'none' }}>
                  You need 10+ rounds played and 50+ leaderboard points. Check the <strong>Tournament Status</strong> tab to view your live countdown timer.
                </div>
              </div>

              {/* FAQ Item 6 */}
              <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '28px', padding: '24px 28px' }}>
                <div style={{ fontSize: '1.02rem', fontWeight: 700, color: '#1c1c1e', marginBottom: '8px', fontFamily: APPLE_FONT, textTransform: 'none', display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ color: '#007aff' }}>❓</span> Can I play on mobile or tablet?
                </div>
                <div style={{ fontSize: '0.88rem', color: '#8e8e93', lineHeight: 1.5, fontFamily: APPLE_FONT, textTransform: 'none' }}>
                  Yes! CLASHA is fully responsive and optimized for touch devices on Mobile, Tablet, and Desktop web browsers.
                </div>
              </div>

              {/* FAQ Item 7 */}
              <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '28px', padding: '24px 28px' }}>
                <div style={{ fontSize: '1.02rem', fontWeight: 700, color: '#1c1c1e', marginBottom: '8px', fontFamily: APPLE_FONT, textTransform: 'none', display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ color: '#007aff' }}>❓</span> How do I change my display name?
                </div>
                <div style={{ fontSize: '0.88rem', color: '#8e8e93', lineHeight: 1.5, fontFamily: APPLE_FONT, textTransform: 'none' }}>
                  Go to <strong>Profile -&gt; Personal Details</strong>, update the Full Name field, and click <strong>Save &amp; Return to Menu</strong>.
                </div>
              </div>

              {/* FAQ Item 8 */}
              <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '28px', padding: '24px 28px' }}>
                <div style={{ fontSize: '1.02rem', fontWeight: 700, color: '#1c1c1e', marginBottom: '8px', fontFamily: APPLE_FONT, textTransform: 'none', display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ color: '#007aff' }}>❓</span> How do I contact official support?
                </div>
                <div style={{ fontSize: '0.88rem', color: '#8e8e93', lineHeight: 1.5, fontFamily: APPLE_FONT, textTransform: 'none' }}>
                  Open the <strong>Support</strong> tab to submit a support ticket or email official support directly at <strong>clasha@gmail.com</strong>.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* OTHER LEGAL & ASSISTANCE TABS (FALLBACK) */}
        {/* ------------------------------------------------------------- */}
        {activeTab !== 'profile' && activeTab !== 'stats' && activeTab !== 'tournament' && activeTab !== 'support' && activeTab !== 'about' && activeTab !== 'terms' && activeTab !== 'privacy' && activeTab !== 'faq' && (
          <div style={{ width: '100%', maxWidth: '1000px', textAlign: 'left' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1c1c1e', marginBottom: '20px', textTransform: 'capitalize', fontFamily: APPLE_FONT }}>
              {activeTab.replace('_', ' ')}
            </div>

            <div style={{ background: '#ffffff', borderRadius: '32px', border: '1px solid #e5e5ea', padding: '40px', textAlign: 'center' }}>
              <ShieldCheck size={40} color="#007aff" style={{ margin: '0 auto 14px auto', display: 'block' }} />
              <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1c1c1e', fontFamily: APPLE_FONT, textTransform: 'none' }}>CLASHA {activeTab.toUpperCase()} Policy</div>
              <div style={{ fontSize: '0.88rem', color: '#8e8e93', marginTop: '6px', maxWidth: '480px', margin: '6px auto 0 auto', fontFamily: APPLE_FONT, textTransform: 'none' }}>
                All legal, terms, and privacy guidelines are strictly verified for CLASHA v1.0.4. Contact <strong>clasha@gmail.com</strong> for any inquiries.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
