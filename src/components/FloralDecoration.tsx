import React from 'react';
import floralIvoryImg from '../assets/floral-corner-ivory.jpg';
import floralTerracottaImg from '../assets/floral-corner-terracotta.jpg';

export type FloralCorner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
export type FloralSurface = 'ivory' | 'terracotta';
export type FloralSize = 'sm' | 'md' | 'lg';

interface FloralDecorationProps {
  corner: FloralCorner;
  surface?: FloralSurface;
  size?: FloralSize;
  className?: string;
}

const SIZE_CLASSES: Record<FloralSize, string> = {
  sm: 'w-28 h-28 sm:w-32 sm:h-32',
  md: 'w-40 h-40 sm:w-44 sm:h-44',
  lg: 'w-52 h-52 sm:w-60 sm:h-60',
};

const POSITION_CLASSES: Record<FloralCorner, string> = {
  'top-left': 'top-0 left-0',
  'top-right': 'top-0 right-0',
  'bottom-left': 'bottom-0 left-0',
  'bottom-right': 'bottom-0 right-0',
};

// floral-corner-ivory.jpg is naturally oriented top-left
const IVORY_ORIENTATION: Record<FloralCorner, string> = {
  'top-left': '',
  'top-right': '-scale-x-100',
  'bottom-left': '-scale-y-100',
  'bottom-right': 'rotate-180',
};

// floral-corner-terracotta.jpg is naturally oriented bottom-left
const TERRACOTTA_ORIENTATION: Record<FloralCorner, string> = {
  'bottom-left': '',
  'top-right': 'rotate-180',
  'top-left': '-scale-y-100',
  'bottom-right': '-scale-x-100',
};

export const FloralDecoration: React.FC<FloralDecorationProps> = ({
  corner,
  surface = 'ivory',
  size = 'md',
  className = '',
}) => {
  const isIvory = surface === 'ivory';
  const src = isIvory ? floralIvoryImg : floralTerracottaImg;
  const orientation = isIvory ? IVORY_ORIENTATION[corner] : TERRACOTTA_ORIENTATION[corner];

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none select-none absolute overflow-hidden ${POSITION_CLASSES[corner]} ${SIZE_CLASSES[size]} ${className}`}
    >
      <img
        src={src}
        alt=""
        loading="eager"
        decoding="async"
        className={`w-full h-full object-contain ${orientation} ${
          isIvory ? 'mix-blend-multiply opacity-95' : 'opacity-95'
        }`}
        style={
          isIvory
            ? undefined
            : {
                maskImage: 'radial-gradient(ellipse at 26% 74%, black 36%, transparent 70%)',
                WebkitMaskImage: 'radial-gradient(ellipse at 26% 74%, black 36%, transparent 70%)',
              }
        }
      />
    </div>
  );
};
