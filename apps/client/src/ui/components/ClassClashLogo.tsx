import React from 'react';

export const ClassClashLogo: React.FC<{ size?: number }> = ({ size = 72 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: 'drop-shadow(0 4px 10px rgba(0, 0, 0, 0.4))' }}
    >
      <defs>
        <linearGradient id="pinkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff1a75" />
          <stop offset="50%" stopColor="#ff0066" />
          <stop offset="100%" stopColor="#e6005c" />
        </linearGradient>
      </defs>

      {/* Central Sharp Pillar */}
      <polygon points="50,15 44,45 50,92 56,45" fill="url(#pinkGrad)" />

      {/* Left Wing Upper */}
      <polygon points="41,20 22,25 36,44 42,42" fill="url(#pinkGrad)" />
      {/* Left Wing Lower */}
      <polygon points="39,47 28,52 38,78 43,62" fill="url(#pinkGrad)" />

      {/* Right Wing Upper */}
      <polygon points="59,20 78,25 64,44 58,42" fill="url(#pinkGrad)" />
      {/* Right Wing Lower */}
      <polygon points="61,47 72,52 62,78 57,62" fill="url(#pinkGrad)" />
    </svg>
  );
};
