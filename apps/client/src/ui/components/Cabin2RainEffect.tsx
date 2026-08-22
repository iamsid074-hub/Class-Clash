import React, { useEffect, useRef } from 'react';

interface Drop {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
  width: number;
}

interface Splash {
  x: number;
  y: number;
  r: number;
  maxR: number;
  opacity: number;
}

export const Cabin2RainEffect: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Initialize 220 physics-based falling raindrops
    const dropsCount = 220;
    const drops: Drop[] = [];
    const splashes: Splash[] = [];

    for (let i = 0; i < dropsCount; i++) {
      drops.push({
        x: Math.random() * width * 1.3 - width * 0.15,
        y: Math.random() * height,
        length: Math.random() * 28 + 14,
        speed: Math.random() * 14 + 18,
        opacity: Math.random() * 0.45 + 0.25,
        width: Math.random() * 1.3 + 0.7,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render Falling Rain Streaks
      ctx.lineCap = 'round';

      for (let i = 0; i < drops.length; i++) {
        const d = drops[i];

        // Draw raindrop streak with smooth gradient for realistic motion blur
        const gradient = ctx.createLinearGradient(d.x, d.y, d.x - 4, d.y + d.length);
        gradient.addColorStop(0, `rgba(180, 215, 255, 0)`);
        gradient.addColorStop(0.4, `rgba(200, 230, 255, ${d.opacity * 0.6})`);
        gradient.addColorStop(1, `rgba(255, 255, 255, ${d.opacity})`);

        ctx.beginPath();
        ctx.strokeStyle = gradient;
        ctx.lineWidth = d.width;
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - 5, d.y + d.length);
        ctx.stroke();

        // Update positions with natural wind angle
        d.y += d.speed;
        d.x -= d.speed * 0.12;

        // Reset drop when hitting bottom
        if (d.y > height) {
          if (Math.random() < 0.25) {
            splashes.push({
              x: d.x,
              y: height - Math.random() * 120,
              r: 1,
              maxR: Math.random() * 5 + 3,
              opacity: 0.6,
            });
          }

          d.y = -d.length - Math.random() * 40;
          d.x = Math.random() * width * 1.3 - width * 0.15;
          d.speed = Math.random() * 14 + 18;
        }
      }

      // Render Rain Splash Ripples on glass/sill
      for (let i = splashes.length - 1; i >= 0; i--) {
        const s = splashes[i];
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(215, 238, 255, ${s.opacity})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();

        s.r += 0.45;
        s.opacity -= 0.035;

        if (s.opacity <= 0 || s.r >= s.maxR) {
          splashes.splice(i, 1);
        }
      }

      animFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animFrameId);
    };
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 2,
        overflow: 'hidden',
      }}
    >
      {/* Dynamic Falling Rain Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      />

      {/* Realistic Window Glass Droplets & Sliding Water Streaks Layer */}
      <div className="cabin2-glass-rain-layer" />

      <style>{`
        .cabin2-glass-rain-layer {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          background-image: 
            radial-gradient(circle at 15% 30%, rgba(255,255,255,0.45) 1px, transparent 2px),
            radial-gradient(circle at 42% 60%, rgba(255,255,255,0.35) 1.5px, transparent 3px),
            radial-gradient(circle at 70% 22%, rgba(255,255,255,0.55) 1px, transparent 2.5px),
            radial-gradient(circle at 88% 68%, rgba(255,255,255,0.4) 2px, transparent 4px),
            radial-gradient(circle at 32% 78%, rgba(255,255,255,0.4) 1px, transparent 2px),
            radial-gradient(circle at 58% 12%, rgba(255,255,255,0.5) 1.8px, transparent 3px);
          background-size: 220px 220px;
          opacity: 0.75;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
          animation: cabin2GlassSlide 9s linear infinite;
        }

        @keyframes cabin2GlassSlide {
          0% {
            background-position: 0px 0px;
          }
          100% {
            background-position: -25px 440px;
          }
        }
      `}</style>
    </div>
  );
};
