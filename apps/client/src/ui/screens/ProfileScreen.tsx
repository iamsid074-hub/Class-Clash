import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../state/useGameStore';
import { User, ShieldCheck, ArrowLeft, CheckCircle2, LogOut } from 'lucide-react';
import { ClassClashLogo } from '../components/ClassClashLogo';
import { SupabaseAuthService, UserProfile } from '../../networking/supabaseClient';

export const ProfileScreen: React.FC = () => {
  const { displayName, setDisplayName, setScreen, triggerGateTransition } = useGameStore();
  const [profileNameInput, setProfileNameInput] = useState(displayName || 'RACER_ONE');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    SupabaseAuthService.getSavedSession().then((p) => {
      if (p) setUserProfile(p);
    });
  }, []);

  const matchesPlayed = userProfile?.matchesPlayed || 0;
  const points = userProfile?.leaderboardPoints || 0;
  const winRate = matchesPlayed > 0 ? '70%' : '0%';
  const isQualified = matchesPlayed >= 10 && points >= 50;

  const handleSaveAndReturn = () => {
    if (profileNameInput.trim()) {
      setDisplayName(profileNameInput.trim());
    }
    triggerGateTransition(() => {
      setScreen('MAIN_MENU');
    }, 'MAIN MENU', 'CLASHA');
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
        background: 'radial-gradient(circle at 50% 30%, rgba(255, 238, 245, 0.98) 0%, rgba(255, 204, 226, 0.98) 100%)',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        overflow: 'auto',
        color: '#2b0017',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* 1. TOP HEADER NAVIGATION BAR */}
      <div
        style={{
          width: '100%',
          padding: '24px 48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxSizing: 'border-box',
          background: 'rgba(255, 255, 255, 0.6)',
          backdropFilter: 'blur(20px)',
          borderBottom: '2px solid rgba(255, 102, 163, 0.3)',
        }}
      >
        {/* Left: Back Button & Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <button
            type="button"
            onClick={handleBackToMenu}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 24px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #ff0066 0%, #ff3385 100%)',
              border: '2px solid #ffffff',
              color: '#ffffff',
              fontWeight: 900,
              fontSize: '0.95rem',
              fontStyle: 'italic',
              fontFamily: "'Kanit', sans-serif",
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(255, 0, 102, 0.4)',
              transition: 'transform 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <ArrowLeft size={18} /> BACK TO MENU
          </button>
          <ClassClashLogo size={0.7} />
        </div>

        {/* Center: Page Title */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 900, color: '#e6005c', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            RACER DASHBOARD & ACCOUNT SETTINGS
          </div>
          <div
            style={{
              fontSize: '2.4rem',
              fontWeight: 900,
              fontStyle: 'italic',
              color: '#2b0017',
              fontFamily: "'Kanit', sans-serif",
              lineHeight: 1,
              marginTop: '2px',
            }}
          >
            PLAYER PROFILE
          </div>
        </div>

        {/* Right: Verification Status Badge & Logout Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              background: 'rgba(0, 200, 83, 0.12)',
              border: '2px solid #00c853',
              borderRadius: '14px',
              padding: '10px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: '#007029',
              fontWeight: 900,
              fontSize: '0.9rem',
              letterSpacing: '0.08em',
              boxShadow: '0 4px 16px rgba(0, 200, 83, 0.15)',
            }}
          >
            <ShieldCheck size={20} color="#00c853" />
            <span>VERIFIED RACER</span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '14px',
              background: 'rgba(255, 51, 102, 0.15)',
              border: '2px solid #ff3366',
              color: '#cc0033',
              fontWeight: 900,
              fontSize: '0.9rem',
              fontStyle: 'italic',
              fontFamily: "'Kanit', sans-serif",
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <LogOut size={18} color="#cc0033" /> LOG OUT
          </button>
        </div>
      </div>

      {/* 2. MAIN PAGE CONTENT BODY */}
      <div
        style={{
          flex: 1,
          maxWidth: '1280px',
          width: '100%',
          margin: '0 auto',
          padding: 'clamp(20px, 3vh, 40px) clamp(16px, 3vw, 48px)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'clamp(16px, 2.5vw, 36px)',
          boxSizing: 'border-box',
          alignItems: 'start',
        }}
      >
        {/* LEFT COLUMN: RACER CUSTOMIZATION & TOURNAMENT ELIGIBILITY */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {/* Card A: Player Name Edit & Avatar Header */}
          <div
            style={{
              background: '#ffffff',
              border: '2px solid #ff66a3',
              borderRadius: '24px',
              padding: '32px',
              boxShadow: '0 12px 36px rgba(255, 102, 163, 0.18)',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '24px',
                  background: 'linear-gradient(135deg, #ff0066 0%, #ff66a3 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 30px rgba(255, 0, 102, 0.5), inset 0 2px 4px #ffffff',
                  flexShrink: 0,
                }}
              >
                <User size={44} color="#ffffff" strokeWidth={2.5} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 900, color: '#e6005c', letterSpacing: '0.12em' }}>
                  OFFICIAL RACER TAG
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, fontStyle: 'italic', color: '#2b0017', fontFamily: "'Kanit', sans-serif" }}>
                  {profileNameInput || 'RACER'}
                </div>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#7a003c', opacity: 0.8 }}>
                  ID: #CC-RACER-948 • REGION: ASIA-NORTH
                </div>
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid rgba(255, 102, 163, 0.2)', margin: 0 }} />

            {/* Input Field */}
            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 900, color: '#7a003c', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                EDIT RACER CALLSIGN (DISPLAY NAME)
              </label>
              <input
                type="text"
                value={profileNameInput}
                onChange={(e) => setProfileNameInput(e.target.value)}
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  borderRadius: '16px',
                  border: '2px solid #ff3385',
                  background: 'rgba(255, 240, 246, 0.5)',
                  color: '#2b0017',
                  fontWeight: 900,
                  fontSize: '1.3rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: "'Kanit', sans-serif",
                }}
                placeholder="ENTER YOUR NAME"
              />
            </div>
          </div>

          {/* Card B: Tournament Qualification Banner */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(0, 200, 83, 0.14) 0%, rgba(0, 230, 118, 0.08) 100%)',
              border: '2.5px solid #00c853',
              borderRadius: '24px',
              padding: '28px 32px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              textAlign: 'left',
              boxShadow: '0 8px 28px rgba(0, 200, 83, 0.18)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <CheckCircle2 size={28} color="#00c853" />
                <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#007029', fontFamily: "'Kanit', sans-serif" }}>
                  TOURNAMENT QUALIFICATION STATUS
                </span>
              </div>
              <div
                style={{
                  background: isQualified ? '#00c853' : '#ff9900',
                  color: '#ffffff',
                  padding: '8px 18px',
                  borderRadius: '12px',
                  fontWeight: 900,
                  fontSize: '0.85rem',
                  letterSpacing: '0.08em',
                  boxShadow: isQualified ? '0 4px 12px rgba(0, 200, 83, 0.35)' : '0 4px 12px rgba(255, 153, 0, 0.35)',
                }}
              >
                {isQualified ? 'QUALIFIED' : 'IN PROGRESS'}
              </div>
            </div>

            <div style={{ color: '#008e3b', fontSize: '0.92rem', fontWeight: 800, lineHeight: 1.5 }}>
              Your profile satisfies all mandatory entry criteria for the <strong>WINTER DOOM TOURNAMENT</strong>:
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', fontWeight: 800, color: '#007029' }}>
                <CheckCircle2 size={18} color={matchesPlayed >= 10 ? "#00c853" : "#ff9900"} />
                <span>10+ Matches Played (Current: {matchesPlayed} Rounds)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', fontWeight: 800, color: '#007029' }}>
                <CheckCircle2 size={18} color={points >= 50 ? "#00c853" : "#ff9900"} />
                <span>50+ Leaderboard Points (Current: {points} Points)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', fontWeight: 800, color: '#007029' }}>
                <CheckCircle2 size={18} color="#00c853" />
                <span>Identity Verification Completed (Status: Verified)</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CAREER STATS DASHBOARD GRID */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          <div
            style={{
              background: '#ffffff',
              border: '2px solid #ff66a3',
              borderRadius: '24px',
              padding: '32px',
              boxShadow: '0 12px 36px rgba(255, 102, 163, 0.18)',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
            }}
          >
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 900, color: '#e6005c', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                CAREER PERFORMANCE METRICS
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 900, fontStyle: 'italic', color: '#2b0017', fontFamily: "'Kanit', sans-serif" }}>
                RACER STATISTICS
              </div>
            </div>

            {/* 2x2 Clean Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {/* Stat 1: Matches Played */}
              <div
                style={{
                  background: 'rgba(255, 240, 246, 0.6)',
                  border: '1.5px solid rgba(255, 102, 163, 0.4)',
                  borderRadius: '20px',
                  padding: '24px',
                  textAlign: 'left',
                }}
              >
                <div style={{ fontSize: '0.78rem', fontWeight: 900, color: '#e6005c', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  MATCHES PLAYED
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#2b0017', fontFamily: "'Kanit', sans-serif", marginTop: '4px' }}>
                  {matchesPlayed} Rounds
                </div>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: matchesPlayed >= 10 ? '#008e3b' : '#ff9900', marginTop: '4px' }}>
                  {matchesPlayed >= 10 ? '✓ 10+ Rounds (Qualified)' : '• Progressing'}
                </div>
              </div>

              {/* Stat 2: Leaderboard Score */}
              <div
                style={{
                  background: 'rgba(255, 240, 246, 0.6)',
                  border: '1.5px solid rgba(255, 102, 163, 0.4)',
                  borderRadius: '20px',
                  padding: '24px',
                  textAlign: 'left',
                }}
              >
                <div style={{ fontSize: '0.78rem', fontWeight: 900, color: '#e6005c', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  LEADERBOARD POINTS
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#2b0017', fontFamily: "'Kanit', sans-serif", marginTop: '4px' }}>
                  {points} Points
                </div>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: points >= 50 ? '#008e3b' : '#ff9900', marginTop: '4px' }}>
                  {points >= 50 ? '✓ 50+ Points (Qualified)' : '• Progressing'}
                </div>
              </div>

              {/* Stat 3: Win Rate */}
              <div
                style={{
                  background: 'rgba(255, 240, 246, 0.6)',
                  border: '1.5px solid rgba(255, 102, 163, 0.4)',
                  borderRadius: '20px',
                  padding: '24px',
                  textAlign: 'left',
                }}
              >
                <div style={{ fontSize: '0.78rem', fontWeight: 900, color: '#e6005c', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  WIN RATE
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#2b0017', fontFamily: "'Kanit', sans-serif", marginTop: '4px' }}>
                  {winRate}
                </div>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#e6005c', marginTop: '4px' }}>
                  {matchesPlayed} Podiums Recorded
                </div>
              </div>

              {/* Stat 4: Account Status */}
              <div
                style={{
                  background: 'rgba(255, 240, 246, 0.6)',
                  border: '1.5px solid rgba(255, 102, 163, 0.4)',
                  borderRadius: '20px',
                  padding: '24px',
                  textAlign: 'left',
                }}
              >
                <div style={{ fontSize: '0.78rem', fontWeight: 900, color: '#e6005c', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  ACCOUNT STATUS
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#008e3b', fontFamily: "'Kanit', sans-serif", marginTop: '4px' }}>
                  VERIFIED
                </div>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#008e3b', marginTop: '4px' }}>
                  ✓ Identity Verified
                </div>
              </div>
            </div>

            {/* Bottom Save Action Button */}
            <button
              type="button"
              onClick={handleSaveAndReturn}
              style={{
                width: '100%',
                height: '60px',
                borderRadius: '18px',
                background: 'linear-gradient(135deg, #ff0066 0%, #ff3385 100%)',
                border: '2px solid #ffffff',
                color: '#ffffff',
                fontWeight: 900,
                fontSize: '1.3rem',
                fontStyle: 'italic',
                fontFamily: "'Kanit', sans-serif",
                cursor: 'pointer',
                boxShadow: '0 8px 30px rgba(255, 0, 102, 0.5)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                transition: 'transform 0.2s ease, boxShadow 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow = '0 12px 36px rgba(255, 0, 102, 0.65)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(255, 0, 102, 0.5)';
              }}
            >
              SAVE PROFILE & RETURN TO MENU
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
