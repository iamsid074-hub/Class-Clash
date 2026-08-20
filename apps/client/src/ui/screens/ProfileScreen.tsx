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
} from 'lucide-react';
import { SupabaseAuthService, UserProfile } from '../../networking/supabaseClient';

export const ProfileScreen: React.FC = () => {
  const { displayName, setDisplayName, setScreen, triggerGateTransition } = useGameStore();
  const [profileNameInput, setProfileNameInput] = useState(displayName || '2eosV3');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    SupabaseAuthService.getSavedSession().then((p) => {
      if (p) setUserProfile(p);
    });
  }, []);

  const matchesPlayed = userProfile?.matchesPlayed || 0;
  const points = userProfile?.leaderboardPoints || 0;
  const userEmail = userProfile?.email || 'anshu@classclash.io';

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
              { id: 'stats', label: 'Racer Statistics', icon: BarChart2 },
              { id: 'tournament', label: 'Tournament Status', icon: Trophy },
              { id: 'delivery', label: 'Delivery Partner', icon: Truck },
              { id: 'security', label: 'Security & Access', icon: Lock },
              { id: 'experience', label: 'App Experience', icon: Smartphone },
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
              { id: 'transactions', label: 'Transactions', icon: Receipt },
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

        {/* Section: Personal details */}
        <div style={{ width: '100%', maxWidth: '720px' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '28px' }}>
            Personal details
          </div>

          {/* Grid Layout 2x3 */}
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
      </div>
    </div>
  );
};
