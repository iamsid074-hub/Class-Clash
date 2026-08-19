import React from 'react';
import { useGameStore } from '../../state/useGameStore';
import { NetworkClient } from '../../networking/NetworkClient';
import { Trophy, Play } from 'lucide-react';

export const BracketScreen: React.FC = () => {
  const { tournament, teams, setScreen } = useGameStore();

  const bracket = tournament?.bracket || [];
  const semi1 = bracket.find((b) => b.id === 'match_semi_1')?.matchup;
  const semi2 = bracket.find((b) => b.id === 'match_semi_2')?.matchup;
  const final = bracket.find((b) => b.id === 'match_final')?.matchup;

  const handlePlayNextMatch = () => {
    NetworkClient.send({ type: 'START_TOURNAMENT', payload: {} });
    setScreen('MATCHMAKING_SHUFFLE');
  };

  return (
    <div
      className="screen-overlay"
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        background: 'rgba(9, 11, 16, 0.95)',
        backdropFilter: 'blur(20px)',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 className="text-gradient" style={{ fontSize: '3.4rem', fontWeight: 900 }}>
          TOURNAMENT BRACKET
        </h1>
        <p style={{ color: '#ffffff', fontSize: '1.1rem', fontWeight: 700, letterSpacing: '0.1em' }}>CLASS CLASH CHAMPIONSHIP</p>
      </div>

      {/* Bracket Layout Tree */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '60px' }}>
        {/* Semi Finals Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 900, color: '#ff66b3', textTransform: 'uppercase', textShadow: '0 0 10px #ff007f' }}>
            SEMI FINALS
          </div>

          {/* Semi 1 Node */}
          <div className="glass-panel" style={{ width: '230px', padding: '18px' }}>
            <div style={{ fontWeight: 900, color: semi1?.winnerTeamId === semi1?.team1Id ? '#ffffff' : '#ff66b3' }}>
              {teams[semi1?.team1Id || '']?.name || 'TBD'}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#ffffff', margin: '4px 0', fontWeight: 800 }}>VS</div>
            <div style={{ fontWeight: 900, color: semi1?.winnerTeamId === semi1?.team2Id ? '#ffffff' : '#ff66b3' }}>
              {teams[semi1?.team2Id || '']?.name || 'TBD'}
            </div>
          </div>

          {/* Semi 2 Node */}
          <div className="glass-panel" style={{ width: '230px', padding: '18px' }}>
            <div style={{ fontWeight: 900, color: semi2?.winnerTeamId === semi2?.team1Id ? '#ffffff' : '#ff66b3' }}>
              {teams[semi2?.team1Id || '']?.name || 'TBD'}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#ffffff', margin: '4px 0', fontWeight: 800 }}>VS</div>
            <div style={{ fontWeight: 900, color: semi2?.winnerTeamId === semi2?.team2Id ? '#ffffff' : '#ff66b3' }}>
              {teams[semi2?.team2Id || '']?.name || 'TBD'}
            </div>
          </div>
        </div>

        {/* Grand Final Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ffaa00', textTransform: 'uppercase' }}>
            GRAND FINAL
          </div>

          <div
            className="glass-panel"
            style={{
              width: '240px',
              padding: '24px 18px',
              border: '2px solid #ffaa00',
              boxShadow: '0 0 30px rgba(255, 170, 0, 0.3)',
            }}
          >
            <div style={{ fontWeight: 900, fontSize: '1.1rem', color: '#fff' }}>
              {teams[final?.team1Id || '']?.name || 'FINALIST 1'}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#ffaa00', margin: '8px 0', fontWeight: 800 }}>
              VS
            </div>
            <div style={{ fontWeight: 900, fontSize: '1.1rem', color: '#fff' }}>
              {teams[final?.team2Id || '']?.name || 'FINALIST 2'}
            </div>
          </div>
        </div>
      </div>

      <button className="btn-primary" style={{ marginTop: '48px' }} onClick={handlePlayNextMatch}>
        <Play size={20} /> START NEXT MATCH
      </button>
    </div>
  );
};
