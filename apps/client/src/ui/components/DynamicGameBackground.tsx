import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export type BackgroundMode = '3D_WEBGL' | 'PARALLAX_CANVAS' | 'CYBER_HORIZON';

interface DynamicGameBackgroundProps {
  initialMode?: BackgroundMode;
}

export const DynamicGameBackground: React.FC<DynamicGameBackgroundProps> = ({
  initialMode = '3D_WEBGL',
}) => {
  const [mode, setMode] = useState<BackgroundMode>(() => {
    try {
      const saved = localStorage.getItem('clasha_bg_mode');
      return (saved as BackgroundMode) || initialMode;
    } catch {
      return initialMode;
    }
  });

  const mountRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  const handleModeChange = (newMode: BackgroundMode) => {
    setMode(newMode);
    try {
      localStorage.setItem('clasha_bg_mode', newMode);
    } catch {
      // ignore
    }
  };

  // Global Mouse tracking for Parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseRef.current.targetX = normX;
      mouseRef.current.targetY = normY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // ------------------------------------------------------------------
  // MODE 1: THREE.JS 3D WEBGL ENGINE
  // ------------------------------------------------------------------
  useEffect(() => {
    if (mode !== '3D_WEBGL' || !mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x1a0013, 0.035);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 3, 14);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xff66b3, 1.2);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xff0066, 4, 30);
    pointLight.position.set(0, 5, 5);
    scene.add(pointLight);

    const cyanLight = new THREE.PointLight(0x00f0ff, 3, 25);
    cyanLight.position.set(-8, 2, -2);
    scene.add(cyanLight);

    // 3D Grid Ground
    const gridHelper = new THREE.GridHelper(60, 40, 0xff0066, 0xff3399);
    gridHelper.position.y = -2;
    scene.add(gridHelper);

    // Floating 3D Octahedron Monoliths / Crystals
    const crystalsGroup = new THREE.Group();
    const crystalGeo = new THREE.OctahedronGeometry(1.2, 0);

    const crystalMat1 = new THREE.MeshStandardMaterial({
      color: 0xff0066,
      roughness: 0.1,
      metalness: 0.8,
      emissive: 0x880033,
      emissiveIntensity: 0.6,
    });

    const crystalMat2 = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      roughness: 0.2,
      metalness: 0.7,
      emissive: 0x004466,
      emissiveIntensity: 0.5,
    });

    for (let i = 0; i < 18; i++) {
      const mat = i % 2 === 0 ? crystalMat1 : crystalMat2;
      const mesh = new THREE.Mesh(crystalGeo, mat);
      mesh.position.set(
        (Math.random() - 0.5) * 28,
        Math.random() * 8 - 1,
        (Math.random() - 0.5) * 20 - 5
      );
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      const scale = Math.random() * 0.8 + 0.5;
      mesh.scale.set(scale, scale * 1.5, scale);
      crystalsGroup.add(mesh);
    }
    scene.add(crystalsGroup);

    // Floating 3D Particles
    const particleCount = 180;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 35;
      positions[i + 1] = Math.random() * 14 - 2;
      positions[i + 2] = (Math.random() - 0.5) * 30;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.18,
      color: 0xff66cc,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Animation Loop
    let animationId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // Rotate camera based on mouse parallax
      camera.position.x = mouseRef.current.x * 2.5;
      camera.position.y = 3 + mouseRef.current.y * 1.5;
      camera.lookAt(0, 1, 0);

      // Animate 3D Crystals
      crystalsGroup.children.forEach((child, index) => {
        child.rotation.y += 0.008 + (index % 3) * 0.003;
        child.rotation.x += 0.004;
        child.position.y += Math.sin(elapsedTime * 1.5 + index) * 0.004;
      });

      // Animate Particles
      particles.rotation.y = elapsedTime * 0.03;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [mode]);

  // ------------------------------------------------------------------
  // MODE 2 & 3: CANVAS PARTICLE ENGINE (PARALLAX & CYBER HORIZON)
  // ------------------------------------------------------------------
  useEffect(() => {
    if ((mode !== 'PARALLAX_CANVAS' && mode !== 'CYBER_HORIZON') || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Particle Physics List
    const particles: Array<{
      x: number;
      y: number;
      size: number;
      vx: number;
      vy: number;
      alpha: number;
      color: string;
    }> = [];

    const numParticles = mode === 'PARALLAX_CANVAS' ? 80 : 120;
    const colors = ['#ff0066', '#ff66cc', '#00f0ff', '#ffffff'];

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 3 + 1,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8 - 0.2,
        alpha: Math.random() * 0.7 + 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let horizonPhase = 0;

    const render = () => {
      animId = requestAnimationFrame(render);
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      const mouseOffsetX = mouseRef.current.x * 30;
      const mouseOffsetY = mouseRef.current.y * 20;

      if (mode === 'PARALLAX_CANVAS') {
        // Deep Soft Pink-Purple Ambient Gradient
        const grad = ctx.createRadialGradient(
          width / 2 + mouseOffsetX,
          height / 3 + mouseOffsetY,
          10,
          width / 2,
          height / 2,
          width * 0.8
        );
        grad.addColorStop(0, '#2d0a25');
        grad.addColorStop(0.5, '#190317');
        grad.addColorStop(1, '#09000a');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        // Volumetric Light Beams (God Rays)
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        const beamGrad = ctx.createLinearGradient(width / 2, 0, width / 2, height);
        beamGrad.addColorStop(0, 'rgba(255, 0, 102, 0.25)');
        beamGrad.addColorStop(0.6, 'rgba(255, 102, 204, 0.08)');
        beamGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = beamGrad;
        ctx.beginPath();
        ctx.moveTo(width / 2 - 250 + mouseOffsetX, 0);
        ctx.lineTo(width / 2 + 250 + mouseOffsetX, 0);
        ctx.lineTo(width / 2 + 500, height);
        ctx.lineTo(width / 2 - 500, height);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Draw Floating Wind Particles (Sakura/Neon Embers)
        particles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.shadowBlur = 12;
          ctx.shadowColor = p.color;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x + mouseOffsetX * 0.4, p.y + mouseOffsetY * 0.4, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });

      } else if (mode === 'CYBER_HORIZON') {
        // Deep Dark Cyber Matrix Background
        ctx.fillStyle = '#0a000e';
        ctx.fillRect(0, 0, width, height);

        horizonPhase += 0.02;

        // Animated Horizon Grid Lines
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 0, 102, 0.35)';
        ctx.lineWidth = 1.5;

        const horizonY = height * 0.55 + mouseOffsetY;
        const gridSpacing = 45;

        // Perspective Vertical Grid Lines
        for (let x = -width; x < width * 2; x += gridSpacing) {
          ctx.beginPath();
          ctx.moveTo(x + mouseOffsetX * 1.5, height);
          ctx.lineTo(width / 2 + (x - width / 2) * 0.1, horizonY);
          ctx.stroke();
        }

        // Horizontal Pulse Waves
        for (let y = horizonY; y < height; y += 24) {
          const waveAlpha = Math.sin((y - horizonY) * 0.05 - horizonPhase) * 0.3 + 0.4;
          ctx.strokeStyle = `rgba(255, 0, 102, ${waveAlpha})`;
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
        ctx.restore();

        // Constellation Particle Network
        for (let i = 0; i < particles.length; i++) {
          const p1 = particles[i];
          p1.x += p1.vx;
          p1.y += p1.vy;

          if (p1.x < 0 || p1.x > width) p1.vx *= -1;
          if (p1.y < 0 || p1.y > height) p1.vy *= -1;

          ctx.fillStyle = p1.color;
          ctx.beginPath();
          ctx.arc(p1.x, p1.y, p1.size, 0, Math.PI * 2);
          ctx.fill();

          // Connect nearby particles with laser lines
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
            if (dist < 110) {
              ctx.strokeStyle = `rgba(255, 0, 102, ${1 - dist / 110})`;
              ctx.lineWidth = 0.8;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }
      }
    };

    render();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [mode]);

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        zIndex: 0,
        background: '#0d0012',
      }}
    >
      {/* 3D WebGL Container */}
      {mode === '3D_WEBGL' && (
        <div ref={mountRef} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }} />
      )}

      {/* 2.5D Canvas Container */}
      {(mode === 'PARALLAX_CANVAS' || mode === 'CYBER_HORIZON') && (
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }} />
      )}

      {/* Interactive Mode Switcher Pill (Top Center Testing Toolbar) */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100,
          background: 'rgba(20, 5, 20, 0.75)',
          backdropFilter: 'blur(16px)',
          border: '1.5px solid rgba(255, 0, 102, 0.4)',
          borderRadius: '50px',
          padding: '5px 8px',
          display: 'flex',
          gap: '6px',
          boxShadow: '0 8px 32px rgba(255, 0, 102, 0.25)',
        }}
      >
        {[
          { id: '3D_WEBGL', label: '🌐 3D WebGL Scene' },
          { id: 'PARALLAX_CANVAS', label: '🌸 2.5D Parallax Wind' },
          { id: 'CYBER_HORIZON', label: '⚡ Cyber Horizon' },
        ].map((item) => {
          const isActive = mode === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleModeChange(item.id as BackgroundMode)}
              style={{
                padding: '7px 16px',
                borderRadius: '50px',
                background: isActive
                  ? 'linear-gradient(135deg, #ff0066 0%, #ff3385 100%)'
                  : 'transparent',
                color: isActive ? '#ffffff' : '#ff99cc',
                border: 'none',
                fontWeight: isActive ? 800 : 600,
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
                boxShadow: isActive ? '0 4px 14px rgba(255, 0, 102, 0.4)' : 'none',
              }}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
