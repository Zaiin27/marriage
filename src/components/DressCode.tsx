import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { InvitationCard } from './InvitationCard';
import type { WeddingConfig } from '../config/weddingConfig';

interface DressCodeProps {
  dressCode: WeddingConfig['dressCode'];
}

export const DressCode: React.FC<DressCodeProps> = ({ dressCode }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <InvitationCard
      id="dress-code"
      corners={['top-right', 'bottom-left']}
      floralSize="sm"
      innerClassName="text-center py-12 sm:py-14"
    >
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
        whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="font-sans-clean text-[10px] tracking-[0.28em] uppercase text-[#963C23] mb-2">
          ATTIRE GUIDE
        </p>
        <h2 className="font-display text-3xl tracking-[0.16em] uppercase text-[#47352E]">
          DRESS CODE
        </h2>

        <p className="mt-2 font-editorial italic text-sm text-[#47352E]/80">
          {dressCode.title}
        </p>

        {/* Color Swatches Row */}
        <div
          className="my-7 flex items-center justify-center gap-3.5 sm:gap-4 flex-wrap"
          role="list"
          aria-label="Suggested attire color palette"
        >
          {dressCode.swatches.map((swatch) => (
            <div
              key={swatch.name}
              role="listitem"
              className="flex flex-col items-center gap-1.5"
            >
              <span
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#47352E]/15 shadow-[inset_0_2px_4px_rgba(255,255,255,0.25),0_3px_8px_rgba(71,53,46,0.12)]"
                style={{ backgroundColor: swatch.hex }}
                title={swatch.name}
              />
              <span className="font-sans-clean text-[9px] tracking-[0.14em] uppercase text-[#47352E]/70">
                {swatch.name}
              </span>
            </div>
          ))}
        </div>

        <p className="max-w-[270px] mx-auto font-sans-clean text-xs leading-relaxed text-[#47352E]/80">
          {dressCode.description}
        </p>
      </motion.div>
    </InvitationCard>
  );
};
