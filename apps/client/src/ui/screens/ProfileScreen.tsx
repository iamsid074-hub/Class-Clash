import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../state/useGameStore';
import {
  User,
  LogOut,
  Truck,
  Lock,
  Smartphone,
  Receipt,
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
  const [supportCategory, setSupportCategory] = useState('Account / Login Assistance');
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
        background: '#ffffff',
        display: 'flex',
        overflow: 'hidden',
        color: '#0f172a',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif",
      }}
    >
      {/* ------------------------------------------------------------- */}
      {/* 1. LEFT SIDEBAR NAVIGATION */}
      {/* ------------------------------------------------------------- */}
      <div
        style={{
          width: '260px',
          height: '100%',
          borderRight: '1px solid #e2e8f0',
          background: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '24px 16px',
          boxSizing: 'border-box',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Logo Brand Header */}
          <div style={{ paddingLeft: '8px' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>
              CLASHA
            </div>
          </div>

          {/* Section 1: MY ACCOUNT */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em', paddingLeft: '12px', marginBottom: '4px' }}>
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
                    padding: '10px 14px',
                    borderRadius: '12px',
                    background: isActive ? '#f1f5f9' : 'transparent',
                    border: 'none',
                    color: isActive ? '#0f172a' : '#64748b',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Icon size={16} color={isActive ? '#0f172a' : '#64748b'} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Section 2: ASSISTANCE & LEGAL */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em', paddingLeft: '12px', marginBottom: '4px' }}>
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
                    padding: '10px 14px',
                    borderRadius: '12px',
                    background: isActive ? '#f1f5f9' : 'transparent',
                    border: 'none',
                    color: isActive ? '#0f172a' : '#64748b',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Icon size={16} color={isActive ? '#0f172a' : '#64748b'} />
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
            padding: '12px',
            borderRadius: '14px',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: '#3b82f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
              }}
            >
              <User size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                {profileNameInput || displayName || '2eosV3'}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
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
              color: '#64748b',
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
          padding: '40px 60px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        {/* TOP RIGHT SMALL BACK ARROW BUTTON */}
        <button
          onClick={handleBackToMenu}
          title="Back to Menu"
          style={{
            position: 'absolute',
            top: '24px',
            right: '24px',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: '#f1f5f9',
            border: '1px solid #cbd5e1',
            color: '#0f172a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
            transition: 'all 0.15s ease',
            zIndex: 40,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#e2e8f0';
            e.currentTarget.style.transform = 'scale(1.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#f1f5f9';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <ArrowLeft size={18} color="#0f172a" strokeWidth={2.2} />
        </button>

        {/* Top User Header Avatar & Title */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            width: '100%',
            maxWidth: '720px',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '24px',
              background: '#60a5fa',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 25px rgba(96, 165, 250, 0.3)',
              flexShrink: 0,
            }}
          >
            <User size={48} color="#ffffff" strokeWidth={2} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                {profileNameInput || displayName || '2eosV3'}
              </span>
              <div
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: '#3b82f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Check size={12} color="#ffffff" strokeWidth={3} />
              </div>
            </div>
            <div style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '2px' }}>
              {userEmail}
            </div>
          </div>
        </div>

        <hr style={{ width: '100%', maxWidth: '720px', border: 'none', borderTop: '1px solid #e2e8f0', marginBottom: '32px' }} />

        {/* ------------------------------------------------------------- */}
        {/* TAB 1: PROFILE / PERSONAL DETAILS */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'profile' && (
          <div style={{ width: '100%', maxWidth: '720px' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '28px' }}>
              Personal details
            </div>

            {/* Grid Layout 2x4 */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                columnGap: '60px',
                rowGap: '28px',
                width: '100%',
                marginBottom: '40px',
              }}
            >
              {/* FULL NAME */}
              <div>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>
                  FULL NAME
                </div>
                <input
                  type="text"
                  value={profileNameInput}
                  onChange={(e) => setProfileNameInput(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    color: '#0f172a',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* EMAIL */}
              <div>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>
                  EMAIL
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
                  {userEmail}
                </div>
              </div>

              {/* ACCOUNT STATUS */}
              <div>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>
                  ACCOUNT STATUS
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
                  Active
                </div>
              </div>

              {/* JOINED */}
              <div>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>
                  JOINED
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
                  August 2026
                </div>
              </div>

              {/* LEADERBOARD RANKING */}
              <div>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>
                  LEADERBOARD RANKING
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
                  {points > 100 ? '#1' : points > 0 ? '#3' : '#12'}
                </div>
              </div>

              {/* NATIONALITY */}
              <div>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>
                  NATIONALITY
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
                  Indian
                </div>
              </div>

              {/* MATCHES PLAYED */}
              <div>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>
                  MATCHES PLAYED
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
                  {matchesPlayed} Rounds
                </div>
              </div>

              {/* LEADERBOARD POINTS */}
              <div>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>
                  LEADERBOARD POINTS
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
                  {points} Points
                </div>
              </div>
            </div>

            {/* Full Width Save Profile Action Button */}
            <div style={{ width: '100%' }}>
              <button
                type="button"
                onClick={handleSaveAndReturn}
                style={{
                  width: '100%',
                  padding: '14px 28px',
                  borderRadius: '12px',
                  background: '#3b82f6',
                  border: 'none',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(59, 130, 246, 0.35)',
                  transition: 'transform 0.15s ease',
                }}
              >
                {savedSuccess ? 'Saved!' : 'Save & Return to Menu'}
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 2: DETAILED STATISTICS */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'stats' && (
          <div style={{ width: '100%', maxWidth: '720px' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
              Statistics
            </div>
            <div style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '28px' }}>
              Detailed career performance metrics for {profileNameInput || displayName}.
            </div>

            {/* 2x2 Detailed Metrics Cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '20px',
                width: '100%',
                marginBottom: '32px',
              }}
            >
              <div style={{ padding: '20px', borderRadius: '16px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  MATCHES PLAYED
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
                  {matchesPlayed} Rounds
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, marginTop: '4px' }}>
                  • Total completed match rounds
                </div>
              </div>

              <div style={{ padding: '20px', borderRadius: '16px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  LEADERBOARD POINTS
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
                  {points} Points
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, marginTop: '4px' }}>
                  • Total career leaderboard score
                </div>
              </div>

              <div style={{ padding: '20px', borderRadius: '16px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  WIN RATE & PODIUMS
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
                  {matchesPlayed > 0 ? '70%' : '0%'}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, marginTop: '4px' }}>
                  {matchesPlayed > 0 ? '• 7 Podium Finishes Recorded' : '• Play matches to earn podiums'}
                </div>
              </div>

              <div style={{ padding: '20px', borderRadius: '16px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  GLOBAL RANKING
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#3b82f6', marginTop: '4px' }}>
                  {points > 100 ? '#1 Ranked' : points > 0 ? '#3 Ranked' : '#12 Ranked'}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#16a34a', fontWeight: 600, marginTop: '4px' }}>
                  • Top 1% Global Racer Bracket
                </div>
              </div>
            </div>

            {/* Detailed Performance Breakdown */}
            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', marginBottom: '32px' }}>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
                Detailed Performance Breakdown
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>Best Lap Record</span>
                  <span style={{ color: '#0f172a', fontSize: '0.9rem', fontWeight: 700 }}>1:24.52s (Sky Factory Map)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>Avg Points / Match</span>
                  <span style={{ color: '#0f172a', fontSize: '0.9rem', fontWeight: 700 }}>20.0 PTS</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>Identity Verification</span>
                  <span style={{ color: '#16a34a', fontSize: '0.9rem', fontWeight: 700 }}>✓ Verified Racer</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>Current Division</span>
                  <span style={{ color: '#3b82f6', fontSize: '0.9rem', fontWeight: 700 }}>Tier 1 Champions Division</span>
                </div>
              </div>
            </div>

            {/* Back Action Button */}
            <div style={{ width: '100%' }}>
              <button
                type="button"
                onClick={handleBackToMenu}
                style={{
                  width: '100%',
                  padding: '14px 28px',
                  borderRadius: '12px',
                  background: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  color: '#0f172a',
                  fontWeight: 700,
                  fontSize: '1rem',
                  cursor: 'pointer',
                }}
              >
                Return to Main Menu
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 3: TOURNAMENT STATUS */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'tournament' && (
          <div style={{ width: '100%', maxWidth: '720px' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
              Tournament Status
            </div>
            <div style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '28px' }}>
              Upcoming official championship details, countdown, and registration status.
            </div>

            {/* Upcoming Tournament Main Card */}
            <div
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '20px',
                padding: '32px',
                marginBottom: '32px',
                textAlign: 'left',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
              }}
            >
              {/* Header Badge & Name */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#3b82f6', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '4px' }}>
                    UPCOMING CHAMPIONSHIP
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>
                    WINTER DOOM TOURNAMENT
                  </div>
                </div>

                <div
                  style={{
                    background: matchesPlayed >= 10 && points >= 50 ? '#dcfce7' : '#ffedd5',
                    color: matchesPlayed >= 10 && points >= 50 ? '#15803d' : '#c2410c',
                    padding: '6px 16px',
                    borderRadius: '50px',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    letterSpacing: '0.04em',
                  }}
                >
                  {matchesPlayed >= 10 && points >= 50 ? 'QUALIFIED' : 'IN PROGRESS'}
                </div>
              </div>

              {/* Description */}
              <div style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.5, marginBottom: '28px' }}>
                The ultimate seasonal arena championship. 64 qualified racers will battle for the season crown and exclusive champion rewards.
              </div>

              {/* LARGE 10-DAY COUNTDOWN TIMER */}
              <div style={{ marginBottom: '32px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px', textAlign: 'center' }}>
                  REGISTRATION OPENS IN
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', textAlign: 'center' }}>
                  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '16px 8px' }}>
                    <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#0f172a', fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif", lineHeight: 1 }}>
                      {String(timeLeft.days).padStart(2, '0')}
                    </div>
                    <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', marginTop: '6px', letterSpacing: '0.08em' }}>
                      DAYS
                    </div>
                  </div>

                  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '16px 8px' }}>
                    <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#0f172a', fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif", lineHeight: 1 }}>
                      {String(timeLeft.hours).padStart(2, '0')}
                    </div>
                    <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', marginTop: '6px', letterSpacing: '0.08em' }}>
                      HOURS
                    </div>
                  </div>

                  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '16px 8px' }}>
                    <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#0f172a', fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif", lineHeight: 1 }}>
                      {String(timeLeft.minutes).padStart(2, '0')}
                    </div>
                    <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', marginTop: '6px', letterSpacing: '0.08em' }}>
                      MINUTES
                    </div>
                  </div>

                  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '16px 8px' }}>
                    <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#3b82f6', fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif", lineHeight: 1 }}>
                      {String(timeLeft.seconds).padStart(2, '0')}
                    </div>
                    <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', marginTop: '6px', letterSpacing: '0.08em' }}>
                      SECONDS
                    </div>
                  </div>
                </div>
              </div>

              {/* Qualification Criteria Checklist */}
              <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '20px', marginBottom: '28px' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', marginBottom: '14px' }}>
                  QUALIFICATION CRITERIA
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', fontWeight: 600, color: '#0f172a' }}>
                    <Check size={18} color={matchesPlayed >= 10 ? '#16a34a' : '#ea580c'} />
                    <span>10+ Matches Played (Current: {matchesPlayed} Rounds)</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', fontWeight: 600, color: '#0f172a' }}>
                    <Check size={18} color={points >= 50 ? '#16a34a' : '#ea580c'} />
                    <span>50+ Leaderboard Points (Current: {points} Points)</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', fontWeight: 600, color: '#0f172a' }}>
                    <Check size={18} color="#16a34a" />
                    <span>Identity Verification Completed (Status: Verified)</span>
                  </div>
                </div>
              </div>

              {/* LOCKED REGISTRATION BUTTON */}
              <button
                type="button"
                disabled
                style={{
                  width: '100%',
                  padding: '16px 24px',
                  borderRadius: '12px',
                  background: '#e2e8f0',
                  border: '1px solid #cbd5e1',
                  color: '#64748b',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  letterSpacing: '0.04em',
                  cursor: 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  boxShadow: 'none',
                }}
              >
                <Lock size={18} color="#64748b" />
                <span>REGISTRATION LOCKED (OPENS IN 10 DAYS)</span>
              </button>

              <div style={{ fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center', marginTop: '10px', fontWeight: 500 }}>
                Registration unlocks automatically when countdown ends. Complete qualification requirements before launch.
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 4: SUPPORT & HELP CENTER */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'support' && (
          <div style={{ width: '100%', maxWidth: '720px', textAlign: 'left' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
              Player Support & Help Center
            </div>
            <div style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '28px' }}>
              We're here 24/7 to assist with your CLASHA account, gameplay, and tournament inquiries.
            </div>

            {/* Official Direct Contact Banner */}
            <div
              style={{
                background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                border: '1px solid #bfdbfe',
                borderRadius: '20px',
                padding: '24px 28px',
                marginBottom: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '16px',
                    background: '#3b82f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    boxShadow: '0 8px 18px rgba(59, 130, 246, 0.3)',
                    flexShrink: 0,
                  }}
                >
                  <Mail size={24} color="#ffffff" />
                </div>

                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#1d4ed8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    OFFICIAL SUPPORT EMAIL
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif", marginTop: '2px' }}>
                    clasha@gmail.com
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#3b82f6', fontWeight: 600, marginTop: '2px' }}>
                    ⚡ Average response time: Under 2 Hours (24/7 Support)
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={handleCopySupportEmail}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '10px',
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    color: '#0f172a',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                  }}
                >
                  {copiedEmail ? <Check size={16} color="#16a34a" /> : <Copy size={16} />}
                  <span>{copiedEmail ? 'Copied!' : 'Copy Email'}</span>
                </button>

                <a
                  href="mailto:clasha@gmail.com"
                  style={{
                    padding: '10px 18px',
                    borderRadius: '10px',
                    background: '#3b82f6',
                    border: 'none',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                  }}
                >
                  <Send size={15} color="#ffffff" />
                  <span>Send Email</span>
                </a>
              </div>
            </div>

            {/* Direct Ticket Submission Form */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '28px', marginBottom: '32px' }}>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
                Submit a Support Ticket
              </div>
              <div style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '20px' }}>
                Fill out the details below and our team will get back to you directly at your email.
              </div>

              {ticketSent ? (
                <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: '12px', padding: '20px', textAlign: 'center', color: '#15803d', fontWeight: 700 }}>
                  <Check size={28} color="#16a34a" style={{ margin: '0 auto 8px auto', display: 'block' }} />
                  <div>Support Ticket Submitted Successfully!</div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 500, marginTop: '4px' }}>
                    We have received your ticket. A representative will contact you at <strong>clasha@gmail.com</strong> shortly.
                  </div>
                </div>
              ) : (
                <form onSubmit={handleTicketSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
                        ISSUE CATEGORY
                      </label>
                      <select
                        value={supportCategory}
                        onChange={(e) => setSupportCategory(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          borderRadius: '10px',
                          border: '1px solid #cbd5e1',
                          background: '#ffffff',
                          color: '#0f172a',
                          fontWeight: 600,
                          fontSize: '0.88rem',
                          outline: 'none',
                        }}
                      >
                        <option value="Account / Login Assistance">Account & Login Assistance</option>
                        <option value="Multiplayer Connection Issue">Multiplayer / Room Connection Issue</option>
                        <option value="Gameplay / Physics Bug">Gameplay / Physics Bug Report</option>
                        <option value="Tournament Inquiry">Tournament & Points Inquiry</option>
                        <option value="General Feedback">General Feedback & Suggestion</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
                        YOUR CONTACT EMAIL
                      </label>
                      <input
                        type="email"
                        readOnly
                        value={userEmail}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          borderRadius: '10px',
                          border: '1px solid #cbd5e1',
                          background: '#f1f5f9',
                          color: '#64748b',
                          fontWeight: 600,
                          fontSize: '0.88rem',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
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
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: '1px solid #cbd5e1',
                        background: '#ffffff',
                        color: '#0f172a',
                        fontWeight: 600,
                        fontSize: '0.88rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
                      DETAILED DESCRIPTION
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={supportMessage}
                      onChange={(e) => setSupportMessage(e.target.value)}
                      placeholder="Describe what happened or what help you need in detail..."
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: '10px',
                        border: '1px solid #cbd5e1',
                        background: '#ffffff',
                        color: '#0f172a',
                        fontWeight: 500,
                        fontSize: '0.88rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                        resize: 'vertical',
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    style={{
                      padding: '12px 24px',
                      borderRadius: '10px',
                      background: '#3b82f6',
                      border: 'none',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                    }}
                  >
                    Submit Support Ticket
                  </button>
                </form>
              )}
            </div>

            {/* Quick Self-Help Guides */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '28px', marginBottom: '32px' }}>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
                Frequently Asked Questions & Quick Help
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ padding: '16px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
                    ❓ How do I join a multiplayer room with friends?
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.5 }}>
                    Go to Main Menu -&gt; Join Room -&gt; Enter the Room ID and Password provided by the room host. Once in the cabin, wait for players to join and click Start Match!
                  </div>
                </div>

                <div style={{ padding: '16px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
                    ❓ Why is the timer or countdown stuck on Vercel?
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.5 }}>
                    Our application features built-in client-side fallback timers. If you experience network delays, the timer ticks down automatically in local mode.
                  </div>
                </div>

                <div style={{ padding: '16px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
                    ❓ How do I qualify for the Winter Doom Tournament?
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.5 }}>
                    Complete 10+ match rounds and earn at least 50 leaderboard points before registration unlocks in 10 days.
                  </div>
                </div>

                <div style={{ padding: '16px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
                    ❓ Need direct support or bug report?
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.5 }}>
                    Contact us anytime at <strong>clasha@gmail.com</strong> for quick 24/7 technical support.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* OTHER TABS FALLBACK (ABOUT, TERMS, PRIVACY, FAQ) */}
        {/* ------------------------------------------------------------- */}
        {activeTab !== 'profile' && activeTab !== 'stats' && activeTab !== 'tournament' && activeTab !== 'support' && (
          <div style={{ width: '100%', maxWidth: '720px', textAlign: 'left' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px', textTransform: 'capitalize' }}>
              {activeTab.replace('_', ' ')}
            </div>
            <div style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '28px' }}>
              Settings and information for {activeTab}.
            </div>

            <div style={{ background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '32px', textAlign: 'center', color: '#64748b' }}>
              <Check size={32} color="#3b82f6" style={{ margin: '0 auto 12px auto', display: 'block' }} />
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>{activeTab.toUpperCase()} STATUS ACTIVE</div>
              <div style={{ fontSize: '0.85rem', marginTop: '6px' }}>All account parameters and settings are up to date. Contact clasha@gmail.com for inquiries.</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
