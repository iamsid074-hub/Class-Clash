import React from 'react';
import { useGameStore } from '../../state/useGameStore';
import { Trophy } from 'lucide-react';

export const CyberGateTransition: React.FC = () => {
  const { isGateActive: isActive, isGateClosed: isClosed, gateTitle, gateSubhead, gateStyle } = useGameStore();

  const displayTitle = gateTitle || 'LEADERBOARD';
  const displaySubhead = gateSubhead || 'SPECIAL TOURNAMENT';
  const isTournamentStyle = gateStyle === 'tournament';

  if (!isActive) return null;

  // COLOR THEMES BASED ON TOURNAMENT VS DEFAULT
  const doorGradientLeft = isTournamentStyle
    ? 'linear-gradient(135deg, #02143d 0%, #0044cc 50%, #0066ff 100%)'
    : 'linear-gradient(135deg, #d60050 0%, #e6005c 50%, #ff0066 100%)';

  const doorGradientRight = isTournamentStyle
    ? 'linear-gradient(135deg, #0066ff 0%, #0044cc 50%, #02143d 100%)'
    : 'linear-gradient(135deg, #ff0066 0%, #e6005c 50%, #d60050 100%)';

  const seamColor = isTournamentStyle ? '#00f0ff' : '#ffffff';
  const seamGlow = isTournamentStyle ? '0 0 16px #00f0ff, 0 0 30px #0066ff' : '0 0 10px rgba(255, 255, 255, 0.95)';

  const pillBorder = isTournamentStyle ? '2px solid #00f0ff' : '2px solid #ff3385';
  const pillShadow = isTournamentStyle
    ? '0 0 35px rgba(0, 240, 255, 0.8), 0 0 75px rgba(0, 102, 255, 0.6), 0 12px 40px rgba(0, 0, 0, 0.9)'
    : '0 0 35px rgba(255, 0, 102, 0.55), 0 12px 40px rgba(0, 0, 0, 0.85)';

  const ambientGlow = isTournamentStyle
    ? 'radial-gradient(circle, rgba(0, 240, 255, 0.75) 0%, rgba(0, 102, 255, 0.45) 40%, transparent 75%)'
    : 'radial-gradient(circle, rgba(255, 0, 102, 0.65) 0%, transparent 75%)';

  const trophyColor = isTournamentStyle ? '#0055ff' : '#ff0066';
  const titleUnderline = isTournamentStyle ? '2.5px solid #00f0ff' : '2.5px solid #ff0066';
  const subheadColor = isTournamentStyle ? '#70e1ff' : 'rgba(255, 255, 255, 0.9)';

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
      {/* 1. LEFT DIAGONAL SHUTTER DOOR WITH HALFTONE DOT PATTERN */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: doorGradientLeft,
          clipPath: 'polygon(0 0, 64vw 0, 36vw 100%, 0 100%)',
          transform: isClosed ? 'translateX(0%)' : 'translateX(-105vw)',
          transition: 'transform 0.45s cubic-bezier(0.77, 0, 0.175, 1)',
          zIndex: 1,
        }}
      >
        {/* Halftone Dot Overlay Pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: 'radial-gradient(rgba(0, 0, 0, 0.3) 1.5px, transparent 1.5px)',
            backgroundSize: '14px 14px',
            opacity: 0.75,
          }}
        />

        {/* Tournament Angled Tech Slash Bars (Bottom-Left Corner) */}
        {isTournamentStyle && (
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              left: '40px',
              display: 'flex',
              gap: '12px',
              transform: 'skewX(-25deg)',
              opacity: 0.5,
            }}
          >
            <div style={{ width: '14px', height: '140px', background: '#00f0ff', boxShadow: '0 0 15px #00f0ff' }} />
            <div style={{ width: '22px', height: '140px', background: '#00f0ff', boxShadow: '0 0 15px #00f0ff' }} />
            <div style={{ width: '8px', height: '140px', background: '#ffffff', boxShadow: '0 0 10px #ffffff' }} />
          </div>
        )}
      </div>

      {/* 2. RIGHT DIAGONAL SHUTTER DOOR WITH HALFTONE DOT PATTERN */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: doorGradientRight,
          clipPath: 'polygon(64vw 0, 100vw 0, 100vw 100%, 36vw 100%)',
          transform: isClosed ? 'translateX(0%)' : 'translateX(105vw)',
          transition: 'transform 0.45s cubic-bezier(0.77, 0, 0.175, 1)',
          zIndex: 2,
        }}
      >
        {/* Halftone Dot Overlay Pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: 'radial-gradient(rgba(0, 0, 0, 0.3) 1.5px, transparent 1.5px)',
            backgroundSize: '14px 14px',
            opacity: 0.75,
          }}
        />

        {/* Tournament Angled Tech Slash Bars (Top-Right Corner) */}
        {isTournamentStyle && (
          <div
            style={{
              position: 'absolute',
              top: '40px',
              right: '40px',
              display: 'flex',
              gap: '12px',
              transform: 'skewX(-25deg)',
              opacity: 0.5,
            }}
          >
            <div style={{ width: '8px', height: '140px', background: '#ffffff', boxShadow: '0 0 10px #ffffff' }} />
            <div style={{ width: '22px', height: '140px', background: '#00f0ff', boxShadow: '0 0 15px #00f0ff' }} />
            <div style={{ width: '14px', height: '140px', background: '#00f0ff', boxShadow: '0 0 15px #00f0ff' }} />
          </div>
        )}
      </div>

      {/* 3. DIAGONAL SEAM GLOWING LINE OVERLAY */}
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 15,
          opacity: isClosed ? 1 : 0,
          transition: 'opacity 0.35s cubic-bezier(0.77, 0, 0.175, 1)',
        }}
      >
        <line
          x1="64vw"
          y1="0"
          x2="36vw"
          y2="100vh"
          stroke={seamColor}
          strokeWidth="3.5"
          style={{ filter: `drop-shadow(${seamGlow})` }}
        />
      </svg>

      {/* 4. CENTER FLOATING BADGE CARD WITH HORIZONTAL SPEED TRAILS */}
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
        {/* Soft Radial Ambient Glow */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '520px',
            height: '180px',
            background: ambientGlow,
            borderRadius: '50%',
            filter: 'blur(35px)',
            pointerEvents: 'none',
          }}
        />

        {/* Horizontal Speed Lines (Left Side) */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '-65px',
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
            opacity: 0.9,
            pointerEvents: 'none',
          }}
        >
          <div style={{ width: '50px', height: '2px', background: isTournamentStyle ? 'linear-gradient(90deg, transparent, #00f0ff)' : 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.9))' }} />
          <div style={{ width: '70px', height: '3px', background: isTournamentStyle ? 'linear-gradient(90deg, transparent, #ffffff)' : 'linear-gradient(90deg, transparent, #ffffff)' }} />
          <div style={{ width: '40px', height: '2px', background: isTournamentStyle ? 'linear-gradient(90deg, transparent, #00f0ff)' : 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.7))' }} />
        </div>

        {/* Horizontal Speed Lines (Right Side) */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            right: '-65px',
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
            opacity: 0.9,
            pointerEvents: 'none',
          }}
        >
          <div style={{ width: '50px', height: '2px', background: isTournamentStyle ? 'linear-gradient(-90deg, transparent, #00f0ff)' : 'linear-gradient(-90deg, transparent, rgba(255, 255, 255, 0.9))' }} />
          <div style={{ width: '70px', height: '3px', background: isTournamentStyle ? 'linear-gradient(-90deg, transparent, #ffffff)' : 'linear-gradient(-90deg, transparent, #ffffff)' }} />
          <div style={{ width: '40px', height: '2px', background: isTournamentStyle ? 'linear-gradient(-90deg, transparent, #00f0ff)' : 'linear-gradient(-90deg, transparent, rgba(255, 255, 255, 0.7))' }} />
        </div>

        {/* Main Floating Pill Badge Container */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '12px 32px 12px 14px',
            background: isTournamentStyle ? '#050d21' : '#0f0817',
            border: pillBorder,
            borderRadius: '26px',
            boxShadow: pillShadow,
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
              boxShadow: isTournamentStyle ? '0 0 22px rgba(0, 240, 255, 0.9)' : '0 0 20px rgba(255, 255, 255, 0.85)',
              flexShrink: 0,
            }}
          >
            <Trophy size={32} color={trophyColor} fill={trophyColor} strokeWidth={1.5} />
          </div>

          {/* Text Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'left' }}>
            {/* Subhead with small sparkles/accents */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: isTournamentStyle ? '#00f0ff' : '#ff3385', fontSize: '0.75rem', fontWeight: 900 }}>✦</span>
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 900,
                  color: subheadColor,
                  letterSpacing: '0.14em',
                  fontFamily: 'Outfit, sans-serif',
                  textTransform: 'uppercase',
                }}
              >
                {displaySubhead}
              </span>
              <span style={{ color: isTournamentStyle ? '#00f0ff' : '#ff3385', fontSize: '0.75rem', fontWeight: 900 }}>✦</span>
            </div>

            {/* Main Bold Italic Title */}
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
                borderBottom: titleUnderline,
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
