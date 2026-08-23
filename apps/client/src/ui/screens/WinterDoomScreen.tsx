import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../state/useGameStore';
import {
  ArrowLeft,
  Trophy,
  Calendar,
  Users,
  ShieldCheck,
  Check,
  Play,
  Lock,
  Sparkles,
  Video,
  Award,
  Clock,
  Swords,
  Zap,
  Globe2,
  FileText,
  CheckCircle2,
} from 'lucide-react';
import { FullscreenVideoModal } from '../components/FullscreenVideoModal';

const APPLE_FONT = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Inter', 'Plus Jakarta Sans', sans-serif";

export const WinterDoomScreen: React.FC = () => {
  const { setScreen, triggerGateTransition } = useGameStore();
  const [isPlayingFormatVideo, setIsPlayingFormatVideo] = useState(false);

  // Live 10-Day Countdown Timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 9,
    hours: 23,
    minutes: 59,
    seconds: 59,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        }
        if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        }
        if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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
        padding: '28px 40px 48px 40px',
        boxSizing: 'border-box',
        zIndex: 10,
      }}
    >
      {/* 1. TOP HEADER & BREADCRUMB */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
        }}
      >
        <button
          type="button"
          onClick={handleBackToMainMenu}
          style={{
            padding: '10px 20px',
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
          <div
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              color: '#007aff',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '2px',
              fontFamily: APPLE_FONT,
            }}
          >
            OFFICIAL CLASHA CHAMPIONSHIP • SEASON 1
          </div>
          <div
            style={{
              fontSize: '1.8rem',
              fontWeight: 800,
              color: '#1c1c1e',
              letterSpacing: '-0.02em',
              fontFamily: APPLE_FONT,
            }}
          >
            Winter Doom Tournament
          </div>
        </div>
      </div>

      {/* 2. TOP BANNER & COUNTDOWN STRIP */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e5e5ea',
          borderRadius: '28px',
          padding: '20px 28px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.02)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '16px',
              background: '#e5f1ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Clock size={24} color="#007aff" />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#8e8e93', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              REGISTRATION COUNTDOWN
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1c1c1e', marginTop: '2px' }}>
              Registration Opens in First Week of September
            </div>
          </div>
        </div>

        {/* Countdown Digits Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: '#f2f2f7', border: '1px solid #e5e5ea', borderRadius: '16px', padding: '8px 16px', textAlign: 'center', minWidth: '65px' }}>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1c1c1e', lineHeight: 1 }}>{String(timeLeft.days).padStart(2, '0')}</div>
            <div style={{ fontSize: '0.62rem', fontWeight: 700, color: '#8e8e93', marginTop: '3px' }}>DAYS</div>
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#8e8e93' }}>:</div>

          <div style={{ background: '#f2f2f7', border: '1px solid #e5e5ea', borderRadius: '16px', padding: '8px 16px', textAlign: 'center', minWidth: '65px' }}>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1c1c1e', lineHeight: 1 }}>{String(timeLeft.hours).padStart(2, '0')}</div>
            <div style={{ fontSize: '0.62rem', fontWeight: 700, color: '#8e8e93', marginTop: '3px' }}>HOURS</div>
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#8e8e93' }}>:</div>

          <div style={{ background: '#f2f2f7', border: '1px solid #e5e5ea', borderRadius: '16px', padding: '8px 16px', textAlign: 'center', minWidth: '65px' }}>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1c1c1e', lineHeight: 1 }}>{String(timeLeft.minutes).padStart(2, '0')}</div>
            <div style={{ fontSize: '0.62rem', fontWeight: 700, color: '#8e8e93', marginTop: '3px' }}>MINS</div>
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#8e8e93' }}>:</div>

          <div style={{ background: '#f2f2f7', border: '1px solid #e5e5ea', borderRadius: '16px', padding: '8px 16px', textAlign: 'center', minWidth: '65px' }}>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#007aff', lineHeight: 1 }}>{String(timeLeft.seconds).padStart(2, '0')}</div>
            <div style={{ fontSize: '0.62rem', fontWeight: 700, color: '#8e8e93', marginTop: '3px' }}>SECS</div>
          </div>
        </div>
      </div>

      {/* 3. MAIN 3-COLUMN RICH CONTENT GRID */}
      <div
        style={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '24px',
          marginBottom: '24px',
        }}
      >
        {/* COLUMN 1: TOURNAMENT MEDIA & PRIZES */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Hero Media Card */}
          <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '28px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', border: '1px solid #e5e5ea', height: '220px' }}>
              <img
                src="/tournament_shutter_bg.png"
                alt="Winter Doom Tournament"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/cabin2.jpeg';
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '60%',
                  background: 'linear-gradient(180deg, transparent 0%, rgba(28, 28, 30, 0.9) 100%)',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#70e1ff', letterSpacing: '0.1em' }}>$10,000 TOTAL POOL</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>Winter Doom Battle</div>
                </div>
                <span style={{ background: '#e4f9ec', color: '#34c759', padding: '4px 12px', borderRadius: '9999px', fontWeight: 700, fontSize: '0.75rem' }}>
                  Enrollment Open
                </span>
              </div>
            </div>

            {/* Quick Match Specs */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ background: '#f2f2f7', borderRadius: '16px', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Swords size={18} color="#007aff" />
                <div>
                  <div style={{ fontSize: '0.65rem', color: '#8e8e93', fontWeight: 700 }}>FORMAT</div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1c1c1e' }}>5v5 Squad Battle</div>
                </div>
              </div>

              <div style={{ background: '#f2f2f7', borderRadius: '16px', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Globe2 size={18} color="#007aff" />
                <div>
                  <div style={{ fontSize: '0.65rem', color: '#8e8e93', fontWeight: 700 }}>SERVER</div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1c1c1e' }}>Asia East Arena</div>
                </div>
              </div>
            </div>
          </div>

          {/* Prize Rewards Card */}
          <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '28px', padding: '22px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1c1c1e', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={20} color="#007aff" />
              <span>Championship Prize Pool</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ background: '#fff9e6', border: '1px solid #ffe599', borderRadius: '16px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.2rem' }}>🥇</span>
                  <span style={{ fontWeight: 800, color: '#1c1c1e', fontSize: '0.9rem' }}>1st Place Winner</span>
                </div>
                <span style={{ fontWeight: 800, color: '#d97706', fontSize: '0.95rem' }}>$5,000 + Golden Trophy</span>
              </div>

              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.2rem' }}>🥈</span>
                  <span style={{ fontWeight: 800, color: '#1c1c1e', fontSize: '0.9rem' }}>2nd Place Runner Up</span>
                </div>
                <span style={{ fontWeight: 800, color: '#64748b', fontSize: '0.95rem' }}>$3,000 Prize</span>
              </div>

              <div style={{ background: '#fff5f5', border: '1px solid #fed7d7', borderRadius: '16px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.2rem' }}>🥉</span>
                  <span style={{ fontWeight: 800, color: '#1c1c1e', fontSize: '0.9rem' }}>3rd Place Finalist</span>
                </div>
                <span style={{ fontWeight: 800, color: '#c53030', fontSize: '0.95rem' }}>$2,000 Prize</span>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMN 2: SCHEDULE & TIMELINE */}
        <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '28px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1c1c1e', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={20} color="#007aff" />
            <span>Championship Schedule & Phases</span>
          </div>

          {/* Vertical Timeline Steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
            <div style={{ background: '#f2f2f7', border: '1px solid #e5e5ea', borderRadius: '20px', padding: '16px 18px', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#007aff', color: '#ffffff', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.85rem' }}>
                01
              </div>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1c1c1e' }}>Phase 1: Player Registration</div>
                <div style={{ fontSize: '0.78rem', color: '#8e8e93', marginTop: '3px' }}>Starts 1st Week of September 2026. Open for 10 qualified teams.</div>
              </div>
            </div>

            <div style={{ background: '#f2f2f7', border: '1px solid #e5e5ea', borderRadius: '20px', padding: '16px 18px', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#e5f1ff', color: '#007aff', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.85rem' }}>
                02
              </div>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1c1c1e' }}>Phase 2: Group Stage Knockouts</div>
                <div style={{ fontSize: '0.78rem', color: '#8e8e93', marginTop: '3px' }}>5v5 squad elimination rounds across Cyber Arena map tracks.</div>
              </div>
            </div>

            <div style={{ background: '#f2f2f7', border: '1px solid #e5e5ea', borderRadius: '20px', padding: '16px 18px', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#e5f1ff', color: '#007aff', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.85rem' }}>
                03
              </div>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1c1c1e' }}>Phase 3: Grand Finals Showdown</div>
                <div style={{ fontSize: '0.78rem', color: '#8e8e93', marginTop: '3px' }}>Live broadcasted finals to decide the Season 1 Champion.</div>
              </div>
            </div>
          </div>

          {/* Rules Summary Box */}
          <div style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '20px', padding: '16px 18px', marginTop: 'auto' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475569', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FileText size={16} /> Official Tournament Rules
            </div>
            <div style={{ fontSize: '0.76rem', color: '#64748b', lineHeight: 1.45 }}>
              • All racers must play using verified accounts.<br />
              • Unsportsmanlike conduct or hacking leads to immediate ban.<br />
              • Matches start strictly at scheduled round times.
            </div>
          </div>
        </div>

        {/* COLUMN 3: QUALIFICATION REQUIREMENTS & ENROLLMENT */}
        <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '28px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1c1c1e', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={20} color="#007aff" />
              <span>Qualification Checklist</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              <div style={{ background: '#f2f2f7', border: '1px solid #e5e5ea', borderRadius: '18px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#e4f9ec', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Check size={16} color="#34c759" strokeWidth={2.5} />
                </div>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1c1c1e' }}>10+ Matches Played</div>
                  <div style={{ fontSize: '0.72rem', color: '#8e8e93' }}>Minimum round participation met</div>
                </div>
              </div>

              <div style={{ background: '#f2f2f7', border: '1px solid #e5e5ea', borderRadius: '18px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#e4f9ec', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Check size={16} color="#34c759" strokeWidth={2.5} />
                </div>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1c1c1e' }}>50+ Leaderboard Points</div>
                  <div style={{ fontSize: '0.72rem', color: '#8e8e93' }}>Global skill ranking cutoff met</div>
                </div>
              </div>

              <div style={{ background: '#f2f2f7', border: '1px solid #e5e5ea', borderRadius: '18px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#e4f9ec', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Check size={16} color="#34c759" strokeWidth={2.5} />
                </div>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1c1c1e' }}>Verified Racer Profile</div>
                  <div style={{ fontSize: '0.72rem', color: '#8e8e93' }}>Official account identity verified</div>
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            style={{
              width: '100%',
              padding: '16px',
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
              boxShadow: '0 4px 14px rgba(0, 122, 255, 0.25)',
            }}
          >
            <Sparkles size={18} color="#ffffff" />
            <span>Enroll in Winter Doom</span>
          </button>
        </div>
      </div>

      {/* 4. BOTTOM FEATURED CARD: FORMAT EXPLAINER BUTTON (PLAYS VIDEO t1) */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <div
          style={{
            width: '100%',
            background: '#ffffff',
            border: '1px solid #e5e5ea',
            borderRadius: '28px',
            padding: '20px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '16px',
                background: '#e5f1ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Video size={24} color="#007aff" />
            </div>
            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1c1c1e', fontFamily: APPLE_FONT }}>
                Official Format Explainer Video
              </div>
              <div style={{ fontSize: '0.8rem', color: '#8e8e93', marginTop: '2px', fontFamily: APPLE_FONT }}>
                Watch the official tournament rules and battle format breakdown video (Video t1)
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsPlayingFormatVideo(true)}
            style={{
              padding: '12px 26px',
              borderRadius: '9999px',
              background: '#1c1c1e',
              color: '#ffffff',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
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
