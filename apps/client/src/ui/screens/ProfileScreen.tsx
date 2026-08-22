import React, { useState, useEffect } from 'react';
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
  Pencil,
  CheckCircle2,
  Plus,
} from 'lucide-react';
import { SupabaseAuthService, UserProfile } from '../../networking/supabaseClient';

const APPLE_FONT = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Inter', 'Plus Jakarta Sans', sans-serif";

export const ProfileScreen: React.FC = () => {
  const { displayName, setDisplayName, setScreen, triggerGateTransition } = useGameStore();
  
  // Profile editable fields matching Image 1
  const [fullNameInput, setFullNameInput] = useState(displayName || 'Admin');
  const [usernameInput, setUsernameInput] = useState(displayName ? displayName.toLowerCase() : 'virat');
  const [phoneInput, setPhoneInput] = useState('9466166750');
  const [hostelInput, setHostelInput] = useState('NC1');
  const [roomInput, setRoomInput] = useState('223');
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

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
          setFullNameInput(p.displayName);
          setUsernameInput(p.displayName.toLowerCase());
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
  const userEmail = userProfile?.email || 'iamsid074@gmail.com';

  const handleSaveAndReturn = () => {
    if (fullNameInput.trim()) {
      setDisplayName(fullNameInput.trim());
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
        background: '#f8f9fa',
        display: 'flex',
        overflow: 'hidden',
        color: '#1c1c1e',
        fontFamily: APPLE_FONT,
      }}
    >
      {/* ------------------------------------------------------------- */}
      {/* 1. iOS SIDEBAR NAVIGATION                                      */}
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

          {/* Section: MY ACCOUNT */}
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
                  type="button"
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
                    transition: 'all 0.2s ease',
                    boxShadow: isActive ? '0 4px 14px rgba(0, 122, 255, 0.3)' : 'none',
                  }}
                >
                  <Icon size={17} color={isActive ? '#ffffff' : '#007aff'} />
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
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1c1c1e', fontFamily: APPLE_FONT }}>
                {fullNameInput || displayName || 'Admin'}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#8e8e93', fontFamily: APPLE_FONT }}>
                {userEmail}
              </div>
            </div>
          </div>

          <button
            type="button"
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
        {/* TOP RIGHT BACK BUTTON */}
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

        {/* ------------------------------------------------------------- */}
        {/* TAB 1: PROFILE / ACCOUNT SETTINGS (MATCHING IMAGE 1 DESIGN)   */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'profile' && (
          <div style={{ width: '100%', maxWidth: '880px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '28px' }}>
            
            {/* 1. TOP HEADER WITH AVATAR + CAMERA BADGE (EXACT MATCH IMAGE 1) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '22px' }}>
              {/* Circular Avatar with Camera Badge */}
              <div style={{ position: 'relative', width: '84px', height: '84px' }}>
                <div
                  style={{
                    width: '84px',
                    height: '84px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #007aff 0%, #5856d6 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    fontSize: '2rem',
                    fontWeight: 800,
                    boxShadow: '0 8px 20px rgba(0, 122, 255, 0.25)',
                    overflow: 'hidden',
                  }}
                >
                  <User size={46} color="#ffffff" strokeWidth={2} />
                </div>
                {/* Camera Badge overlapping bottom right */}
                <button
                  type="button"
                  title="Change Profile Photo"
                  style={{
                    position: 'absolute',
                    bottom: '0px',
                    right: '0px',
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: '#5856d6',
                    border: '2.5px solid #ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                  }}
                >
                  <Camera size={13} strokeWidth={2.5} />
                </button>
              </div>

              {/* Title & Subtitle */}
              <div>
                <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#1c1c1e', letterSpacing: '-0.02em', fontFamily: APPLE_FONT }}>
                  Account Settings
                </div>
                <div style={{ fontSize: '0.9rem', color: '#8e8e93', marginTop: '2px', fontWeight: 500, fontFamily: APPLE_FONT }}>
                  Update your profile and account information
                </div>
              </div>
            </div>

            {/* 2. MAIN CARD 1: CONTACT DETAILS (EXACT MATCH IMAGE 1) */}
            <div
              style={{
                background: '#ffffff',
                borderRadius: '24px',
                border: '1px solid #e5e5ea',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
                padding: '32px',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
              }}
            >
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#1c1c1e', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: APPLE_FONT }}>
                CONTACT DETAILS
              </div>

              {/* 2-Column Form Fields Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 24px' }}>
                {/* FULL NAME */}
                <div>
                  <label style={{ fontSize: '0.68rem', fontWeight: 800, color: '#8e8e93', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px', display: 'block', fontFamily: APPLE_FONT }}>
                    FULL NAME
                  </label>
                  <input
                    type="text"
                    value={fullNameInput}
                    onChange={(e) => setFullNameInput(e.target.value)}
                    placeholder="Admin"
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      borderRadius: '16px',
                      border: '1px solid transparent',
                      background: '#f2f2f7',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      color: '#1c1c1e',
                      outline: 'none',
                      boxSizing: 'border-box',
                      fontFamily: APPLE_FONT,
                      transition: 'border 0.2s ease',
                    }}
                  />
                </div>

                {/* USERNAME */}
                <div>
                  <label style={{ fontSize: '0.68rem', fontWeight: 800, color: '#8e8e93', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px', display: 'block', fontFamily: APPLE_FONT }}>
                    USERNAME
                  </label>
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="virat"
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      borderRadius: '16px',
                      border: '1px solid transparent',
                      background: '#f2f2f7',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      color: '#1c1c1e',
                      outline: 'none',
                      boxSizing: 'border-box',
                      fontFamily: APPLE_FONT,
                      transition: 'border 0.2s ease',
                    }}
                  />
                </div>

                {/* PHONE NUMBER */}
                <div>
                  <label style={{ fontSize: '0.68rem', fontWeight: 800, color: '#8e8e93', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px', display: 'block', fontFamily: APPLE_FONT }}>
                    PHONE NUMBER
                  </label>
                  <input
                    type="text"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    placeholder="9466166750"
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      borderRadius: '16px',
                      border: '1px solid transparent',
                      background: '#f2f2f7',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      color: '#1c1c1e',
                      outline: 'none',
                      boxSizing: 'border-box',
                      fontFamily: APPLE_FONT,
                      transition: 'border 0.2s ease',
                    }}
                  />
                </div>

                {/* HOSTEL BLOCK */}
                <div>
                  <label style={{ fontSize: '0.68rem', fontWeight: 800, color: '#8e8e93', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px', display: 'block', fontFamily: APPLE_FONT }}>
                    HOSTEL BLOCK
                  </label>
                  <input
                    type="text"
                    value={hostelInput}
                    onChange={(e) => setHostelInput(e.target.value)}
                    placeholder="NC1"
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      borderRadius: '16px',
                      border: '1px solid transparent',
                      background: '#f2f2f7',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      color: '#1c1c1e',
                      outline: 'none',
                      boxSizing: 'border-box',
                      fontFamily: APPLE_FONT,
                      transition: 'border 0.2s ease',
                    }}
                  />
                </div>

                {/* ROOM NUMBER */}
                <div>
                  <label style={{ fontSize: '0.68rem', fontWeight: 800, color: '#8e8e93', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px', display: 'block', fontFamily: APPLE_FONT }}>
                    ROOM NUMBER
                  </label>
                  <input
                    type="text"
                    value={roomInput}
                    onChange={(e) => setRoomInput(e.target.value)}
                    placeholder="223"
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      borderRadius: '16px',
                      border: '1px solid transparent',
                      background: '#f2f2f7',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      color: '#1c1c1e',
                      outline: 'none',
                      boxSizing: 'border-box',
                      fontFamily: APPLE_FONT,
                      transition: 'border 0.2s ease',
                    }}
                  />
                </div>
              </div>

              {/* Card Bottom Row: Right Aligned Edit/Save Account Button (EXACT MATCH IMAGE 1) */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '11px 24px',
                    borderRadius: '50px',
                    background: '#ffffff',
                    border: '1.5px solid #d1d1d6',
                    color: '#1c1c1e',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                    fontFamily: APPLE_FONT,
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Pencil size={15} color="#1c1c1e" />
                  <span>{isEditing ? 'Editing Mode' : 'Edit Account'}</span>
                </button>
              </div>
            </div>

            {/* 3. MAIN CARD 2: ACCOUNT OVERVIEW (EXACT MATCH IMAGE 1) */}
            <div
              style={{
                background: '#ffffff',
                borderRadius: '24px',
                border: '1px solid #e5e5ea',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
                padding: '32px',
                display: 'flex',
                flexDirection: 'column',
                gap: '22px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#1c1c1e', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: APPLE_FONT }}>
                  ACCOUNT OVERVIEW
                </div>

                {/* + Add New Email Pill Badge (Matching Image 1) */}
                <button
                  type="button"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 18px',
                    borderRadius: '50px',
                    background: '#eef2ff',
                    border: 'none',
                    color: '#4f46e5',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    fontFamily: APPLE_FONT,
                  }}
                >
                  <Plus size={14} color="#4f46e5" />
                  <span>Add New Email</span>
                </button>
              </div>

              {/* Account Stats & Overview Info Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px' }}>
                <div style={{ background: '#f8f9fa', borderRadius: '16px', padding: '16px 20px' }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#8e8e93', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '6px' }}>
                    EMAIL
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1c1c1e', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {userEmail}
                  </div>
                </div>

                <div style={{ background: '#f8f9fa', borderRadius: '16px', padding: '16px 20px' }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#8e8e93', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '6px' }}>
                    STATUS
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#34c759', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={15} color="#34c759" /> Active
                  </div>
                </div>

                <div style={{ background: '#f8f9fa', borderRadius: '16px', padding: '16px 20px' }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#8e8e93', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '6px' }}>
                    JOINED
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1c1c1e' }}>
                    August 2026
                  </div>
                </div>

                <div style={{ background: '#f8f9fa', borderRadius: '16px', padding: '16px 20px' }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#8e8e93', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '6px' }}>
                    LEADERBOARD RANK
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#007aff' }}>
                    {points > 100 ? '#1 Ranked' : points > 0 ? '#3 Ranked' : '#12 Ranked'}
                  </div>
                </div>
              </div>
            </div>

            {/* 4. BOTTOM SAVE & RETURN BUTTON */}
            <button
              type="button"
              onClick={handleSaveAndReturn}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '50px',
                background: 'linear-gradient(135deg, #007aff 0%, #5856d6 100%)',
                border: 'none',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.98rem',
                cursor: 'pointer',
                fontFamily: APPLE_FONT,
                boxShadow: '0 6px 20px rgba(0, 122, 255, 0.35)',
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
          <div style={{ width: '100%', maxWidth: '880px', textAlign: 'left' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1c1c1e', marginBottom: '20px', letterSpacing: '-0.02em', fontFamily: APPLE_FONT }}>
              Statistics
            </div>

            {/* 4 Cards Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '16px',
                width: '100%',
                marginBottom: '28px',
              }}
            >
              <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '24px', padding: '22px' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#8e8e93', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: APPLE_FONT }}>
                  MATCHES PLAYED
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1c1c1e', marginTop: '6px', fontFamily: APPLE_FONT, letterSpacing: '-0.03em' }}>
                  {matchesPlayed} Rounds
                </div>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '24px', padding: '22px' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#8e8e93', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: APPLE_FONT }}>
                  TOTAL SCORE
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1c1c1e', marginTop: '6px', fontFamily: APPLE_FONT, letterSpacing: '-0.03em' }}>
                  {points} PTS
                </div>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '24px', padding: '22px' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#8e8e93', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: APPLE_FONT }}>
                  WIN RATE
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1c1c1e', marginTop: '6px', fontFamily: APPLE_FONT, letterSpacing: '-0.03em' }}>
                  {matchesPlayed > 0 ? '70%' : '0%'}
                </div>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '24px', padding: '22px' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#8e8e93', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: APPLE_FONT }}>
                  GLOBAL RANKING
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#007aff', marginTop: '6px', fontFamily: APPLE_FONT, letterSpacing: '-0.03em' }}>
                  {points > 100 ? '#1' : points > 0 ? '#3' : '#12'}
                </div>
              </div>
            </div>

            {/* Performance Breakdown Card */}
            <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '24px', padding: '28px 32px', marginBottom: '28px' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1c1c1e', marginBottom: '18px', fontFamily: APPLE_FONT }}>
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
                padding: '16px',
                borderRadius: '50px',
                background: '#ffffff',
                border: '1px solid #e5e5ea',
                color: '#1c1c1e',
                fontWeight: 700,
                fontSize: '0.95rem',
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
          <div style={{ width: '100%', maxWidth: '880px', textAlign: 'left' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1c1c1e', marginBottom: '20px', letterSpacing: '-0.02em', fontFamily: APPLE_FONT }}>
              Tournament Status
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '24px', padding: '36px', marginBottom: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#007aff', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px', fontFamily: APPLE_FONT }}>
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
                    borderRadius: '50px',
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
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#8e8e93', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '14px', textAlign: 'center', fontFamily: APPLE_FONT }}>
                  REGISTRATION UNLOCK COUNTDOWN
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', textAlign: 'center' }}>
                  <div style={{ background: '#f8f9fa', border: '1px solid #e5e5ea', borderRadius: '20px', padding: '22px 8px' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1c1c1e', lineHeight: 1, fontFamily: APPLE_FONT }}>
                      {String(timeLeft.days).padStart(2, '0')}
                    </div>
                    <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8e8e93', marginTop: '8px', fontFamily: APPLE_FONT }}>DAYS</div>
                  </div>

                  <div style={{ background: '#f8f9fa', border: '1px solid #e5e5ea', borderRadius: '20px', padding: '22px 8px' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1c1c1e', lineHeight: 1, fontFamily: APPLE_FONT }}>
                      {String(timeLeft.hours).padStart(2, '0')}
                    </div>
                    <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8e8e93', marginTop: '8px', fontFamily: APPLE_FONT }}>HOURS</div>
                  </div>

                  <div style={{ background: '#f8f9fa', border: '1px solid #e5e5ea', borderRadius: '20px', padding: '22px 8px' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1c1c1e', lineHeight: 1, fontFamily: APPLE_FONT }}>
                      {String(timeLeft.minutes).padStart(2, '0')}
                    </div>
                    <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8e8e93', marginTop: '8px', fontFamily: APPLE_FONT }}>MINUTES</div>
                  </div>

                  <div style={{ background: '#f8f9fa', border: '1px solid #e5e5ea', borderRadius: '20px', padding: '22px 8px' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#007aff', lineHeight: 1, fontFamily: APPLE_FONT }}>
                      {String(timeLeft.seconds).padStart(2, '0')}
                    </div>
                    <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8e8e93', marginTop: '8px', fontFamily: APPLE_FONT }}>SECONDS</div>
                  </div>
                </div>
              </div>

              {/* Requirements Checklist */}
              <div style={{ background: '#f8f9fa', borderRadius: '20px', padding: '24px', marginBottom: '28px' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1c1c1e', marginBottom: '14px', fontFamily: APPLE_FONT }}>
                  Qualification Requirements
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', fontWeight: 600, color: '#1c1c1e', fontFamily: APPLE_FONT }}>
                    <Check size={18} color={matchesPlayed >= 10 ? '#34c759' : '#ff9500'} />
                    <span>10+ Matches Played (Current: {matchesPlayed} Rounds)</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', fontWeight: 600, color: '#1c1c1e', fontFamily: APPLE_FONT }}>
                    <Check size={18} color={points >= 50 ? '#34c759' : '#ff9500'} />
                    <span>50+ Leaderboard Points (Current: {points} Points)</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', fontWeight: 600, color: '#1c1c1e', fontFamily: APPLE_FONT }}>
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
                  padding: '16px 28px',
                  borderRadius: '50px',
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
