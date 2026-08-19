import React, { useState } from 'react';
import { useGameStore } from '../../state/useGameStore';
import { NetworkClient } from '../../networking/NetworkClient';
import { ClassClashLogo } from '../components/ClassClashLogo';
import { PinkNeonFrame } from '../components/PinkNeonFrame';
import { Plus, ArrowRight, User, Trophy, X, Snowflake, Calendar, ShieldCheck, CheckCircle2, Flame, Home } from 'lucide-react';

export const MainMenuScreen: React.FC = () => {
  const { displayName, setDisplayName, setScreen, triggerGateTransition, errorMessage, setErrorMessage } = useGameStore();
  const [createRoomIdInput, setCreateRoomIdInput] = useState('ARENA' + Math.floor(Math.random() * 899 + 100));
  const [createPasswordInput, setCreatePasswordInput] = useState('1234');
  const [joinRoomIdInput, setJoinRoomIdInput] = useState('');
  const [joinPasswordInput, setJoinPasswordInput] = useState('');
  const [profileNameInput, setProfileNameInput] = useState(displayName || 'RACER_ONE');
  const [activeModal, setActiveModal] = useState<'NONE' | 'CREATE' | 'JOIN' | 'TOURNAMENT'>('NONE');

  const handleCreateRoom = () => {
    const finalRoomId = createRoomIdInput.trim().toUpperCase() || ('ROOM_' + Math.floor(Math.random() * 899 + 100));
    const finalPassword = createPasswordInput.trim();
    setErrorMessage(null);

    triggerGateTransition(() => {
      NetworkClient.connect();
      NetworkClient.send({
        type: 'JOIN_ROOM',
        payload: {
          roomCode: finalRoomId,
          password: finalPassword,
          isHost: true,
          displayName: profileNameInput,
        },
      });
      setActiveModal('NONE');
    }, 'ENTERING CABIN', 'CREATING PRIVATE ROOM');
  };

  const handleJoinRoom = () => {
    if (!joinRoomIdInput.trim()) {
      setErrorMessage('PLEASE ENTER A VALID ROOM ID!');
      return;
    }
    const finalRoomId = joinRoomIdInput.trim().toUpperCase();
    const finalPassword = joinPasswordInput.trim();
    setErrorMessage(null);

    triggerGateTransition(() => {
      NetworkClient.connect();
      NetworkClient.send({
        type: 'JOIN_ROOM',
        payload: {
          roomCode: finalRoomId,
          password: finalPassword,
          isHost: false,
          displayName: profileNameInput,
        },
      });
      setActiveModal('NONE');
    }, 'ENTERING CABIN', 'JOINING PRIVATE ROOM');
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
        backgroundImage: "url('/homepage.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '36px 48px',
        boxSizing: 'border-box',
        zIndex: 10,
        overflow: 'hidden',
      }}
    >
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
        <ClassClashLogo size={52} />
        <h1
          style={{
            fontSize: '3.2rem',
            fontWeight: 900,
            fontStyle: 'italic',
            fontFamily: "'Kanit', sans-serif",
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

      {/* 2. RIGHT SIDE EDGE DIAGONAL RECTANGLE BUTTONS (LARGE & BOLD) */}
      <div
        style={{
          position: 'absolute',
          right: '48px',
          top: '52%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: '26px',
          alignItems: 'flex-end',
          zIndex: 20,
        }}
      >
        {/* BUTTON 1: CREATE ROOM */}
        <button
          className="diagonal-menu-btn"
          onClick={() => setActiveModal('CREATE')}
        >
          <div className="diagonal-menu-btn-content">
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '1.65rem', fontWeight: 900, fontStyle: 'italic', color: '#ffffff', fontFamily: "'Kanit', sans-serif", letterSpacing: '0.04em' }}>
                CREATE ROOM
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'rgba(255, 255, 255, 0.85)', letterSpacing: '0.08em', marginTop: '2px' }}>
                HOST NEW CABIN
              </div>
            </div>
            <Plus size={34} color="#ffffff" strokeWidth={3.2} />
          </div>
        </button>

        {/* BUTTON 2: JOIN ROOM */}
        <button
          className="diagonal-menu-btn"
          onClick={() => setActiveModal('JOIN')}
        >
          <div className="diagonal-menu-btn-content">
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '1.65rem', fontWeight: 900, fontStyle: 'italic', color: '#ffffff', fontFamily: "'Kanit', sans-serif", letterSpacing: '0.04em' }}>
                JOIN ROOM
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'rgba(255, 255, 255, 0.85)', letterSpacing: '0.08em', marginTop: '2px' }}>
                ENTER ROOM CODE
              </div>
            </div>
            <ArrowRight size={34} color="#ffffff" strokeWidth={3.2} />
          </div>
        </button>

        {/* BUTTON 3: PLAYER PROFILE */}
        <button
          className="diagonal-menu-btn"
          onClick={() => triggerGateTransition(() => setScreen('PROFILE'), 'PLAYER PROFILE', 'RACER DASHBOARD')}
        >
          <div className="diagonal-menu-btn-content">
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '1.65rem', fontWeight: 900, fontStyle: 'italic', color: '#ffffff', fontFamily: "'Kanit', sans-serif", letterSpacing: '0.04em' }}>
                PROFILE
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'rgba(255, 255, 255, 0.85)', letterSpacing: '0.08em', marginTop: '2px' }}>
                {displayName || 'RACER PROFILE'}
              </div>
            </div>
            <User size={34} color="#ffffff" strokeWidth={3.2} />
          </div>
        </button>

        {/* BUTTON 4: LEADERBOARD */}
        <button
          className="diagonal-menu-btn"
          onClick={() => triggerGateTransition(() => setScreen('LEADERBOARD'), 'LEADERBOARD', 'GLOBAL STANDINGS')}
        >
          <div className="diagonal-menu-btn-content">
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '1.65rem', fontWeight: 900, fontStyle: 'italic', color: '#ffffff', fontFamily: "'Kanit', sans-serif", letterSpacing: '0.04em' }}>
                LEADERBOARD
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'rgba(255, 255, 255, 0.85)', letterSpacing: '0.08em', marginTop: '2px' }}>
                GLOBAL RANKINGS
              </div>
            </div>
            <Trophy size={34} color="#ffffff" strokeWidth={3.2} />
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
                {/* LEFT CARD: CABIN ARENA LARGE IMAGE PREVIEW */}
                <div
                  style={{
                    background: '#181224',
                    border: '1.5px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '28px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '16px',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
                    textAlign: 'left',
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      height: '275px',
                      borderRadius: '22px',
                      overflow: 'hidden',
                      border: '2px solid rgba(255, 0, 102, 0.45)',
                      position: 'relative',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.65)',
                    }}
                  >
                    <img
                      src="/cabin.png"
                      alt="Neon Cyber Cabin Arena"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '12px',
                        left: '12px',
                        background: 'rgba(0, 0, 0, 0.8)',
                        backdropFilter: 'blur(8px)',
                        border: '1.5px solid #ff0066',
                        borderRadius: '10px',
                        padding: '6px 14px',
                        fontSize: '0.78rem',
                        fontWeight: 900,
                        color: '#ffffff',
                        letterSpacing: '0.08em',
                      }}
                    >
                      COZY CABIN 01
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '0 4px' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#ff0066', letterSpacing: '0.12em' }}>
                      CABIN SELECTION
                    </div>
                    <div style={{ fontSize: '1.35rem', fontWeight: 900, fontStyle: 'italic', color: '#ffffff', fontFamily: "'Kanit', sans-serif" }}>
                      LUXURY CABIN ARENA
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.65)', fontWeight: 600 }}>
                      Selected for host & guest players.
                    </div>
                  </div>
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
                    <div style={{ fontSize: '1.8rem', fontWeight: 900, fontStyle: 'italic', color: '#ffffff', fontFamily: "'Kanit', sans-serif", marginTop: '2px' }}>
                      CREATE ROOM
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 900, color: 'rgba(255, 255, 255, 0.7)', letterSpacing: '0.06em' }}>
                        CREATE ROOM ID
                      </label>
                      <input
                        type="text"
                        value={createRoomIdInput}
                        onChange={(e) => setCreateRoomIdInput(e.target.value.toUpperCase())}
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
                        placeholder="ENTER ROOM ID"
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 900, color: 'rgba(255, 255, 255, 0.7)', letterSpacing: '0.06em' }}>
                        SET ROOM PASSWORD
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
                    style={{
                      width: '100%',
                      height: '52px',
                      borderRadius: '14px',
                      background: 'linear-gradient(135deg, #ff0066 0%, #ff3385 100%)',
                      border: 'none',
                      color: '#ffffff',
                      fontWeight: 900,
                      fontSize: '1.15rem',
                      fontStyle: 'italic',
                      fontFamily: "'Kanit', sans-serif",
                      cursor: 'pointer',
                      letterSpacing: '0.06em',
                    }}
                  >
                    START ROOM NOW
                  </button>
                </div>
              </div>
            )}

            {/* ====================================================================== */}
            {/* MODAL 2: JOIN ROOM (CLEAN COMPACT CARD - NO CABIN IMAGE AT ALL)       */}
            {/* ====================================================================== */}
            {activeModal === 'JOIN' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#ff0066', letterSpacing: '0.14em' }}>
                    CONNECT TO ARENA
                  </div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 900, fontStyle: 'italic', color: '#ffffff', fontFamily: "'Kanit', sans-serif", marginTop: '2px' }}>
                    JOIN ROOM
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
                      ENTER ROOM ID
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
                      placeholder="ENTER ROOM ID"
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 900, color: 'rgba(255, 255, 255, 0.7)', letterSpacing: '0.06em' }}>
                      ENTER ROOM PASSWORD
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
                  style={{
                    width: '100%',
                    height: '52px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #ff0066 0%, #ff3385 100%)',
                    border: 'none',
                    color: '#ffffff',
                    fontWeight: 900,
                    fontSize: '1.15rem',
                    fontStyle: 'italic',
                    fontFamily: "'Kanit', sans-serif",
                    cursor: 'pointer',
                    letterSpacing: '0.06em',
                    marginTop: '4px',
                  }}
                >
                  JOIN ROOM NOW
                </button>
              </div>
            )}

            {/* MODAL 4: TOURNAMENT DETAILS (WIDE SPACIOUS ESPORT CARD) */}
            {activeModal === 'TOURNAMENT' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', textAlign: 'left' }}>
                {/* Header Title Section */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                  <div
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '18px',
                      background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 0 24px rgba(0, 242, 254, 0.85), inset 0 1px 2px #ffffff',
                    }}
                  >
                    <Snowflake size={34} color="#ffffff" strokeWidth={2.5} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 900, color: '#70e1ff', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                      OFFICIAL CLASHA CHAMPIONSHIP • SEASON 1
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 900, fontStyle: 'italic', color: '#ffffff', fontFamily: "'Kanit', sans-serif", lineHeight: 1.1, marginTop: '2px' }}>
                      WINTER DOOM TOURNAMENT
                    </div>
                  </div>
                </div>

                {/* Main 2-Column Wide Grid Layout */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  {/* LEFT COLUMN: CHAMPIONSHIP INFO & SCHEDULE */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {/* Card 1: Schedule */}
                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(112, 225, 255, 0.35)',
                        borderRadius: '16px',
                        padding: '16px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                      }}
                    >
                      <div
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '12px',
                          background: 'rgba(0, 242, 254, 0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Calendar size={22} color="#70e1ff" />
                      </div>
                      <div>
                        <div style={{ color: '#70e1ff', fontSize: '0.75rem', fontWeight: 900, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                          SCHEDULED DATE
                        </div>
                        <div style={{ color: '#ffffff', fontWeight: 900, fontSize: '1.15rem', marginTop: '2px', lineHeight: 1.2 }}>
                          First week of SEPTEMBER
                        </div>
                      </div>
                    </div>

                    {/* Card 2: Teams */}
                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(112, 225, 255, 0.35)',
                        borderRadius: '16px',
                        padding: '16px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                      }}
                    >
                      <div
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '12px',
                          background: 'rgba(0, 242, 254, 0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <User size={22} color="#70e1ff" />
                      </div>
                      <div>
                        <div style={{ color: '#70e1ff', fontSize: '0.75rem', fontWeight: 900, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                          TEAM CAPACITY
                        </div>
                        <div style={{ color: '#ffffff', fontWeight: 900, fontSize: '1.15rem', marginTop: '2px', lineHeight: 1.2 }}>
                          10 Teams Only
                        </div>
                      </div>
                    </div>

                    {/* Card 3: Prizes */}
                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(112, 225, 255, 0.35)',
                        borderRadius: '16px',
                        padding: '16px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                      }}
                    >
                      <div
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '12px',
                          background: 'rgba(0, 242, 254, 0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Trophy size={22} color="#70e1ff" />
                      </div>
                      <div>
                        <div style={{ color: '#70e1ff', fontSize: '0.75rem', fontWeight: 900, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                          REWARDS & PRIZES
                        </div>
                        <div style={{ color: '#ffffff', fontWeight: 900, fontSize: '1.15rem', marginTop: '2px', lineHeight: 1.2 }}>
                          Top 1 Will Get Prizes
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT COLUMN: REQUIREMENTS TO ENROLL */}
                  <div
                    style={{
                      background: 'rgba(0, 242, 254, 0.05)',
                      border: '1.5px solid rgba(112, 225, 255, 0.4)',
                      borderRadius: '20px',
                      padding: '20px 22px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '14px',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 900, color: '#70e1ff', letterSpacing: '0.14em', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ShieldCheck size={20} /> TO ENROLL (REQUIREMENTS)
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.6)', marginTop: '4px', fontWeight: 700 }}>
                        Must satisfy all criteria to qualify for entry:
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {/* Req 1 */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', background: 'rgba(255, 255, 255, 0.04)', padding: '10px 14px', borderRadius: '12px', border: '1px solid rgba(112, 225, 255, 0.15)' }}>
                        <CheckCircle2 size={20} color="#70e1ff" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <div>
                          <div style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 900, lineHeight: 1.2 }}>
                            Play at least 10 rounds on Clasha
                          </div>
                          <div style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.75rem', marginTop: '2px', fontWeight: 700 }}>
                            Minimum match participation requirement
                          </div>
                        </div>
                      </div>

                      {/* Req 2 */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', background: 'rgba(255, 255, 255, 0.04)', padding: '10px 14px', borderRadius: '12px', border: '1px solid rgba(112, 225, 255, 0.15)' }}>
                        <CheckCircle2 size={20} color="#70e1ff" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <div>
                          <div style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 900, lineHeight: 1.2 }}>
                            Points on leaderboard should be more than 50
                          </div>
                          <div style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.75rem', marginTop: '2px', fontWeight: 700 }}>
                            Global skill ranking score cutoff
                          </div>
                        </div>
                      </div>

                      {/* Req 3 */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', background: 'rgba(255, 255, 255, 0.04)', padding: '10px 14px', borderRadius: '12px', border: '1px solid rgba(112, 225, 255, 0.15)' }}>
                        <CheckCircle2 size={20} color="#70e1ff" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <div>
                          <div style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 900, lineHeight: 1.2 }}>
                            Your profile should be verified
                          </div>
                          <div style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.75rem', marginTop: '2px', fontWeight: 700 }}>
                            Official account authentication check
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Full Width Enroll Button */}
                <button
                  type="button"
                  onClick={() => alert('Registration for September Tournament is Open! Make sure your profile meets all requirements.')}
                  style={{
                    width: '100%',
                    height: '56px',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
                    border: '2px solid #ffffff',
                    color: '#ffffff',
                    fontWeight: 900,
                    fontSize: '1.25rem',
                    fontStyle: 'italic',
                    fontFamily: "'Kanit', sans-serif",
                    cursor: 'pointer',
                    boxShadow: '0 8px 32px rgba(0, 242, 254, 0.65)',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    marginTop: '4px',
                  }}
                >
                  ENROLL NOW
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. BOTTOM-LEFT ICE & FROST WINTER BADGE (WINTER DOOM TOURNAMENT - CLICKABLE) */}
      <div
        onClick={() => setActiveModal('TOURNAMENT')}
        style={{
          position: 'absolute',
          bottom: '28px',
          left: '36px',
          zIndex: 25,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '18px',
          padding: '14px 32px 14px 22px',
          background: 'linear-gradient(135deg, rgba(12, 28, 48, 0.94) 0%, rgba(6, 18, 32, 0.96) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '24px',
          border: '2px solid #70e1ff',
          boxShadow: `
            0 0 25px rgba(0, 242, 254, 0.6),
            0 12px 36px rgba(0, 0, 0, 0.8),
            inset 0 2px 4px rgba(255, 255, 255, 0.8),
            inset 0 -2px 12px rgba(0, 180, 216, 0.3)
          `,
          cursor: 'pointer',
          transition: 'transform 0.2s ease, boxShadow 0.2s ease',
          overflow: 'hidden',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.boxShadow = '0 0 35px rgba(0, 242, 254, 0.9), 0 16px 40px rgba(0, 0, 0, 0.9)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 0 25px rgba(0, 242, 254, 0.6), 0 12px 36px rgba(0, 0, 0, 0.8)';
        }}
      >
        {/* Frost / Ice Shimmer Top Highlight */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '45%',
            background: 'linear-gradient(180deg, rgba(224, 247, 250, 0.4) 0%, rgba(224, 247, 250, 0.0) 100%)',
            pointerEvents: 'none',
            borderRadius: '24px 24px 0 0',
          }}
        />

        {/* Icy Snowflake Icon Capsule */}
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(0, 242, 254, 0.9), inset 0 1px 2px #ffffff',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <Snowflake size={28} color="#ffffff" strokeWidth={2.5} />
        </div>

        <div style={{ textAlign: 'left', position: 'relative', zIndex: 2 }}>
          <h2
            style={{
              fontSize: '2.6rem',
              fontWeight: 900,
              fontStyle: 'italic',
              fontFamily: "'Kanit', sans-serif",
              letterSpacing: '0.04em',
              margin: 0,
              color: '#ffffff',
              lineHeight: 1,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              textTransform: 'uppercase',
            }}
          >
            <span
              style={{
                background: 'linear-gradient(180deg, #ffffff 0%, #cff4fc 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.8))',
              }}
            >
              WINTER
            </span>
            <span
              style={{
                background: 'linear-gradient(180deg, #70e1ff 0%, #00b4d8 60%, #0077b6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 16px rgba(0, 242, 254, 0.9))',
              }}
            >
              DOOM
            </span>
          </h2>
          <div
            style={{
              fontSize: '0.82rem',
              fontWeight: 900,
              color: '#70e1ff',
              letterSpacing: '0.16em',
              marginTop: '4px',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Snowflake size={13} color="#70e1ff" strokeWidth={3} />
            <span>TOURNAMENT</span>
          </div>
        </div>
      </div>
    </div>
  );
};
