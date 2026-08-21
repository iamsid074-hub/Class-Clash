import React, { useEffect, useState } from 'react';
import { useGameStore } from '../../state/useGameStore';
import { Zap, Swords } from 'lucide-react';

export const MatchmakingShuffleScreen: React.FC = () => {
  const { currentMatchup, teams, setScreen } = useGameStore();

  const allTeams = Object.values(teams);
  const team1 = (currentMatchup ? teams[currentMatchup.team1Id] : null) || allTeams[0] || { name: 'HOST SQUAD', color: '#ff007f' };
  const team2 = (currentMatchup ? teams[currentMatchup.team2Id] : null) || allTeams[1] || { name: 'CHALLENGER SQUAD', color: '#ff66b3' };

  const hasTwoCustomTeams = allTeams.length >= 2;

  const [shufflingName1, setShufflingName1] = useState(team1.name);
  const [shufflingName2, setShufflingName2] = useState(team2.name);
  const [isLocked, setIsLocked] = useState(hasTwoCustomTeams);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (hasTwoCustomTeams) {
      // 2 Custom Teams already in Room: Lock instantly, zero fake shuffling!
      setIsLocked(true);

      const countdownInterval = setInterval(() => {
        setCountdown((prev) => (prev > 1 ? prev - 1 : 1));
      }, 1000);

      const launchTimer = setTimeout(() => {
        setScreen('RACING_HUD');
      }, 3000);

      return () => {
        clearInterval(countdownInterval);
        clearTimeout(launchTimer);
      };
    } else {
      // Single Squad: Quick 1.5s shuffle then lock & start
      const fakeNames = ['GHOST SQUAD', 'VORTEX VIPERS', 'SOLAR KINGS', 'TITAN BLUE', 'CRIMSON COMET'];

      const interval = setInterval(() => {
        setShufflingName1(fakeNames[Math.floor(Math.random() * fakeNames.length)]);
        setShufflingName2(fakeNames[Math.floor(Math.random() * fakeNames.length)]);
      }, 90);

      const timer1 = setTimeout(() => {
        clearInterval(interval);
        setIsLocked(true);
      }, 1500);

      const timer2 = setTimeout(() => {
        setScreen('RACING_HUD');
      }, 3000);

      return () => {
        clearInterval(interval);
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [hasTwoCustomTeams, setScreen]);

  return (
    <div
      className="screen-overlay"
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        background: 'rgba(9, 11, 16, 0.94)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Top Title Banner */}
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#ff66b3', letterSpacing: '0.2em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', textShadow: '0 0 10px #ff007f' }}>
          <Zap size={20} color="#ff66b3" /> {hasTwoCustomTeams ? 'DIRECT CUSTOM MATCHUP' : 'MATCHMAKING LOBBY'}
        </div>
        <h2 style={{ fontSize: '3.2rem', color: '#ffffff', fontWeight: 900, marginTop: '6px', fontStyle: 'italic', textShadow: '0 0 25px rgba(255, 0, 127, 0.6)', fontFamily: "'QUARTZO', 'Kanit', 'Outfit', sans-serif" }}>
          {isLocked ? `MATCH LOCKED • STARTING IN ${countdown}S` : 'MATCHING OPPONENTS...'}
        </h2>
      </div>

      {/* Duel Cards Container */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '36px' }}>
        {/* Team 1 Card */}
        <div
          className="glass-panel"
          style={{
            width: '320px',
            padding: '36px 24px',
            textAlign: 'center',
            border: `3px solid ${team1.color || '#ff007f'}`,
            boxShadow: `0 0 45px ${team1.color || '#ff007f'}88`,
            transform: isLocked ? 'scale(1.04)' : 'none',
            transition: 'all 0.3s ease',
            background: 'linear-gradient(180deg, rgba(40, 12, 35, 0.9) 0%, rgba(14, 8, 20, 0.95) 100%)',
            borderRadius: '20px',
          }}
        >
          <div style={{ fontSize: '3.5rem', marginBottom: '12px' }}>🛡️</div>
          <h3 style={{ fontSize: '2rem', fontWeight: 900, color: '#ffffff', fontStyle: 'italic', fontFamily: "'QUARTZO', 'Kanit', 'Outfit', sans-serif" }}>
            {isLocked ? team1.name : shufflingName1}
          </h3>
          <p style={{ color: '#ff99cc', fontSize: '0.9rem', marginTop: '8px', fontWeight: 800 }}>HOST SQUAD • 4 PLAYERS READY</p>
        </div>

        {/* VS Emblem */}
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #ff0066 0%, #ff007f 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.6rem',
            fontWeight: 900,
            fontStyle: 'italic',
            fontFamily: "'Kanit', sans-serif",
            color: '#ffffff',
            boxShadow: '0 0 35px rgba(255, 0, 127, 0.95), inset 0 1px 2px #ffffff',
            border: '3px solid #ffffff',
          }}
        >
          VS
        </div>

        {/* Team 2 Card */}
        <div
          className="glass-panel"
          style={{
            width: '320px',
            padding: '36px 24px',
            textAlign: 'center',
            border: `3px solid ${team2.color || '#ff66b3'}`,
            boxShadow: `0 0 45px ${team2.color || '#ff66b3'}88`,
            transform: isLocked ? 'scale(1.04)' : 'none',
            transition: 'all 0.3s ease',
            background: 'linear-gradient(180deg, rgba(35, 12, 40, 0.9) 0%, rgba(14, 8, 20, 0.95) 100%)',
            borderRadius: '20px',
          }}
        >
          <div style={{ fontSize: '3.5rem', marginBottom: '12px' }}>⚔️</div>
          <h3 style={{ fontSize: '2rem', fontWeight: 900, color: '#ffffff', fontStyle: 'italic', fontFamily: "'QUARTZO', 'Kanit', 'Outfit', sans-serif" }}>
            {isLocked ? team2.name : shufflingName2}
          </h3>
          <p style={{ color: '#ff99cc', fontSize: '0.9rem', marginTop: '8px', fontWeight: 800 }}>CHALLENGER SQUAD • 4 PLAYERS READY</p>
        </div>
      </div>

      <div style={{ marginTop: '42px', color: '#ffffff', fontSize: '1.1rem', fontWeight: 800, letterSpacing: '0.06em' }}>
        {isLocked ? '⚡ TELEPORTING TO SKY FACTORY ARENA...' : 'PREPARING ARENA MATCHUP...'}
      </div>
    </div>
  );
};
