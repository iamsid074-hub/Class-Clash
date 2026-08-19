import React, { useState, useEffect, useRef } from 'react';

interface CinematicSplashOverlayProps {
  onComplete: () => void;
}

export const CinematicSplashOverlay: React.FC<CinematicSplashOverlayProps> = ({ onComplete }) => {
  const [isFading, setIsFading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Trim video playback to exactly 4.2 seconds
    const timer1 = setTimeout(() => {
      setIsFading(true);
    }, 4200);

    const timer2 = setTimeout(() => {
      onComplete();
    }, 4700);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  const handleSkip = () => {
    setIsFading(true);
    setTimeout(() => {
      onComplete();
    }, 400);
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
        src="/intro.mp4"
        autoPlay
        muted
        playsInline
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
    </div>
  );
};
