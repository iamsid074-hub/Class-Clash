import React, { useState } from 'react';
import { useGameStore } from '../../state/useGameStore';
import { NetworkClient } from '../../networking/NetworkClient';
import { PinkNeonFrame } from '../components/PinkNeonFrame';
import { Copy, Check, Play, ArrowLeft, Pencil, Loader2, Sparkles, Swords } from 'lucide-react';

// 4 Distinct High-Resolution Vector Racer Avatars
const AVATAR_KEYS = ['avatar_cyber', 'avatar_ninja', 'avatar_mech', 'avatar_apex'];

const RacerAvatarSvg: React.FC<{ avatarId?: string; size?: number }> = ({ avatarId = 'avatar_cyber', size = 64 }) => {
  const index = Math.abs(
    (avatarId || 'avatar_cyber').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  ) % 4;

  switch (index) {
    case 0:
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="30" fill="#1b0826" stroke="#ff007f" strokeWidth="2.5" />
          <path d="M18 26C18 20 24 16 32 16C40 16 46 20 46 26V38C46 44 40 48 32 48C24 48 18 44 18 38V26Z" fill="#2d103d" />
          <path d="M14 26C14 24 20 22 32 22C44 22 50 24 50 26C50 31 44 33 32 33C20 33 14 31 14 26Z" fill="#ff007f" />
          <path d="M20 26H44" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
          <circle cx="32" cy="42" r="3" fill="#ff66b3" />
        </svg>
      );
    case 1:
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="30" fill="#100b21" stroke="#ff66b3" strokeWidth="2.5" />
          <path d="M16 22L32 14L48 22V42L32 50L16 42V22Z" fill="#1e163b" />
          <path d="M20 28H44V34H20V28Z" fill="#0b0818" stroke="#ff0066" strokeWidth="1.5" />
          <circle cx="26" cy="31" r="2.5" fill="#ffffff" />
          <circle cx="38" cy="31" r="2.5" fill="#ffffff" />
          <path d="M26 40H38" stroke="#ff0066" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 2:
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="30" fill="#220a2e" stroke="#ffffff" strokeWidth="2" />
          <rect x="20" y="18" width="24" height="28" rx="8" fill="#3a134d" />
          <path d="M22 24C22 22 26 20 32 20C38 20 42 22 42 24V32C42 34 38 36 32 36C26 36 22 34 22 32V24Z" fill="#ff007f" />
          <path d="M25 28L39 28" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
          <path d="M12 28H18M46 28H52" stroke="#ff66b3" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case 3:
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="30" fill="#18051e" stroke="#ffd700" strokeWidth="2.5" />
          <path d="M18 20L25 14L32 22L39 14L46 20V42H18V20Z" fill="#ff0066" />
          <path d="M22 28H42V36H22V28Z" fill="#1a0421" />
          <path d="M26 32H38" stroke="#ffd700" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="32" cy="12" r="3" fill="#ffd700" />
        </svg>
      );
  }
};

export const TeamCabinScreen: React.FC = () => {
  const { roomCode, roomPassword, playerId, players, teams, setScreen, displayName, setDisplayName, triggerGateTransition } = useGameStore();
  const [copied, setCopied] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const localPlayer = players[playerId];
  const allTeams = Object.values(teams);
  const hostTeam = allTeams[0] || { id: 't1', name: 'TEAM NEON PINK', color: '#ff007f', members: [] };
  const opponentTeam = allTeams.length > 1 ? allTeams[1] : null;

  const currentTeam = localPlayer?.teamId ? teams[localPlayer.teamId] : hostTeam;

  const rawTeamName = (currentTeam?.name || 'NEON PINK').replace(/^TEAM\s+/i, '');

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStartTournament = () => {
    if (isLaunching) return;
    setIsLaunching(true);
    NetworkClient.send({ type: 'START_TOURNAMENT', payload: {} });

    triggerGateTransition(() => {
      setScreen('MATCHMAKING_SHUFFLE');
    }, 'ENTER ARENA', 'CLASHA');
  };

  const handleBackToMenu = () => {
    triggerGateTransition(() => {
      setScreen('MAIN_MENU');
    }, 'MAIN MENU', 'CLASHA');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setDisplayName(newName);
    NetworkClient.send({
      type: 'UPDATE_PLAYER',
      payload: { displayName: newName },
    });
  };

  const handleCycleAvatar = (memberId: string, currentAvatar: string) => {
    if (memberId !== playerId) return;
    const currIndex = AVATAR_KEYS.indexOf(currentAvatar);
    const nextAvatar = AVATAR_KEYS[(currIndex + 1) % AVATAR_KEYS.length];
    NetworkClient.send({
      type: 'UPDATE_PLAYER',
      payload: { avatar: nextAvatar },
    });
  };

  return (
    <div
      className="screen-overlay"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundImage: "url('/cabin.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        padding: '24px 32px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        zIndex: 10,
        pointerEvents: 'auto',
      }}
    >
      {/* Pink Neon Architectural LED Strip Light Beam */}
      <PinkNeonFrame />

      {/* Top Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Left: Squad Badge & Room Code */}
        <div
          className="glass-panel"
          style={{
            padding: '12px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            background: 'rgba(26, 8, 30, 0.92)',
            border: '2px solid #ff66b3',
          }}
        >
          <div>
            <div style={{ fontSize: '0.75rem', color: '#ff99cc', fontWeight: 800 }}>BGMI CUSTOM LOBBY</div>
            <div
              style={{
                fontSize: '1.4rem',
                fontWeight: 900,
                color: currentTeam?.color || '#ff007f',
                textShadow: '0 0 10px rgba(255,0,127,0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span style={{ color: '#ff66b3', fontWeight: 900 }}>TEAM</span>
              <span>{rawTeamName}</span>
            </div>
          </div>

          <div style={{ borderLeft: '2px solid rgba(255,128,191,0.2)', paddingLeft: '20px', display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#ff99cc', fontWeight: 800 }}>ROOM ID</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '0.12em', color: '#ffffff' }}>
                  {roomCode}
                </span>
                <button
                  className="hud-interactive"
                  onClick={handleCopyCode}
                  style={{
                    background: 'rgba(255, 0, 127, 0.2)',
                    border: '1px solid #ff66b3',
                    color: copied ? '#ffffff' : '#ff99cc',
                    padding: '4px 8px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                  }}
                >
                  {copied ? <Check size={14} color="#ffffff" /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            <div style={{ borderLeft: '1px solid rgba(255,128,191,0.3)', paddingLeft: '20px' }}>
              <div style={{ fontSize: '0.75rem', color: '#ff99cc', fontWeight: 800 }}>ROOM PASSWORD</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '0.12em', color: '#ff0066' }}>
                {roomPassword || '1234'}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Back to Main Menu Button */}
        <button
          className="btn-secondary hud-interactive"
          onClick={handleBackToMenu}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 24px',
            fontSize: '0.95rem',
            background: 'rgba(20, 8, 26, 0.85)',
            border: '2px solid #ff66b3',
            color: '#ffffff',
            borderRadius: '12px',
            cursor: 'pointer',
            boxShadow: '0 0 15px rgba(255, 0, 127, 0.3)',
          }}
        >
          <ArrowLeft size={18} color="#ff66b3" /> BACK TO MENU
        </button>
      </div>

      {/* CENTER WALL CONTAINER: INCREASED HEIGHT BGMI DUAL TEAM TV DISPLAY SCREEN */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: 'auto 0' }}>
        <div
          style={{
            width: '1260px',
            maxWidth: '96%',
            minHeight: '460px',
            background: 'rgba(12, 10, 16, 0.95)',
            border: '7px solid #1a1a22',
            borderRadius: '20px',
            padding: '28px 32px',
            boxShadow: '0 30px 70px rgba(0, 0, 0, 0.85), inset 0 0 20px rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            position: 'relative',
          }}
        >
          {/* SQUAD 1 TV SCREEN (HOST TEAM) */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 6px' }}>
              <div style={{ fontSize: '1rem', fontWeight: 900, color: '#ff007f', letterSpacing: '0.08em' }}>
                HOST SQUAD • {hostTeam.name}
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#ff99cc' }}>
                {hostTeam.members?.length || 0}/4 RACERS
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              {[0, 1, 2, 3].map((index) => {
                const member = hostTeam.members?.[index];
                const isLocalPlayer = member?.id === playerId;
                const avatarId = member ? (players[member.id]?.avatar || member.avatar || AVATAR_KEYS[index]) : AVATAR_KEYS[index];

                return (
                  <div
                    key={index}
                    style={{
                      padding: '18px 14px',
                      textAlign: 'center',
                      borderRadius: '16px',
                      border: member
                        ? '2px solid #ff007f'
                        : '1px dashed rgba(255, 255, 255, 0.15)',
                      background: member
                        ? 'linear-gradient(180deg, rgba(50, 12, 45, 0.95) 0%, rgba(20, 8, 26, 0.95) 100%)'
                        : 'rgba(255, 255, 255, 0.02)',
                      boxShadow: member ? '0 0 20px rgba(255, 0, 127, 0.4)' : 'none',
                    }}
                  >
                    <div
                      onClick={() => member && handleCycleAvatar(member.id, avatarId)}
                      style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        margin: '4px auto 10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: isLocalPlayer ? 'pointer' : 'default',
                      }}
                    >
                      {member ? <RacerAvatarSvg avatarId={avatarId} size={64} /> : <div style={{ fontSize: '1.4rem', color: '#ff66b3', fontWeight: 900 }}>+</div>}
                    </div>

                    <div style={{ margin: '8px 0 4px', fontSize: '1.05rem', fontWeight: 900, color: '#ffffff' }}>
                      {isLocalPlayer ? (
                        <input
                          type="text"
                          value={displayName}
                          onChange={handleNameChange}
                          maxLength={16}
                          style={{
                            fontWeight: 900,
                            fontSize: '1.05rem',
                            color: '#ffffff',
                            background: 'transparent',
                            border: 'none',
                            borderBottom: '1.5px dashed #ff007f',
                            textAlign: 'center',
                            width: '90%',
                            outline: 'none',
                          }}
                        />
                      ) : (
                        member ? member.displayName : 'OPEN'
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CENTER VS EMBLEM BADGE */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 4px',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #ff0066 0%, #ff007f 100%)',
                border: '3px solid #ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 30px rgba(255, 0, 127, 0.9), inset 0 1px 2px #ffffff',
                fontSize: '1.45rem',
                fontWeight: 900,
                fontStyle: 'italic',
                fontFamily: "'Kanit', 'Outfit', sans-serif",
                color: '#ffffff',
                letterSpacing: '0.04em',
                userSelect: 'none',
              }}
            >
              VS
            </div>
          </div>

          {/* SQUAD 2 TV SCREEN (OPPONENT CHALLENGER TEAM) */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 6px' }}>
              <div style={{ fontSize: '1rem', fontWeight: 900, color: opponentTeam ? '#ff66b3' : 'rgba(255,255,255,0.6)', letterSpacing: '0.08em' }}>
                CHALLENGER SQUAD • {opponentTeam ? opponentTeam.name : 'WAITING FOR OPPONENT...'}
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#ff99cc' }}>
                {opponentTeam?.members?.length || 0}/4 RACERS
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              {[0, 1, 2, 3].map((index) => {
                const member = opponentTeam?.members?.[index];
                const avatarId = member ? (players[member.id]?.avatar || member.avatar || AVATAR_KEYS[index]) : AVATAR_KEYS[index];

                return (
                  <div
                    key={index}
                    style={{
                      padding: '18px 14px',
                      textAlign: 'center',
                      borderRadius: '16px',
                      border: member
                        ? '2px solid #ff66b3'
                        : '1px dashed rgba(255, 255, 255, 0.15)',
                      background: member
                        ? 'linear-gradient(180deg, rgba(28, 12, 36, 0.9) 0%, rgba(14, 8, 20, 0.95) 100%)'
                        : 'rgba(255, 255, 255, 0.02)',
                    }}
                  >
                    <div
                      style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        margin: '4px auto 10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {member ? <RacerAvatarSvg avatarId={avatarId} size={64} /> : <div style={{ fontSize: '1.4rem', color: 'rgba(255,255,255,0.25)', fontWeight: 900 }}>+</div>}
                    </div>

                    <div style={{ margin: '8px 0 4px', fontSize: '1.05rem', fontWeight: 900, color: member ? '#ffffff' : 'rgba(255,255,255,0.4)' }}>
                      {member ? member.displayName : 'OPEN'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM CONTROLS BAR: ENTER ARENA BUTTON WITH INSTANT PRESS FEEDBACK */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', zIndex: 20 }}>
        <button
          className="hud-interactive"
          onClick={handleStartTournament}
          disabled={isLaunching}
          style={{
            height: '56px',
            padding: '0 48px',
            borderRadius: '50px',
            fontSize: '1.15rem',
            fontWeight: 900,
            fontFamily: 'Outfit',
            letterSpacing: '0.06em',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            cursor: isLaunching ? 'wait' : 'pointer',
            background: isLaunching
              ? 'linear-gradient(135deg, #ff007f 0%, #ff3399 100%)'
              : 'linear-gradient(135deg, #ff0066 0%, #ff007f 50%, #e6005c 100%)',
            border: '2.5px solid #ffffff',
            color: '#ffffff',
            boxShadow: isLaunching
              ? '0 0 45px rgba(255, 0, 127, 0.95), inset 0 2px 4px #ffffff'
              : '0 8px 30px rgba(255, 0, 127, 0.6), inset 0 1.5px 2px #ffffff',
            transform: isLaunching ? 'scale(0.95)' : 'scale(1)',
            transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
            outline: 'none',
            userSelect: 'none',
          }}
        >
          {isLaunching ? (
            <>
              <Loader2 size={22} color="#ffffff" style={{ animation: 'spin 1s linear infinite' }} />
              <span>LAUNCHING ARENA...</span>
            </>
          ) : (
            <>
              <Play size={22} color="#ffffff" fill="#ffffff" />
              <span>Enter Arena</span>
              <Sparkles size={16} color="#ff99cc" />
            </>
          )}
        </button>
      </div>

      {/* BOTTOM LEFT CORNER EXIT ARROW BUTTON - CLEAN iOS UI */}
      <button
        className="hud-interactive"
        onClick={() => setShowExitConfirm(true)}
        title="Exit Cabin Room"
        style={{
          position: 'absolute',
          bottom: '24px',
          left: '24px',
          width: '46px',
          height: '46px',
          borderRadius: '50%',
          background: 'rgba(28, 28, 30, 0.85)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
          zIndex: 40,
        }}
      >
        <ArrowLeft size={22} color="#ffffff" strokeWidth={2.2} />
      </button>

      {/* EXIT CONFIRMATION MODAL OVERLAY - PURE iOS UI */}
      {showExitConfirm && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
          }}
        >
          <div
            style={{
              width: '360px',
              background: 'rgba(28, 28, 30, 0.94)',
              backdropFilter: 'blur(30px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '22px',
              padding: '24px',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.7)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ArrowLeft size={24} color="#ffffff" strokeWidth={2.2} />
              </div>
            </div>

            <div>
              <div
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif",
                  color: '#ffffff',
                  letterSpacing: '-0.01em',
                }}
              >
                Exit Cabin Room?
              </div>
              <div style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.65)', marginTop: '6px', fontWeight: 500, lineHeight: 1.45 }}>
                Are you sure you want to leave this room lobby and return to the main menu?
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
              <button
                className="hud-interactive"
                onClick={() => setShowExitConfirm(false)}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
                }}
              >
                Cancel
              </button>

              <button
                className="hud-interactive"
                onClick={() => {
                  setShowExitConfirm(false);
                  NetworkClient.send({ type: 'LEAVE_ROOM', payload: {} });
                  handleBackToMenu();
                }}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: '#ff3b30',
                  border: 'none',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
                }}
              >
                Exit Room
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
