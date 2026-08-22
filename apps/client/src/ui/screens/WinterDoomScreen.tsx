import React, { useState } from 'react';
import { useGameStore } from '../../state/useGameStore';
import { ArrowLeft, Trophy, Calendar, Users, ShieldCheck, CheckCircle2, Play, Lock, Sparkles, Video } from 'lucide-react';
import { FullscreenVideoModal } from '../components/FullscreenVideoModal';

export const WinterDoomScreen: React.FC = () => {
  const { setScreen, triggerGateTransition } = useGameStore();
  const [isPlayingFormatVideo, setIsPlayingFormatVideo] = useState(false);

  const handleBackToMainMenu = () => {
    triggerGateTransition(() => setScreen('MAIN_MENU'));
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(135deg, #06111e 0%, #030811 50%, #071527 100%)',
        color: '#ffffff',
        overflowY: 'auto',
        padding: '36px 48px',
        boxSizing: 'border-box',
        zIndex: 10,
      }}
    >
      {/* Background Icy Ambient Glow Orbs */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '20%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(0, 242, 254, 0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-10%',
          right: '10%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(79, 172, 254, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* 1. TOP NAVIGATION HEADER */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <button
          type="button"
          onClick={handleBackToMainMenu}
          className="btn-press-effect"
          style={{
            padding: '12px 24px',
            borderRadius: '16px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(112, 225, 255, 0.3)',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '0.88rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backdropFilter: 'blur(16px)',
          }}
        >
          <ArrowLeft size={18} color="#70e1ff" />
          <span>BACK TO MAIN MENU</span>
        </button>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 900, color: '#70e1ff', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            OFFICIAL CLASHA CHAMPIONSHIP • SEASON 1
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, fontStyle: 'italic', color: '#ffffff', fontFamily: "'Misery', 'QUARTZO', 'Kanit', sans-serif" }}>
            WINTER DOOM TOURNAMENT
          </div>
        </div>
      </div>

      {/* 2. MAIN 2-COLUMN ESPORTS BANNER & DETAILS LAYOUT */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '32px', marginBottom: '36px' }}>
        {/* LEFT COLUMN: TOURNAMENT BANNER IMAGE & STATS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Main Tournament Image Frame */}
          <div
            style={{
              position: 'relative',
              borderRadius: '28px',
              overflow: 'hidden',
              border: '2px solid rgba(112, 225, 255, 0.4)',
              boxShadow: '0 16px 40px rgba(0, 242, 254, 0.25), 0 20px 50px rgba(0, 0, 0, 0.7)',
              height: '340px',
            }}
          >
            <img
              src="/tournament_shutter_bg.png"
              alt="Winter Doom Tournament"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              onError={(e) => {
                // Fallback image if tournament_shutter_bg not present
                (e.currentTarget as HTMLImageElement).src = '/cabin2.jpeg';
              }}
            />

            {/* Dark Gradient Bottom Overlay */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '60%',
                background: 'linear-gradient(180deg, transparent 0%, rgba(6, 17, 30, 0.95) 100%)',
                padding: '24px',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#70e1ff', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                  $10,000 PRIZE POOL
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ffffff', fontFamily: "'Misery', 'QUARTZO', 'Kanit', sans-serif" }}>
                  SQUAD BATTLE ROYALE
                </div>
              </div>

              <span style={{ background: '#00f2fe', color: '#030811', padding: '6px 16px', borderRadius: '50px', fontWeight: 900, fontSize: '0.78rem' }}>
                ENROLLMENT OPEN
              </span>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(112, 225, 255, 0.25)', borderRadius: '20px', padding: '18px 16px', textAlign: 'center' }}>
              <Calendar size={22} color="#70e1ff" style={{ margin: '0 auto 8px' }} />
              <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#70e1ff', letterSpacing: '0.1em' }}>SCHEDULED</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#ffffff', marginTop: '2px' }}>1st Wk SEPT</div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(112, 225, 255, 0.25)', borderRadius: '20px', padding: '18px 16px', textAlign: 'center' }}>
              <Users size={22} color="#70e1ff" style={{ margin: '0 auto 8px' }} />
              <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#70e1ff', letterSpacing: '0.1em' }}>CAPACITY</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#ffffff', marginTop: '2px' }}>10 Teams</div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(112, 225, 255, 0.25)', borderRadius: '20px', padding: '18px 16px', textAlign: 'center' }}>
              <Trophy size={22} color="#70e1ff" style={{ margin: '0 auto 8px' }} />
              <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#70e1ff', letterSpacing: '0.1em' }}>REWARDS</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#ffffff', marginTop: '2px' }}>Top 1 Winner</div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: REQUIREMENTS & ENROLLMENT */}
        <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(112, 225, 255, 0.3)', borderRadius: '28px', padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <ShieldCheck size={24} color="#70e1ff" />
              <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#ffffff', letterSpacing: '0.04em' }}>
                QUALIFICATION CRITERIA
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', background: 'rgba(0, 242, 254, 0.08)', padding: '14px 18px', borderRadius: '16px', border: '1px solid rgba(0, 242, 254, 0.2)' }}>
                <CheckCircle2 size={20} color="#00f2fe" />
                <div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff' }}>Play at least 10 rounds on Clasha</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)' }}>Minimum match participation requirement</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', background: 'rgba(0, 242, 254, 0.08)', padding: '14px 18px', borderRadius: '16px', border: '1px solid rgba(0, 242, 254, 0.2)' }}>
                <CheckCircle2 size={20} color="#00f2fe" />
                <div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff' }}>Points on leaderboard &gt; 50</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)' }}>Global skill ranking score cutoff</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', background: 'rgba(0, 242, 254, 0.08)', padding: '14px 18px', borderRadius: '16px', border: '1px solid rgba(0, 242, 254, 0.2)' }}>
                <CheckCircle2 size={20} color="#00f2fe" />
                <div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff' }}>Verified Racer Account</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)' }}>Official account authentication check</div>
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="btn-press-effect"
            style={{
              width: '100%',
              padding: '18px 24px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
              border: 'none',
              color: '#030811',
              fontWeight: 900,
              fontSize: '1.1rem',
              cursor: 'pointer',
              boxShadow: '0 8px 28px rgba(0, 242, 254, 0.45)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              fontFamily: "'Misery', 'QUARTZO', 'Kanit', sans-serif",
              letterSpacing: '0.06em',
            }}
          >
            <Sparkles size={20} color="#030811" />
            <span>ENROLL IN WINTER DOOM</span>
          </button>
        </div>
      </div>

      {/* 3. BOTTOM FEATURED SECTION: FORMAT EXPLAINER BUTTON (PLAYS VIDEO t1) */}
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.12) 0%, rgba(79, 172, 254, 0.06) 100%)',
            border: '2px solid rgba(112, 225, 255, 0.4)',
            borderRadius: '28px',
            padding: '28px 36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.4)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '18px',
                background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 24px rgba(0, 242, 254, 0.65)',
                flexShrink: 0,
              }}
            >
              <Video size={30} color="#030811" />
            </div>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', fontFamily: "'Misery', 'QUARTZO', 'Kanit', sans-serif" }}>
                OFFICIAL FORMAT EXPLAINER VIDEO
              </div>
              <div style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.7)', marginTop: '2px' }}>
                Watch the official tournament rules and battle format breakdown video (Video t1)
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsPlayingFormatVideo(true)}
            className="btn-press-effect"
            style={{
              padding: '16px 32px',
              borderRadius: '20px',
              background: '#ffffff',
              color: '#030811',
              border: 'none',
              fontWeight: 900,
              fontSize: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 8px 24px rgba(255, 255, 255, 0.35)',
              fontFamily: "'Misery', 'QUARTZO', 'Kanit', sans-serif",
              letterSpacing: '0.06em',
            }}
          >
            <Play size={20} color="#030811" fill="#030811" />
            <span>FORMAT EXPLAINER</span>
          </button>
        </div>
      </div>

      {/* FULLSCREEN VIDEO MODAL FOR FORMAT EXPLAINER (VIDEO t1) */}
      {isPlayingFormatVideo && (
        <FullscreenVideoModal
          videoSrc="/videos/t1.mp4"
          title="WINTER DOOM • FORMAT EXPLAINER VIDEO (t1)"
          onComplete={() => setIsPlayingFormatVideo(false)}
        />
      )}
    </div>
  );
};
