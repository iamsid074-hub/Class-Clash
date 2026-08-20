import React, { useState } from 'react';
import { useGameStore } from '../../state/useGameStore';
import { ArrowLeft, Trophy, Crown, Flame, Search, Medal, UserCheck } from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  displayName: string;
  avatarId: string;
  teamName: string;
  wins: number;
  races: number;
  winRate: string;
  points: number;
  isLocalPlayer?: boolean;
}

// 4 Distinct High-Resolution Vector Racer Avatars
const RacerAvatarSvg: React.FC<{ avatarId?: string; size?: number }> = ({ avatarId = 'avatar_cyber', size = 44 }) => {
  const index = Math.abs(
    (avatarId || 'avatar_cyber').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  ) % 4;

  switch (index) {
    case 0:
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="30" fill="#2b0a3d" stroke="#ff007f" strokeWidth="2.5" />
          <path d="M18 26C18 20 24 16 32 16C40 16 46 20 46 26V38C46 44 40 48 32 48C24 48 18 44 18 38V26Z" fill="#3d1454" />
          <path d="M14 26C14 24 20 22 32 22C44 22 50 24 50 26C50 31 44 33 32 33C20 33 14 31 14 26Z" fill="#ff007f" />
          <path d="M20 26H44" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
          <circle cx="32" cy="42" r="3" fill="#ff66b3" />
        </svg>
      );
    case 1:
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="30" fill="#15102a" stroke="#ff66b3" strokeWidth="2.5" />
          <path d="M16 22L32 14L48 22V42L32 50L16 42V22Z" fill="#251d42" />
          <path d="M20 28H44V34H20V28Z" fill="#0f0b1e" stroke="#ff0066" strokeWidth="1.5" />
          <circle cx="26" cy="31" r="2.5" fill="#ffffff" />
          <circle cx="38" cy="31" r="2.5" fill="#ffffff" />
          <path d="M26 40H38" stroke="#ff0066" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 2:
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="30" fill="#2d0f3c" stroke="#ffffff" strokeWidth="2" />
          <rect x="20" y="18" width="24" height="28" rx="8" fill="#4d1b64" />
          <path d="M22 24C22 22 26 20 32 20C38 20 42 22 42 24V32C42 34 38 36 32 36C26 36 22 34 22 32V24Z" fill="#ff007f" />
          <path d="M25 28L39 28" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
          <path d="M12 28H18M46 28H52" stroke="#ff66b3" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case 3:
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="30" fill="#23062c" stroke="#ffd700" strokeWidth="2.5" />
          <path d="M18 20L25 14L32 22L39 14L46 20V42H18V20Z" fill="#ff0066" />
          <path d="M22 28H42V36H22V28Z" fill="#260830" />
          <path d="M26 32H38" stroke="#ffd700" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="32" cy="12" r="3" fill="#ffd700" />
        </svg>
      );
  }
};

export const LeaderboardScreen: React.FC = () => {
  const { setScreen, displayName, triggerGateTransition } = useGameStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'ALL' | 'TOP' | 'LOCAL'>('ALL');
  const [realLeaderboard, setRealLeaderboard] = useState<LeaderboardEntry[]>([]);

  // Dynamically load real registered racer accounts & user sessions
  React.useEffect(() => {
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
          displayName: displayName || 'RACER_ONE',
          avatar: 'avatar_cyber',
          matchesPlayed: 0,
          leaderboardPoints: 0,
        });
      }

      const sorted: LeaderboardEntry[] = profiles
        .sort((a, b) => (b.leaderboardPoints || 0) - (a.leaderboardPoints || 0))
        .map((p, idx) => ({
          rank: idx + 1,
          displayName: p.displayName || 'RACER',
          avatarId: p.avatar || 'avatar_cyber',
          teamName: 'ARENA SQUAD',
          wins: Math.floor((p.matchesPlayed || 0) * 0.7),
          races: p.matchesPlayed || 0,
          winRate: (p.matchesPlayed || 0) > 0 ? `${Math.round(((p.matchesPlayed || 0) * 0.7 / (p.matchesPlayed || 1)) * 100)}%` : '0%',
          points: p.leaderboardPoints || 0,
          isLocalPlayer: currentUser ? p.displayName === currentUser.displayName : true,
        }));

      setRealLeaderboard(sorted);
    } catch {
      setRealLeaderboard([]);
    }
  }, [displayName]);

  const filteredList = realLeaderboard.filter((entry) => {
    const matchesSearch =
      entry.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.teamName.toLowerCase().includes(searchQuery.toLowerCase());
    if (filterMode === 'TOP') return matchesSearch && entry.rank <= 5;
    return matchesSearch;
  });
  const myPlayerEntry = realLeaderboard.find((e) => e.isLocalPlayer) || realLeaderboard[0] || {
    rank: 1,
    displayName: displayName || 'RACER_ONE',
    avatarId: 'avatar_cyber',
    teamName: 'ARENA SQUAD',
    wins: 0,
    races: 0,
    winRate: '0%',
    points: 0,
    isLocalPlayer: true,
  };

  const rank1 = realLeaderboard[0] || myPlayerEntry;
  const rank2 = realLeaderboard[1] || null;
  const rank3 = realLeaderboard[2] || null;

  return (
    <div
      className="screen-overlay"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(135deg, #fff0f6 0%, #ffffff 45%, #ffe6f2 100%)',
        padding: '24px 36px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        overflow: 'hidden',
        zIndex: 10,
        pointerEvents: 'auto',
        fontFamily: "'Outfit', sans-serif",
        color: '#1a1a24',
      }}
    >
      {/* 1. FULL WIDTH TOP BAR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        {/* Left: Back Button */}
        <button
          className="hud-interactive"
          onClick={() => triggerGateTransition(() => setScreen('MAIN_MENU'), 'MAIN MENU', 'CLASHA')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 22px',
            fontSize: '0.95rem',
            fontWeight: 800,
            background: '#ffffff',
            border: '2px solid #ff66a3',
            color: '#ff0066',
            borderRadius: '50px',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(255, 0, 102, 0.15)',
          }}
        >
          <ArrowLeft size={18} color="#ff0066" /> BACK TO MENU
        </button>

        {/* Right: LEADERBOARD Title Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ff0066 0%, #ff66b3 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 6px 18px rgba(255, 0, 102, 0.35)',
            }}
          >
            <Trophy size={22} color="#ffffff" />
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#ff0066', letterSpacing: '0.12em' }}>
              GLOBAL STANDINGS
            </div>
            <div
              style={{
                fontSize: '1.9rem',
                fontWeight: 900,
                color: '#1a1a24',
                fontStyle: 'italic',
                fontFamily: "'Kanit', sans-serif",
                margin: 0,
                lineHeight: 1.1,
              }}
            >
              LEADERBOARD
            </div>
          </div>
        </div>
      </div>

      {/* 2. FULL WIDTH RESPONSIVE DASHBOARD GRID */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'clamp(14px, 2vw, 24px)',
          flex: 1,
          minHeight: 0,
          width: '100%',
          overflowY: 'auto',
        }}
      >
        {/* LEFT COLUMN: PODIUM HALL OF FAME + YOUR CARD */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
          {/* Top 3 Podium Card Box */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              border: '2px solid #ffe0ec',
              padding: '20px',
              boxShadow: '0 8px 24px rgba(255, 0, 102, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            <div style={{ fontWeight: 900, fontSize: '1rem', color: '#ff0066', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Crown size={18} color="#ff0066" /> TOP 3 CHAMPIONS
            </div>

            {/* Rank 1 Card */}
            <div
              style={{
                background: 'linear-gradient(135deg, #fff7ed 0%, #ffffff 100%)',
                border: '2px solid #ffd700',
                borderRadius: '14px',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 4px 14px rgba(255, 215, 0, 0.25)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    background: 'linear-gradient(135deg, #ffd700 0%, #ffaa00 100%)',
                    color: '#1a1a24',
                    fontWeight: 900,
                    fontSize: '0.8rem',
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  🥇
                </div>
                <RacerAvatarSvg avatarId={rank1.avatarId} size={42} />
                <div>
                  <div style={{ fontWeight: 900, fontSize: '0.95rem', color: '#1a1a24' }}>{rank1.displayName}</div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#ff0066' }}>{rank1.teamName}</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#ff0066' }}>{rank1.points} PTS</div>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#888899' }}>{rank1.winRate} WIN</div>
              </div>
            </div>

            {/* Rank 2 Card */}
            <div
              style={{
                background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
                border: '1.5px solid #cbd5e1',
                borderRadius: '14px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    background: '#cbd5e1',
                    color: '#475569',
                    fontWeight: 900,
                    fontSize: '0.8rem',
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  🥈
                </div>
                <RacerAvatarSvg avatarId={rank2?.avatarId || 'avatar_cyber'} size={38} />
                <div>
                  <div style={{ fontWeight: 900, fontSize: '0.9rem', color: '#1a1a24' }}>{rank2?.displayName || 'VACANT SLOT'}</div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#666677' }}>{rank2?.teamName || 'CHALLENGER SQUAD'}</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#1a1a24' }}>{rank2?.points || 0} PTS</div>
              </div>
            </div>

            {/* Rank 3 Card */}
            <div
              style={{
                background: 'linear-gradient(135deg, #fff7ed 0%, #ffffff 100%)',
                border: '1.5px solid #fdba74',
                borderRadius: '14px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    background: '#fed7aa',
                    color: '#9a3412',
                    fontWeight: 900,
                    fontSize: '0.8rem',
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  🥉
                </div>
                <RacerAvatarSvg avatarId={rank3?.avatarId || 'avatar_cyber'} size={38} />
                <div>
                  <div style={{ fontWeight: 900, fontSize: '0.9rem', color: '#1a1a24' }}>{rank3?.displayName || 'VACANT SLOT'}</div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#666677' }}>{rank3?.teamName || 'RENEGADE SQUAD'}</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#1a1a24' }}>{rank3?.points || 0} PTS</div>
              </div>
            </div>
          </div>

          {/* YOUR PLAYER CARD BOX */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(255, 0, 102, 0.95) 0%, rgba(255, 102, 179, 0.95) 100%)',
              borderRadius: '20px',
              padding: '20px',
              color: '#ffffff',
              boxShadow: '0 10px 25px rgba(255, 0, 102, 0.35)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 900, letterSpacing: '0.08em', color: '#ffe6f2' }}>
                YOUR RANK & STATS
              </div>
              <div style={{ background: '#ffffff', color: '#ff0066', fontWeight: 900, fontSize: '0.75rem', padding: '3px 10px', borderRadius: '12px' }}>
                #{myPlayerEntry.rank} RANKED
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
              <RacerAvatarSvg avatarId={myPlayerEntry.avatarId} size={54} />
              <div>
                <div style={{ fontWeight: 900, fontSize: '1.25rem' }}>{myPlayerEntry.displayName}</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#ffe6f2' }}>{myPlayerEntry.teamName}</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.18)', borderRadius: '12px', padding: '10px 14px' }}>
              <div>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#ffe6f2' }}>SCORE</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 900 }}>{myPlayerEntry.points} PTS</div>
              </div>
              <div>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#ffe6f2' }}>WIN RATE</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 900 }}>{myPlayerEntry.winRate}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#ffe6f2' }}>WINS</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 900 }}>{myPlayerEntry.wins}</div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: FULL WIDTH RANKINGS TABLE & SEARCH FILTER */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '20px',
            border: '2px solid #ffe0ec',
            padding: '24px',
            boxShadow: '0 8px 30px rgba(255, 0, 102, 0.06)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            minHeight: 0,
            overflow: 'hidden',
          }}
        >
          {/* Search & Filter Header Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
            {/* Filter Chips */}
            <div style={{ display: 'flex', gap: '8px' }}>
              {(['ALL', 'TOP', 'LOCAL'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setFilterMode(mode)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '30px',
                    border: filterMode === mode ? 'none' : '1.5px solid #ffb6c1',
                    background: filterMode === mode ? 'linear-gradient(135deg, #ff0066 0%, #ff3385 100%)' : '#ffffff',
                    color: filterMode === mode ? '#ffffff' : '#666677',
                    fontWeight: 900,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: filterMode === mode ? '0 4px 12px rgba(255, 0, 102, 0.3)' : 'none',
                  }}
                >
                  {mode === 'ALL' ? 'ALL RACERS' : mode === 'TOP' ? 'TOP 5 ONLY' : 'MY SQUAD'}
                </button>
              ))}
            </div>

            {/* Live Search Input */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#fff0f6',
                border: '1.5px solid #ffb6c1',
                borderRadius: '30px',
                padding: '6px 16px',
                width: '280px',
              }}
            >
              <Search size={16} color="#ff0066" />
              <input
                type="text"
                placeholder="Search racer or squad..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#1a1a24',
                  width: '100%',
                }}
              />
            </div>
          </div>

          {/* Table Column Headers */}
          <div
            style={{
              display: 'flex',
              padding: '10px 20px',
              background: '#fff8fa',
              borderRadius: '12px',
              fontSize: '0.75rem',
              fontWeight: 900,
              color: '#ff0066',
              letterSpacing: '0.06em',
            }}
          >
            <div style={{ width: '80px' }}>RANK</div>
            <div style={{ flex: 2 }}>RACER NAME</div>
            <div style={{ flex: 1.5 }}>SQUAD</div>
            <div style={{ flex: 1, textAlign: 'center' }}>WINS / RACES</div>
            <div style={{ flex: 1, textAlign: 'center' }}>WIN RATE</div>
            <div style={{ flex: 1, textAlign: 'right' }}>SCORE POINTS</div>
          </div>

          {/* Full-Width Scrollable Rankings List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', flex: 1, paddingRight: '4px' }}>
            {filteredList.map((player) => (
              <div
                key={player.rank}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 20px',
                  borderRadius: '14px',
                  transition: 'all 0.2s ease',
                  background: player.isLocalPlayer
                    ? 'linear-gradient(135deg, rgba(255, 0, 102, 0.12) 0%, rgba(255, 102, 179, 0.08) 100%)'
                    : player.rank % 2 === 0
                    ? '#fffafc'
                    : '#ffffff',
                  border: player.isLocalPlayer
                    ? '2px solid #ff0066'
                    : '1px solid #ffe6f0',
                  boxShadow: player.isLocalPlayer ? '0 4px 16px rgba(255, 0, 102, 0.2)' : 'none',
                }}
              >
                {/* Rank Badge */}
                <div style={{ width: '80px', display: 'flex', alignItems: 'center' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: player.rank <= 3 ? '#ff0066' : '#f1f5f9',
                      color: player.rank <= 3 ? '#ffffff' : '#64748b',
                      fontWeight: 900,
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    #{player.rank}
                  </div>
                </div>

                {/* Racer Avatar & Name */}
                <div style={{ flex: 2, display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <RacerAvatarSvg avatarId={player.avatarId} size={40} />
                  <div>
                    <div style={{ fontWeight: 900, fontSize: '1.05rem', color: '#1a1a24', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {player.displayName}
                      {player.isLocalPlayer && (
                        <span
                          style={{
                            background: '#ff0066',
                            color: '#ffffff',
                            fontSize: '0.65rem',
                            fontWeight: 900,
                            padding: '2px 8px',
                            borderRadius: '10px',
                          }}
                        >
                          YOU
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Squad */}
                <div style={{ flex: 1.5, fontSize: '0.85rem', fontWeight: 800, color: '#ff0066' }}>
                  {player.teamName}
                </div>

                {/* Wins / Races */}
                <div style={{ flex: 1, textAlign: 'center', fontSize: '0.9rem', fontWeight: 900, color: '#1a1a24' }}>
                  {player.wins} / {player.races}
                </div>

                {/* Win Rate */}
                <div style={{ flex: 1, textAlign: 'center', fontSize: '0.9rem', fontWeight: 900, color: '#ff0066' }}>
                  {player.winRate}
                </div>

                {/* Points */}
                <div style={{ flex: 1, textAlign: 'right', fontSize: '1.1rem', fontWeight: 900, color: '#ff0066' }}>
                  {player.points.toLocaleString()} PTS
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
