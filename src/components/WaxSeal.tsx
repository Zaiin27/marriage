import React from 'react';

interface WaxSealProps {
  initials?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  interactive?: boolean;
}

const SEAL_SIZES = {
  sm: 'w-12 h-12',
  md: 'w-[74px] h-[74px]',
  lg: 'w-20 h-20',
};

export const WaxSeal: React.FC<WaxSealProps> = ({
  initials = 'A&D',
  size = 'md',
  className = '',
  interactive = true,
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full select-none ${
        SEAL_SIZES[size]
      } ${interactive ? 'animate-seal-shimmer' : ''} ${className}`}
    >
      {/* Organic irregular antique-gold wax outer rim */}
      <svg
        viewBox="0 0 120 120"
        className="w-full h-full drop-shadow-[0_6px_14px_rgba(32,12,6,0.45)]"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="waxGoldOuter" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#DFC78E" />
            <stop offset="45%" stopColor="#B49A64" />
            <stop offset="85%" stopColor="#8B7240" />
            <stop offset="100%" stopColor="#6D562C" />
          </radialGradient>
          <radialGradient id="waxGoldInner" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#CBB078" />
            <stop offset="60%" stopColor="#A68B53" />
            <stop offset="100%" stopColor="#846A38" />
          </radialGradient>
          <linearGradient id="waxHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF5D6" stopOpacity="0.65" />
            <stop offset="50%" stopColor="#FFF5D6" stopOpacity="0" />
            <stop offset="100%" stopColor="#4A3818" stopOpacity="0.35" />
          </linearGradient>
        </defs>

        {/* Irregular hand-pressed wax silhouette */}
        <path
          d="M60,5 C73,4 85,9 95,16 C106,24 114,37 115,51 C116,65 113,79 105,91 C97,103 84,113 69,115 C54,117 38,114 26,105 C14,96 6,82 5,67 C4,51 8,35 18,23 C28,11 44,6 60,5 Z"
          fill="url(#waxGoldOuter)"
        />
        {/* Raised rim bevel */}
        <circle
          cx="60"
          cy="60"
          r="46"
          fill="none"
          stroke="url(#waxHighlight)"
          strokeWidth="2.5"
        />
        {/* Debossed inner well */}
        <circle
          cx="60"
          cy="60"
          r="41"
          fill="url(#waxGoldInner)"
          stroke="#7A6130"
          strokeWidth="1.5"
        />
        <circle
          cx="60"
          cy="60"
          r="37"
          fill="none"
          stroke="#E5CF9B"
          strokeOpacity="0.45"
          strokeWidth="0.8"
        />

        {/* Subtle botanical olive/laurel sprig behind initials */}
        <g stroke="#6D562C" strokeOpacity="0.45" fill="none" strokeWidth="1.2">
          <path d="M60,84 C60,65 60,48 60,34" />
          <path d="M60,68 C52,64 47,57 46,50 C52,53 57,59 60,68 Z" fill="#6D562C" fillOpacity="0.18" />
          <path d="M60,68 C68,64 73,57 74,50 C68,53 63,59 60,68 Z" fill="#6D562C" fillOpacity="0.18" />
          <path d="M60,54 C53,50 49,44 49,38 C54,41 58,46 60,54 Z" fill="#6D562C" fillOpacity="0.18" />
          <path d="M60,54 C67,50 71,44 71,38 C66,41 62,46 60,54 Z" fill="#6D562C" fillOpacity="0.18" />
        </g>
      </svg>

      {/* Embossed monogram */}
      <span
        className="absolute inset-0 flex items-center justify-center font-display text-[13px] font-semibold tracking-[0.14em] text-[#4E3B19]"
        style={{
          textShadow: '0 1px 0 rgba(255, 243, 210, 0.55), 0 -0.5px 0 rgba(70, 50, 15, 0.45)',
        }}
      >
        {initials}
      </span>
    </div>
  );
};
