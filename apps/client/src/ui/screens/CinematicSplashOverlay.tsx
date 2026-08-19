import React, { useState, useEffect, useRef } from 'react';

interface CinematicSplashOverlayProps {
  onComplete: () => void;
}

export const CinematicSplashOverlay: React.FC<CinematicSplashOverlayProps> = ({ onComplete }) => {
  const [isFading, setIsFading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasTriggeredRef = useRef(false);

  const triggerCompletion = () => {
    if (hasTriggeredRef.current) return;
    hasTriggeredRef.current = true;
    setIsFading(true);
    setTimeout(() => {
      onComplete();
    }, 500);
  };

  useEffect(() => {
    // Timer fallback: Stop video & complete intro at exactly 5 seconds
    const timer1 = setTimeout(() => {
      triggerCompletion();
    }, 5000);

    return () => {
      clearTimeout(timer1);
    };
  }, []);

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.currentTime >= 5.0) {
      triggerCompletion();
    }
  };

  const handleSkip = () => {
    triggerCompletion();
  };

  return (
    <div
      onClick={handleSkip}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        background: '#000000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        opacity: isFading ? 0 : 1,
        transition: 'opacity 0.5s ease-out',
        cursor: 'pointer',
      }}
    >
      <video
        ref={videoRef}
        src="/animation1.mp4"
        autoPlay
        muted
        playsInline
        onTimeUpdate={handleTimeUpdate}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
    </div>
  );
};
