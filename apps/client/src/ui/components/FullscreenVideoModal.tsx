import React, { useState, useEffect, useRef } from 'react';
import { SkipForward } from 'lucide-react';
import { AudioManager } from '../../utils/AudioManager';

interface FullscreenVideoModalProps {
  videoSrc: string;
  onComplete: () => void;
  title?: string;
}

export const FullscreenVideoModal: React.FC<FullscreenVideoModalProps> = ({ videoSrc, onComplete, title }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [opacity, setOpacity] = useState(0);
  const isExitingRef = useRef(false);

  const handleFinish = () => {
    if (isExitingRef.current) return;
    isExitingRef.current = true;
    setOpacity(0);
    setTimeout(() => {
      onComplete();
    }, 350);
  };

  useEffect(() => {
    // Smoothly pause background music while video plays
    AudioManager.fadeOut(300);

    // Smooth Fade-In transition on video start
    const timer = setTimeout(() => {
      setOpacity(1);
    }, 40);

    const videoEl = videoRef.current;
    if (videoEl) {
      videoEl.volume = 1.0;
      videoEl.muted = false;

      // Attempt playback with audio enabled
      videoEl.play().catch(() => {
        // Autoplay policy fallback: try muted then let user unmute
        videoEl.muted = true;
        videoEl.play().catch(() => {});
      });
    }

    return () => {
      clearTimeout(timer);
      // Resume background music when video finishes or closes
      AudioManager.fadeIn(500);
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#000000',
        zIndex: 9998,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        opacity: opacity,
        transition: 'opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* Top Header Controls Overlay */}
      <div
        style={{
          position: 'absolute',
          top: '24px',
          left: '32px',
          right: '32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 10,
          pointerEvents: 'auto',
        }}
      >
        <div
          style={{
            color: '#70e1ff',
            fontSize: '1rem',
            fontWeight: 900,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            fontFamily: "'Misery', 'QUARTZO', 'Kanit', sans-serif",
            textShadow: '0 0 12px rgba(112, 225, 255, 0.6)',
          }}
        >
          {title || 'CLASHA CHAMPIONSHIP EXPLAINER'}
        </div>

        <button
          type="button"
          onClick={handleFinish}
          className="btn-press-effect"
          style={{
            padding: '10px 24px',
            borderRadius: '50px',
            background: 'rgba(255, 255, 255, 0.18)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.35)',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
            transition: 'all 0.18s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <span>SKIP / PROCEED</span>
          <SkipForward size={16} color="#ffffff" />
        </button>
      </div>

      {/* Main Fullscreen Video Display */}
      <video
        ref={videoRef}
        src={videoSrc}
        onEnded={handleFinish}
        preload="auto"
        autoPlay
        style={{
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
        }}
        playsInline
      />
    </div>
  );
};
