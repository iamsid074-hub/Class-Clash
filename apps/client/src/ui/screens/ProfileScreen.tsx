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
} from 'lucide-react';
import { SupabaseAuthService, UserProfile } from '../../networking/supabaseClient';

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
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif",
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
          {/* Brand Header */}
          <div style={{ paddingLeft: '6px' }}>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#1c1c1e', letterSpacing: '-0.03em' }}>
              CLASHA
            </div>
          </div>

          {/* Section 1: MY ACCOUNT */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8e8e93', letterSpacing: '0.08em', paddingLeft: '12px', marginBottom: '4px' }}>
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
                    borderRadius: '9999px', // Apple iOS Pill Button
                    background: isActive ? '#007aff' : 'transparent',
                    border: 'none',
                    color: isActive ? '#ffffff' : '#1c1c1e',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    textAlign: 'left',
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
            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8e8e93', letterSpacing: '0.08em', paddingLeft: '12px', marginBottom: '4px' }}>
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
                    borderRadius: '9999px', // Apple iOS Pill Button
                    background: isActive ? '#007aff' : 'transparent',
                    border: 'none',
                    color: isActive ? '#ffffff' : '#1c1c1e',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    textAlign: 'left',
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
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1c1c1e' }}>
                {profileNameInput || displayName || '2eosV3'}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#8e8e93' }}>
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
      {/* 2. MAIN CONTENT AREA (SPANNING FULL 1000px WIDTH TO FILL SPACE) */}
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
            borderRadius: '9999px', // Circular Pill
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

        {/* User Profile Header Banner (Super-Rounded 32px Squircle) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            width: '100%',
            maxWidth: '1000px',
            background: '#ffffff',
            border: '1px solid #e5e5ea',
            borderRadius: '32px', // Ultra-smooth Apple squircle
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
              borderRadius: '9999px', // Apple Circle Avatar
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
              <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1c1c1e', letterSpacing: '-0.03em' }}>
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
            <div style={{ fontSize: '0.9rem', color: '#8e8e93', marginTop: '2px', fontWeight: 500 }}>
              {userEmail}
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* TAB 1: PROFILE / PERSONAL DETAILS */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'profile' && (
          <div style={{ width: '100%', maxWidth: '1000px', textAlign: 'left' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1c1c1e', marginBottom: '20px', letterSpacing: '-0.02em' }}>
              Personal details
            </div>

            {/* iOS Super-Rounded 2-Column Grid */}
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
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8e8e93', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  FULL NAME
                </div>
                <input
                  type="text"
                  value={profileNameInput}
                  onChange={(e) => setProfileNameInput(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    borderRadius: '16px', // Rounded input
                    border: '1px solid #d1d1d6',
                    background: '#ffffff',
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: '#1c1c1e',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* EMAIL */}
              <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '28px', padding: '22px 26px' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8e8e93', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  EMAIL
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1c1c1e' }}>
                  {userEmail}
                </div>
              </div>

              {/* ACCOUNT STATUS */}
              <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '28px', padding: '22px 26px' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8e8e93', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  ACCOUNT STATUS
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#34c759', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={18} color="#34c759" /> Active
                </div>
              </div>

              {/* JOINED */}
              <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '28px', padding: '22px 26px' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8e8e93', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  JOINED
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1c1c1e' }}>
                  August 2026
                </div>
              </div>

              {/* LEADERBOARD RANKING */}
              <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '28px', padding: '22px 26px' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8e8e93', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  LEADERBOARD RANKING
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#007aff' }}>
                  {points > 100 ? '#1 Ranked' : points > 0 ? '#3 Ranked' : '#12 Ranked'}
                </div>
              </div>

              {/* NATIONALITY */}
              <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '28px', padding: '22px 26px' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8e8e93', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  NATIONALITY
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1c1c1e' }}>
                  Indian
                </div>
              </div>

              {/* MATCHES PLAYED */}
              <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '28px', padding: '22px 26px' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8e8e93', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  MATCHES PLAYED
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1c1c1e' }}>
                  {matchesPlayed} Rounds
                </div>
              </div>

              {/* LEADERBOARD POINTS */}
              <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '28px', padding: '22px 26px' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8e8e93', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  LEADERBOARD POINTS
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1c1c1e' }}>
                  {points} Points
                </div>
              </div>
            </div>

            {/* iOS Full-Width Pill Save Button */}
            <button
              type="button"
              onClick={handleSaveAndReturn}
              style={{
                width: '100%',
                padding: '18px 36px',
                borderRadius: '9999px', // Apple Pill Button
                background: '#007aff',
                border: 'none',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '1rem',
                cursor: 'pointer',
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
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1c1c1e', marginBottom: '20px', letterSpacing: '-0.02em' }}>
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
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8e8e93', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  MATCHES PLAYED
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1c1c1e', marginTop: '6px' }}>
                  {matchesPlayed} Rounds
                </div>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '28px', padding: '22px' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8e8e93', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  TOTAL SCORE
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1c1c1e', marginTop: '6px' }}>
                  {points} PTS
                </div>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '28px', padding: '22px' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8e8e93', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  WIN RATE
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1c1c1e', marginTop: '6px' }}>
                  {matchesPlayed > 0 ? '70%' : '0%'}
                </div>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '28px', padding: '22px' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8e8e93', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  GLOBAL RANKING
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#007aff', marginTop: '6px' }}>
                  {points > 100 ? '#1' : points > 0 ? '#3' : '#12'}
                </div>
              </div>
            </div>

            {/* Performance Breakdown Card */}
            <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '32px', padding: '28px 32px', marginBottom: '28px' }}>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1c1c1e', marginBottom: '18px' }}>
                Performance Metrics
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid #f2f2f7' }}>
                  <span style={{ color: '#8e8e93', fontSize: '0.9rem', fontWeight: 500 }}>Best Lap Time</span>
                  <span style={{ color: '#1c1c1e', fontSize: '0.9rem', fontWeight: 700 }}>1:24.52s (Sky Factory)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid #f2f2f7' }}>
                  <span style={{ color: '#8e8e93', fontSize: '0.9rem', fontWeight: 500 }}>Average Score Per Round</span>
                  <span style={{ color: '#1c1c1e', fontSize: '0.9rem', fontWeight: 700 }}>20.0 Points</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid #f2f2f7' }}>
                  <span style={{ color: '#8e8e93', fontSize: '0.9rem', fontWeight: 500 }}>Identity Verification</span>
                  <span style={{ color: '#34c759', fontSize: '0.9rem', fontWeight: 700 }}>✓ Verified Racer</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#8e8e93', fontSize: '0.9rem', fontWeight: 500 }}>Division Tier</span>
                  <span style={{ color: '#007aff', fontSize: '0.9rem', fontWeight: 700 }}>Tier 1 Champions Division</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleBackToMenu}
              style={{
                width: '100%',
                padding: '18px 36px',
                borderRadius: '9999px', // Pill Button
                background: '#ffffff',
                border: '1px solid #e5e5ea',
                color: '#1c1c1e',
                fontWeight: 700,
                fontSize: '1rem',
                cursor: 'pointer',
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
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1c1c1e', marginBottom: '20px', letterSpacing: '-0.02em' }}>
              Tournament Status
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '32px', padding: '36px', marginBottom: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#007aff', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>
                    UPCOMING CHAMPIONSHIP
                  </div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#1c1c1e', letterSpacing: '-0.02em' }}>
                    WINTER DOOM TOURNAMENT
                  </div>
                </div>

                <div
                  style={{
                    background: matchesPlayed >= 10 && points >= 50 ? '#e4f9ec' : '#fff3e0',
                    color: matchesPlayed >= 10 && points >= 50 ? '#34c759' : '#ff9500',
                    padding: '8px 20px',
                    borderRadius: '9999px', // Pill Badge
                    fontSize: '0.82rem',
                    fontWeight: 800,
                  }}
                >
                  {matchesPlayed >= 10 && points >= 50 ? 'QUALIFIED' : 'IN PROGRESS'}
                </div>
              </div>

              {/* LARGE 10-DAY COUNTDOWN TIMER */}
              <div style={{ marginBottom: '32px' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#8e8e93', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '14px', textAlign: 'center' }}>
                  REGISTRATION UNLOCK COUNTDOWN
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', textAlign: 'center' }}>
                  <div style={{ background: '#f2f2f7', border: '1px solid #e5e5ea', borderRadius: '24px', padding: '22px 8px' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#1c1c1e', lineHeight: 1 }}>
                      {String(timeLeft.days).padStart(2, '0')}
                    </div>
                    <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8e8e93', marginTop: '8px' }}>DAYS</div>
                  </div>

                  <div style={{ background: '#f2f2f7', border: '1px solid #e5e5ea', borderRadius: '24px', padding: '22px 8px' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#1c1c1e', lineHeight: 1 }}>
                      {String(timeLeft.hours).padStart(2, '0')}
                    </div>
                    <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8e8e93', marginTop: '8px' }}>HOURS</div>
                  </div>

                  <div style={{ background: '#f2f2f7', border: '1px solid #e5e5ea', borderRadius: '24px', padding: '22px 8px' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#1c1c1e', lineHeight: 1 }}>
                      {String(timeLeft.minutes).padStart(2, '0')}
                    </div>
                    <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8e8e93', marginTop: '8px' }}>MINUTES</div>
                  </div>

                  <div style={{ background: '#f2f2f7', border: '1px solid #e5e5ea', borderRadius: '24px', padding: '22px 8px' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#007aff', lineHeight: 1 }}>
                      {String(timeLeft.seconds).padStart(2, '0')}
                    </div>
                    <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8e8e93', marginTop: '8px' }}>SECONDS</div>
                  </div>
                </div>
              </div>

              {/* Requirements Checklist */}
              <div style={{ background: '#f2f2f7', borderRadius: '24px', padding: '24px', marginBottom: '28px' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1c1c1e', marginBottom: '14px' }}>
                  QUALIFICATION REQUIREMENTS
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', fontWeight: 600, color: '#1c1c1e' }}>
                    <Check size={18} color={matchesPlayed >= 10 ? '#34c759' : '#ff9500'} />
                    <span>10+ Matches Played (Current: {matchesPlayed} Rounds)</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', fontWeight: 600, color: '#1c1c1e' }}>
                    <Check size={18} color={points >= 50 ? '#34c759' : '#ff9500'} />
                    <span>50+ Leaderboard Points (Current: {points} Points)</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', fontWeight: 600, color: '#1c1c1e' }}>
                    <Check size={18} color="#34c759" />
                    <span>Identity Verification Completed (Status: Verified)</span>
                  </div>
                </div>
              </div>

              {/* Locked Pill Button */}
              <button
                type="button"
                disabled
                style={{
                  width: '100%',
                  padding: '18px 28px',
                  borderRadius: '9999px', // Apple Pill Button
                  background: '#e5e5ea',
                  border: 'none',
                  color: '#8e8e93',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  cursor: 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                }}
              >
                <Lock size={18} color="#8e8e93" />
                <span>REGISTRATION LOCKED (OPENS IN 10 DAYS)</span>
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 4: SUPPORT (SUPER-ROUNDED iOS 32px CARDS & PILL BUTTONS) */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'support' && (
          <div style={{ width: '100%', maxWidth: '1000px', textAlign: 'left' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1c1c1e', marginBottom: '20px', letterSpacing: '-0.02em' }}>
              Support Center
            </div>

            {/* Row 1: Contact Banner + Status Card 2-Column Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '20px', marginBottom: '24px' }}>
              {/* Left Contact Card */}
              <div
                style={{
                  background: '#ffffff',
                  border: '1px solid #e5e5ea',
                  borderRadius: '32px', // Ultra-rounded Apple Card
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
                      borderRadius: '9999px', // Circle icon container
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
                    <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8e8e93', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      SUPPORT EMAIL
                    </div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#1c1c1e', marginTop: '2px' }}>
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
                      borderRadius: '9999px', // Apple Pill Button
                      background: '#f2f2f7',
                      border: '1px solid #e5e5ea',
                      color: '#1c1c1e',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    {copiedEmail ? <Check size={16} color="#34c759" /> : <Copy size={16} />}
                    <span>{copiedEmail ? 'Copied' : 'Copy'}</span>
                  </button>

                  <a
                    href="mailto:clasha@gmail.com"
                    style={{
                      padding: '12px 20px',
                      borderRadius: '9999px', // Apple Pill Button
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
                  borderRadius: '32px', // Ultra-rounded Apple Card
                  padding: '26px 32px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.03)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#34c759' }} />
                  <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#34c759' }}>24/7 Support Live</span>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#8e8e93', fontWeight: 500 }}>
                  Under 2 hours average response time.
                </div>
              </div>
            </div>

            {/* Row 2: 2-Column Grid (Ticket Form Left 55% + FAQ Right 45%) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
              {/* Left Column: Direct Ticket Form */}
              <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '32px', padding: '32px' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1c1c1e', marginBottom: '20px' }}>
                  Submit Support Ticket
                </div>

                {ticketSent ? (
                  <div style={{ background: '#e4f9ec', border: '1px solid #a7f3d0', borderRadius: '24px', padding: '24px', textAlign: 'center', color: '#15803d', fontWeight: 700 }}>
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
                        <label style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8e8e93', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
                          CATEGORY
                        </label>
                        <select
                          value={supportCategory}
                          onChange={(e) => setSupportCategory(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            borderRadius: '18px', // iOS Rounded select
                            border: '1px solid #d1d1d6',
                            background: '#ffffff',
                            color: '#1c1c1e',
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            outline: 'none',
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
                        <label style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8e8e93', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
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
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8e8e93', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
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
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8e8e93', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
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
                        }}
                      />
                    </div>

                    {/* Apple iOS Full Pill Submit Button */}
                    <button
                      type="submit"
                      style={{
                        padding: '16px 32px',
                        borderRadius: '9999px', // Pill Button
                        background: '#007aff',
                        border: 'none',
                        color: '#ffffff',
                        fontWeight: 800,
                        fontSize: '0.95rem',
                        cursor: 'pointer',
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
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1c1c1e' }}>
                  Frequently Asked Questions
                </div>

                <div style={{ padding: '16px', borderRadius: '20px', background: '#f2f2f7' }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#1c1c1e', marginBottom: '4px' }}>
                    ❓ How to join room?
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#8e8e93', lineHeight: 1.4 }}>
                    Main Menu -&gt; Join Room -&gt; Enter Room ID &amp; Password.
                  </div>
                </div>

                <div style={{ padding: '16px', borderRadius: '20px', background: '#f2f2f7' }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#1c1c1e', marginBottom: '4px' }}>
                    ❓ How to qualify for Winter Doom?
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#8e8e93', lineHeight: 1.4 }}>
                    Complete 10+ rounds and earn 50+ points before 10-day unlock.
                  </div>
                </div>

                <div style={{ padding: '16px', borderRadius: '20px', background: '#f2f2f7' }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#1c1c1e', marginBottom: '4px' }}>
                    ❓ Direct Email Contact
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#8e8e93', lineHeight: 1.4 }}>
                    Email us anytime at <strong>clasha@gmail.com</strong> for assistance.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* OTHER LEGAL & ASSISTANCE TABS (ABOUT, TERMS, PRIVACY, FAQ) */}
        {/* ------------------------------------------------------------- */}
        {activeTab !== 'profile' && activeTab !== 'stats' && activeTab !== 'tournament' && activeTab !== 'support' && (
          <div style={{ width: '100%', maxWidth: '1000px', textAlign: 'left' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1c1c1e', marginBottom: '20px', textTransform: 'capitalize' }}>
              {activeTab.replace('_', ' ')}
            </div>

            <div style={{ background: '#ffffff', borderRadius: '32px', border: '1px solid #e5e5ea', padding: '40px', textAlign: 'center' }}>
              <ShieldCheck size={40} color="#007aff" style={{ margin: '0 auto 14px auto', display: 'block' }} />
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1c1c1e' }}>CLASHA {activeTab.toUpperCase()} POLICY</div>
              <div style={{ fontSize: '0.88rem', color: '#8e8e93', marginTop: '6px', maxWidth: '480px', margin: '6px auto 0 auto' }}>
                All legal, terms, and privacy guidelines are strictly verified for CLASHA v1.0.4. Contact <strong>clasha@gmail.com</strong> for any inquiries.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
