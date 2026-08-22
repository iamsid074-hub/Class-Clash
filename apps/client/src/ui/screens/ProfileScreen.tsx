import React, { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../../state/useGameStore';
import {
  User,
  LogOut,
  Lock,
  Trophy,
  BarChart2,
  Check,
  ArrowLeft,
  Camera,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import { SupabaseAuthService, UserProfile } from '../../networking/supabaseClient';

const APPLE_FONT = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Inter', 'Plus Jakarta Sans', sans-serif";

export const ProfileScreen: React.FC = () => {
  const { displayName, setDisplayName, setScreen, triggerGateTransition } = useGameStore();
  const [profileNameInput, setProfileNameInput] = useState(displayName || 'Anshu yadav');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Avatar Image Upload State
  const [avatarUrl, setAvatarUrl] = useState<string | null>(() => {
    try {
      return localStorage.getItem('clasha_user_avatar');
    } catch {
      return null;
    }
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Live 10-Day Countdown Timer state for Upcoming Tournament
  const [timeLeft, setTimeLeft] = useState({
    days: 9,
    hours: 23,
    minutes: 59,
    seconds: 59,
  });

  useEffect(() => {
    SupabaseAuthService.getSavedSession().then((p) => {
      if (p) {
        setUserProfile(p);
        if (p.displayName) {
          setProfileNameInput(p.displayName);
        }
      }
    });
  }, []);

  useEffect(() => {
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
  const userEmail = userProfile?.email || 'anshu123302@gmail.com';

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setAvatarUrl(result);
          try {
            localStorage.setItem('clasha_user_avatar', result);
          } catch {
            // ignore
          }
        }
      };
      reader.readAsDataURL(file);
    }
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
      {/* Hidden File Input for Avatar Photo Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleAvatarUpload}
        style={{ display: 'none' }}
      />

      {/* ------------------------------------------------------------- */}
      {/* 1. LEFT SIDEBAR NAVIGATION (EXACT DESIGN MATCHING IMAGE)       */}
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
          padding: '32px 20px',
          boxSizing: 'border-box',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Top User Info Card Header (Exact Match to Image Top) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', paddingLeft: '4px' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                overflow: 'hidden',
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
              }}
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt="User Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <User size={22} color="#ffffff" />
              )}
            </div>
            <div>
              <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#1c1c1e', fontFamily: APPLE_FONT, lineHeight: 1.2 }}>
                {profileNameInput || displayName || 'Admin'}
              </div>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#635bff', letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: '2px', fontFamily: APPLE_FONT }}>
                RACER
              </div>
            </div>
          </div>

          {/* Section 1: GENERAL */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#9ca3af', letterSpacing: '0.12em', paddingLeft: '12px', marginBottom: '6px', fontFamily: APPLE_FONT }}>
              GENERAL
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '13px 18px',
                borderRadius: '20px',
                background: activeTab === 'profile' ? '#eeeffe' : 'transparent',
                border: 'none',
                color: activeTab === 'profile' ? '#4f46e5' : '#1c1c1e',
                fontWeight: activeTab === 'profile' ? 800 : 600,
                fontSize: '0.95rem',
                cursor: 'pointer',
                textAlign: 'left',
                fontFamily: APPLE_FONT,
                transition: 'all 0.15s ease',
              }}
            >
              <User size={19} color={activeTab === 'profile' ? '#4f46e5' : '#8e8e93'} />
              <span>Profile</span>
              {activeTab === 'profile' && (
                <ChevronRight size={16} color="#4f46e5" style={{ marginLeft: 'auto' }} />
              )}
            </button>
          </div>

          {/* Section 2: YOUR ACTIVITY */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#9ca3af', letterSpacing: '0.12em', paddingLeft: '12px', marginBottom: '6px', fontFamily: APPLE_FONT }}>
              YOUR ACTIVITY
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('stats')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '13px 18px',
                borderRadius: '20px',
                background: activeTab === 'stats' ? '#eeeffe' : 'transparent',
                border: 'none',
                color: activeTab === 'stats' ? '#4f46e5' : '#1c1c1e',
                fontWeight: activeTab === 'stats' ? 800 : 600,
                fontSize: '0.95rem',
                cursor: 'pointer',
                textAlign: 'left',
                fontFamily: APPLE_FONT,
                transition: 'all 0.15s ease',
              }}
            >
              <BarChart2 size={19} color={activeTab === 'stats' ? '#4f46e5' : '#8e8e93'} />
              <span>Statistics</span>
              {activeTab === 'stats' && (
                <ChevronRight size={16} color="#4f46e5" style={{ marginLeft: 'auto' }} />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('tournament')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '13px 18px',
                borderRadius: '20px',
                background: activeTab === 'tournament' ? '#eeeffe' : 'transparent',
                border: 'none',
                color: activeTab === 'tournament' ? '#4f46e5' : '#1c1c1e',
                fontWeight: activeTab === 'tournament' ? 800 : 600,
                fontSize: '0.95rem',
                cursor: 'pointer',
                textAlign: 'left',
                fontFamily: APPLE_FONT,
                transition: 'all 0.15s ease',
              }}
            >
              <Trophy size={19} color={activeTab === 'tournament' ? '#4f46e5' : '#8e8e93'} />
              <span>Tournament Status</span>
              {activeTab === 'tournament' && (
                <ChevronRight size={16} color="#4f46e5" style={{ marginLeft: 'auto' }} />
              )}
            </button>
          </div>

        </div>

        {/* Bottom Back Button & Logout */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            type="button"
            onClick={handleBackToMenu}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              width: '100%',
              padding: '12px 14px',
              borderRadius: '16px',
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

          <button
            type="button"
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              width: '100%',
              padding: '10px 14px',
              borderRadius: '16px',
              background: 'transparent',
              color: '#ff3b30',
              border: 'none',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              fontFamily: APPLE_FONT,
            }}
          >
            <LogOut size={15} color="#ff3b30" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. RIGHT MAIN CONTENT AREA                                     */}
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
        {/* TOP RIGHT CIRCULAR BACK BUTTON */}
        <button
          type="button"
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
        >
          <ArrowLeft size={20} strokeWidth={2.5} />
        </button>

        {/* User Profile Banner with Custom Image Upload Camera Button */}
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
          {/* Avatar Container with Upload Camera Overlay Button */}
          <div style={{ position: 'relative', width: '80px', height: '80px' }}>
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
                overflow: 'hidden',
              }}
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt="User Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <User size={46} color="#ffffff" strokeWidth={2} />
              )}
            </div>

            {/* Camera Upload Badge Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Upload Profile Picture"
              style={{
                position: 'absolute',
                bottom: '-2px',
                right: '-2px',
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: '#007aff',
                border: '2.5px solid #ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                cursor: 'pointer',
                boxShadow: '0 3px 8px rgba(0, 122, 255, 0.4)',
                transition: 'transform 0.15s ease',
              }}
            >
              <Camera size={13} strokeWidth={2.5} />
            </button>
          </div>

          <div style={{ textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1c1c1e', letterSpacing: '-0.03em', fontFamily: APPLE_FONT }}>
                {profileNameInput || displayName || 'Anshu yadav'}
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
            <div style={{ fontSize: '0.9rem', color: '#8e8e93', marginTop: '2px', fontWeight: 500, fontFamily: APPLE_FONT }}>
              {userEmail}
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* TAB 1: PERSONAL DETAILS                                        */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'profile' && (
          <div style={{ width: '100%', maxWidth: '1000px', textAlign: 'left' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1c1c1e', marginBottom: '20px', letterSpacing: '-0.02em', fontFamily: APPLE_FONT }}>
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
              {/* 1. FULL NAME */}
              <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '28px', padding: '22px 26px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
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

              {/* 2. EMAIL */}
              <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '28px', padding: '22px 26px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8e8e93', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px', fontFamily: APPLE_FONT }}>
                  EMAIL
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1c1c1e', fontFamily: APPLE_FONT }}>
                  {userEmail}
                </div>
              </div>

              {/* 3. ACCOUNT STATUS */}
              <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '28px', padding: '22px 26px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8e8e93', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px', fontFamily: APPLE_FONT }}>
                  ACCOUNT STATUS
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#34c759', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: APPLE_FONT }}>
                  <CheckCircle2 size={18} color="#34c759" /> Active
                </div>
              </div>

              {/* 4. JOINED */}
              <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '28px', padding: '22px 26px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8e8e93', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px', fontFamily: APPLE_FONT }}>
                  JOINED
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1c1c1e', fontFamily: APPLE_FONT }}>
                  August 2026
                </div>
              </div>

              {/* 5. LEADERBOARD RANKING */}
              <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '28px', padding: '22px 26px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8e8e93', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px', fontFamily: APPLE_FONT }}>
                  LEADERBOARD RANKING
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#007aff', fontFamily: APPLE_FONT }}>
                  {points > 100 ? '#1 Ranked' : points > 0 ? '#3 Ranked' : '#12 Ranked'}
                </div>
              </div>

              {/* 6. NATIONALITY */}
              <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '28px', padding: '22px 26px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8e8e93', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px', fontFamily: APPLE_FONT }}>
                  NATIONALITY
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1c1c1e', fontFamily: APPLE_FONT }}>
                  Indian
                </div>
              </div>

              {/* 7. MATCHES PLAYED */}
              <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '28px', padding: '22px 26px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8e8e93', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px', fontFamily: APPLE_FONT }}>
                  MATCHES PLAYED
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1c1c1e', fontFamily: APPLE_FONT }}>
                  {matchesPlayed} Rounds
                </div>
              </div>

              {/* 8. LEADERBOARD POINTS */}
              <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '28px', padding: '22px 26px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8e8e93', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px', fontFamily: APPLE_FONT }}>
                  LEADERBOARD POINTS
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1c1c1e', fontFamily: APPLE_FONT }}>
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
                boxShadow: '0 8px 24px rgba(0, 122, 255, 0.35)',
                transition: 'all 0.2s ease',
              }}
            >
              {savedSuccess ? 'Saved!' : 'Save & Return to Menu'}
            </button>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 2: DETAILED STATISTICS                                     */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'stats' && (
          <div style={{ width: '100%', maxWidth: '1000px', textAlign: 'left' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1c1c1e', marginBottom: '20px', letterSpacing: '-0.02em', fontFamily: APPLE_FONT }}>
              Statistics
            </div>

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
                <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1c1c1e', marginTop: '6px', fontFamily: APPLE_FONT, letterSpacing: '-0.03em' }}>
                  {matchesPlayed} Rounds
                </div>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '28px', padding: '22px' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8e8e93', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: APPLE_FONT }}>
                  TOTAL SCORE
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1c1c1e', marginTop: '6px', fontFamily: APPLE_FONT, letterSpacing: '-0.03em' }}>
                  {points} PTS
                </div>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '28px', padding: '22px' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8e8e93', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: APPLE_FONT }}>
                  WIN RATE
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1c1c1e', marginTop: '6px', fontFamily: APPLE_FONT, letterSpacing: '-0.03em' }}>
                  {matchesPlayed > 0 ? '70%' : '0%'}
                </div>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '28px', padding: '22px' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8e8e93', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: APPLE_FONT }}>
                  GLOBAL RANKING
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#007aff', marginTop: '6px', fontFamily: APPLE_FONT, letterSpacing: '-0.03em' }}>
                  {points > 100 ? '#1' : points > 0 ? '#3' : '#12'}
                </div>
              </div>
            </div>

            {/* Performance Breakdown Card */}
            <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '32px', padding: '28px 32px', marginBottom: '28px' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1c1c1e', marginBottom: '18px', fontFamily: APPLE_FONT }}>
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
              }}
            >
              Return to Main Menu
            </button>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 3: TOURNAMENT STATUS                                       */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'tournament' && (
          <div style={{ width: '100%', maxWidth: '1000px', textAlign: 'left' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1c1c1e', marginBottom: '20px', letterSpacing: '-0.02em', fontFamily: APPLE_FONT }}>
              Tournament Status
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '32px', padding: '36px', marginBottom: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#007aff', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px', fontFamily: APPLE_FONT }}>
                    UPCOMING CHAMPIONSHIP
                  </div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1c1c1e', letterSpacing: '-0.02em', fontFamily: APPLE_FONT }}>
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
                  }}
                >
                  {matchesPlayed >= 10 && points >= 50 ? 'Qualified' : 'In Progress'}
                </div>
              </div>

              {/* COUNTDOWN TIMER */}
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
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1c1c1e', marginBottom: '14px', fontFamily: APPLE_FONT }}>
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
                }}
              >
                <Lock size={18} color="#8e8e93" />
                <span>Registration Locked (Opens in 10 Days)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
