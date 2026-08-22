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
    ? 'linear-gradient(135deg, #02143d 0%, #0044cc 50%, #0066ff 100%)'
    : 'linear-gradient(135deg, #d60050 0%, #e6005c 50%, #ff0066 100%)';

  const doorGradientRight = isTournamentStyle
    ? 'linear-gradient(135deg, #0066ff 0%, #0044cc 50%, #02143d 100%)'
    : 'linear-gradient(135deg, #ff0066 0%, #e6005c 50%, #d60050 100%)';

  const seamColor = isTournamentStyle ? '#00f0ff' : '#ffffff';
  const seamGlow = isTournamentStyle ? '0 0 18px #00f0ff, 0 0 35px #0066ff' : '0 0 10px rgba(255, 255, 255, 0.95)';

  const ambientGlow = isTournamentStyle
    ? 'radial-gradient(circle, rgba(0, 240, 255, 0.85) 0%, rgba(0, 102, 255, 0.55) 40%, transparent 75%)'
    : 'radial-gradient(circle, rgba(255, 0, 102, 0.65) 0%, transparent 75%)';

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
          clipPath: 'polygon(0 0, 60vw 0, 35vw 100%, 0 100%)',
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
          clipPath: 'polygon(60vw 0, 100vw 0, 100vw 100%, 36vw 100%)',
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
          x1="60vw"
          y1="0"
          x2="35vw"
          y2="100vh"
          stroke={seamColor}
          strokeWidth="3"
          style={{ filter: `drop-shadow(${seamGlow})` }}
        />
      </svg>

      {/* 4. CENTER FLOATING BADGE CARD (EXACT MATCH FOR REFERENCE IMAGE) */}
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
            width: '560px',
            height: '200px',
            background: ambientGlow,
            borderRadius: '50%',
            filter: 'blur(40px)',
            pointerEvents: 'none',
          }}
        />

        {isTournamentStyle ? (
          /* TOURNAMENT STYLE: EXACT REPLICATE OF NEW REFERENCE IMAGE (HEXAGONAL BEVELED WHITE/BLUE BANNER) */
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              background: 'linear-gradient(180deg, #ffffff 0%, #eef6ff 100%)',
              border: '2.5px solid #00d9ff',
              borderRadius: '24px',
              padding: '6px 28px 6px 6px',
              boxShadow: '0 0 30px rgba(0, 217, 255, 0.85), 0 0 60px rgba(0, 102, 255, 0.5), 0 12px 40px rgba(0, 0, 0, 0.85)',
              gap: '18px',
              minWidth: '460px',
            }}
          >
            {/* Left Hexagonal Blue Icon Box */}
            <div
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '18px',
                background: 'linear-gradient(135deg, #0066ff 0%, #0044cc 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 20px rgba(0, 102, 255, 0.6), inset 0 1px 2px rgba(255, 255, 255, 0.4)',
                flexShrink: 0,
              }}
            >
              {/* White Squircle Box with Blue Trophy Icon */}
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.15)',
                }}
              >
                <Trophy size={28} color="#0055ff" fill="#0055ff" strokeWidth={1.5} />
              </div>
            </div>

            {/* Right Text Block */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'left', flex: 1 }}>
              {/* Subhead with small dashes */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#0055ff', fontSize: '0.8rem', fontWeight: 900 }}>—</span>
                <span style={{ color: '#0055ff', fontSize: '0.72rem', fontWeight: 900 }}>✦</span>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 900,
                    color: '#0055ff',
                    letterSpacing: '0.18em',
                    fontFamily: "'Kanit', 'Outfit', sans-serif",
                    textTransform: 'uppercase',
                  }}
                >
                  {displaySubhead}
                </span>
                <span style={{ color: '#0055ff', fontSize: '0.72rem', fontWeight: 900 }}>✦</span>
                <span style={{ color: '#0055ff', fontSize: '0.8rem', fontWeight: 900 }}>—</span>
              </div>

              {/* Main Title (Clean Dark Navy Blue Bold Italic Text: WINTER DOOM) */}
              <div
                style={{
                  fontSize: '2.1rem',
                  fontWeight: 900,
                  fontStyle: 'italic',
                  fontFamily: "-apple-system, BlinkMacSystemFont, 'Kanit', 'Outfit', 'Inter', sans-serif",
                  color: '#071630',
                  lineHeight: 1.05,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  borderBottom: '2.5px solid #0055ff',
                  paddingBottom: '3px',
                }}
              >
                {displayTitle}
              </div>
            </div>
          </div>
        ) : (
          /* DEFAULT STYLE: ORIGINAL PINK PILL CARD */
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '12px 32px 12px 14px',
              background: '#0f0817',
              border: '2px solid #ff3385',
              borderRadius: '26px',
              boxShadow: '0 0 35px rgba(255, 0, 102, 0.55), 0 12px 40px rgba(0, 0, 0, 0.85)',
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
              <Trophy size={32} color="#ff0066" fill="#ff0066" strokeWidth={1.5} />
            </div>

            {/* Text Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: '#ff3385', fontSize: '0.75rem', fontWeight: 900 }}>⤺</span>
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
                <span style={{ color: '#ff3385', fontSize: '0.75rem', fontWeight: 900 }}>—</span>
              </div>

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
                  borderBottom: '2.5px solid #ff0066',
                  paddingBottom: '3px',
                }}
              >
                {displayTitle}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
