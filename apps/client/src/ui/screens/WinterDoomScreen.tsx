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
  ChevronRight,
} from 'lucide-react';
import { FullscreenVideoModal } from '../components/FullscreenVideoModal';

const APPLE_FONT = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Inter', 'Plus Jakarta Sans', sans-serif";

export const WinterDoomScreen: React.FC = () => {
  const { setScreen, triggerGateTransition } = useGameStore();
  const [isPlayingFormatVideo, setIsPlayingFormatVideo] = useState(false);
  const [activeTab, setActiveTab] = useState<'ROADMAP' | 'RULES'>('ROADMAP');

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
          className="btn-press-effect"
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
            transition: 'all 0.18s cubic-bezier(0.4, 0, 0.2, 1)',
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

        {/* COLUMN 2: GUIDELINES & ROADMAP BUTTONS HUB (INLINE SMOOTH WINDOW IN EMPTY CARD SPACE) */}
        <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '28px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', justifyContent: 'flex-start' }}>
          <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1c1c1e', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
            <Calendar size={20} color="#007aff" />
            <span>Championship Details Hub</span>
          </div>

          {/* 2 TOP TOGGLE BUTTONS WITH NATIVE IOS PRESS FEEL */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {/* BUTTON 1: ROADMAP & 3 PHASES */}
            <button
              type="button"
              onClick={() => setActiveTab('ROADMAP')}
              className="btn-press-effect"
              style={{
                background: activeTab === 'ROADMAP' ? '#007aff' : '#f2f2f7',
                border: activeTab === 'ROADMAP' ? '1px solid #007aff' : '1px solid #e5e5ea',
                borderRadius: '18px',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
                outline: 'none',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                fontFamily: APPLE_FONT,
                color: activeTab === 'ROADMAP' ? '#ffffff' : '#1c1c1e',
                boxShadow: activeTab === 'ROADMAP' ? '0 4px 12px rgba(0, 122, 255, 0.25)' : 'none',
              }}
            >
              <Zap size={18} color={activeTab === 'ROADMAP' ? '#ffffff' : '#007aff'} />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 800 }}>Roadmap & 3 Phases</div>
                <div style={{ fontSize: '0.7rem', opacity: 0.8, marginTop: '1px' }}>Tournament Timeline</div>
              </div>
            </button>

            {/* BUTTON 2: OFFICIAL TOURNAMENT RULES */}
            <button
              type="button"
              onClick={() => setActiveTab('RULES')}
              className="btn-press-effect"
              style={{
                background: activeTab === 'RULES' ? '#007aff' : '#f2f2f7',
                border: activeTab === 'RULES' ? '1px solid #007aff' : '1px solid #e5e5ea',
                borderRadius: '18px',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
                outline: 'none',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                fontFamily: APPLE_FONT,
                color: activeTab === 'RULES' ? '#ffffff' : '#1c1c1e',
                boxShadow: activeTab === 'RULES' ? '0 4px 12px rgba(0, 122, 255, 0.25)' : 'none',
              }}
            >
              <FileText size={18} color={activeTab === 'RULES' ? '#ffffff' : '#007aff'} />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 800 }}>Official Rules</div>
                <div style={{ fontSize: '0.7rem', opacity: 0.8, marginTop: '1px' }}>Policy Guidelines</div>
              </div>
            </button>
          </div>

          {/* INLINE ANIMATED WINDOW (FILLING THE BOTTOM EMPTY CARD SPACE SMOOTHLY) */}
          <div
            key={activeTab}
            style={{
              background: '#f2f2f7',
              border: '1px solid #e5e5ea',
              borderRadius: '22px',
              padding: '18px',
              marginTop: '4px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              animation: 'fadeIn 0.25s ease-in-out',
            }}
          >
            {activeTab === 'ROADMAP' ? (
              <>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#007aff', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '2px' }}>
                  SEASON 1 CHAMPIONSHIP TIMELINE
                </div>

                <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '16px', padding: '14px 16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#007aff', color: '#ffffff', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.8rem' }}>
                    01
                  </div>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#1c1c1e' }}>Phase 1: Player Registration</div>
                    <div style={{ fontSize: '0.75rem', color: '#8e8e93', marginTop: '2px' }}>Starts 1st Wk September 2026. Open for 10 qualified teams.</div>
                  </div>
                </div>

                <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '16px', padding: '14px 16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#e5f1ff', color: '#007aff', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.8rem' }}>
                    02
                  </div>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#1c1c1e' }}>Phase 2: Group Stage Knockouts</div>
                    <div style={{ fontSize: '0.75rem', color: '#8e8e93', marginTop: '2px' }}>5v5 squad elimination rounds across Cyber Arena map tracks.</div>
                  </div>
                </div>

                <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '16px', padding: '14px 16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#e5f1ff', color: '#007aff', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.8rem' }}>
                    03
                  </div>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#1c1c1e' }}>Phase 3: Grand Finals Showdown</div>
                    <div style={{ fontSize: '0.75rem', color: '#8e8e93', marginTop: '2px' }}>Live broadcasted finals to decide the Season 1 Champion.</div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#007aff', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '2px' }}>
                  OFFICIAL TOURNAMENT RULES & CODE OF CONDUCT
                </div>

                <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '16px', padding: '14px 16px' }}>
                  <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#1c1c1e' }}>1. Account Verification</div>
                  <div style={{ fontSize: '0.75rem', color: '#8e8e93', marginTop: '2px' }}>All racers must play using official verified Clasha accounts.</div>
                </div>

                <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '16px', padding: '14px 16px' }}>
                  <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#1c1c1e' }}>2. Fair Play Policy</div>
                  <div style={{ fontSize: '0.75rem', color: '#8e8e93', marginTop: '2px' }}>Any third-party software, hacking, or unsportsmanlike conduct results in instant disqualification.</div>
                </div>

                <div style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '16px', padding: '14px 16px' }}>
                  <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#1c1c1e' }}>3. Schedule Punctuality</div>
                  <div style={{ fontSize: '0.75rem', color: '#8e8e93', marginTop: '2px' }}>Matches start strictly at designated times with 5 min check-in grace period.</div>
                </div>
              </>
            )}
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
            disabled
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '9999px',
              background: '#2c2c2e',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: 'rgba(255, 255, 255, 0.65)',
              fontWeight: 800,
              fontSize: '0.98rem',
              cursor: 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              transition: 'all 0.18s cubic-bezier(0.4, 0, 0.2, 1)',
              fontFamily: APPLE_FONT,
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2)',
              userSelect: 'none',
            }}
          >
            <Lock size={18} color="#ff3366" />
            <span>ENROLLMENT LOCKED</span>
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
                Official Format Explainer
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* 3 Fast Sequential Flowing Arrows pointing right into the button */}
            <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
              <ChevronRight className="fast-arrow-1" size={22} color="#007aff" strokeWidth={3.5} />
              <ChevronRight className="fast-arrow-2" size={22} color="#007aff" strokeWidth={3.5} style={{ marginLeft: '-10px' }} />
              <ChevronRight className="fast-arrow-3" size={22} color="#007aff" strokeWidth={3.5} style={{ marginLeft: '-10px' }} />
            </div>

            <button
              type="button"
              onClick={() => setIsPlayingFormatVideo(true)}
              className="btn-press-effect"
              style={{
                padding: '16px 36px',
                minWidth: '240px',
                borderRadius: '9999px',
                background: '#1c1c1e',
                color: '#ffffff',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.95rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                transition: 'all 0.18s cubic-bezier(0.4, 0, 0.2, 1)',
                fontFamily: APPLE_FONT,
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
              }}
            >
              <Play size={18} color="#ffffff" fill="#ffffff" />
              <span>Format Explainer</span>
            </button>
          </div>
        </div>

        <style>{`
          @keyframes arrowLightChase {
            0%, 100% {
              opacity: 0.18;
              filter: drop-shadow(0 0 0px transparent);
            }
            40% {
              opacity: 1;
              filter: drop-shadow(0 0 8px #007aff) drop-shadow(0 0 14px rgba(0, 122, 255, 0.9));
            }
          }

          .fast-arrow-1 {
            animation: arrowLightChase 0.9s linear infinite 0s;
          }
          .fast-arrow-2 {
            animation: arrowLightChase 0.9s linear infinite 0.3s;
          }
          .fast-arrow-3 {
            animation: arrowLightChase 0.9s linear infinite 0.6s;
          }
        `}</style>
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
