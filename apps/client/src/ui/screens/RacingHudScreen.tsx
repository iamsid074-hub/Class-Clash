import React, { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../../state/useGameStore';
import { NetworkClient } from '../../networking/NetworkClient';
import { InputController } from '../../game/controllers/InputController';
import { Flag, Swords, Zap, CheckCircle2, Play, LogOut, Pause } from 'lucide-react';

export const RacingHudScreen: React.FC = () => {
  const { playerId, latestSnapshot, currentMatchup, teams, triggerGateTransition } = useGameStore();

  const sequenceCounter = useRef(0);
  const [countdownText, setCountdownText] = useState<string | null>('3');
  const [isPaused, setIsPaused] = useState(false);

  // 3.. 2.. 1.. GO! Countdown Overlay Effect
  useEffect(() => {
    const t1 = setTimeout(() => setCountdownText('2'), 1000);
    const t2 = setTimeout(() => setCountdownText('1'), 2000);
    const t3 = setTimeout(() => setCountdownText('GO!'), 3000);
    const t4 = setTimeout(() => setCountdownText(null), 4000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  const [showDebugFps, setShowDebugFps] = useState(false);
  const [showDebugCollision, setShowDebugCollision] = useState(false);
  const [fps, setFps] = useState(60);

  // Escape key toggle pause menu & F1/F2 Debug Mode Toggles
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        setIsPaused((prev) => !prev);
      } else if (e.code === 'F2') {
        e.preventDefault();
        setShowDebugFps((prev) => !prev);
      } else if (e.code === 'F1') {
        e.preventDefault();
        setShowDebugCollision((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Centralized Input Controller 30Hz Transmission Loop
  useEffect(() => {
    InputController.init();

    const interval = setInterval(() => {
      const input = InputController.getProcessedInput();

      NetworkClient.sendInput({
        forward: input.forward,
        backward: input.backward,
        left: input.left,
        right: input.right,
        jump: input.jump,
        sprint: input.sprint,
        rotationY: input.cameraAngle,
        sequence: ++sequenceCounter.current,
      });
    }, 1000 / 30);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const localPlayer = latestSnapshot?.players[playerId];
  const allPlayers = latestSnapshot ? Object.values(latestSnapshot.players) : [];

  const allTeamsList = Object.values(teams);
  const team1 = (currentMatchup ? teams[currentMatchup.team1Id] : null) || allTeamsList[0] || { id: 't1', name: 'TEAM A', color: '#ff007f' };
  const team2 = (currentMatchup ? teams[currentMatchup.team2Id] : null) || allTeamsList[1] || { id: 't2', name: 'TEAM B', color: '#ff66b3' };

  const team1Players = allPlayers.filter((p) => p.teamId === team1.id);
  const team2Players = allPlayers.filter((p) => p.teamId === team2.id || !p.teamId);

  // Calculate Average Progress (0 to 100%) for Team 1 & Team 2 towards Finish Line (285m)
  const trackLength = 285;
  const calcProgress = (plist: typeof allPlayers) => {
    if (plist.length === 0) return 0;
    const totalZ = plist.reduce((acc, p) => acc + Math.max(0, Math.min(trackLength, (p.position?.z || 0) + 10)), 0);
    return Math.min(100, Math.round((totalZ / (plist.length * trackLength)) * 100));
  };

  const team1Prog = calcProgress(team1Players);
  const team2Prog = calcProgress(team2Players);

  return (
    <div className="hud-overlay">
      {/* 1. TOP TEAM PROGRESS DUAL BAR & STANDINGS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
        {/* Left Team Standings */}
        <div className="glass-panel" style={{ padding: '14px 20px', width: '230px', background: 'rgba(26, 8, 30, 0.92)', border: '2px solid #ff007f' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 900, color: '#ff007f', letterSpacing: '0.06em' }}>
            {team1.name}
          </div>
          <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {team1Players.map((p) => (
              <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ fontWeight: 700, color: p.id === playerId ? '#ffffff' : '#e6b8d4' }}>
                  {p.displayName} {p.id === playerId ? ' (YOU)' : ''}
                </span>
                <span style={{ color: p.status === 'FINISHED' ? '#ffffff' : '#ff99cc', fontWeight: 900 }}>
                  {p.status === 'FINISHED' ? `🏁 #${p.finishRank}` : `${Math.floor(Math.max(0, p.position?.z || 0))}m`}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Center: Team A vs Team B Duel Progress Bar */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <div
            className="glass-panel"
            style={{
              padding: '10px 24px',
              background: 'rgba(14, 10, 20, 0.94)',
              border: '2px solid #ff66b3',
              boxShadow: '0 0 25px rgba(255, 0, 127, 0.6)',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              width: '440px',
            }}
          >
            <div style={{ fontSize: '0.8rem', fontWeight: 900, color: '#ff007f', width: '90px', textAlign: 'left' }}>
              {team1.name}
            </div>

            {/* Combined Dual Progress Bar */}
            <div style={{ flex: 1, height: '14px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden', display: 'flex' }}>
              <div style={{ width: `${team1Prog}%`, background: 'linear-gradient(90deg, #ff0066 0%, #ff007f 100%)', transition: 'width 0.3s ease' }} />
              <div style={{ width: `${team2Prog}%`, background: 'linear-gradient(90deg, #ff66b3 0%, #ffffff 100%)', transition: 'width 0.3s ease' }} />
            </div>

            <div style={{ fontSize: '0.8rem', fontWeight: 900, color: '#ff99cc', width: '90px', textAlign: 'right' }}>
              {team2.name}
            </div>
          </div>

          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#ffffff', letterSpacing: '0.1em' }}>
            MAP: SKYBREAK RUN (300M)
          </div>
        </div>

        {/* Right Team Standings */}
        <div className="glass-panel" style={{ padding: '14px 20px', width: '230px', background: 'rgba(26, 8, 30, 0.92)', border: '2px solid #ff66b3' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 900, color: '#ff99cc', textAlign: 'right', letterSpacing: '0.06em' }}>
            {team2.name}
          </div>
          <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {team2Players.map((p) => (
              <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: p.status === 'FINISHED' ? '#ffffff' : '#ff99cc', fontWeight: 900 }}>
                  {p.status === 'FINISHED' ? `🏁 #${p.finishRank}` : `${Math.floor(Math.max(0, p.position?.z || 0))}m`}
                </span>
                <span style={{ fontWeight: 700, color: p.id === playerId ? '#ffffff' : '#e6b8d4' }}>
                  {p.displayName} {p.id === playerId ? ' (YOU)' : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. ON-SCREEN COUNTDOWN OVERLAY BANNER */}
      {countdownText && (
        <div
          style={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: countdownText === 'GO!' ? '5rem' : '7rem',
            fontWeight: 900,
            fontStyle: 'italic',
            fontFamily: "'Kanit', sans-serif",
            color: '#ffffff',
            textShadow: '0 0 40px #ff007f, 0 0 80px #ff007f',
            pointerEvents: 'none',
            userSelect: 'none',
            animation: 'pulse 0.4s ease',
          }}
        >
          {countdownText}
        </div>
      )}

      {/* 3. ESC PAUSE / EXIT MENU OVERLAY */}
      {isPaused && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(20, 8, 25, 0.96)',
            border: '2.5px solid #ff007f',
            borderRadius: '24px',
            padding: '36px 54px',
            textAlign: 'center',
            boxShadow: '0 0 60px rgba(255, 0, 127, 0.8)',
            zIndex: 100,
          }}
        >
          <Pause size={48} color="#ff007f" style={{ margin: '0 auto 12px' }} />
          <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#ffffff', fontStyle: 'italic', fontFamily: "'Kanit', sans-serif" }}>
            GAME PAUSED
          </h2>
          <p style={{ color: '#ff99cc', fontSize: '0.9rem', marginBottom: '24px', fontWeight: 700 }}>
            PRESS ESC AGAIN TO RESUME OR CHOOSE BELOW
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '280px', margin: '0 auto' }}>
            <button
              className="cyber-button glow"
              onClick={() => setIsPaused(false)}
              style={{ padding: '12px 24px', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
            >
              <Play size={20} /> RESUME RACE
            </button>
            <button
              className="cyber-button alt"
              onClick={() => {
                setIsPaused(false);
                triggerGateTransition(
                  () => useGameStore.getState().setScreen('MAIN_MENU'),
                  'MAIN MENU',
                  'RETURNING TO LOBBY...'
                );
              }}
              style={{ padding: '12px 24px', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
            >
              <LogOut size={20} /> EXIT TO MAIN MENU
            </button>
          </div>
        </div>
      )}

      {/* 4. FINISH NOTIFICATION */}
      {localPlayer?.status === 'FINISHED' && (
        <div
          style={{
            position: 'absolute',
            top: '30%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(26, 8, 30, 0.95)',
            border: '3px solid #ff007f',
            padding: '24px 48px',
            borderRadius: '24px',
            textAlign: 'center',
            boxShadow: '0 0 50px rgba(255, 0, 127, 0.9)',
          }}
        >
          <CheckCircle2 size={48} color="#ff007f" style={{ margin: '0 auto 12px' }} />
          <h2 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#ffffff', fontStyle: 'italic' }}>
            RACE FINISHED! #{localPlayer.finishRank}
          </h2>
          <p style={{ color: '#ff99cc', fontSize: '1rem', marginTop: '6px', fontWeight: 700 }}>
            CELEBRATING WITH YOUR SQUAD...
          </p>
        </div>
      )}

      {/* 5. BOTTOM CONTROLS HELPER BAR */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div
          className="glass-panel"
          style={{
            padding: '10px 28px',
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            fontSize: '0.88rem',
            fontWeight: 800,
            color: '#ffffff',
            background: 'rgba(14, 10, 20, 0.92)',
            border: '1.5px solid #ff66b3',
          }}
        >
          <div><span style={{ color: '#ff007f' }}>W A S D</span> MOVE</div>
          <div><span style={{ color: '#ff007f' }}>SPACE</span> JUMP</div>
          <div><span style={{ color: '#ff007f' }}>SHIFT</span> SPRINT</div>
          <div><span style={{ color: '#ff007f' }}>MOUSE</span> LOOK</div>
          <div><span style={{ color: '#ff007f' }}>ESC</span> PAUSE / EXIT</div>
          <div><span style={{ color: '#00b4d8' }}>F2</span> DEV STATS</div>
        </div>
      </div>

      {/* 6. MOBILE VIRTUAL CONTROLS OVERLAY (JOYSTICK & JUMP BUTTON) */}
      <div style={{ position: 'absolute', bottom: '24px', right: '30px', display: 'flex', gap: '16px', zIndex: 50 }}>
        <button
          onTouchStart={() => InputController.setVirtualKey('Space', true)}
          onTouchEnd={() => InputController.setVirtualKey('Space', false)}
          onMouseDown={() => InputController.setVirtualKey('Space', true)}
          onMouseUp={() => InputController.setVirtualKey('Space', false)}
          style={{
            width: '76px',
            height: '76px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #ff007f 0%, #ff66b3 100%)',
            border: '3.5px solid #ffffff',
            color: '#ffffff',
            fontWeight: 900,
            fontSize: '1.1rem',
            boxShadow: '0 0 30px rgba(255, 0, 127, 0.8)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            userSelect: 'none',
          }}
        >
          JUMP
        </button>
      </div>

      {/* 7. F2 PERFORMANCE & DEBUG OVERLAY */}
      {showDebugFps && (
        <div
          style={{
            position: 'absolute',
            bottom: '80px',
            left: '20px',
            background: 'rgba(10, 15, 25, 0.94)',
            border: '1.5px solid #00b4d8',
            borderRadius: '12px',
            padding: '12px 18px',
            color: '#00b4d8',
            fontFamily: 'monospace',
            fontSize: '0.82rem',
            lineHeight: 1.6,
            boxShadow: '0 0 20px rgba(0, 180, 216, 0.5)',
          }}
        >
          <div style={{ fontWeight: 900, color: '#ffffff', borderBottom: '1px solid #00b4d8', paddingBottom: '4px', marginBottom: '6px' }}>
            ⚡ DEV PERFORMANCE DEBUG (F2)
          </div>
          <div>TARGET FPS: 60 FPS (16.67ms)</div>
          <div>SIMULATION LOOP: FIXED 30HZ</div>
          <div>ACTIVE PLAYERS: 8 / 8</div>
          <div>PHYSICS ENGINE: CAPSULE COLLIDER</div>
          <div>CLIENT PREDICTION: ACTIVE</div>
        </div>
      )}
    </div>
  );
};
