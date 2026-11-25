import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ChevronDown } from 'lucide-react';
import { FloralDecoration } from './FloralDecoration';
import type { WeddingConfig } from '../config/weddingConfig';

export type ExperienceStage = 'envelope' | 'unfolding' | 'arrived';

interface WeddingHeroProps {
  config: WeddingConfig;
  stage: ExperienceStage;
  onArrivalComplete: () => void;
}

export const WeddingHero: React.FC<WeddingHeroProps> = ({
  config,
  stage,
  onArrivalComplete,
}) => {
  const hasPlayedRef = useRef(false);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const cardRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const topFoldRef = useRef<HTMLDivElement>(null);
  const bottomFoldRef = useRef<HTMLDivElement>(null);
  const floralTopRef = useRef<HTMLDivElement>(null);
  const floralBottomRef = useRef<HTMLDivElement>(null);

  const monogramRef = useRef<HTMLDivElement>(null);
  const familyIntroRef = useRef<HTMLParagraphElement>(null);
  const partner1Ref = useRef<HTMLHeadingElement>(null);
  const ampRef = useRef<HTMLParagraphElement>(null);
  const partner2Ref = useRef<HTMLParagraphElement>(null);
  const inviteLineRef = useRef<HTMLParagraphElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const dateVenueRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);

  // Reset guard when envelope is replayed
  useEffect(() => {
    if (stage === 'envelope') {
      hasPlayedRef.current = false;
      timelineRef.current?.kill();
    }
  }, [stage]);

  useEffect(() => {
    if (stage !== 'unfolding' || hasPlayedRef.current) return;
    hasPlayedRef.current = true;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const textElements = [
      monogramRef.current,
      familyIntroRef.current,
      partner1Ref.current,
      ampRef.current,
      partner2Ref.current,
      inviteLineRef.current,
      dividerRef.current,
      dateVenueRef.current,
      quoteRef.current,
      scrollHintRef.current,
    ];

    if (prefersReducedMotion) {
      gsap.set(
        [
          cardRef.current,
          frameRef.current,
          floralTopRef.current,
          floralBottomRef.current,
          ...textElements,
        ],
        { clearProps: 'all', opacity: 1 }
      );
      gsap.set([topFoldRef.current, bottomFoldRef.current], {
        opacity: 0,
        display: 'none',
      });
      gsap.fromTo(
        cardRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.55,
          ease: 'power2.out',
          onComplete: onArrivalComplete,
        }
      );
      return;
    }

    // Initial pre-unfold states (starts already centered & full-opacity for zero handoff jump)
    gsap.set(cardRef.current, {
      scale: 1,
      y: 0,
      opacity: 1,
    });
    gsap.set(frameRef.current, {
      clipPath: 'inset(18% 0% 18% 0%)',
    });
    gsap.set([topFoldRef.current, bottomFoldRef.current], {
      opacity: 1,
      rotateX: 0,
      display: 'block',
    });
    gsap.set(floralTopRef.current, {
      opacity: 0,
      x: -14,
      y: -14,
      scale: 0.92,
    });
    gsap.set(floralBottomRef.current, {
      opacity: 0,
      x: 14,
      y: 14,
      scale: 0.92,
    });
    gsap.set(textElements, {
      opacity: 0,
      y: 14,
    });
    gsap.set([partner1Ref.current, partner2Ref.current], {
      letterSpacing: '0.18em',
    });

    const tl = gsap.timeline({
      onComplete: onArrivalComplete,
    });
    timelineRef.current = tl;

    // PHASE 1 — CARD COMES FORWARD (0.0s – 0.85s)
    tl.to(
      cardRef.current,
      {
        scale: 1,
        y: 0,
        opacity: 1,
        duration: 0.85,
        ease: 'power2.out',
      },
      0
    );

    // PHASE 2 — FULL INVITATION UNFOLDING (0.75s – 2.2s)
    tl.to(
      frameRef.current,
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 1.4,
        ease: 'power2.inOut',
      },
      0.75
    );

    tl.to(
      topFoldRef.current,
      {
        rotateX: 88,
        opacity: 0,
        duration: 1.25,
        ease: 'power2.inOut',
        transformOrigin: 'bottom center',
      },
      0.75
    );

    tl.to(
      bottomFoldRef.current,
      {
        rotateX: -88,
        opacity: 0,
        duration: 1.25,
        ease: 'power2.inOut',
        transformOrigin: 'top center',
      },
      0.75
    );

    tl.set([topFoldRef.current, bottomFoldRef.current], { display: 'none' }, 2.05);

    // PHASE 3 — FLORAL REVEAL (1.95s – 3.15s)
    tl.to(
      [floralTopRef.current, floralBottomRef.current],
      {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        duration: 1.15,
        ease: 'power2.out',
      },
      1.95
    );

    // PHASE 4 — SEQUENCED TYPOGRAPHY REVEAL (2.35s – 4.75s)
    tl.to(
      monogramRef.current,
      { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out' },
      2.35
    )
      .to(
        familyIntroRef.current,
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
        2.55
      )
      .to(
        partner1Ref.current,
        {
          opacity: 1,
          y: 0,
          letterSpacing: '0.12em',
          duration: 0.85,
          ease: 'power2.out',
        },
        2.85
      )
      .to(
        ampRef.current,
        { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' },
        3.15
      )
      .to(
        partner2Ref.current,
        {
          opacity: 1,
          y: 0,
          letterSpacing: '0.12em',
          duration: 0.85,
          ease: 'power2.out',
        },
        3.38
      )
      .to(
        inviteLineRef.current,
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
        3.75
      )
      .to(
        dividerRef.current,
        { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' },
        3.95
      )
      .to(
        dateVenueRef.current,
        { opacity: 1, y: 0, duration: 0.75, ease: 'power2.out' },
        4.15
      )
      .to(
        quoteRef.current,
        { opacity: 1, y: 0, duration: 0.75, ease: 'power2.out' },
        4.4
      );

    // PHASE 5 — TRANSITION INTO MAIN WEBSITE & ARRIVAL (4.9s – 5.65s)
    tl.to(
      scrollHintRef.current,
      { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
      4.9
    );

    return () => {
      tl.kill();
    };
  }, [stage, onArrivalComplete]);

  return (
    <section
      id="invitation"
      ref={cardRef}
      style={{ perspective: '1200px' }}
      className={`relative transition-opacity duration-300 ${
        stage === 'envelope' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Expanding Invitation Card Container */}
      <div
        ref={frameRef}
        className="relative overflow-hidden bg-[#FFF9F1] paper-grain border border-[#D5C0A0]/70 shadow-[0_18px_46px_-14px_rgba(71,53,46,0.2)]"
      >
        {/* Fine inner stationery border frame */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-3 sm:inset-4 border border-[#B49A64]/35 z-10"
        />

        {/* Corner botanical florals (gradually revealed in Phase 3) */}
        <div ref={floralTopRef} className="pointer-events-none absolute inset-0 z-10">
          <FloralDecoration corner="top-left" surface="ivory" size="md" />
        </div>
        <div ref={floralBottomRef} className="pointer-events-none absolute inset-0 z-10">
          <FloralDecoration corner="bottom-right" surface="ivory" size="md" />
        </div>

        {/* Unfolding Paper Wings (Phase 2 hinge panels) */}
        <div
          ref={topFoldRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-1/2 z-30 bg-gradient-to-b from-[#EFE2D0] to-[#FAF1E4] border-b border-[#D5C0A0]/70 shadow-[0_6px_18px_rgba(71,53,46,0.12)]"
          style={{ backfaceVisibility: 'hidden', display: 'none' }}
        />
        <div
          ref={bottomFoldRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 z-30 bg-gradient-to-t from-[#EFE2D0] to-[#FAF1E4] border-t border-[#D5C0A0]/70 shadow-[0_-6px_18px_rgba(71,53,46,0.12)]"
          style={{ backfaceVisibility: 'hidden', display: 'none' }}
        />

        {/* Invitation Content */}
        <div className="relative z-20 px-7 pt-16 pb-12 sm:px-10 sm:pt-20 sm:pb-14 text-center">
          {/* Top Monogram */}
          <div ref={monogramRef} className="mb-8">
            <span className="font-display text-sm tracking-[0.35em] text-[#47352E]/85">
              {config.coupleNames.initials}
            </span>
            <div className="mx-auto mt-3 flex items-center justify-center gap-2">
              <span className="h-px w-8 bg-[#B49A64]/60" />
              <span className="h-1 w-1 rounded-full bg-[#B49A64]" />
              <span className="h-px w-8 bg-[#B49A64]/60" />
            </div>
          </div>

          {/* 1. Family Intro */}
          <p
            ref={familyIntroRef}
            className="font-sans-clean text-[10px] sm:text-[11px] tracking-[0.26em] text-[#47352E]/80 uppercase"
          >
            {config.familyIntro}
          </p>

          {/* 2–4. Couple Names */}
          <div className="my-8 sm:my-10">
            <h1
              ref={partner1Ref}
              className="font-display text-[2.85rem] sm:text-[3.35rem] leading-[1.06] font-normal tracking-[0.12em] text-[#47352E] uppercase"
            >
              {config.coupleNames.partner1}
            </h1>
            <p
              ref={ampRef}
              className="font-display italic text-2xl sm:text-3xl text-[#B84F2B] my-2"
            >
              &amp;
            </p>
            <p
              ref={partner2Ref}
              className="font-display text-[2.85rem] sm:text-[3.35rem] leading-[1.06] font-normal tracking-[0.12em] text-[#47352E] uppercase"
            >
              {config.coupleNames.partner2}
            </p>
          </div>

          {/* 5. Request the pleasure */}
          <p
            ref={inviteLineRef}
            className="font-sans-clean text-[10px] sm:text-[11px] tracking-[0.24em] text-[#47352E]/80 uppercase mb-6"
          >
            {config.invitationLine}
          </p>

          {/* Fine Ornamental Divider */}
          <div
            ref={dividerRef}
            className="mx-auto mb-6 flex items-center justify-center gap-3"
          >
            <span className="h-px w-12 bg-[#D5C0A0]" />
            <span className="h-1.5 w-1.5 rotate-45 bg-[#B84F2B]/70" />
            <span className="h-px w-12 bg-[#D5C0A0]" />
          </div>

          {/* 6. Wedding Date & Venue */}
          <div ref={dateVenueRef} className="space-y-1">
            <p className="font-sans-clean text-[11px] tracking-[0.24em] uppercase text-[#963C23] font-medium">
              {config.displayDate.dayOfWeek}
            </p>
            <p className="font-editorial text-xl sm:text-2xl tracking-[0.06em] text-[#47352E]">
              {config.displayDate.dateText}
            </p>
            <p className="font-sans-clean text-[11px] tracking-[0.2em] uppercase text-[#47352E]/75">
              {config.displayDate.timeText} &middot; {config.venue.name}
            </p>
          </div>

          {/* Blessing Quote */}
          <div ref={quoteRef} className="mt-8 max-w-[260px] mx-auto">
            <p className="font-editorial italic text-[13px] leading-relaxed text-[#47352E]/85">
              {config.blessingQuote.text}
            </p>
            <p className="mt-2 font-sans-clean text-[9px] tracking-[0.24em] uppercase text-[#B49A64]">
              {config.blessingQuote.source}
            </p>
          </div>

          {/* Subtle Scroll Indicator on Arrival */}
          <div
            ref={scrollHintRef}
            className="mt-9 flex flex-col items-center gap-1 text-[#963C23]/75"
          >
            <span className="font-sans-clean text-[9px] tracking-[0.26em] uppercase">
              Scroll to explore
            </span>
            <ChevronDown className="w-3.5 h-3.5 animate-gentle-float" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
};
