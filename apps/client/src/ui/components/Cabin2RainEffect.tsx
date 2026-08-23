import React, { useEffect, useRef, useState } from 'react';

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

interface WindowBounds {
  left: number;
  top: number;
  width: number;
  height: number;
}

export const Cabin2RainEffect: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [bounds, setBounds] = useState<WindowBounds>({ left: 0, top: 0, width: 0, height: 0 });

  // Compute exact rendered image coordinates for background-size: cover (1536x1024, AR = 1.5)
  // Maps the rain container strictly to the glass window in cabin2.jpeg
  const updateWindowBounds = () => {
    const parent = containerRef.current?.parentElement;
    if (!parent) return;

    const W = parent.clientWidth;
    const H = parent.clientHeight;
    if (W === 0 || H === 0) return;

    const AR_img = 1536 / 1024; // Native cabin2.jpeg aspect ratio (1.5)
    const AR_box = W / H;

    let renderW = W;
    let renderH = H;
    let offsetX = 0;
    let offsetY = 0;

    if (AR_box > AR_img) {
      // Viewport wider than 1.5 (e.g. 16:9, 21:9) -> height is scaled & cropped top/bottom
      renderW = W;
      renderH = W / AR_img;
      offsetY = (H - renderH) / 2;
    } else {
      // Viewport taller than 1.5 (e.g. 4:3, portrait) -> width is scaled & cropped left/right
      renderH = H;
      renderW = H * AR_img;
      offsetX = (W - renderW) / 2;
    }

    // Precise normalized glass window coordinates inside cabin2.jpeg:
    // Left: 31.0%, Top: 12.5%, Width: 45.0%, Height: 52.0%
    const winLeft = offsetX + renderW * 0.31;
    const winTop = offsetY + renderH * 0.125;
    const winWidth = renderW * 0.45;
    const winHeight = renderH * 0.52;

    setBounds({
      left: Math.round(winLeft),
      top: Math.round(winTop),
      width: Math.round(winWidth),
      height: Math.round(winHeight),
    });
  };

  useEffect(() => {
    updateWindowBounds();
    window.addEventListener('resize', updateWindowBounds);
    return () => window.removeEventListener('resize', updateWindowBounds);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || bounds.width === 0 || bounds.height === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;
    const width = (canvas.width = bounds.width);
    const height = (canvas.height = bounds.height);

    // Initialize 110 physics-based falling raindrops strictly inside the window frame
    const dropsCount = 110;
    const drops: Drop[] = [];
    const splashes: Splash[] = [];

    for (let i = 0; i < dropsCount; i++) {
      drops.push({
        x: Math.random() * width * 1.2 - width * 0.1,
        y: Math.random() * height,
        length: Math.random() * 16 + 12,
        speed: Math.random() * 10 + 12,
        opacity: Math.random() * 0.35 + 0.18,
        width: Math.random() * 0.6 + 0.7,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render Falling Rain Streaks
      ctx.lineCap = 'round';

      for (let i = 0; i < drops.length; i++) {
        const d = drops[i];

        // Draw raindrop streak with smooth gradient for realistic motion blur
        const gradient = ctx.createLinearGradient(d.x, d.y, d.x - 3, d.y + d.length);
        gradient.addColorStop(0, `rgba(180, 215, 255, 0)`);
        gradient.addColorStop(0.4, `rgba(200, 230, 255, ${d.opacity * 0.6})`);
        gradient.addColorStop(1, `rgba(255, 255, 255, ${d.opacity})`);

        ctx.beginPath();
        ctx.strokeStyle = gradient;
        ctx.lineWidth = d.width;
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - 3, d.y + d.length);
        ctx.stroke();

        // Update positions with natural wind angle
        d.y += d.speed;
        d.x -= d.speed * 0.08;

        // Reset drop when hitting window sill bottom
        if (d.y > height) {
          if (Math.random() < 0.18) {
            splashes.push({
              x: d.x,
              y: height - Math.random() * 15,
              r: 1,
              maxR: Math.random() * 3 + 2,
              opacity: 0.4,
            });
          }

          d.y = -d.length - Math.random() * 20;
          d.x = Math.random() * width * 1.2 - width * 0.1;
          d.speed = Math.random() * 10 + 12;
        }
      }

      // Render Rain Splash Ripples on balcony window sill
      for (let i = splashes.length - 1; i >= 0; i--) {
        const s = splashes[i];
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(215, 238, 255, ${s.opacity})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();

        s.r += 0.35;
        s.opacity -= 0.045;

        if (s.opacity <= 0 || s.r >= s.maxR) {
          splashes.splice(i, 1);
        }
      }

      animFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, [bounds.width, bounds.height]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        left: bounds.width > 0 ? `${bounds.left}px` : '31%',
        top: bounds.width > 0 ? `${bounds.top}px` : '12.5%',
        width: bounds.width > 0 ? `${bounds.width}px` : '45%',
        height: bounds.width > 0 ? `${bounds.height}px` : '52%',
        pointerEvents: 'none',
        zIndex: 3,
        overflow: 'hidden',
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 90%, 0% 94%)',
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
            radial-gradient(circle at 15% 30%, rgba(255,255,255,0.35) 1px, transparent 2px),
            radial-gradient(circle at 42% 60%, rgba(255,255,255,0.25) 1.5px, transparent 3px),
            radial-gradient(circle at 70% 22%, rgba(255,255,255,0.4) 1px, transparent 2.5px),
            radial-gradient(circle at 88% 68%, rgba(255,255,255,0.3) 2px, transparent 4px),
            radial-gradient(circle at 32% 78%, rgba(255,255,255,0.3) 1px, transparent 2px),
            radial-gradient(circle at 58% 12%, rgba(255,255,255,0.4) 1.8px, transparent 3px);
          background-size: 180px 180px;
          opacity: 0.55;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
          animation: cabin2GlassSlide 10s linear infinite;
        }

        @keyframes cabin2GlassSlide {
          0% {
            background-position: 0px 0px;
          }
          100% {
            background-position: -15px 360px;
          }
        }
      `}</style>
    </div>
  );
};
