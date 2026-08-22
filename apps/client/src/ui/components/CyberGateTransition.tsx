import React from 'react';
import { useGameStore } from '../../state/useGameStore';
import { Trophy, Zap, Shield, Crown, Settings as SettingsIcon, User } from 'lucide-react';

export const CyberGateTransition: React.FC = () => {
  const { isGateActive: isActive, isGateClosed: isClosed, gateTitle, gateSubhead, gateShutterBg } = useGameStore();

  const displayTitle = gateTitle || 'LEADERBOARD';
  const displaySubhead = gateSubhead || 'GLOBAL STANDINGS';

  if (!isActive) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 99999,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {/* 1. LEFT SHUTTER DOOR */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: gateShutterBg ? '50vw' : '100vw',
          height: '100vh',
          background: gateShutterBg
            ? `url('${gateShutterBg}') left center/cover no-repeat`
            : 'linear-gradient(135deg, #d60050 0%, #e6005c 50%, #ff0066 100%)',
          clipPath: gateShutterBg ? undefined : 'polygon(0 0, 64vw 0, 36vw 100%, 0 100%)',
          transform: isClosed ? 'translateX(0%)' : 'translateX(-105vw)',
          transition: 'transform 0.45s cubic-bezier(0.77, 0, 0.175, 1)',
          zIndex: 1,
        }}
      >
        {/* Halftone Dot Overlay Pattern (Only if not custom shutter image) */}
        {!gateShutterBg && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: 'radial-gradient(rgba(0, 0, 0, 0.22) 1.5px, transparent 1.5px)',
              backgroundSize: '14px 14px',
              opacity: 0.75,
            }}
          />
        )}
      </div>

      {/* 2. RIGHT SHUTTER DOOR */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: gateShutterBg ? '50vw' : 0,
          width: gateShutterBg ? '50vw' : '100vw',
          height: '100vh',
          background: gateShutterBg
            ? `url('${gateShutterBg}') right center/cover no-repeat`
            : 'linear-gradient(135deg, #ff0066 0%, #e6005c 50%, #d60050 100%)',
          clipPath: gateShutterBg ? undefined : 'polygon(64vw 0, 100vw 0, 100vw 100%, 36vw 100%)',
          transform: isClosed ? 'translateX(0%)' : 'translateX(105vw)',
          transition: 'transform 0.45s cubic-bezier(0.77, 0, 0.175, 1)',
          zIndex: 2,
        }}
      >
        {/* Halftone Dot Overlay Pattern (Only if not custom shutter image) */}
        {!gateShutterBg && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: 'radial-gradient(rgba(0, 0, 0, 0.22) 1.5px, transparent 1.5px)',
              backgroundSize: '14px 14px',
              opacity: 0.75,
            }}
          />
        )}
      </div>

      {/* 3. CENTER FLOATING BADGE CARD (NORMAL WHITE THEME) */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 25,
          opacity: isClosed ? 1 : 0,
          scale: isClosed ? '1' : '0.7',
          transition: 'all 0.3s cubic-bezier(0.77, 0, 0.175, 1)',
        }}
      >
        {/* Soft Radial White Ambient Glow */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '480px',
            height: '160px',
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.45) 0%, transparent 75%)',
            borderRadius: '50%',
            filter: 'blur(30px)',
            pointerEvents: 'none',
          }}
        />

        {/* Horizontal Speed Lines (Left Side) */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '-60px',
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
            opacity: 0.8,
            pointerEvents: 'none',
          }}
        >
          <div style={{ width: '45px', height: '2px', background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.9))' }} />
          <div style={{ width: '60px', height: '3px', background: 'linear-gradient(90deg, transparent, #ffffff)' }} />
          <div style={{ width: '35px', height: '2px', background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.7))' }} />
        </div>

        {/* Horizontal Speed Lines (Right Side) */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            right: '-60px',
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
            opacity: 0.8,
            pointerEvents: 'none',
          }}
        >
          <div style={{ width: '45px', height: '2px', background: 'linear-gradient(-90deg, transparent, rgba(255, 255, 255, 0.9))' }} />
          <div style={{ width: '60px', height: '3px', background: 'linear-gradient(-90deg, transparent, #ffffff)' }} />
          <div style={{ width: '35px', height: '2px', background: 'linear-gradient(-90deg, transparent, rgba(255, 255, 255, 0.7))' }} />
        </div>

        {/* Main Floating Pill Badge Container (White Border & White Glow) */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '12px 28px 12px 14px',
            background: '#0a0a0d',
            border: '2px solid #ffffff',
            borderRadius: '26px',
            boxShadow: '0 0 35px rgba(255, 255, 255, 0.45), 0 12px 40px rgba(0, 0, 0, 0.85)',
          }}
        >
          {/* White Squircle Icon Box */}
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '16px',
              background: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(255, 255, 255, 0.85)',
              flexShrink: 0,
            }}
          >
            <Trophy size={32} color="#1c1c1e" fill="#1c1c1e" strokeWidth={1.5} />
          </div>

          {/* Text Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'left' }}>
            {/* Subhead with white accents */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#ffffff', fontSize: '0.75rem', fontWeight: 900 }}>⤺</span>
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 900,
                  color: 'rgba(255, 255, 255, 0.9)',
                  letterSpacing: '0.14em',
                  fontFamily: 'Outfit, sans-serif',
                  textTransform: 'uppercase',
                }}
              >
                {displaySubhead}
              </span>
              <span style={{ color: '#ffffff', fontSize: '0.75rem', fontWeight: 900 }}>—</span>
            </div>

            {/* Main Bold Italic Title with White Underline */}
            <div
              style={{
                fontSize: '1.9rem',
                fontWeight: 900,
                fontStyle: 'italic',
                fontFamily: "'Misery', 'QUARTZO', 'Kanit', sans-serif",
                color: '#ffffff',
                lineHeight: 1.05,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                borderBottom: '2.5px solid #ffffff',
                paddingBottom: '3px',
              }}
            >
              {displayTitle}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

