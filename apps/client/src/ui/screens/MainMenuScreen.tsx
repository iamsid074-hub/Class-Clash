import React, { useState } from 'react';
import { useGameStore } from '../../state/useGameStore';
import { NetworkClient } from '../../networking/NetworkClient';
import { ClassClashLogo } from '../components/ClassClashLogo';
import { PinkNeonFrame } from '../components/PinkNeonFrame';
import { Plus, ArrowRight, User, Trophy, Settings, X, Snowflake, Calendar, ShieldCheck, CheckCircle2, Flame, Home, ChevronLeft, ChevronRight, Sparkles, Megaphone, Zap, Lock, Copy, Check, Share2, Gift, FileText } from 'lucide-react';

export const MainMenuScreen: React.FC = () => {
  const { displayName, setDisplayName, setScreen, setRoomCode, setRoomPassword, setCabinName, isJoiningCabin, setIsJoiningCabin, initializeLocalRoom, triggerGateTransition, playFullscreenVideo, errorMessage, setErrorMessage } = useGameStore();
  const [createCabinNameInput, setCreateCabinNameInput] = useState(() => {
    try {
      return localStorage.getItem('clasha_selected_cabin_name') || 'Cyberpunk Neon Cabin';
    } catch {
      return 'Cyberpunk Neon Cabin';
    }
  });
  const [createRoomIdInput, setCreateRoomIdInput] = useState('');
  const [createPasswordInput, setCreatePasswordInput] = useState('');
  const [joinRoomIdInput, setJoinRoomIdInput] = useState('');
  const [joinPasswordInput, setJoinPasswordInput] = useState('');
  const [profileNameInput, setProfileNameInput] = useState(displayName || 'RACER_ONE');
  const [activeModal, setActiveModal] = useState<'NONE' | 'CREATE' | 'JOIN' | 'TOURNAMENT'>('NONE');
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  // Apple-Style Referral Bottom Sheet State
  const [isReferralSheetOpen, setIsReferralSheetOpen] = useState(false);
  const [showTncView, setShowTncView] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const userReferralCode = React.useMemo(() => {
    const cleanName = (displayName || 'RACER').toUpperCase().replace(/[^A-Z0-9]/g, '');
    return `CLASHA-${cleanName.slice(0, 6)}10`;
  }, [displayName]);

  // Interactive Event Announcements Carousel State
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const eventSlides = [
    {
      id: 'winter_doom',
      tag: 'FEATURED EVENT',
      title: 'WINTER DOOM CHAMPIONSHIP',
      subtitle: '$10,000 Prize Pool • Enrollment Open Now!',
      badgeColor: '#70e1ff',
      borderColor: '#70e1ff',
      bgGradient: 'linear-gradient(135deg, rgba(12, 28, 48, 0.94) 0%, rgba(6, 18, 32, 0.96) 100%)',
      icon: Snowflake,
      action: () => {
        triggerGateTransition(
          () => {
            setActiveModal('NONE');
            setScreen('WINTER_DOOM');
            playFullscreenVideo('/videos/t2.mp4', 'WINTER DOOM • INTRO ANNOUNCEMENT (t2)');
          },
          'WINTER DOOM',
          'TOURNAMENT CHAMPIONSHIP',
          '/shutterdesign.png'
        );
      },
    },
    {
      id: 'cyber_season',
      tag: 'NEW SEASON 1',
      title: 'CYBER SPEEDWAY RACE',
      subtitle: '2X XP Double Reward Event • Unlock Karts!',
      badgeColor: '#ff0066',
      borderColor: '#ff0066',
      bgGradient: 'linear-gradient(135deg, rgba(40, 10, 30, 0.94) 0%, rgba(20, 5, 15, 0.96) 100%)',
      icon: Flame,
      action: () => setScreen('LEADERBOARD'),
    },
    {
      id: 'global_clash',
      tag: 'WEEKLY LEADERBOARD',
      title: 'GLOBAL RACERS CHAMPIONSHIP',
      subtitle: 'Compete for #1 Rank & Exclusive Badges!',
      badgeColor: '#ff9500',
      borderColor: '#ff9500',
      bgGradient: 'linear-gradient(135deg, rgba(38, 24, 6, 0.94) 0%, rgba(18, 10, 2, 0.96) 100%)',
      icon: Trophy,
      action: () => setScreen('LEADERBOARD'),
    },
  ];

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % eventSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [eventSlides.length]);
  // Ambient 60fps Floating Petal / Ember Canvas Particle Engine
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      rotation: number;
      rotationSpeed: number;
      opacity: number;
      color: string;
    }> = [];

    const colors = ['#ff0066', '#ff66b3', '#ffffff', '#ff99cc', '#ff1a75'];

    for (let i = 0; i < 45; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 5 + 2,
        speedX: (Math.random() - 0.5) * 0.8 + 0.3,
        speedY: (Math.random() - 0.5) * 0.6 - 0.4,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        opacity: Math.random() * 0.7 + 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        if (p.x > width + 20) p.x = -20;
        if (p.x < -20) p.x = width + 20;
        if (p.y > height + 20) p.y = -20;
        if (p.y < -20) p.y = height + 20;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;

        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleCreateRoom = () => {
    if (isJoiningCabin) return; // Prevent double-submit
    const finalCabinId = createRoomIdInput.trim().toUpperCase() || ('ROOM_' + Math.floor(Math.random() * 899 + 100));
    const finalPassword = createPasswordInput.trim();
    const finalName = profileNameInput.trim() || displayName || 'HOST RACER';
    const finalCabinName = createCabinNameInput.trim() || `${finalName}'s Cabin`;
    setErrorMessage(null);
    setIsJoiningCabin(true);

    const selectedTemplate = (() => {
      try {
        const id = localStorage.getItem('clasha_selected_cabin');
        if (id === 'neon_arena_2' || id === 'cabin_2') return 'cabin_2';
      } catch {
        // ignore
      }
      return 'cabin_1';
    })();

    // Send CREATE_CABIN to server
    NetworkClient.createCabin({
      cabinId: finalCabinId,
      cabinName: finalCabinName,
      password: finalPassword,
      displayName: finalName,
      avatar: 'avatar_cyber',
      cabinTemplate: selectedTemplate,
    });

    // Safety timeout: reset loading if server response takes more than 6s
    setTimeout(() => {
      if (useGameStore.getState().isJoiningCabin) {
        useGameStore.getState().setIsJoiningCabin(false);
        useGameStore.getState().setErrorMessage('SERVER RESPONSE TIMED OUT! PLEASE RETRY.');
      }
    }, 6000);
  };

  const handleJoinRoom = () => {
    if (isJoiningCabin) return; // Prevent double-submit
    if (!joinRoomIdInput.trim()) {
      setErrorMessage('PLEASE ENTER A VALID CABIN ID!');
      return;
    }
    const finalCabinId = joinRoomIdInput.trim().toUpperCase();
    const finalPassword = joinPasswordInput.trim();
    const finalName = profileNameInput.trim() || displayName || 'GUEST RACER';
    setErrorMessage(null);
    setIsJoiningCabin(true);

    // Send JOIN_CABIN to server
    NetworkClient.joinCabin({
      cabinId: finalCabinId,
      password: finalPassword,
      displayName: finalName,
      avatar: 'avatar_neon',
    });

    // Safety timeout: reset loading if server response takes more than 6s
    setTimeout(() => {
      if (useGameStore.getState().isJoiningCabin) {
        useGameStore.getState().setIsJoiningCabin(false);
        useGameStore.getState().setErrorMessage('SERVER RESPONSE TIMED OUT! PLEASE RETRY.');
      }
    }, 6000);
  };

  const handleSaveProfile = () => {
    if (profileNameInput.trim()) {
      setDisplayName(profileNameInput.trim());
    }
    setActiveModal('NONE');
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
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '36px 48px',
        boxSizing: 'border-box',
        zIndex: 10,
        overflow: 'hidden',
        background: '#0a0a0f',
      }}
    >
      {/* FULL UNTOUCHED ORIGINAL RAW BACKGROUND IMAGE */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: "url('/homepage.jpg?v=10')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: 1,
        }}
      />
      {/* Pink Neon Architectural LED Strip Light Beam */}
      <PinkNeonFrame />

      {/* 1. TOP-LEFT LOGO EMBLEM & TITLE (FLUSH TOP-LEFT CORNER BANNER) */}
      <div
        style={{
          position: 'absolute',
          top: '0px',
          left: '0px',
          zIndex: 25,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '18px',
          padding: '14px 30px 14px 22px',
          background: 'linear-gradient(135deg, rgba(24, 24, 30, 0.94) 0%, rgba(16, 16, 20, 0.94) 100%)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderRadius: '0 0 24px 0',
          borderRight: '2px solid #ff0066',
          borderBottom: '2px solid #ff0066',
          borderTop: 'none',
          borderLeft: 'none',
          boxShadow: '0 0 22px rgba(255, 0, 102, 0.55), 0 12px 32px rgba(0, 0, 0, 0.75)',
        }}
      >
        <ClassClashLogo size={42} />
        <h1
          style={{
            fontSize: '2.2rem',
            fontWeight: 900,
            fontStyle: 'italic',
            fontFamily: "'Vandria', 'Bebas Neue', 'Anton', 'Misery', 'QUARTZO', 'Kanit', sans-serif",
            letterSpacing: '0.04em',
            margin: 0,
            display: 'flex',
            gap: '0px',
            textTransform: 'uppercase',
            lineHeight: 1,
          }}
        >
          <span style={{ color: '#ffffff' }}>CLA</span>
          <span style={{ color: '#ff0066' }}>SHA</span>
        </h1>
      </div>

      {/* 2. RIGHT SIDE EDGE DIAGONAL RECTANGLE BUTTONS (RESPONSIVE SCALING FOR ALL LAPTOPS) */}
      <div
        style={{
          position: 'absolute',
          right: 'clamp(16px, 3.5vw, 48px)',
          top: '52%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(8px, 1.6vh, 22px)',
          alignItems: 'flex-end',
          zIndex: 20,
          maxHeight: '85vh',
          justifyContent: 'center',
        }}
      >
        {/* BUTTON 1: CREATE ROOM */}
        <button
          className="diagonal-menu-btn"
          onClick={() => setActiveModal('CREATE')}
        >
          <div className="diagonal-menu-btn-content">
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 'clamp(1.15rem, 1.4vw, 1.65rem)', fontWeight: 900, fontStyle: 'italic', color: '#ffffff', fontFamily: "'Vandria', 'Bebas Neue', 'Anton', 'Misery', 'QUARTZO', 'Kanit', sans-serif", letterSpacing: '0.04em' }}>
                CREATE ROOM
              </div>
              <div style={{ fontSize: 'clamp(0.72rem, 0.8vw, 0.85rem)', fontWeight: 800, color: 'rgba(255, 255, 255, 0.85)', letterSpacing: '0.08em', marginTop: '2px' }}>
                HOST NEW CABIN
              </div>
            </div>
            <Plus size={28} color="#ffffff" strokeWidth={3.2} />
          </div>
        </button>

        {/* BUTTON 2: JOIN ROOM */}
        <button
          className="diagonal-menu-btn"
          onClick={() => setActiveModal('JOIN')}
        >
          <div className="diagonal-menu-btn-content">
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 'clamp(1.15rem, 1.4vw, 1.65rem)', fontWeight: 900, fontStyle: 'italic', color: '#ffffff', fontFamily: "'Vandria', 'Bebas Neue', 'Anton', 'Misery', 'QUARTZO', 'Kanit', sans-serif", letterSpacing: '0.04em' }}>
                JOIN ROOM
              </div>
              <div style={{ fontSize: 'clamp(0.72rem, 0.8vw, 0.85rem)', fontWeight: 800, color: 'rgba(255, 255, 255, 0.85)', letterSpacing: '0.08em', marginTop: '2px' }}>
                ENTER ROOM CODE
              </div>
            </div>
            <ArrowRight size={28} color="#ffffff" strokeWidth={3.2} />
          </div>
        </button>

        {/* BUTTON 3: PLAYER PROFILE */}
        <button
          className="diagonal-menu-btn"
          onClick={() => triggerGateTransition(() => setScreen('PROFILE'), 'PLAYER PROFILE', 'RACER DASHBOARD')}
        >
          <div className="diagonal-menu-btn-content">
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 'clamp(1.15rem, 1.4vw, 1.65rem)', fontWeight: 900, fontStyle: 'italic', color: '#ffffff', fontFamily: "'Vandria', 'Bebas Neue', 'Anton', 'Misery', 'QUARTZO', 'Kanit', sans-serif", letterSpacing: '0.04em' }}>
                PROFILE
              </div>
              <div style={{ fontSize: 'clamp(0.72rem, 0.8vw, 0.85rem)', fontWeight: 800, color: 'rgba(255, 255, 255, 0.85)', letterSpacing: '0.08em', marginTop: '2px' }}>
                {displayName || 'RACER PROFILE'}
              </div>
            </div>
            <User size={28} color="#ffffff" strokeWidth={3.2} />
          </div>
        </button>

        {/* BUTTON 4: LEADERBOARD */}
        <button
          className="diagonal-menu-btn"
          onClick={() => triggerGateTransition(() => setScreen('LEADERBOARD'), 'LEADERBOARD', 'GLOBAL STANDINGS')}
        >
          <div className="diagonal-menu-btn-content">
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 'clamp(1.15rem, 1.4vw, 1.65rem)', fontWeight: 900, fontStyle: 'italic', color: '#ffffff', fontFamily: "'Vandria', 'Bebas Neue', 'Anton', 'Misery', 'QUARTZO', 'Kanit', sans-serif", letterSpacing: '0.04em' }}>
                LEADERBOARD
              </div>
              <div style={{ fontSize: 'clamp(0.72rem, 0.8vw, 0.85rem)', fontWeight: 800, color: 'rgba(255, 255, 255, 0.85)', letterSpacing: '0.08em', marginTop: '2px' }}>
                GLOBAL RANKINGS
              </div>
            </div>
            <Trophy size={28} color="#ffffff" strokeWidth={3.2} />
          </div>
        </button>

        {/* BUTTON 5: SETTINGS */}
        <button
          className="diagonal-menu-btn"
          onClick={() => triggerGateTransition(() => setScreen('SETTINGS'), 'GAME SETTINGS', 'PREFERENCES')}
        >
          <div className="diagonal-menu-btn-content">
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 'clamp(1.15rem, 1.4vw, 1.65rem)', fontWeight: 900, fontStyle: 'italic', color: '#ffffff', fontFamily: "'Vandria', 'Bebas Neue', 'Anton', 'Misery', 'QUARTZO', 'Kanit', sans-serif", letterSpacing: '0.04em' }}>
                SETTINGS
              </div>
              <div style={{ fontSize: 'clamp(0.72rem, 0.8vw, 0.85rem)', fontWeight: 800, color: 'rgba(255, 255, 255, 0.85)', letterSpacing: '0.08em', marginTop: '2px' }}>
                AUDIO & GRAPHICS
              </div>
            </div>
            <Settings size={28} color="#ffffff" strokeWidth={3.2} />
          </div>
        </button>
      </div>

      {/* 3. DIAGONAL FROSTED GLASS ACTION MODALS */}
      {activeModal !== 'NONE' && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(5, 7, 14, 0.65)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 40,
          }}
        >
          <div
            className="panel-slide-in"
            style={{
              width: activeModal === 'CREATE' ? '980px' : activeModal === 'JOIN' ? '480px' : activeModal === 'TOURNAMENT' ? '880px' : '440px',
              maxWidth: '95vw',
              background: activeModal === 'TOURNAMENT' 
                ? 'linear-gradient(145deg, rgba(8, 22, 40, 0.97) 0%, rgba(4, 12, 24, 0.98) 100%)' 
                : 'linear-gradient(135deg, rgba(22, 12, 30, 0.96) 0%, rgba(12, 6, 18, 0.98) 100%)',
              border: activeModal === 'TOURNAMENT' ? '2px solid #70e1ff' : '2px solid #ff0066',
              borderRadius: '36px',
              padding: activeModal === 'CREATE' ? '36px 40px' : '32px 36px',
              boxShadow: '0 25px 70px rgba(0, 0, 0, 0.85)',
              position: 'relative',
              boxSizing: 'border-box',
            }}
          >
            {/* Close X Button */}
            <button
              onClick={() => setActiveModal('NONE')}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#ffffff',
                zIndex: 20,
              }}
            >
              <X size={20} color="#ffffff" />
            </button>

            {/* ====================================================================== */}
            {/* MODAL 1: CREATE ROOM (2-COLUMN CARD WITH CABIN IMAGE PREVIEW)         */}
            {/* ====================================================================== */}
            {activeModal === 'CREATE' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 1fr', gap: '28px', width: '100%' }}>
                {/* LEFT CARD: CABIN PREVIEW FRAME (DYNAMICAL FROM PROFILE SELECTION) */}
                <div
                  style={{
                    background: '#181224',
                    border: '1.5px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '28px',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '16px',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
                    textAlign: 'left',
                  }}
                >
                  {(() => {
                    const selectedCabin = (() => {
                      try {
                        const id = localStorage.getItem('clasha_selected_cabin');
                        if (id === 'neon_arena_2') {
                          return { name: 'NEON SPEEDWAY ARENA', img: '/cabin2.jpeg' };
                        }
                      } catch {
                        // ignore
                      }
                      return { name: 'CYBERPUNK NEON CABIN', img: '/cabin1.png' };
                    })();

                    return (
                      <>
                        <div
                          style={{
                            width: '100%',
                            height: '275px',
                            borderRadius: '22px',
                            overflow: 'hidden',
                            border: '2px solid rgba(255, 0, 102, 0.45)',
                            position: 'relative',
                            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.65)',
                            background: '#0d0714',
                          }}
                        >
                          <img
                            src={selectedCabin.img}
                            alt={selectedCabin.name}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              display: 'block',
                            }}
                          />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '4px 4px 0 4px' }}>
                          <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#ff0066', letterSpacing: '0.14em' }}>
                            SELECTED CABIN
                          </div>
                          <div style={{ fontSize: '1.85rem', fontWeight: 900, fontStyle: 'italic', color: '#ffffff', fontFamily: "'Vandria', 'Bebas Neue', 'Anton', 'Misery', 'QUARTZO', 'Kanit', sans-serif", letterSpacing: '0.04em', lineHeight: 1.1 }}>
                            {selectedCabin.name}
                          </div>
                          <div style={{ fontSize: '1rem', color: '#34c759', fontWeight: 900, letterSpacing: '0.1em', marginTop: '2px' }}>
                            FREE
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>

                {/* RIGHT CARD: ROOM DETAILS INPUT FORM */}
                <div
                  style={{
                    background: '#181224',
                    border: '1.5px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '28px',
                    padding: '30px 34px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '20px',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
                    textAlign: 'left',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#ff0066', letterSpacing: '0.14em' }}>
                      HOST A NEW MATCH
                    </div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 900, fontStyle: 'italic', color: '#ffffff', fontFamily: "'Vandria', 'Bebas Neue', 'Anton', 'Misery', 'QUARTZO', 'Kanit', sans-serif", marginTop: '2px' }}>
                      CREATE CABIN
                    </div>
                  </div>

                  {errorMessage && (
                    <div
                      style={{
                        background: 'rgba(255, 51, 102, 0.15)',
                        border: '1.5px solid #ff3366',
                        borderRadius: '10px',
                        padding: '10px 14px',
                        color: '#ff6688',
                        fontSize: '0.85rem',
                        fontWeight: 800,
                      }}
                    >
                      ⚠️ {errorMessage}
                    </div>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 900, color: 'rgba(255, 255, 255, 0.7)', letterSpacing: '0.06em' }}>
                          CABIN NAME
                        </label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', fontWeight: 800, color: '#ff3366' }}>
                          <Lock size={12} color="#ff3366" />
                          <span>LOCKED</span>
                        </div>
                      </div>
                      <div
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          borderRadius: '12px',
                          border: '1.5px solid rgba(255, 255, 255, 0.12)',
                          background: 'rgba(255, 255, 255, 0.06)',
                          color: 'rgba(255, 255, 255, 0.65)',
                          fontWeight: 900,
                          fontSize: '1.05rem',
                          cursor: 'not-allowed',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          boxSizing: 'border-box',
                        }}
                      >
                        <span>{createCabinNameInput}</span>
                        <Lock size={16} color="rgba(255, 255, 255, 0.4)" />
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 900, color: 'rgba(255, 255, 255, 0.7)', letterSpacing: '0.06em' }}>
                        CREATE CABIN ID
                      </label>
                      <input
                        type="text"
                        value={createRoomIdInput}
                        onChange={(e) => {
                          setCreateRoomIdInput(e.target.value.toUpperCase());
                          if (errorMessage) setErrorMessage(null);
                        }}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          borderRadius: '12px',
                          border: '1.5px solid rgba(255, 255, 255, 0.2)',
                          background: 'rgba(0, 0, 0, 0.4)',
                          color: '#ffffff',
                          fontWeight: 900,
                          fontSize: '1.15rem',
                          outline: 'none',
                          marginTop: '4px',
                          boxSizing: 'border-box',
                          letterSpacing: '0.08em',
                        }}
                        placeholder="ENTER CABIN ID"
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 900, color: 'rgba(255, 255, 255, 0.7)', letterSpacing: '0.06em' }}>
                        SET CABIN PASSWORD
                      </label>
                      <input
                        type="text"
                        value={createPasswordInput}
                        onChange={(e) => setCreatePasswordInput(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          borderRadius: '12px',
                          border: '1.5px solid rgba(255, 255, 255, 0.2)',
                          background: 'rgba(0, 0, 0, 0.4)',
                          color: '#ffffff',
                          fontWeight: 900,
                          fontSize: '1.15rem',
                          outline: 'none',
                          marginTop: '4px',
                          boxSizing: 'border-box',
                        }}
                        placeholder="ENTER PASSWORD"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCreateRoom}
                    disabled={isJoiningCabin}
                    style={{
                      width: '100%',
                      height: '52px',
                      borderRadius: '14px',
                      background: isJoiningCabin ? 'rgba(255, 0, 102, 0.5)' : 'linear-gradient(135deg, #ff0066 0%, #ff3385 100%)',
                      border: 'none',
                      color: '#ffffff',
                      fontWeight: 900,
                      fontSize: '1.15rem',
                      fontStyle: 'italic',
                      fontFamily: "'Vandria', 'Bebas Neue', 'Anton', 'Misery', 'QUARTZO', 'Kanit', sans-serif",
                      cursor: isJoiningCabin ? 'wait' : 'pointer',
                      letterSpacing: '0.06em',
                      opacity: isJoiningCabin ? 0.7 : 1,
                    }}
                  >
                    {isJoiningCabin ? 'CREATING...' : 'CREATE CABIN NOW'}
                  </button>
                </div>
              </div>
            )}

            {/* ====================================================================== */}
            {/* MODAL 2: JOIN CABIN (CLEAN COMPACT CARD)                              */}
            {/* ====================================================================== */}
            {activeModal === 'JOIN' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#ff0066', letterSpacing: '0.14em' }}>
                    CONNECT TO CABIN
                  </div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 900, fontStyle: 'italic', color: '#ffffff', fontFamily: "'Vandria', 'Bebas Neue', 'Anton', 'Misery', 'QUARTZO', 'Kanit', sans-serif", marginTop: '2px' }}>
                    JOIN CABIN
                  </div>
                </div>

                {errorMessage && (
                  <div
                    style={{
                      background: 'rgba(255, 51, 102, 0.15)',
                      border: '1.5px solid #ff3366',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      color: '#ff6688',
                      fontSize: '0.85rem',
                      fontWeight: 800,
                    }}
                  >
                    ⚠️ {errorMessage}
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 900, color: 'rgba(255, 255, 255, 0.7)', letterSpacing: '0.06em' }}>
                      ENTER CABIN ID
                    </label>
                    <input
                      type="text"
                      value={joinRoomIdInput}
                      onChange={(e) => {
                        setJoinRoomIdInput(e.target.value.toUpperCase());
                        if (errorMessage) setErrorMessage(null);
                      }}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '1.5px solid rgba(255, 255, 255, 0.2)',
                        background: 'rgba(0, 0, 0, 0.4)',
                        color: '#ffffff',
                        fontWeight: 900,
                        fontSize: '1.15rem',
                        letterSpacing: '0.08em',
                        outline: 'none',
                        marginTop: '4px',
                        boxSizing: 'border-box',
                      }}
                      placeholder="ENTER CABIN ID"
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 900, color: 'rgba(255, 255, 255, 0.7)', letterSpacing: '0.06em' }}>
                      ENTER CABIN PASSWORD
                    </label>
                    <input
                      type="text"
                      value={joinPasswordInput}
                      onChange={(e) => {
                        setJoinPasswordInput(e.target.value);
                        if (errorMessage) setErrorMessage(null);
                      }}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '1.5px solid rgba(255, 255, 255, 0.2)',
                        background: 'rgba(0, 0, 0, 0.4)',
                        color: '#ffffff',
                        fontWeight: 900,
                        fontSize: '1.15rem',
                        outline: 'none',
                        marginTop: '4px',
                        boxSizing: 'border-box',
                      }}
                      placeholder="ENTER PASSWORD"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleJoinRoom}
                  disabled={isJoiningCabin}
                  style={{
                    width: '100%',
                    height: '52px',
                    borderRadius: '14px',
                    background: isJoiningCabin ? 'rgba(255, 0, 102, 0.5)' : 'linear-gradient(135deg, #ff0066 0%, #ff3385 100%)',
                    border: 'none',
                    color: '#ffffff',
                    fontWeight: 900,
                    fontSize: '1.15rem',
                    fontStyle: 'italic',
                    fontFamily: "'Vandria', 'Bebas Neue', 'Anton', 'Misery', 'QUARTZO', 'Kanit', sans-serif",
                    cursor: isJoiningCabin ? 'wait' : 'pointer',
                    letterSpacing: '0.06em',
                    marginTop: '4px',
                    opacity: isJoiningCabin ? 0.7 : 1,
                  }}
                >
                  {isJoiningCabin ? 'JOINING...' : 'JOIN CABIN NOW'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2.5 EVENT ANNOUNCEMENT BANNER CAROUSEL (CLICK OPENS APPLE-STYLE REFERRAL SHEET) */}
      {(() => {
        const boxImages = ['/box1.jpeg', '/box2.jpeg'];
        const activeImg = boxImages[currentSlideIndex % boxImages.length];
        return (
          <div
            onClick={() => setIsReferralSheetOpen(true)}
            style={{
              position: 'absolute',
              bottom: '100px',
              left: '36px',
              width: '340px',
              height: '215px',
              zIndex: 25,
              background: 'rgba(20, 20, 26, 0.92)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderRadius: '20px',
              border: '1.5px solid rgba(255, 255, 255, 0.25)',
              boxShadow: '0 10px 36px rgba(0, 0, 0, 0.7)',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxSizing: 'border-box',
              cursor: 'pointer',
              transition: 'transform 0.2s ease, boxShadow 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.boxShadow = '0 14px 40px rgba(0, 242, 254, 0.35)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 10px 36px rgba(0, 0, 0, 0.7)';
            }}
          >
            {/* Slide Image (Full 100% Image Size Fit) */}
            <img
              key={activeImg}
              src={`${activeImg}?v=4`}
              alt="Event Announcement Banner"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'fill',
                display: 'block',
                transition: 'opacity 0.4s ease',
              }}
            />



            {/* Pagination Indicator Dots (Bottom-Right) */}
            <div
              style={{
                position: 'absolute',
                bottom: '10px',
                right: '12px',
                display: 'flex',
                gap: '5px',
                zIndex: 5,
                background: 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(6px)',
                padding: '3px 8px',
                borderRadius: '50px',
              }}
            >
              {boxImages.map((_, idx) => (
                <div
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentSlideIndex(idx);
                  }}
                  style={{
                    width: idx === currentSlideIndex % boxImages.length ? '14px' : '5px',
                    height: '5px',
                    borderRadius: '50px',
                    background: idx === currentSlideIndex % boxImages.length ? '#ffffff' : 'rgba(255, 255, 255, 0.35)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                  }}
                />
              ))}
            </div>
          </div>
        );
      })()}

      {/* 3. BOTTOM-LEFT ICE & FROST WINTER BADGE (SKY BLUE WINTER DOOM BUTTON) */}
      <div
        onClick={() => {
          triggerGateTransition(
            () => {
              setActiveModal('NONE');
              setScreen('WINTER_DOOM');
              playFullscreenVideo('/videos/t2.mp4', 'WINTER DOOM • INTRO ANNOUNCEMENT (t2)');
            },
            'WINTER DOOM',
            'TOURNAMENT CHAMPIONSHIP',
            '/shutterdesign.png'
          );
        }}
        style={{
          position: 'absolute',
          bottom: '28px',
          left: '36px',
          width: '340px',
          height: '60px',
          boxSizing: 'border-box',
          zIndex: 25,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 20px',
          background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '20px',
          border: '2px solid #ffffff',
          boxShadow: '0 8px 25px rgba(0, 242, 254, 0.45), 0 10px 32px rgba(0, 0, 0, 0.6)',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          overflow: 'hidden',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.03)';
          e.currentTarget.style.boxShadow = '0 12px 35px rgba(0, 242, 254, 0.65), 0 12px 36px rgba(0, 0, 0, 0.7)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 242, 254, 0.45), 0 10px 32px rgba(0, 0, 0, 0.6)';
        }}
      >
        {/* Sky Blue Highlight Overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '45%',
            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* 100% Dead-Centered Title (Shifted Slightly Downwards) */}
        <h2
          style={{
            fontSize: '1.85rem',
            fontWeight: 900,
            fontStyle: 'italic',
            fontFamily: "'Vandria', 'Bebas Neue', 'Anton', 'Misery', 'QUARTZO', 'Kanit', sans-serif",
            letterSpacing: '0.04em',
            margin: 0,
            color: '#ffffff',
            lineHeight: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            textTransform: 'uppercase',
            position: 'relative',
            zIndex: 2,
            width: '100%',
            textAlign: 'center',
            marginTop: '4px',
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.25)',
          }}
        >
          <span style={{ color: '#ffffff' }}>WINTER</span>
          <span style={{ color: '#091b2c' }}>DOOM</span>
        </h2>

        {/* Right Arrow Icon Positioned Absolutely */}
        <div
          style={{
            position: 'absolute',
            right: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 3,
            marginTop: '2px',
          }}
        >
          <ArrowRight size={22} color="#ffffff" strokeWidth={3} />
        </div>
      </div>
      {/* 🍎 APPLE LIGHT MODE WHITE REFERRAL BOTTOM SHEET DRAWER */}
      {isReferralSheetOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.55)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end',
            pointerEvents: 'auto',
          }}
          onClick={() => {
            setIsReferralSheetOpen(false);
            setShowTncView(false);
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '94vw',
              maxWidth: '720px',
              height: 'auto',
              maxHeight: '88vh',
              background: '#ffffff',
              borderTopLeftRadius: '28px',
              borderTopRightRadius: '28px',
              border: '1px solid #e5e5ea',
              borderBottom: 'none',
              boxShadow: '0 -16px 60px rgba(0, 0, 0, 0.35)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              animation: 'slideUpBottom 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {/* iOS Top Drag Pill Handle */}
            <div
              style={{
                width: '100%',
                padding: '12px 0 4px 0',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: '#ffffff',
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '5px',
                  borderRadius: '10px',
                  background: '#d1d1d6',
                }}
              />
            </div>

            {/* Header with Title & Close Button */}
            <div
              style={{
                padding: '12px 28px 18px 28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid #f2f2f7',
                background: '#ffffff',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #ff9500 0%, #ff5e00 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 16px rgba(255, 149, 0, 0.35)',
                  }}
                >
                  <Gift size={24} color="#ffffff" />
                </div>
                <div>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: '1.3rem',
                      fontWeight: 800,
                      color: '#1c1c1e',
                      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif",
                    }}
                  >
                    Refer & Earn ₹10 Cash
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '0.82rem',
                      color: '#636366',
                      fontWeight: 500,
                    }}
                  >
                    Invite friends & earn rewards per qualifying player
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsReferralSheetOpen(false);
                  setShowTncView(false);
                }}
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  background: '#f2f2f7',
                  border: 'none',
                  color: '#1c1c1e',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'background 0.2s ease',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div
              style={{
                padding: '24px 28px 32px 28px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                background: '#ffffff',
              }}
            >
              {!showTncView ? (
                <>
                  {/* Referral Code Box */}
                  <div
                    style={{
                      background: 'linear-gradient(135deg, rgba(255, 149, 0, 0.08) 0%, rgba(255, 94, 0, 0.04) 100%)',
                      border: '1.5px dashed #ff9500',
                      borderRadius: '20px',
                      padding: '18px 24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '16px',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          color: '#8e8e93',
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                        }}
                      >
                        YOUR UNIQUE INVITATION CODE
                      </div>
                      <div
                        style={{
                          fontSize: '1.6rem',
                          fontWeight: 900,
                          color: '#ff3b30',
                          letterSpacing: '0.1em',
                          fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
                          marginTop: '2px',
                        }}
                      >
                        {userReferralCode}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(userReferralCode);
                        setCopiedCode(true);
                        setTimeout(() => setCopiedCode(false), 2000);
                      }}
                      style={{
                        padding: '12px 22px',
                        borderRadius: '14px',
                        background: copiedCode ? '#34c759' : '#ff9500',
                        border: 'none',
                        color: '#ffffff',
                        fontWeight: 800,
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        boxShadow: '0 4px 14px rgba(255, 149, 0, 0.3)',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {copiedCode ? <Check size={18} /> : <Copy size={18} />}
                      {copiedCode ? 'COPIED!' : 'COPY'}
                    </button>
                  </div>

                  {/* WhatsApp / Share Quick Button */}
                  <button
                    onClick={() => {
                      const shareMsg = `Join me on CLASHA Quiz Battles & Competitions! Use my invite code *${userReferralCode}* to get started: https://clasha.vercel.app`;
                      if (navigator.share) {
                        navigator.share({ title: 'CLASHA Invite', text: shareMsg, url: 'https://clasha.vercel.app' });
                      } else {
                        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareMsg)}`, '_blank');
                      }
                    }}
                    style={{
                      width: '100%',
                      padding: '16px',
                      borderRadius: '18px',
                      background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                      border: 'none',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: '1.05rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px',
                      cursor: 'pointer',
                      boxShadow: '0 8px 24px rgba(37, 211, 102, 0.35)',
                    }}
                  >
                    <Share2 size={20} /> SHARE VIA WHATSAPP / LINK
                  </button>

                  {/* 3 Step How It Works Overview */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '4px' }}>
                    <div
                      style={{
                        fontSize: '0.82rem',
                        fontWeight: 800,
                        color: '#1c1c1e',
                        letterSpacing: '0.06em',
                      }}
                    >
                      HOW REFERRAL WORKS:
                    </div>

                    <div
                      style={{
                        background: '#f2f2f7',
                        border: '1px solid #e5e5ea',
                        borderRadius: '18px',
                        padding: '14px 18px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                      }}
                    >
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          background: 'rgba(255, 149, 0, 0.15)',
                          color: '#ff9500',
                          fontWeight: 900,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1rem',
                        }}
                      >
                        1
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1c1c1e' }}>Send Code to Friend</div>
                        <div style={{ fontSize: '0.8rem', color: '#636366', fontWeight: 500 }}>Friend signs up on CLASHA with your code</div>
                      </div>
                    </div>

                    <div
                      style={{
                        background: '#f2f2f7',
                        border: '1px solid #e5e5ea',
                        borderRadius: '18px',
                        padding: '14px 18px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                      }}
                    >
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          background: 'rgba(0, 122, 255, 0.15)',
                          color: '#007aff',
                          fontWeight: 900,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1rem',
                        }}
                      >
                        2
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1c1c1e' }}>Friend Plays Games</div>
                        <div style={{ fontSize: '0.8rem', color: '#636366', fontWeight: 500 }}>Must play 3 Party Rounds + 1 Tournament Match</div>
                      </div>
                    </div>

                    <div
                      style={{
                        background: '#f2f2f7',
                        border: '1px solid #e5e5ea',
                        borderRadius: '18px',
                        padding: '14px 18px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                      }}
                    >
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          background: 'rgba(52, 199, 89, 0.15)',
                          color: '#34c759',
                          fontWeight: 900,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1rem',
                        }}
                      >
                        3
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1c1c1e' }}>Get ₹10 Instantly</div>
                        <div style={{ fontSize: '0.8rem', color: '#636366', fontWeight: 500 }}>Reward is credited to your wallet balance</div>
                      </div>
                    </div>
                  </div>

                  {/* Apple Style T&C Button */}
                  <button
                    onClick={() => setShowTncView(true)}
                    style={{
                      marginTop: '6px',
                      padding: '14px 18px',
                      borderRadius: '16px',
                      background: '#f2f2f7',
                      border: '1px solid #e5e5ea',
                      color: '#1c1c1e',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <FileText size={18} color="#ff9500" />
                      <span>Terms & Conditions (T&C)</span>
                    </div>
                    <ChevronRight size={18} color="#8e8e93" />
                  </button>
                </>
              ) : (
                /* Apple-Style Detailed Terms & Conditions View */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <button
                    onClick={() => setShowTncView(false)}
                    style={{
                      alignSelf: 'flex-start',
                      background: 'none',
                      border: 'none',
                      color: '#ff9500',
                      fontWeight: 800,
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    <ChevronLeft size={18} /> Back to Referral
                  </button>

                  <div
                    style={{
                      background: '#f9f9fb',
                      border: '1px solid #e5e5ea',
                      borderRadius: '20px',
                      padding: '22px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px',
                    }}
                  >
                    <h4
                      style={{
                        margin: 0,
                        fontSize: '1.15rem',
                        fontWeight: 800,
                        color: '#1c1c1e',
                        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
                      }}
                    >
                      📜 Referral Program Terms & Conditions
                    </h4>

                    <div style={{ fontSize: '0.88rem', color: '#3a3a3c', lineHeight: 1.6 }}>
                      <p style={{ margin: '0 0 12px 0' }}>
                        1. <strong>Signup Condition:</strong> Sending an invitation code and a new user completing sign-up alone <em>will not</em> immediately trigger the ₹10 reward.
                      </p>
                      <p style={{ margin: '0 0 12px 0' }}>
                        2. <strong>Gameplay Qualification Criteria:</strong> For the referrer to receive ₹10 Cash, the newly registered user must complete:
                      </p>
                      <ul style={{ margin: '0 0 12px 0', paddingLeft: '22px', color: '#ff9500', fontWeight: 700 }}>
                        <li>Minimum <strong>3 Party Cabin Rounds</strong></li>
                        <li>Minimum <strong>1 Tournament Match</strong></li>
                      </ul>
                      <p style={{ margin: '0 0 12px 0' }}>
                        3. <strong>Reward Payout:</strong> As soon as the referred player satisfies both gameplay criteria, ₹10 is automatically credited to the referrer's account wallet balance.
                      </p>
                      <p style={{ margin: 0 }}>
                        4. <strong>Fair Play & Anti-Fraud Policy:</strong> Self-referrals, fake account creations, or bot activities will result in immediate disqualification and account ban.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
