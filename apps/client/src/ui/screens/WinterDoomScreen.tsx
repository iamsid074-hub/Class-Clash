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
  const [showRoadmapModal, setShowRoadmapModal] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);

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
          {/* Hero Media Card (Full Shutter Image) */}
          <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '28px', padding: '16px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', border: '1px solid #e5e5ea', height: '290px' }}>
              <img
                src="/shutterdesign.png"
                alt="Winter Doom Tournament Shutter"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/cabin2.jpeg';
                }}
              />
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
                <span style={{ fontWeight: 800, color: '#d97706', fontSize: '0.95rem' }}>TBA</span>
              </div>

              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.2rem' }}>🥈</span>
                  <span style={{ fontWeight: 800, color: '#1c1c1e', fontSize: '0.9rem' }}>2nd Place Runner Up</span>
                </div>
                <span style={{ fontWeight: 800, color: '#64748b', fontSize: '0.95rem' }}>TBA</span>
              </div>

              <div style={{ background: '#fff5f5', border: '1px solid #fed7d7', borderRadius: '16px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.2rem' }}>🥉</span>
                  <span style={{ fontWeight: 800, color: '#1c1c1e', fontSize: '0.9rem' }}>3rd Place Finalist</span>
                </div>
                <span style={{ fontWeight: 800, color: '#c53030', fontSize: '0.95rem' }}>TBA</span>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMN 2: GUIDELINES & ROADMAP BUTTONS HUB */}
        <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '28px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px', justifyContent: 'center' }}>
          <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1c1c1e', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Calendar size={20} color="#007aff" />
            <span>Tournament Details & Hub</span>
          </div>

          {/* BUTTON 1: ROADMAP & 3 PHASES */}
          <div
            onClick={() => setShowRoadmapModal(true)}
            style={{
              background: '#f2f2f7',
              border: '1px solid #e5e5ea',
              borderRadius: '22px',
              padding: '20px 22px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: '#007aff', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Zap size={22} color="#ffffff" />
              </div>
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1c1c1e' }}>Roadmap & 3 Phases</div>
                <div style={{ fontSize: '0.78rem', color: '#8e8e93', marginTop: '2px' }}>View Phase 1, Phase 2 & Grand Finals timeline</div>
              </div>
            </div>
            <div style={{ background: '#007aff', color: '#ffffff', padding: '8px 16px', borderRadius: '9999px', fontWeight: 700, fontSize: '0.78rem' }}>
              View
            </div>
          </div>

          {/* BUTTON 2: OFFICIAL TOURNAMENT RULES */}
          <div
            onClick={() => setShowRulesModal(true)}
            style={{
              background: '#f2f2f7',
              border: '1px solid #e5e5ea',
              borderRadius: '22px',
              padding: '20px 22px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: '#e5f1ff', color: '#007aff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <FileText size={22} color="#007aff" />
              </div>
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1c1c1e' }}>Official Tournament Rules</div>
                <div style={{ fontSize: '0.78rem', color: '#8e8e93', marginTop: '2px' }}>View player guidelines, conduct & match policies</div>
              </div>
            </div>
            <div style={{ background: '#1c1c1e', color: '#ffffff', padding: '8px 16px', borderRadius: '9999px', fontWeight: 700, fontSize: '0.78rem' }}>
              Read
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

      {/* ROADMAP & 3 PHASES MODAL */}
      {showRoadmapModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(8px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            boxSizing: 'border-box',
          }}
          onClick={() => setShowRoadmapModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '560px',
              background: '#ffffff',
              borderRadius: '28px',
              padding: '32px',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)',
              fontFamily: APPLE_FONT,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1c1c1e' }}>Tournament Roadmap (3 Phases)</div>
              <button
                type="button"
                onClick={() => setShowRoadmapModal(false)}
                style={{ background: '#f2f2f7', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontWeight: 800 }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: '#f2f2f7', border: '1px solid #e5e5ea', borderRadius: '20px', padding: '16px 18px', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#007aff', color: '#ffffff', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.85rem' }}>
                  01
                </div>
                <div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1c1c1e' }}>Phase 1: Player Registration</div>
                  <div style={{ fontSize: '0.8rem', color: '#8e8e93', marginTop: '3px' }}>Starts 1st Week of September 2026. Open for 10 qualified teams.</div>
                </div>
              </div>

              <div style={{ background: '#f2f2f7', border: '1px solid #e5e5ea', borderRadius: '20px', padding: '16px 18px', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#e5f1ff', color: '#007aff', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.85rem' }}>
                  02
                </div>
                <div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1c1c1e' }}>Phase 2: Group Stage Knockouts</div>
                  <div style={{ fontSize: '0.8rem', color: '#8e8e93', marginTop: '3px' }}>5v5 squad elimination rounds across Cyber Arena map tracks.</div>
                </div>
              </div>

              <div style={{ background: '#f2f2f7', border: '1px solid #e5e5ea', borderRadius: '20px', padding: '16px 18px', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#e5f1ff', color: '#007aff', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.85rem' }}>
                  03
                </div>
                <div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1c1c1e' }}>Phase 3: Grand Finals Showdown</div>
                  <div style={{ fontSize: '0.8rem', color: '#8e8e93', marginTop: '3px' }}>Live broadcasted finals to decide the Season 1 Champion.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OFFICIAL TOURNAMENT RULES MODAL */}
      {showRulesModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(8px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            boxSizing: 'border-box',
          }}
          onClick={() => setShowRulesModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '560px',
              background: '#ffffff',
              borderRadius: '28px',
              padding: '32px',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)',
              fontFamily: APPLE_FONT,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1c1c1e' }}>Official Tournament Rules</div>
              <button
                type="button"
                onClick={() => setShowRulesModal(false)}
                style={{ background: '#f2f2f7', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontWeight: 800 }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.88rem', color: '#3a3a3c', lineHeight: 1.5 }}>
              <div style={{ background: '#f2f2f7', borderRadius: '16px', padding: '16px' }}>
                <strong>1. Account Verification:</strong> All racers must play using official verified Clasha accounts.
              </div>
              <div style={{ background: '#f2f2f7', borderRadius: '16px', padding: '16px' }}>
                <strong>2. Fair Play Policy:</strong> Any third-party software, hacking, or unsportsmanlike conduct will result in instant team disqualification.
              </div>
              <div style={{ background: '#f2f2f7', borderRadius: '16px', padding: '16px' }}>
                <strong>3. Schedule Punctuality:</strong> Matches will start strictly at designated times. 5 minute grace period allowed for team check-in.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
