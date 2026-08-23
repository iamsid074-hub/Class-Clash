import React, { useState } from 'react';
import { useGameStore } from '../../state/useGameStore';
import { ArrowLeft, Trophy, Calendar, Users, ShieldCheck, Check, Play, Lock, Sparkles, Video } from 'lucide-react';
import { FullscreenVideoModal } from '../components/FullscreenVideoModal';

const APPLE_FONT = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Inter', 'Plus Jakarta Sans', sans-serif";

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
        background: '#f2f2f7',
        color: '#1c1c1e',
        fontFamily: APPLE_FONT,
        overflowY: 'auto',
        padding: '36px 48px',
        boxSizing: 'border-box',
        zIndex: 10,
      }}
    >
      {/* 1. TOP NAVIGATION HEADER */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <button
          type="button"
          onClick={handleBackToMainMenu}
          style={{
            padding: '10px 22px',
            borderRadius: '9999px',
            background: '#ffffff',
            border: '1px solid #e5e5ea',
            color: '#1c1c1e',
            fontWeight: 700,
            fontSize: '0.88rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
            transition: 'all 0.2s ease',
            fontFamily: APPLE_FONT,
          }}
        >
          <ArrowLeft size={18} color="#007aff" />
          <span>Back to Main Menu</span>
        </button>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#007aff', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '2px', fontFamily: APPLE_FONT }}>
            UPCOMING CHAMPIONSHIP
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1c1c1e', letterSpacing: '-0.02em', fontFamily: APPLE_FONT }}>
            Winter Doom Tournament
          </div>
        </div>
      </div>

      {/* 2. MAIN 2-COLUMN PROFILE-STYLE CARDS LAYOUT */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '28px', marginBottom: '28px' }}>
        {/* LEFT COLUMN: BANNER IMAGE & QUICK STATS */}
        <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '32px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Main Tournament Image Frame */}
          <div
            style={{
              position: 'relative',
              borderRadius: '24px',
              overflow: 'hidden',
              border: '1px solid #e5e5ea',
              height: '300px',
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
                (e.currentTarget as HTMLImageElement).src = '/cabin2.jpeg';
              }}
            />

            {/* Dark Bottom Overlay */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '55%',
                background: 'linear-gradient(180deg, transparent 0%, rgba(28, 28, 30, 0.88) 100%)',
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#70e1ff', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: APPLE_FONT }}>
                  $10,000 PRIZE POOL
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.01em', fontFamily: APPLE_FONT }}>
                  Squad Battle Royale
                </div>
              </div>

              <span
                style={{
                  background: '#e4f9ec',
                  color: '#34c759',
                  padding: '6px 16px',
                  borderRadius: '9999px',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  fontFamily: APPLE_FONT,
                }}
              >
                Enrollment Open
              </span>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
            <div style={{ background: '#f2f2f7', border: '1px solid #e5e5ea', borderRadius: '20px', padding: '16px 12px', textAlign: 'center' }}>
              <Calendar size={20} color="#007aff" style={{ margin: '0 auto 6px' }} />
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8e8e93', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: APPLE_FONT }}>SCHEDULED</div>
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1c1c1e', marginTop: '2px', fontFamily: APPLE_FONT }}>1st Wk SEPT</div>
            </div>

            <div style={{ background: '#f2f2f7', border: '1px solid #e5e5ea', borderRadius: '20px', padding: '16px 12px', textAlign: 'center' }}>
              <Users size={20} color="#007aff" style={{ margin: '0 auto 6px' }} />
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8e8e93', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: APPLE_FONT }}>CAPACITY</div>
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1c1c1e', marginTop: '2px', fontFamily: APPLE_FONT }}>10 Teams</div>
            </div>

            <div style={{ background: '#f2f2f7', border: '1px solid #e5e5ea', borderRadius: '20px', padding: '16px 12px', textAlign: 'center' }}>
              <Trophy size={20} color="#007aff" style={{ margin: '0 auto 6px' }} />
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8e8e93', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: APPLE_FONT }}>REWARDS</div>
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1c1c1e', marginTop: '2px', fontFamily: APPLE_FONT }}>Top 1 Winner</div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: QUALIFICATION REQUIREMENTS */}
        <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '32px', padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1c1c1e', marginBottom: '18px', letterSpacing: '-0.01em', fontFamily: APPLE_FONT }}>
              Qualification Requirements
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
              <div style={{ background: '#f2f2f7', border: '1px solid #e5e5ea', borderRadius: '20px', padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e4f9ec', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Check size={18} color="#34c759" strokeWidth={2.5} />
                </div>
                <div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#1c1c1e', fontFamily: APPLE_FONT }}>Play at least 10 rounds on Clasha</div>
                  <div style={{ fontSize: '0.75rem', color: '#8e8e93', marginTop: '2px', fontFamily: APPLE_FONT }}>Minimum match participation requirement</div>
                </div>
              </div>

              <div style={{ background: '#f2f2f7', border: '1px solid #e5e5ea', borderRadius: '20px', padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e4f9ec', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Check size={18} color="#34c759" strokeWidth={2.5} />
                </div>
                <div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#1c1c1e', fontFamily: APPLE_FONT }}>Points on leaderboard &gt; 50</div>
                  <div style={{ fontSize: '0.75rem', color: '#8e8e93', marginTop: '2px', fontFamily: APPLE_FONT }}>Global skill ranking score cutoff</div>
                </div>
              </div>

              <div style={{ background: '#f2f2f7', border: '1px solid #e5e5ea', borderRadius: '20px', padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e4f9ec', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Check size={18} color="#34c759" strokeWidth={2.5} />
                </div>
                <div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#1c1c1e', fontFamily: APPLE_FONT }}>Verified Racer Account</div>
                  <div style={{ fontSize: '0.75rem', color: '#8e8e93', marginTop: '2px', fontFamily: APPLE_FONT }}>Official account authentication check</div>
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            style={{
              width: '100%',
              padding: '16px 24px',
              borderRadius: '9999px',
              background: '#007aff',
              border: 'none',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.98rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
              fontFamily: APPLE_FONT,
            }}
          >
            <Sparkles size={18} color="#ffffff" />
            <span>Enroll in Winter Doom</span>
          </button>
        </div>
      </div>

      {/* 3. BOTTOM FEATURED CARD: FORMAT EXPLAINER BUTTON (PLAYS VIDEO t1) */}
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e5e5ea',
            borderRadius: '32px',
            padding: '24px 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '16px',
                background: '#e5f1ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Video size={26} color="#007aff" />
            </div>
            <div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1c1c1e', fontFamily: APPLE_FONT }}>
                Official Format Explainer Video
              </div>
              <div style={{ fontSize: '0.82rem', color: '#8e8e93', marginTop: '2px', fontFamily: APPLE_FONT }}>
                Watch the official tournament rules and battle format breakdown video (Video t1)
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsPlayingFormatVideo(true)}
            style={{
              padding: '14px 28px',
              borderRadius: '9999px',
              background: '#1c1c1e',
              color: '#ffffff',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.92rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              transition: 'all 0.2s ease',
              fontFamily: APPLE_FONT,
            }}
          >
            <Play size={16} color="#ffffff" fill="#ffffff" />
            <span>Format Explainer</span>
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
