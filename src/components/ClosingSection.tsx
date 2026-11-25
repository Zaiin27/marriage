import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { InvitationCard } from './InvitationCard';
import { WaxSeal } from './WaxSeal';
import type { WeddingConfig } from '../config/weddingConfig';

interface ClosingSectionProps {
  config: WeddingConfig;
  onReplayEnvelope: () => void;
}

export const ClosingSection: React.FC<ClosingSectionProps> = ({
  config,
  onReplayEnvelope,
}) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <InvitationCard
      id="closing"
      corners={['top-left', 'bottom-right']}
      floralSize="md"
      innerClassName="text-center py-16 sm:py-20"
    >
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
        whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex justify-center mb-6">
          <WaxSeal
            initials={config.coupleNames.initials.replace(/\s*\|\s*/, '&')}
            size="sm"
            interactive={false}
          />
        </div>

        <h2 className="font-sans-clean text-[11px] sm:text-xs tracking-[0.26em] uppercase text-[#963C23] max-w-[260px] mx-auto leading-relaxed">
          {config.closingMessage.headline}
        </h2>

        <p className="mt-5 font-display text-3xl sm:text-4xl tracking-[0.12em] uppercase text-[#47352E]">
          {config.coupleNames.partner1}{' '}
          <span className="italic text-[#B84F2B]">&amp;</span>{' '}
          {config.coupleNames.partner2}
        </p>

        <p className="mt-4 max-w-[250px] mx-auto font-editorial italic text-sm text-[#47352E]/80 leading-relaxed">
          {config.closingMessage.subtext}
        </p>

        <div className="mt-9">
          <button
            type="button"
            onClick={onReplayEnvelope}
            className="inline-flex items-center gap-2 font-sans-clean text-[10px] tracking-[0.22em] uppercase text-[#47352E]/70 hover:text-[#B84F2B] underline underline-offset-4 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" aria-hidden="true" />
            <span>Replay Envelope</span>
          </button>
        </div>
      </motion.div>
    </InvitationCard>
  );
};
