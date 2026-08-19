import React from 'react';
import { useGameStore } from '../../state/useGameStore';
import { Trophy, RefreshCw } from 'lucide-react';

export const ChampionScreen: React.FC = () => {
  const { tournament, teams, setScreen } = useGameStore();

  const championTeam = tournament?.championTeamId ? teams[tournament.championTeamId] : Object.values(teams)[0];

  return (
    <div
      className="screen-overlay"
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        background: 'radial-gradient(circle at center, rgba(255, 170, 0, 0.2) 0%, rgba(9, 11, 16, 0.96) 100%)',
        backdropFilter: 'blur(20px)',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <Trophy size={88} color="#ffffff" style={{ filter: 'drop-shadow(0 0 35px #ff007f)' }} />
        <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#ffffff', letterSpacing: '0.22em', marginTop: '16px', textShadow: '0 0 12px #ff007f' }}>
          CLASS CLASH CHAMPIONS
        </div>
        <h1 className="text-gradient" style={{ fontSize: '4.5rem', fontWeight: 900, marginTop: '6px' }}>
          {championTeam?.name || 'NEON PINK'}
        </h1>
      </div>

      {/* 4 Champion Racers Grid */}
      <div style={{ display: 'flex', gap: '24px', marginBottom: '40px' }}>
        {(championTeam?.members || []).map((m, idx) => (
          <div
            key={idx}
            className="glass-panel"
            style={{
              padding: '28px 20px',
              textAlign: 'center',
              width: '175px',
              border: '2px solid #ff66b3',
              boxShadow: '0 0 30px rgba(255, 0, 127, 0.6)',
              background: 'rgba(255, 0, 127, 0.15)',
            }}
          >
            <div style={{ fontSize: '2.8rem', marginBottom: '8px' }}>👑</div>
            <div style={{ fontWeight: 900, fontSize: '1.1rem', color: '#ffffff' }}>{m.displayName}</div>
            <div style={{ fontSize: '0.8rem', color: '#ffffff', marginTop: '4px', fontWeight: 800 }}>CHAMPION</div>
          </div>
        ))}
      </div>

      <button className="btn-secondary" onClick={() => setScreen('MAIN_MENU')}>
        <RefreshCw size={20} /> RETURN TO MAIN MENU
      </button>
    </div>
  );
};
