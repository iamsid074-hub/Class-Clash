import React from 'react';
import { useGameStore } from '../../state/useGameStore';
import { Trophy, ArrowRight, Award } from 'lucide-react';

export const ResultsScreen: React.FC = () => {
  const { lastMatchResult, teams, tournament, setScreen } = useGameStore();

  const matchup = lastMatchResult?.matchup;
  const result = lastMatchResult?.result;

  const team1 = matchup ? teams[matchup.team1Id] : null;
  const team2 = matchup ? teams[matchup.team2Id] : null;

  const winningTeam = result?.winningTeamId ? teams[result.winningTeamId] : team1;

  const handleNextRound = () => {
    if (tournament?.stage === 'CHAMPION') {
      setScreen('CHAMPION');
    } else {
      setScreen('BRACKET');
    }
  };

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
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ff66b3', letterSpacing: '0.2em', textShadow: '0 0 10px #ff007f' }}>
          MATCH COMPLETE
        </div>
        <h1 className="text-gradient" style={{ fontSize: '3.8rem', fontWeight: 900, marginTop: '6px' }}>
          {winningTeam?.name || 'NEON PINK'} WINS!
        </h1>
      </div>

      {/* Scores Table */}
      <div className="glass-panel" style={{ width: '580px', padding: '36px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
        {/* Team 1 Score Row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '18px 26px',
            borderRadius: '14px',
            background: result?.winningTeamId === team1?.id ? 'rgba(255, 0, 127, 0.25)' : 'rgba(255,255,255,0.05)',
            border: `2px solid ${team1?.color || '#ff007f'}`,
            boxShadow: result?.winningTeamId === team1?.id ? '0 0 25px rgba(255,0,127,0.5)' : 'none',
          }}
        >
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: team1?.color || '#ff007f' }}>{team1?.name}</div>
            <div style={{ fontSize: '0.85rem', color: '#ffffff', marginTop: '2px', fontWeight: 600 }}>Individual Points + Team Bonus</div>
          </div>

          <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#ffffff' }}>
            {matchup?.team1Score || 420} PTS
          </div>
        </div>

        {/* Team 2 Score Row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 24px',
            borderRadius: '12px',
            background: result?.winningTeamId === team2?.id ? 'rgba(0, 255, 204, 0.15)' : 'rgba(255,255,255,0.03)',
            border: `2px solid ${team2?.color || '#0088ff'}`,
          }}
        >
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: team2?.color || '#0088ff' }}>{team2?.name}</div>
            <div style={{ fontSize: '0.8rem', color: '#8a99ad', marginTop: '2px' }}>Individual Points + Team Bonus</div>
          </div>

          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#fff' }}>
            {matchup?.team2Score || 380} PTS
          </div>
        </div>
      </div>

      <button className="btn-primary" style={{ marginTop: '36px' }} onClick={handleNextRound}>
        CONTINUE TO BRACKET <ArrowRight size={20} />
      </button>
    </div>
  );
};
