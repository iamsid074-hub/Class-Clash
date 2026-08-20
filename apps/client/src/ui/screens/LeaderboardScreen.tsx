import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../state/useGameStore';
import { ArrowLeft, Trophy, Search, UserCheck, Check, Sparkles, User, Medal } from 'lucide-react';

const APPLE_FONT = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Inter', 'Plus Jakarta Sans', sans-serif";

interface LeaderboardEntry {
  rank: number;
  displayName: string;
  avatarId: string;
  wins: number;
  races: number;
  winRate: string;
  points: number;
  isLocalPlayer?: boolean;
}

export const LeaderboardScreen: React.FC = () => {
  const { setScreen, displayName, triggerGateTransition } = useGameStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'ALL' | 'TOP'>('ALL');
  const [realLeaderboard, setRealLeaderboard] = useState<LeaderboardEntry[]>([]);

  // Dynamically load real registered racer accounts & user sessions
  useEffect(() => {
    try {
      const storedUsersRaw = localStorage.getItem('clasha_registered_users');
      const sessionRaw = localStorage.getItem('class_clash_session');
      const currentUser = sessionRaw ? JSON.parse(sessionRaw) : null;
      
      const userMap: Record<string, any> = storedUsersRaw ? JSON.parse(storedUsersRaw) : {};
      const profiles: any[] = Object.values(userMap).map((u: any) => u.profile).filter(Boolean);

      if (currentUser && !profiles.some((p) => p.displayName === currentUser.displayName)) {
        profiles.push(currentUser);
      }

      if (profiles.length === 0 && currentUser) {
        profiles.push(currentUser);
      }

      // If no users registered yet, show active racer entry
      if (profiles.length === 0) {
        profiles.push({
          displayName: displayName || '2eosV3',
          avatar: 'avatar_cyber',
          matchesPlayed: 0,
          leaderboardPoints: 0,
        });
      }

      const sorted: LeaderboardEntry[] = profiles
        .sort((a, b) => (b.leaderboardPoints || 0) - (a.leaderboardPoints || 0))
        .map((p, idx) => {
          const races = p.matchesPlayed || 0;
          const wins = Math.floor(races * 0.7);
          const winRatePercent = races > 0 ? `${Math.round((wins / races) * 100)}%` : '0%';
          return {
            rank: idx + 1,
            displayName: p.displayName || 'CLASHA Player',
            avatarId: p.avatar || 'avatar_cyber',
            wins,
            races,
            winRate: winRatePercent,
            points: p.leaderboardPoints || 0,
            isLocalPlayer: currentUser ? p.displayName === currentUser.displayName : true,
          };
        });

      setRealLeaderboard(sorted);
    } catch {
      setRealLeaderboard([]);
    }
  }, [displayName]);

  const filteredList = realLeaderboard.filter((entry) => {
    const matchesSearch = entry.displayName.toLowerCase().includes(searchQuery.toLowerCase());
    if (filterMode === 'TOP') return matchesSearch && entry.rank <= 10;
    return matchesSearch;
  });

  const myPlayerEntry = realLeaderboard.find((e) => e.isLocalPlayer) || realLeaderboard[0] || {
    rank: 1,
    displayName: displayName || '2eosV3',
    avatarId: 'avatar_cyber',
    wins: 0,
    races: 0,
    winRate: '0%',
    points: 0,
    isLocalPlayer: true,
  };

  const handleBackToMenu = () => {
    triggerGateTransition(() => {
      setScreen('MAIN_MENU');
    }, 'MAIN MENU', 'CLASHA');
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 10,
        background: '#f2f2f7',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflowY: 'auto',
        color: '#1c1c1e',
        fontFamily: APPLE_FONT,
        padding: '36px 48px',
        boxSizing: 'border-box',
      }}
    >
      {/* TOP RIGHT iOS CIRCULAR BACK BUTTON */}
      <button
        onClick={handleBackToMenu}
        title="Back to Menu"
        style={{
          position: 'absolute',
          top: '28px',
          right: '36px',
          width: '44px',
          height: '44px',
          borderRadius: '9999px',
          background: '#ffffff',
          border: '1px solid #e5e5ea',
          color: '#1c1c1e',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)',
          transition: 'all 0.2s ease',
          zIndex: 40,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#007aff';
          e.currentTarget.style.color = '#ffffff';
          e.currentTarget.style.transform = 'scale(1.08)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#ffffff';
          e.currentTarget.style.color = '#1c1c1e';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <ArrowLeft size={20} strokeWidth={2.5} />
      </button>

      {/* CENTERED CONTAINER (MAX-WIDTH: 1000px) */}
      <div style={{ width: '100%', maxWidth: '1000px', textAlign: 'left' }}>
        
        {/* Screen Title Header */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1c1c1e', letterSpacing: '-0.03em', fontFamily: APPLE_FONT, textTransform: 'none' }}>
            Leaderboard
          </div>
          <div style={{ fontSize: '0.9rem', color: '#8e8e93', marginTop: '2px', fontWeight: 500, fontFamily: APPLE_FONT, textTransform: 'none' }}>
            Global Player Rankings &amp; Competitive Standings
          </div>
        </div>

        {/* 1. YOUR RANK SUMMARY BANNER */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            background: '#ffffff',
            border: '1px solid #e5e5ea',
            borderRadius: '32px',
            padding: '24px 32px',
            boxSizing: 'border-box',
            marginBottom: '24px',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.03)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '9999px',
                background: 'linear-gradient(135deg, #007aff 0%, #5856d6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 6px 20px rgba(0, 122, 255, 0.3)',
                flexShrink: 0,
              }}
            >
              <User size={32} color="#ffffff" strokeWidth={2} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1c1c1e', letterSpacing: '-0.02em', fontFamily: APPLE_FONT, textTransform: 'none' }}>
                  {myPlayerEntry.displayName}
                </span>
                <span style={{ background: '#e4f9ec', color: '#34c759', padding: '3px 10px', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 700, fontFamily: APPLE_FONT }}>
                  YOU
                </span>
              </div>
              <div style={{ fontSize: '0.85rem', color: '#8e8e93', marginTop: '2px', fontWeight: 500, fontFamily: APPLE_FONT, textTransform: 'none' }}>
                Global Standing #{myPlayerEntry.rank} • {myPlayerEntry.races} Rounds Played
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8e8e93', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: APPLE_FONT }}>
                YOUR SCORE
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#007aff', marginTop: '2px', fontFamily: APPLE_FONT }}>
                {myPlayerEntry.points} PTS
              </div>
            </div>

            <div
              style={{
                background: '#007aff',
                color: '#ffffff',
                padding: '10px 20px',
                borderRadius: '9999px',
                fontSize: '0.9rem',
                fontWeight: 700,
                fontFamily: APPLE_FONT,
                boxShadow: '0 4px 14px rgba(0, 122, 255, 0.3)',
              }}
            >
              #{myPlayerEntry.rank} Ranked
            </div>
          </div>
        </div>

        {/* 2. MAIN LEADERBOARD TABLE CONTAINER */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e5e5ea',
            borderRadius: '32px',
            padding: '28px 32px',
            boxSizing: 'border-box',
            marginBottom: '32px',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.03)',
          }}
        >
          {/* Controls Bar: Search Input & Filter Pills */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '16px', flexWrap: 'wrap' }}>
            {/* Search Input */}
            <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
              <Search size={18} color="#8e8e93" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search player name..."
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 46px',
                  borderRadius: '9999px',
                  border: '1px solid #d1d1d6',
                  background: '#ffffff',
                  color: '#1c1c1e',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: APPLE_FONT,
                }}
              />
            </div>

            {/* Filter Pills */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setFilterMode('ALL')}
                style={{
                  padding: '10px 22px',
                  borderRadius: '9999px',
                  background: filterMode === 'ALL' ? '#007aff' : '#f2f2f7',
                  border: filterMode === 'ALL' ? 'none' : '1px solid #e5e5ea',
                  color: filterMode === 'ALL' ? '#ffffff' : '#1c1c1e',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  fontFamily: APPLE_FONT,
                  textTransform: 'none',
                  transition: 'all 0.2s ease',
                  boxShadow: filterMode === 'ALL' ? '0 4px 14px rgba(0, 122, 255, 0.3)' : 'none',
                }}
              >
                All Players
              </button>

              <button
                type="button"
                onClick={() => setFilterMode('TOP')}
                style={{
                  padding: '10px 22px',
                  borderRadius: '9999px',
                  background: filterMode === 'TOP' ? '#007aff' : '#f2f2f7',
                  border: filterMode === 'TOP' ? 'none' : '1px solid #e5e5ea',
                  color: filterMode === 'TOP' ? '#ffffff' : '#1c1c1e',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  fontFamily: APPLE_FONT,
                  textTransform: 'none',
                  transition: 'all 0.2s ease',
                  boxShadow: filterMode === 'TOP' ? '0 4px 14px rgba(0, 122, 255, 0.3)' : 'none',
                }}
              >
                Top 10 Only
              </button>
            </div>
          </div>

          {/* Table Column Headers */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '80px 2fr 1.2fr 1fr 1.2fr',
              padding: '0 20px 14px 20px',
              borderBottom: '1px solid #e5e5ea',
              fontSize: '0.68rem',
              fontWeight: 700,
              color: '#8e8e93',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontFamily: APPLE_FONT,
            }}
          >
            <div>RANK</div>
            <div>PLAYER NAME</div>
            <div>ROUNDS PLAYED</div>
            <div>WIN RATE</div>
            <div style={{ textAlign: 'right' }}>SCORE POINTS</div>
          </div>

          {/* Table Body Rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
            {filteredList.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#8e8e93', fontWeight: 600, fontFamily: APPLE_FONT }}>
                No players found matching "{searchQuery}".
              </div>
            ) : (
              filteredList.map((entry) => (
                <div
                  key={entry.rank}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '80px 2fr 1.2fr 1fr 1.2fr',
                    alignItems: 'center',
                    padding: '16px 20px',
                    borderRadius: '20px',
                    background: entry.isLocalPlayer ? '#f0f7ff' : '#ffffff',
                    border: entry.isLocalPlayer ? '1px solid #007aff' : '1px solid #f2f2f7',
                    boxShadow: entry.isLocalPlayer ? '0 4px 16px rgba(0, 122, 255, 0.08)' : 'none',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {/* Rank Column */}
                  <div>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '36px',
                        height: '36px',
                        borderRadius: '9999px',
                        fontSize: '0.9rem',
                        fontWeight: 800,
                        background:
                          entry.rank === 1
                            ? '#fff3e0'
                            : entry.rank === 2
                            ? '#f2f2f7'
                            : entry.rank === 3
                            ? '#fff5eb'
                            : '#f2f2f7',
                        color:
                          entry.rank === 1
                            ? '#ff9500'
                            : entry.rank === 2
                            ? '#8e8e93'
                            : entry.rank === 3
                            ? '#c67d0a'
                            : '#1c1c1e',
                        fontFamily: APPLE_FONT,
                      }}
                    >
                      #{entry.rank}
                    </span>
                  </div>

                  {/* Player Name Column */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '9999px',
                        background: entry.isLocalPlayer ? '#007aff' : '#e5e5ea',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        flexShrink: 0,
                      }}
                    >
                      <User size={18} color={entry.isLocalPlayer ? '#ffffff' : '#8e8e93'} />
                    </div>

                    <div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1c1c1e', fontFamily: APPLE_FONT, textTransform: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>{entry.displayName}</span>
                        {entry.isLocalPlayer && (
                          <span style={{ background: '#007aff', color: '#ffffff', padding: '2px 8px', borderRadius: '9999px', fontSize: '0.65rem', fontWeight: 800, fontFamily: APPLE_FONT }}>
                            YOU
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Rounds Played Column */}
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1c1c1e', fontFamily: APPLE_FONT, textTransform: 'none' }}>
                    {entry.races} Rounds
                  </div>

                  {/* Win Rate Column */}
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#34c759', fontFamily: APPLE_FONT, textTransform: 'none' }}>
                    {entry.winRate}
                  </div>

                  {/* Score Points Column */}
                  <div style={{ textAlign: 'right', fontSize: '1.1rem', fontWeight: 800, color: '#007aff', fontFamily: APPLE_FONT }}>
                    {entry.points} PTS
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
