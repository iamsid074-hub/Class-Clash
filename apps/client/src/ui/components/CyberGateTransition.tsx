import React from 'react';
import { useGameStore } from '../../state/useGameStore';
import { Trophy } from 'lucide-react';

export const CyberGateTransition: React.FC = () => {
  const { isGateActive: isActive, isGateClosed: isClosed, gateTitle, gateSubhead, gateStyle } = useGameStore();

  const isTournamentStyle = gateStyle === 'tournament';
  const displayTitle = gateTitle || (isTournamentStyle ? 'WINTER DOOM' : 'LEADERBOARD');
  const displaySubhead = gateSubhead || (isTournamentStyle ? 'SPECIAL TOURNAMENT' : 'GLOBAL STANDINGS');

  if (!isActive) return null;

  // COLOR THEMES BASED ON TOURNAMENT VS DEFAULT
  const doorGradientLeft = isTournamentStyle
    ? 'linear-gradient(135deg, #02123d 0%, #0044cc 50%, #0066ff 100%)'
    : 'linear-gradient(135deg, #d60050 0%, #e6005c 50%, #ff0066 100%)';

  const doorGradientRight = isTournamentStyle
    ? 'linear-gradient(135deg, #0066ff 0%, #0044cc 50%, #02123d 100%)'
    : 'linear-gradient(135deg, #ff0066 0%, #e6005c 50%, #d60050 100%)';

  const seamColor = isTournamentStyle ? '#ffffff' : '#ffffff';
  const seamGlow = isTournamentStyle ? '0 0 16px #00f0ff, 0 0 30px #0066ff' : '0 0 10px rgba(255, 255, 255, 0.95)';

  const pillBorder = isTournamentStyle ? '2px solid #00f0ff' : '2px solid #ff3385';
  const pillShadow = isTournamentStyle
    ? '0 0 35px rgba(0, 240, 255, 0.85), 0 0 75px rgba(0, 102, 255, 0.6), 0 12px 40px rgba(0, 0, 0, 0.9)'
    : '0 0 35px rgba(255, 0, 102, 0.55), 0 12px 40px rgba(0, 0, 0, 0.85)';

  const ambientGlow = isTournamentStyle
    ? 'radial-gradient(circle, rgba(0, 240, 255, 0.8) 0%, rgba(0, 102, 255, 0.5) 40%, transparent 75%)'
    : 'radial-gradient(circle, rgba(255, 0, 102, 0.65) 0%, transparent 75%)';

  const trophyColor = isTournamentStyle ? '#0055ff' : '#ff0066';
  const titleUnderline = isTournamentStyle ? '2.5px solid #00f0ff' : '2.5px solid #ff0066';
  const subheadColor = isTournamentStyle ? '#00f0ff' : 'rgba(255, 255, 255, 0.9)';

  const titleFont = isTournamentStyle
    ? "-apple-system, BlinkMacSystemFont, 'Kanit', 'Outfit', 'Inter', 'SF Pro Display', sans-serif"
    : "'Misery', 'QUARTZO', 'Kanit', sans-serif";

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
      {/* 1. LEFT DIAGONAL SHUTTER DOOR */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: isTournamentStyle ? "url('/shutterdesign.png') center/cover no-repeat" : doorGradientLeft,
          clipPath: 'polygon(0 0, 60vw 0, 35vw 100%, 0 100%)',
          transform: isClosed ? 'translateX(0%)' : 'translateX(-105vw)',
          transition: 'transform 0.45s cubic-bezier(0.77, 0, 0.175, 1)',
          zIndex: 1,
        }}
      >
        {/* Halftone Dot Overlay Pattern (Default mode only) */}
        {!isTournamentStyle && (
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
        )}
      </div>

      {/* 2. RIGHT DIAGONAL SHUTTER DOOR */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: isTournamentStyle ? "url('/shutterdesign.png') center/cover no-repeat" : doorGradientRight,
          clipPath: 'polygon(60vw 0, 100vw 0, 100vw 100%, 36vw 100%)',
          transform: isClosed ? 'translateX(0%)' : 'translateX(105vw)',
          transition: 'transform 0.45s cubic-bezier(0.77, 0, 0.175, 1)',
          zIndex: 2,
        }}
      >
        {/* Halftone Dot Overlay Pattern (Default mode only) */}
        {!isTournamentStyle && (
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
          x1="60vw"
          y1="0"
          x2="35vw"
          y2="100vh"
          stroke={seamColor}
          strokeWidth="2.5"
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
            width: '540px',
            height: '190px',
            background: ambientGlow,
            borderRadius: '50%',
            filter: 'blur(35px)',
            pointerEvents: 'none',
          }}
        />

        {/* Horizontal Speed Beams (Left Side - 5 Glowing Lines) */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '-130px',
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            opacity: 0.95,
            pointerEvents: 'none',
          }}
        >
          <div style={{ width: '90px', height: '2px', background: isTournamentStyle ? 'linear-gradient(90deg, transparent, #00f0ff)' : 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.9))', boxShadow: isTournamentStyle ? '0 0 6px #00f0ff' : 'none' }} />
          <div style={{ width: '110px', height: '2px', background: isTournamentStyle ? 'linear-gradient(90deg, transparent, #00f0ff)' : 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.9))', boxShadow: isTournamentStyle ? '0 0 6px #00f0ff' : 'none' }} />
          <div style={{ width: '140px', height: '3px', background: isTournamentStyle ? 'linear-gradient(90deg, transparent, #ffffff)' : 'linear-gradient(90deg, transparent, #ffffff)', boxShadow: isTournamentStyle ? '0 0 10px #ffffff' : 'none' }} />
          <div style={{ width: '110px', height: '2px', background: isTournamentStyle ? 'linear-gradient(90deg, transparent, #00f0ff)' : 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.9))', boxShadow: isTournamentStyle ? '0 0 6px #00f0ff' : 'none' }} />
          <div style={{ width: '90px', height: '2px', background: isTournamentStyle ? 'linear-gradient(90deg, transparent, #00f0ff)' : 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.7))', boxShadow: isTournamentStyle ? '0 0 6px #00f0ff' : 'none' }} />
        </div>

        {/* Horizontal Speed Beams (Right Side - 5 Glowing Lines) */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            right: '-130px',
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            opacity: 0.95,
            pointerEvents: 'none',
          }}
        >
          <div style={{ width: '90px', height: '2px', background: isTournamentStyle ? 'linear-gradient(-90deg, transparent, #00f0ff)' : 'linear-gradient(-90deg, transparent, rgba(255, 255, 255, 0.9))', boxShadow: isTournamentStyle ? '0 0 6px #00f0ff' : 'none' }} />
          <div style={{ width: '110px', height: '2px', background: isTournamentStyle ? 'linear-gradient(-90deg, transparent, #00f0ff)' : 'linear-gradient(-90deg, transparent, rgba(255, 255, 255, 0.9))', boxShadow: isTournamentStyle ? '0 0 6px #00f0ff' : 'none' }} />
          <div style={{ width: '140px', height: '3px', background: isTournamentStyle ? 'linear-gradient(-90deg, transparent, #ffffff)' : 'linear-gradient(-90deg, transparent, #ffffff)', boxShadow: isTournamentStyle ? '0 0 10px #ffffff' : 'none' }} />
          <div style={{ width: '110px', height: '2px', background: isTournamentStyle ? 'linear-gradient(-90deg, transparent, #00f0ff)' : 'linear-gradient(-90deg, transparent, rgba(255, 255, 255, 0.9))', boxShadow: isTournamentStyle ? '0 0 6px #00f0ff' : 'none' }} />
          <div style={{ width: '90px', height: '2px', background: isTournamentStyle ? 'linear-gradient(-90deg, transparent, #00f0ff)' : 'linear-gradient(-90deg, transparent, rgba(255, 255, 255, 0.7))', boxShadow: isTournamentStyle ? '0 0 6px #00f0ff' : 'none' }} />
        </div>

        {/* Main Floating Pill Badge Container */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            gap: '18px',
            padding: '12px 34px 12px 14px',
            background: isTournamentStyle ? '#040b1e' : '#0f0817',
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
            {/* Subhead with small cyan diamond sparkles */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: isTournamentStyle ? '#00f0ff' : '#ff3385', fontSize: '0.75rem', fontWeight: 900 }}>✦</span>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 900,
                  color: subheadColor,
                  letterSpacing: '0.18em',
                  fontFamily: 'Outfit, sans-serif',
                  textTransform: 'uppercase',
                }}
              >
                {displaySubhead}
              </span>
              <span style={{ color: isTournamentStyle ? '#00f0ff' : '#ff3385', fontSize: '0.75rem', fontWeight: 900 }}>✦</span>
            </div>

            {/* Main Bold Italic Title (Clean Solid White Font) */}
            <div
              style={{
                fontSize: '1.95rem',
                fontWeight: 900,
                fontStyle: 'italic',
                fontFamily: titleFont,
                color: '#ffffff',
                lineHeight: 1.05,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                borderBottom: titleUnderline,
                paddingBottom: '3px',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
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
