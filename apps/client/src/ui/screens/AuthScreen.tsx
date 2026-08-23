import React, { useState } from 'react';
import { useGameStore } from '../../state/useGameStore';
import { SupabaseAuthService } from '../../networking/supabaseClient';
import { Lock, Mail, User, ArrowRight, Sparkles, Loader2, Zap, Gift, Check, FileText, X } from 'lucide-react';

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
  const [referralCodeInput, setReferralCodeInput] = useState('');
  const [acceptedTnc, setAcceptedTnc] = useState(false);
  const [showTncModal, setShowTncModal] = useState(false);
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

        if (!acceptedTnc) {
          setAuthError('Please accept the Terms & Conditions to register.');
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
        justifyContent: 'flex-end',
        padding: '40px 8% 40px 40px',
        boxSizing: 'border-box',
        overflow: 'hidden',
        zIndex: 50,
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Inter', sans-serif",
      }}
    >
      {/* Pure Apple iOS Dark Glass Login Card */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          width: '450px',
          maxWidth: '92vw',
          maxHeight: '92vh',
          overflowY: 'auto',
          background: 'rgba(24, 24, 30, 0.82)',
          backdropFilter: 'blur(35px) saturate(180%)',
          WebkitBackdropFilter: 'blur(35px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.16)',
          borderRadius: '36px',
          padding: '36px 36px',
          boxSizing: 'border-box',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.45)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Title */}
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: '1.75rem',
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '-0.02em',
              fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
            }}
          >
            {mode === 'LOGIN' ? 'Sign In' : 'Create Account'}
          </h2>
          <p
            style={{
              margin: '4px 0 0 0',
              fontSize: '0.86rem',
              color: 'rgba(255, 255, 255, 0.65)',
              fontWeight: 500,
            }}
          >
            {mode === 'LOGIN' ? 'Enter your credentials to access live matches' : 'Register your player profile & start competing'}
          </p>
        </div>

        {/* Apple iOS Segmented Control with Smooth Sliding Pill */}
        <div
          style={{
            position: 'relative',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            background: 'rgba(118, 118, 128, 0.28)',
            padding: '3px',
            borderRadius: '20px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '3px',
              bottom: '3px',
              left: mode === 'LOGIN' ? '3px' : 'calc(50% + 1.5px)',
              width: 'calc(50% - 4.5px)',
              borderRadius: '17px',
              background: '#ffffff',
              boxShadow: '0 3px 10px rgba(0, 0, 0, 0.25)',
              transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
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
              padding: '10px 0',
              borderRadius: '17px',
              border: 'none',
              background: 'transparent',
              color: mode === 'LOGIN' ? '#000000' : 'rgba(255, 255, 255, 0.75)',
              fontWeight: mode === 'LOGIN' ? 700 : 500,
              fontSize: '0.88rem',
              fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
              cursor: 'pointer',
              transition: 'color 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            Sign In
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
              padding: '10px 0',
              borderRadius: '17px',
              border: 'none',
              background: 'transparent',
              color: mode === 'REGISTER' ? '#000000' : 'rgba(255, 255, 255, 0.75)',
              fontWeight: mode === 'REGISTER' ? 700 : 500,
              fontSize: '0.88rem',
              fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
              cursor: 'pointer',
              transition: 'color 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            Register
          </button>
        </div>

        {/* Error Banner */}
        {authError && (
          <div
            style={{
              background: 'rgba(255, 59, 48, 0.15)',
              border: '1px solid rgba(255, 69, 58, 0.3)',
              borderRadius: '18px',
              padding: '12px 16px',
              color: '#ff453a',
              fontSize: '0.84rem',
              fontWeight: 500,
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
                background: '#007aff',
                border: 'none',
                color: '#ffffff',
                fontWeight: 700,
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
        <form style={{ display: 'flex', flexDirection: 'column', gap: '14px' }} onSubmit={handleAuthSubmit}>
          {/* Username Field (Only in REGISTER mode) */}
          <div
            style={{
              maxHeight: mode === 'REGISTER' ? '90px' : '0px',
              opacity: mode === 'REGISTER' ? 1 : 0,
              transform: mode === 'REGISTER' ? 'translateY(0px)' : 'translateY(-6px)',
              overflow: 'hidden',
              transition: 'max-height 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.75)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <User size={15} color="#007aff" /> Username / Display Name
            </label>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              style={{
                width: '100%',
                padding: '13px 18px',
                borderRadius: '18px',
                border: '1px solid rgba(255, 255, 255, 0.16)',
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#ffffff',
                fontWeight: 500,
                fontSize: '0.96rem',
                outline: 'none',
                boxSizing: 'border-box',
              }}
              placeholder="Enter Username"
              required={mode === 'REGISTER'}
            />
          </div>

          {/* Email Address Field */}
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.75)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <Mail size={15} color="#007aff" /> Email Address
            </label>
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              style={{
                width: '100%',
                padding: '13px 18px',
                borderRadius: '18px',
                border: '1px solid rgba(255, 255, 255, 0.16)',
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#ffffff',
                fontWeight: 500,
                fontSize: '0.96rem',
                outline: 'none',
                boxSizing: 'border-box',
              }}
              placeholder="Enter Email Address"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.75)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <Lock size={15} color="#007aff" /> Password
            </label>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              style={{
                width: '100%',
                padding: '13px 18px',
                borderRadius: '18px',
                border: '1px solid rgba(255, 255, 255, 0.16)',
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#ffffff',
                fontWeight: 500,
                fontSize: '0.96rem',
                outline: 'none',
                boxSizing: 'border-box',
              }}
              placeholder="Enter Password"
              required
            />
          </div>

          {/* Invitation Code & T&C Checkbox (BELOW PASSWORD!) */}
          <div
            style={{
              maxHeight: mode === 'REGISTER' ? '180px' : '0px',
              opacity: mode === 'REGISTER' ? 1 : 0,
              transform: mode === 'REGISTER' ? 'translateY(0px)' : 'translateY(-10px)',
              overflow: 'hidden',
              transition: 'max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            {/* Invitation Code Field */}
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.75)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <Gift size={15} color="#ff9500" /> Invitation / Referral Code (Optional)
              </label>
              <input
                type="text"
                value={referralCodeInput}
                onChange={(e) => setReferralCodeInput(e.target.value.toUpperCase())}
                style={{
                  width: '100%',
                  padding: '13px 18px',
                  borderRadius: '18px',
                  border: '1px solid rgba(255, 149, 0, 0.3)',
                  background: 'rgba(255, 149, 0, 0.06)',
                  color: '#ff9500',
                  fontWeight: 700,
                  fontSize: '0.96rem',
                  letterSpacing: '0.04em',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
                placeholder="e.g. CLASHA-RACER10"
              />
            </div>

            {/* Terms & Conditions Checkbox */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '2px 0',
                cursor: 'pointer',
                userSelect: 'none',
              }}
              onClick={() => setAcceptedTnc(!acceptedTnc)}
            >
              <div
                style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '7px',
                  border: acceptedTnc ? '2px solid #007aff' : '2px solid rgba(255, 255, 255, 0.35)',
                  background: acceptedTnc ? '#007aff' : 'rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  flexShrink: 0,
                }}
              >
                {acceptedTnc && <Check size={14} color="#ffffff" strokeWidth={3} />}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.85)', fontWeight: 500, lineHeight: 1.35 }}>
                I agree to the{' '}
                <span
                  style={{ color: '#007aff', fontWeight: 700, textDecoration: 'underline' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowTncModal(true);
                  }}
                >
                  Terms & Conditions
                </span>{' '}
                and Fair Play Rules
              </div>
            </div>
          </div>

          {/* Apple iOS Pill Action Button */}
          <button
            type="submit"
            className="hud-interactive btn-press-effect"
            disabled={isLoading}
            style={{
              width: '100%',
              height: '52px',
              borderRadius: '50px',
              background: isLoading
                ? 'linear-gradient(135deg, #0056b3 0%, #004085 100%)'
                : 'linear-gradient(135deg, #007aff 0%, #0056b3 100%)',
              border: 'none',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '1rem',
              fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
              cursor: isLoading ? 'wait' : 'pointer',
              boxShadow: '0 8px 24px rgba(0, 122, 255, 0.35)',
              marginTop: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {isLoading ? (
              <>
                <Loader2 size={20} color="#ffffff" className="spin-icon" />
                <span>{mode === 'LOGIN' ? 'Signing In...' : 'Creating Profile...'}</span>
              </>
            ) : mode === 'LOGIN' ? (
              <>
                <span>Sign In</span> <ArrowRight size={18} />
              </>
            ) : (
              <>
                <span>Create Account</span> <Sparkles size={18} />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '0' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.12)' }} />
          <span style={{ fontSize: '0.74rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.5)' }}>
            or
          </span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.12)' }} />
        </div>

        {/* Apple iOS Glass Google Button */}
        <button
          type="button"
          className="hud-interactive btn-press-effect"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '13px 20px',
            borderRadius: '50px',
            background: 'rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#ffffff',
            fontWeight: 600,
            fontSize: '0.94rem',
            fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <GoogleIcon />
          <span>Continue with Google</span>
        </button>
      </div>

      {/* 📜 APPLE iOS LIGHT MODE TERMS & CONDITIONS MODAL */}
      {showTncModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            zIndex: 99999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px',
          }}
          onClick={() => setShowTncModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '520px',
              background: '#ffffff',
              borderRadius: '28px',
              padding: '28px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              color: '#1c1c1e',
              animation: 'slideUpBottom 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FileText size={22} color="#007aff" />
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>Terms & Conditions</h3>
              </div>
              <button
                onClick={() => setShowTncModal(false)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#f2f2f7',
                  border: 'none',
                  color: '#1c1c1e',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ fontSize: '0.86rem', color: '#3a3a3c', lineHeight: 1.6, maxHeight: '60vh', overflowY: 'auto', paddingRight: '6px' }}>
              <p style={{ margin: '0 0 10px 0' }}>
                1. <strong>Fair Play & Esports Standards:</strong> All players must maintain respectful sportsmanship. Use of third-party hacks, bots, or unauthorized scripts will result in instant account ban.
              </p>
              <p style={{ margin: '0 0 10px 0' }}>
                2. <strong>Referral & Rewards Qualification:</strong> Referral cash payouts (₹10 per player) require the referred user to complete minimum <strong>3 Party Cabin Rounds</strong> and <strong>1 Tournament Match</strong>.
              </p>
              <p style={{ margin: '0 0 10px 0' }}>
                3. <strong>Account Responsibility:</strong> You are responsible for all activity under your racer profile and credentials.
              </p>
              <p style={{ margin: 0 }}>
                4. <strong>Privacy & Data:</strong> Player scores and leaderboard stats are stored securely for competition tracking.
              </p>
            </div>

            <button
              onClick={() => {
                setAcceptedTnc(true);
                setShowTncModal(false);
              }}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '50px',
                background: '#007aff',
                border: 'none',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.96rem',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(0, 122, 255, 0.35)',
              }}
            >
              I Accept & Agree
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
