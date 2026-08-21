import React, { useEffect, useState, useRef } from 'react';
import { useGameStore, GameScreen } from '../../state/useGameStore';
import { ClassClashLogo } from './ClassClashLogo';
import { Zap } from 'lucide-react';

export const CyberGateTransition: React.FC = () => {
  const { isGateActive: isActive, isGateClosed: isClosed, gateTitle, gateSubhead } = useGameStore();

  const displayTitle = gateTitle || 'ENTER ARENA';
  const displaySubhead = gateSubhead || 'CLASHA';

  if (!isActive) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 99999,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {/* Outer White Screen Frame Border */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          boxShadow: 'inset 0 0 0 3.5px #ffffff',
          zIndex: 30,
          pointerEvents: 'none',
          opacity: isClosed ? 1 : 0,
          transition: 'opacity 0.35s cubic-bezier(0.77, 0, 0.175, 1)',
        }}
      />

      {/* 1. LEFT DIAGONAL SHUTTER DOOR - 100vw WIDTH OVERLAPPING CENTER */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: '#ff2853',
          clipPath: 'polygon(0 0, 66vw 0, 36vw 100%, 0 100%)',
          transform: isClosed ? 'translateX(0%)' : 'translateX(-105vw)',
          transition: 'transform 0.45s cubic-bezier(0.77, 0, 0.175, 1)',
          zIndex: 1,
        }}
      />

      {/* 2. RIGHT DIAGONAL SHUTTER DOOR - 100vw WIDTH OVERLAPPING CENTER */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: '#ff2853',
          clipPath: 'polygon(64vw 0, 100vw 0, 100vw 100%, 34vw 100%)',
          transform: isClosed ? 'translateX(0%)' : 'translateX(105vw)',
          transition: 'transform 0.45s cubic-bezier(0.77, 0, 0.175, 1)',
          zIndex: 2,
        }}
      />

      {/* 3. DIAGONAL SEAM CRISP WHITE LINE OVERLAY */}
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 15,
          opacity: isClosed ? 1 : 0,
          transition: 'opacity 0.35s cubic-bezier(0.77, 0, 0.175, 1)',
        }}
      >
        <line x1="65vw" y1="0" x2="35vw" y2="100vh" stroke="#ffffff" strokeWidth="3" />
      </svg>

      {/* 4. CENTER FLOATING PILL CARD */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 25,
          opacity: isClosed ? 1 : 0,
          scale: isClosed ? '1' : '0.7',
          transition: 'all 0.3s cubic-bezier(0.77, 0, 0.175, 1)',
        }}
      >
        {/* Soft Radial Glow */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '450px',
            height: '180px',
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(25px)',
            pointerEvents: 'none',
          }}
        />

        {/* Floating Pill Container */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            gap: '18px',
            padding: '16px 32px',
            background: '#0a0412',
            border: '2px solid #ffffff',
            borderRadius: '20px',
            boxShadow: '0 0 35px rgba(255, 255, 255, 0.6), 0 10px 30px rgba(0, 0, 0, 0.5)',
          }}
        >
          {/* White Square Icon Box */}
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              background: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(255, 255, 255, 0.8)',
            }}
          >
            <ClassClashLogo size={42} />
          </div>

          {/* Text Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Zap size={14} color="#ffffff" />
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 900,
                  color: '#ffffff',
                  letterSpacing: '0.14em',
                  fontFamily: 'Outfit',
                  textTransform: 'uppercase',
                }}
              >
                {displaySubhead}
              </span>
            </div>

            {/* SIMPLE CLEAN LOCKED TITLE */}
            <div
              style={{
                fontSize: '1.95rem',
                fontWeight: 900,
                fontStyle: 'italic',
                fontFamily: "'QUARTZO', 'Kanit', sans-serif",
                color: '#ffffff',
                lineHeight: 1.1,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                borderBottom: '2px solid #ffffff',
                paddingBottom: '4px',
              }}
            >
              {displayTitle}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
