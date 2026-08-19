import React, { useState } from 'react';
import { useGameStore } from '../../state/useGameStore';
import { ClassClashLogo } from '../components/ClassClashLogo';
import { PinkNeonFrame } from '../components/PinkNeonFrame';
import { SupabaseAuthService, isSupabaseConfigured } from '../../networking/supabaseClient';
import { Lock, Mail, User, ArrowRight, Sparkles, Database, ShieldCheck, Trophy } from 'lucide-react';

export const AuthScreen: React.FC = () => {
  const { setDisplayName, setScreen, triggerGateTransition } = useGameStore();

  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!emailInput.trim() || !passwordInput.trim()) {
      setAuthError('PLEASE ENTER BOTH EMAIL AND PASSWORD!');
      return;
    }

    setIsLoading(true);

    try {
      if (mode === 'LOGIN') {
        const { error, profile } = await SupabaseAuthService.signIn(emailInput.trim(), passwordInput.trim());
        if (error) {
          setAuthError(error.message.toUpperCase());
          setIsLoading(false);
          return;
        }

        if (profile?.displayName) {
          setDisplayName(profile.displayName);
        }

        triggerGateTransition(() => {
          setScreen('MAIN_MENU');
        }, 'AUTHENTICATED', profile?.displayName || 'CLASHA');
      } else {
        if (!nameInput.trim()) {
          setAuthError('PLEASE ENTER A DISPLAY USERNAME!');
          setIsLoading(false);
          return;
        }

        const { error, profile } = await SupabaseAuthService.signUp(
          emailInput.trim(),
          passwordInput.trim(),
          nameInput.trim()
        );

        if (error) {
          setAuthError(error.message.toUpperCase());
          setIsLoading(false);
          return;
        }

        if (profile?.displayName) {
          setDisplayName(profile.displayName);
        }

        triggerGateTransition(() => {
          setScreen('MAIN_MENU');
        }, 'RACER REGISTERED', nameInput.trim().toUpperCase());
      }
    } catch (err: any) {
      setAuthError('AUTHENTICATION FAILED! PLEASE TRY AGAIN.');
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(135deg, #181416 0%, #0d0a0b 100%)',
        display: 'flex',
        overflow: 'hidden',
        zIndex: 50,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <PinkNeonFrame />

      {/* ====================================================================== */}
      {/* LEFT SPLIT (50%): HERO ARTWORK & BRANDING BANNER                       */}
      {/* ====================================================================== */}
      <div
        style={{
          flex: '1.1',
          position: 'relative',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '48px 56px',
          boxSizing: 'border-box',
          backgroundImage: "url('/cabin.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Dark Cream Vignette Gradient Overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(180deg, rgba(24, 20, 22, 0.75) 0%, rgba(18, 14, 16, 0.92) 70%, rgba(13, 10, 11, 0.98) 100%)',
            zIndex: 1,
          }}
        />

        {/* Top Left Logo Emblem */}
        <div style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', gap: '16px' }}>
          <ClassClashLogo size={54} />
          <div>
            <h1
              style={{
                fontSize: '2.5rem',
                fontWeight: 900,
                fontStyle: 'italic',
                fontFamily: "'Kanit', sans-serif",
                letterSpacing: '0.04em',
                margin: 0,
                lineHeight: 1,
                textTransform: 'uppercase',
              }}
            >
              <span style={{ color: '#f4ece1' }}>CLAS</span>
              <span style={{ color: '#ff0066' }}>HA</span>
            </h1>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#e4ceaf', letterSpacing: '0.18em', marginTop: '2px' }}>
              ULTRALIGHT ESPORTS LOBBY
            </div>
          </div>
        </div>

        {/* Bottom Hero Info Box */}
        <div style={{ position: 'relative', zIndex: 10, maxWidth: '540px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255, 0, 102, 0.15)',
              border: '1.5px solid #ff0066',
              borderRadius: '20px',
              padding: '6px 14px',
              width: 'fit-content',
              fontSize: '0.78rem',
              fontWeight: 900,
              color: '#ff66a3',
              letterSpacing: '0.1em',
            }}
          >
            <Trophy size={14} color="#ff0066" /> MULTIPLAYER RACING ARENA
          </div>

          <div
            style={{
              fontSize: '2.4rem',
              fontWeight: 900,
              fontStyle: 'italic',
              fontFamily: "'Kanit', sans-serif",
              color: '#f4ece1',
              lineHeight: 1.15,
              letterSpacing: '0.02em',
            }}
          >
            BORING DAY? LET'S RACE TOGETHER.
          </div>
        </div>
      </div>

      {/* ====================================================================== */}
      {/* RIGHT SPLIT (50%): CREAM DARK LOGIN & REGISTER FORM                   */}
      {/* ====================================================================== */}
      <div
        style={{
          flex: '1',
          height: '100%',
          background: 'linear-gradient(145deg, #1d181b 0%, #130f11 100%)',
          borderLeft: '2px solid rgba(228, 206, 175, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
          boxSizing: 'border-box',
          position: 'relative',
        }}
      >
        {/* Form Container Card */}
        <div
          style={{
            width: '460px',
            maxWidth: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            textAlign: 'left',
          }}
        >
          {/* Header */}
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 900, color: '#dfb77a', letterSpacing: '0.16em', textTransform: 'uppercase' }}>
              ACCESS YOUR ACCOUNT
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: 900, fontStyle: 'italic', color: '#f4ece1', fontFamily: "'Kanit', sans-serif", marginTop: '2px' }}>
              {mode === 'LOGIN' ? 'WELCOME BACK' : 'CREATE RACER PROFILE'}
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              background: '#120e10',
              padding: '5px',
              borderRadius: '14px',
              border: '1px solid rgba(228, 206, 175, 0.18)',
            }}
          >
            <button
              type="button"
              onClick={() => {
                setMode('LOGIN');
                setAuthError(null);
              }}
              style={{
                padding: '11px',
                borderRadius: '10px',
                border: 'none',
                background: mode === 'LOGIN' ? 'linear-gradient(135deg, #ff0066 0%, #ff3385 100%)' : 'transparent',
                color: '#ffffff',
                fontWeight: 900,
                fontSize: '0.92rem',
                fontStyle: 'italic',
                fontFamily: "'Kanit', sans-serif",
                letterSpacing: '0.06em',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              SIGN IN
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('REGISTER');
                setAuthError(null);
              }}
              style={{
                padding: '11px',
                borderRadius: '10px',
                border: 'none',
                background: mode === 'REGISTER' ? 'linear-gradient(135deg, #ff0066 0%, #ff3385 100%)' : 'transparent',
                color: '#ffffff',
                fontWeight: 900,
                fontSize: '0.92rem',
                fontStyle: 'italic',
                fontFamily: "'Kanit', sans-serif",
                letterSpacing: '0.06em',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              CREATE ACCOUNT
            </button>
          </div>

          {/* Auth Error Banner */}
          {authError && (
            <div
              style={{
                background: 'rgba(255, 51, 102, 0.15)',
                border: '1.5px solid #ff3366',
                borderRadius: '12px',
                padding: '12px 16px',
                color: '#ff6688',
                fontSize: '0.86rem',
                fontWeight: 800,
              }}
            >
              ⚠️ {authError}
            </div>
          )}

          {/* Form Fields */}
          <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {mode === 'REGISTER' && (
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 900, color: '#e6d7c3', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <User size={14} color="#ff0066" /> USERNAME / DISPLAY NAME
                </label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    borderRadius: '14px',
                    border: '1.5px solid rgba(244, 236, 225, 0.2)',
                    background: '#261f22',
                    color: '#f4ece1',
                    fontWeight: 900,
                    fontSize: '1.1rem',
                    outline: 'none',
                    marginTop: '6px',
                    boxSizing: 'border-box',
                  }}
                  placeholder="ENTER USERNAME (E.G. VIRAT)"
                  required
                />
              </div>
            )}

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 900, color: '#e6d7c3', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={14} color="#ff0066" /> EMAIL ADDRESS
              </label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  borderRadius: '14px',
                  border: '1.5px solid rgba(244, 236, 225, 0.2)',
                  background: '#261f22',
                  color: '#f4ece1',
                  fontWeight: 900,
                  fontSize: '1.1rem',
                  outline: 'none',
                  marginTop: '6px',
                  boxSizing: 'border-box',
                }}
                placeholder="RACER@CLASHA.COM"
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 900, color: '#e6d7c3', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Lock size={14} color="#ff0066" /> PASSWORD
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  borderRadius: '14px',
                  border: '1.5px solid rgba(244, 236, 225, 0.2)',
                  background: '#261f22',
                  color: '#f4ece1',
                  fontWeight: 900,
                  fontSize: '1.1rem',
                  outline: 'none',
                  marginTop: '6px',
                  boxSizing: 'border-box',
                }}
                placeholder="••••••••••••"
                required
              />
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                height: '56px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #ff0066 0%, #ff3385 100%)',
                border: '2px solid #ffffff',
                color: '#ffffff',
                fontWeight: 900,
                fontSize: '1.2rem',
                fontStyle: 'italic',
                fontFamily: "'Kanit', sans-serif",
                cursor: isLoading ? 'wait' : 'pointer',
                boxShadow: '0 8px 25px rgba(255, 0, 102, 0.45)',
                letterSpacing: '0.06em',
                marginTop: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                opacity: isLoading ? 0.7 : 1,
              }}
            >
              {isLoading ? (
                'AUTHENTICATING...'
              ) : mode === 'LOGIN' ? (
                <>
                  ENTER ARENA LOBBY <ArrowRight size={20} />
                </>
              ) : (
                <>
                  CREATE PROFILE & ENTER ARENA <Sparkles size={20} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
