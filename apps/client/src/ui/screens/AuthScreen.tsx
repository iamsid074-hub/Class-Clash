import React, { useState } from 'react';
import { useGameStore } from '../../state/useGameStore';
import { SupabaseAuthService } from '../../networking/supabaseClient';
import { Lock, Mail, User, ArrowRight, Sparkles, Loader2, Zap } from 'lucide-react';

const GoogleIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

export const AuthScreen: React.FC = () => {
  const { setDisplayName, setScreen } = useGameStore();

  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    // 1. Check for OAuth callback errors in URL
    const searchParams = new URLSearchParams(window.location.search);
    const errorParam = searchParams.get('error_description') || searchParams.get('error');
    if (errorParam) {
      setAuthError(`Google Auth Error: ${decodeURIComponent(errorParam)}`);
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // 2. Check for existing session
    SupabaseAuthService.getSavedSession().then((profile) => {
      if (profile?.displayName) {
        setDisplayName(profile.displayName);
        setScreen('MAIN_MENU');
      }
    });
  }, [setDisplayName, setScreen]);

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    setIsLoading(true);
    if (window.location.search || window.location.hash) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    try {
      const { error, profile } = await SupabaseAuthService.signInWithGoogle();
      if (error) {
        setAuthError(error.message);
        setIsLoading(false);
        return;
      }
      if (profile?.displayName) {
        setDisplayName(profile.displayName);
        setScreen('MAIN_MENU');
      }
    } catch (err: any) {
      setAuthError('Google sign in failed. Please try again.');
      setIsLoading(false);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!emailInput.trim() || !passwordInput.trim()) {
      setAuthError('Please enter both email and password.');
      return;
    }

    setIsLoading(true);

    try {
      if (mode === 'LOGIN') {
        const { error, profile } = await SupabaseAuthService.signIn(emailInput.trim(), passwordInput.trim());
        if (error) {
          setAuthError(error.message);
          setIsLoading(false);
          return;
        }

        if (profile?.displayName) {
          setDisplayName(profile.displayName);
        }

        setScreen('MAIN_MENU');
      } else {
        if (!nameInput.trim()) {
          setAuthError('Please enter a display username.');
          setIsLoading(false);
          return;
        }

        const { error, profile } = await SupabaseAuthService.signUp(
          emailInput.trim(),
          passwordInput.trim(),
          nameInput.trim()
        );

        if (error) {
          setAuthError(error.message);
          setIsLoading(false);
          return;
        }

        if (profile?.displayName) {
          setDisplayName(profile.displayName);
        }

        setScreen('MAIN_MENU');
      }
    } catch (err: any) {
      setAuthError('Authentication failed. Please try again.');
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
        backgroundImage: "url('/loginpage.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '40px 40px 40px 8%',
        boxSizing: 'border-box',
        overflow: 'hidden',
        zIndex: 50,
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif",
      }}
    >
      {/* Sleek Deep-Navy Frosted Glass Login Card matching loginpage.png theme */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          width: '440px',
          maxWidth: '100%',
          background: 'rgba(5, 15, 36, 0.78)',
          backdropFilter: 'blur(25px) saturate(180%)',
          WebkitBackdropFilter: 'blur(25px) saturate(180%)',
          border: '1.5px solid rgba(255, 0, 102, 0.4)',
          borderRadius: '26px',
          padding: '36px 36px',
          boxSizing: 'border-box',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.75), 0 0 30px rgba(255, 0, 102, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        {/* Card Title & Subtitle */}
        <div>
          <div
            style={{
              fontSize: '2.0rem',
              fontWeight: 900,
              fontStyle: 'italic',
              color: '#ffffff',
              fontFamily: "'QUARTZO', 'Kanit', sans-serif",
              letterSpacing: '0.02em',
            }}
          >
            {mode === 'LOGIN' ? 'RACER LOGIN' : 'CREATE ACCOUNT'}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.7)', marginTop: '4px', fontWeight: 500 }}>
            {mode === 'LOGIN' ? 'Enter your credentials to access live matches' : 'Register your racer profile & start competing'}
          </div>
        </div>

        {/* Mode Switcher Tabs */}
        <div
          style={{
            position: 'relative',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            background: 'rgba(3, 9, 22, 0.65)',
            padding: '4px',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '4px',
              bottom: '4px',
              left: mode === 'LOGIN' ? '4px' : 'calc(50% + 2px)',
              width: 'calc(50% - 6px)',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #ff0066 0%, #ff3385 100%)',
              transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 4px 15px rgba(255, 0, 102, 0.45)',
              zIndex: 1,
            }}
          />

          <button
            type="button"
            onClick={() => {
              setMode('LOGIN');
              setAuthError(null);
            }}
            style={{
              position: 'relative',
              zIndex: 2,
              padding: '11px',
              borderRadius: '12px',
              border: 'none',
              background: 'transparent',
              color: '#ffffff',
              fontWeight: 900,
              fontSize: '0.9rem',
              fontStyle: 'italic',
              fontFamily: "'QUARTZO', 'Kanit', sans-serif",
              letterSpacing: '0.06em',
              cursor: 'pointer',
              transition: 'color 0.3s ease',
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
              position: 'relative',
              zIndex: 2,
              padding: '11px',
              borderRadius: '12px',
              border: 'none',
              background: 'transparent',
              color: '#ffffff',
              fontWeight: 900,
              fontSize: '0.9rem',
              fontStyle: 'italic',
              fontFamily: "'QUARTZO', 'Kanit', sans-serif",
              letterSpacing: '0.06em',
              cursor: 'pointer',
              transition: 'color 0.3s ease',
            }}
          >
            REGISTER
          </button>
        </div>

        {/* Error Banner */}
        {authError && (
          <div
            style={{
              background: 'rgba(255, 59, 48, 0.18)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 69, 58, 0.35)',
              borderRadius: '14px',
              padding: '12px 16px',
              color: '#ff453a',
              fontSize: '0.84rem',
              fontWeight: 600,
              lineHeight: 1.4,
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <div>{authError}</div>
            <button
              type="button"
              onClick={async () => {
                const { profile } = await SupabaseAuthService.fastGoogleSignIn();
                if (profile?.displayName) {
                  setDisplayName(profile.displayName);
                  setScreen('MAIN_MENU');
                }
              }}
              style={{
                padding: '8px 14px',
                borderRadius: '50px',
                background: '#ff0066',
                border: 'none',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.78rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <Zap size={14} /> Continue with Direct Google Login
            </button>
          </div>
        )}

        {/* Input Form */}
        <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} onSubmit={handleAuthSubmit}>
          {mode === 'REGISTER' && (
            <div>
              <label style={{ fontSize: '0.72rem', fontWeight: 800, color: 'rgba(255, 255, 255, 0.8)', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={14} color="#ff0066" /> USERNAME / DISPLAY NAME
              </label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                style={{
                  width: '100%',
                  padding: '13px 16px',
                  borderRadius: '12px',
                  border: '1.5px solid rgba(255, 255, 255, 0.18)',
                  background: 'rgba(2, 8, 20, 0.55)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '1rem',
                  outline: 'none',
                  marginTop: '6px',
                  boxSizing: 'border-box',
                }}
                placeholder="Enter Username"
                required
              />
            </div>
          )}

          <div>
            <label style={{ fontSize: '0.72rem', fontWeight: 800, color: 'rgba(255, 255, 255, 0.8)', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Mail size={14} color="#ff0066" /> EMAIL ADDRESS
            </label>
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              style={{
                width: '100%',
                padding: '13px 16px',
                borderRadius: '12px',
                border: '1.5px solid rgba(255, 255, 255, 0.18)',
                background: 'rgba(2, 8, 20, 0.55)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '1rem',
                outline: 'none',
                marginTop: '6px',
                boxSizing: 'border-box',
              }}
              placeholder="Enter Email Address"
              required
            />
          </div>

          <div>
            <label style={{ fontSize: '0.72rem', fontWeight: 800, color: 'rgba(255, 255, 255, 0.8)', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Lock size={14} color="#ff0066" /> PASSWORD
            </label>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              style={{
                width: '100%',
                padding: '13px 16px',
                borderRadius: '12px',
                border: '1.5px solid rgba(255, 255, 255, 0.18)',
                background: 'rgba(2, 8, 20, 0.55)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '1rem',
                outline: 'none',
                marginTop: '6px',
                boxSizing: 'border-box',
              }}
              placeholder="Enter Password"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="hud-interactive btn-press-effect"
            disabled={isLoading}
            style={{
              width: '100%',
              height: '52px',
              borderRadius: '14px',
              background: isLoading
                ? 'linear-gradient(135deg, #cc0052 0%, #e6005c 100%)'
                : 'linear-gradient(135deg, #ff0066 0%, #ff3385 100%)',
              border: '2px solid #ffffff',
              color: '#ffffff',
              fontWeight: 900,
              fontSize: '1.1rem',
              fontStyle: 'italic',
              fontFamily: "'QUARTZO', 'Kanit', sans-serif",
              cursor: isLoading ? 'wait' : 'pointer',
              boxShadow: '0 8px 25px rgba(255, 0, 102, 0.55)',
              letterSpacing: '0.06em',
              marginTop: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
            }}
          >
            {isLoading ? (
              <>
                <Loader2 size={22} color="#ffffff" className="spin-icon" />
                <span>{mode === 'LOGIN' ? 'LOGGING IN...' : 'CREATING PROFILE...'}</span>
              </>
            ) : mode === 'LOGIN' ? (
              <>
                <span>ENTER ARENA LOBBY</span> <ArrowRight size={18} />
              </>
            ) : (
              <>
                <span>CREATE PROFILE & ENTER ARENA</span> <Sparkles size={18} />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '2px 0' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.15)' }} />
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255, 255, 255, 0.55)', letterSpacing: '0.08em' }}>
            OR CONTINUE WITH
          </span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.15)' }} />
        </div>

        {/* Google Sign In Button */}
        <button
          type="button"
          className="hud-interactive btn-press-effect"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '12px 18px',
            borderRadius: '14px',
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#ffffff',
            fontWeight: 600,
            fontSize: '0.92rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
          }}
        >
          <GoogleIcon />
          <span>Continue with Google</span>
        </button>
      </div>
    </div>
  );
};
