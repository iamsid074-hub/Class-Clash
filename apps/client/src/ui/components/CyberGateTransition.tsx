import React from 'react';
import { useGameStore } from '../../state/useGameStore';
import { Trophy } from 'lucide-react';

export const CyberGateTransition: React.FC = () => {
  const { isGateActive: isActive, isGateClosed: isClosed, gateTitle, gateSubhead, gateStyle } = useGameStore();

  const isTournamentStyle = gateStyle === 'tournament';
  const displayTitle = gateTitle || (isTournamentStyle ? 'WINTER DOOM' : 'LEADERBOARD');
  const displaySubhead = gateSubhead || (isTournamentStyle ? 'SPECIAL TOURNAMENT' : 'GLOBAL STANDINGS');

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
      {isTournamentStyle ? (
        /* ========================================================================= */
        /* TOURNAMENT STYLE: 100% EXACT REPLICATION OF REFERENCE IMAGE               */
        /* ========================================================================= */
        <>
          {/* 1. LEFT DIAGONAL SHUTTER DOOR (ANIME GARDEN ARENA ARTWORK + CORNER GLASS FRAMES) */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundImage: "url('/tournament_shutter_bg.png')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              clipPath: 'polygon(0 0, 60vw 0, 35vw 100%, 0 100%)',
              transform: isClosed ? 'translateX(0%)' : 'translateX(-105vw)',
              transition: 'transform 0.45s cubic-bezier(0.77, 0, 0.175, 1)',
              zIndex: 1,
            }}
          >
            {/* Top-Left Corner Thick Angled Cyber Glass Slash Frame */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '42vw',
                height: '55vh',
                background: 'linear-gradient(135deg, rgba(0, 85, 255, 0.95) 0%, rgba(0, 160, 255, 0.85) 60%, rgba(0, 220, 255, 0.4) 100%)',
                clipPath: 'polygon(0 0, 42vw 0, 0 55vh)',
                boxShadow: 'inset 0 0 30px rgba(0, 240, 255, 0.6)',
              }}
            >
              {/* Inner Glowing Slash Bars */}
              <div
                style={{
                  position: 'absolute',
                  top: '20px',
                  left: '20px',
                  display: 'flex',
                  gap: '14px',
                  transform: 'skewX(-35deg)',
                  opacity: 0.75,
                }}
              >
                <div style={{ width: '16px', height: '220px', background: '#00f0ff', boxShadow: '0 0 20px #00f0ff' }} />
                <div style={{ width: '28px', height: '220px', background: 'rgba(255, 255, 255, 0.9)', boxShadow: '0 0 15px #ffffff' }} />
                <div style={{ width: '10px', height: '220px', background: '#00f0ff', boxShadow: '0 0 15px #00f0ff' }} />
              </div>
            </div>
          </div>

          {/* 2. RIGHT DIAGONAL SHUTTER DOOR (ANIME GARDEN ARENA ARTWORK + CORNER GLASS FRAMES) */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundImage: "url('/tournament_shutter_bg.png')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              clipPath: 'polygon(60vw 0, 100vw 0, 100vw 100%, 35vw 100%)',
              transform: isClosed ? 'translateX(0%)' : 'translateX(105vw)',
              transition: 'transform 0.45s cubic-bezier(0.77, 0, 0.175, 1)',
              zIndex: 2,
            }}
          >
            {/* Bottom-Right Corner Thick Angled Cyber Glass Slash Frame */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: '42vw',
                height: '55vh',
                background: 'linear-gradient(135deg, rgba(0, 220, 255, 0.4) 0%, rgba(0, 160, 255, 0.85) 40%, rgba(0, 85, 255, 0.95) 100%)',
                clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
                boxShadow: 'inset 0 0 30px rgba(0, 240, 255, 0.6)',
              }}
            >
              {/* Inner Glowing Slash Bars */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '20px',
                  right: '20px',
                  display: 'flex',
                  gap: '14px',
                  transform: 'skewX(-35deg)',
                  opacity: 0.75,
                }}
              >
                <div style={{ width: '10px', height: '220px', background: '#00f0ff', boxShadow: '0 0 15px #00f0ff' }} />
                <div style={{ width: '28px', height: '220px', background: 'rgba(255, 255, 255, 0.9)', boxShadow: '0 0 15px #ffffff' }} />
                <div style={{ width: '16px', height: '220px', background: '#00f0ff', boxShadow: '0 0 20px #00f0ff' }} />
              </div>
            </div>
          </div>

          {/* 3. DIAGONAL SEAM GLOWING CYAN LASER LINE OVERLAY */}
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
              stroke="#00f0ff"
              strokeWidth="4"
              style={{ filter: 'drop-shadow(0 0 16px #00ffff) drop-shadow(0 0 30px #0066ff)' }}
            />
          </svg>

          {/* 4. CENTER FLOATING SCI-FI HEXAGONAL BANNER BADGE (EXACT REPLICATE OF REFERENCE IMAGE) */}
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
            {/* Soft Radial Cyan Ambient Glow */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '600px',
                height: '220px',
                background: 'radial-gradient(circle, rgba(0, 240, 255, 0.9) 0%, rgba(0, 102, 255, 0.6) 45%, transparent 75%)',
                borderRadius: '50%',
                filter: 'blur(45px)',
                pointerEvents: 'none',
              }}
            />

            {/* Main Hexagonal Beveled Banner Outer Container */}
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                minWidth: '580px',
                height: '84px',
                background: 'linear-gradient(180deg, #ffffff 0%, #e8f4ff 100%)',
                border: '2.5px solid #00d9ff',
                boxShadow: '0 0 35px rgba(0, 217, 255, 0.95), 0 0 75px rgba(0, 102, 255, 0.65), 0 12px 40px rgba(0, 0, 0, 0.85)',
                clipPath: 'polygon(24px 0, calc(100% - 24px) 0, 100% 50%, calc(100% - 24px) 100%, 24px 100%, 0 50%)',
              }}
            >
              {/* Left Blue Hexagonal Icon Container */}
              <div
                style={{
                  width: '105px',
                  height: '100%',
                  background: 'linear-gradient(135deg, #0066ff 0%, #003db3 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'inset -2px 0 10px rgba(0,0,0,0.2)',
                  flexShrink: 0,
                  clipPath: 'polygon(24px 0, 100% 0, 100% 100%, 24px 100%, 0 50%)',
                  paddingLeft: '12px',
                }}
              >
                {/* White Squircle Box with Blue Trophy Icon */}
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '16px',
                    background: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
                  }}
                >
                  <Trophy size={32} color="#0052cc" fill="#0052cc" strokeWidth={1.5} />
                </div>
              </div>

              {/* Center Main White/Ice Text Banner Container */}
              <div
                style={{
                  flex: 1,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '0 24px',
                  textAlign: 'center',
                }}
              >
                {/* Subhead with small dashes */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#0052cc', fontSize: '0.85rem', fontWeight: 900 }}>—</span>
                  <span style={{ color: '#0052cc', fontSize: '0.75rem', fontWeight: 900 }}>✦</span>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 900,
                      color: '#0052cc',
                      letterSpacing: '0.2em',
                      fontFamily: "'Kanit', 'Outfit', sans-serif",
                      textTransform: 'uppercase',
                    }}
                  >
                    {displaySubhead}
                  </span>
                  <span style={{ color: '#0052cc', fontSize: '0.75rem', fontWeight: 900 }}>✦</span>
                  <span style={{ color: '#0052cc', fontSize: '0.85rem', fontWeight: 900 }}>—</span>
                </div>

                {/* Main Title (Clean Dark Navy Blue Bold Italic Text: WINTER DOOM) */}
                <div
                  style={{
                    fontSize: '2.2rem',
                    fontWeight: 900,
                    fontStyle: 'italic',
                    fontFamily: "-apple-system, BlinkMacSystemFont, 'Kanit', 'Outfit', 'Inter', sans-serif",
                    color: '#081733',
                    lineHeight: 1.0,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    borderBottom: '2.5px solid #0052cc',
                    paddingBottom: '2px',
                    marginTop: '2px',
                  }}
                >
                  {displayTitle}
                </div>
              </div>

              {/* Right Cyan Faceted Wing Bracket */}
              <div
                style={{
                  width: '45px',
                  height: '100%',
                  background: 'linear-gradient(135deg, #00d9ff 0%, #0066ff 100%)',
                  clipPath: 'polygon(0 0, calc(100% - 24px) 0, 100% 50%, calc(100% - 24px) 100%, 0 100%)',
                  flexShrink: 0,
                }}
              />
            </div>
          </div>
        </>
      ) : (
        /* ========================================================================= */
        /* DEFAULT STYLE: ORIGINAL PINK PILL CARD & SHUTTER                          */
        /* ========================================================================= */
        <>
          {/* 1. LEFT DIAGONAL SHUTTER DOOR */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'linear-gradient(135deg, #d60050 0%, #e6005c 50%, #ff0066 100%)',
              clipPath: 'polygon(0 0, 64vw 0, 36vw 100%, 0 100%)',
              transform: isClosed ? 'translateX(0%)' : 'translateX(-105vw)',
              transition: 'transform 0.45s cubic-bezier(0.77, 0, 0.175, 1)',
              zIndex: 1,
            }}
          >
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
          </div>

          {/* 2. RIGHT DIAGONAL SHUTTER DOOR */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'linear-gradient(135deg, #ff0066 0%, #e6005c 50%, #d60050 100%)',
              clipPath: 'polygon(64vw 0, 100vw 0, 100vw 100%, 36vw 100%)',
              transform: isClosed ? 'translateX(0%)' : 'translateX(105vw)',
              transition: 'transform 0.45s cubic-bezier(0.77, 0, 0.175, 1)',
              zIndex: 2,
            }}
          >
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
          </div>

          {/* 3. DIAGONAL SEAM GLOWING LINE */}
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
              stroke="#ffffff"
              strokeWidth="3.5"
              style={{ filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.95))' }}
            />
          </svg>

          {/* 4. CENTER FLOATING PINK PILL BADGE */}
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
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '480px',
                height: '160px',
                background: 'radial-gradient(circle, rgba(255, 0, 102, 0.65) 0%, transparent 75%)',
                borderRadius: '50%',
                filter: 'blur(30px)',
                pointerEvents: 'none',
              }}
            />

            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '12px 28px 12px 14px',
                background: '#0f0817',
                border: '2px solid #ff3385',
                borderRadius: '26px',
                boxShadow: '0 0 35px rgba(255, 0, 102, 0.55), 0 12px 40px rgba(0, 0, 0, 0.85)',
              }}
            >
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
          </div>
        </>
      )}
    </div>
  );
};
