import React from 'react';
import { FloralDecoration, type FloralCorner } from './FloralDecoration';

interface InvitationCardProps {
  children: React.ReactNode;
  id?: string;
  corners?: FloralCorner[];
  floralSize?: 'sm' | 'md';
  className?: string;
  innerClassName?: string;
}

export const InvitationCard: React.FC<InvitationCardProps> = ({
  children,
  id,
  corners = ['top-left', 'bottom-right'],
  floralSize = 'md',
  className = '',
  innerClassName = '',
}) => {
  return (
    <section
      id={id}
      className={`relative overflow-hidden bg-[#FFF9F1] paper-grain border border-[#D5C0A0]/70 shadow-[0_14px_40px_-14px_rgba(71,53,46,0.16)] ${className}`}
    >
      {/* Fine inner stationery border frame */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-3 sm:inset-4 border border-[#B49A64]/35 z-10"
      />

      {/* Corner botanical florals */}
      {corners.map((corner) => (
        <FloralDecoration key={corner} corner={corner} surface="ivory" size={floralSize} />
      ))}

      {/* Card content */}
      <div className={`relative z-20 px-7 py-14 sm:px-10 sm:py-16 ${innerClassName}`}>
        {children}
      </div>
    </section>
  );
};
