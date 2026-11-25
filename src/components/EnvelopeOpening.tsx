import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { FloralDecoration } from './FloralDecoration';
import { WaxSeal } from './WaxSeal';

interface EnvelopeOpeningProps {
  coupleInitials: string;
  partner1: string;
  partner2: string;
  onOpenComplete: () => void;
}

const PETAL_ITEMS = [
  { left: '12%', delay: '0s', duration: '6.8s', size: 17, rotate: 20 },
  { left: '28%', delay: '0.8s', duration: '7.5s', size: 14, rotate: -35 },
  { left: '48%', delay: '0.3s', duration: '7.0s', size: 19, rotate: 42 },
  { left: '66%', delay: '1.1s', duration: '7.8s', size: 15, rotate: -18 },
  { left: '84%', delay: '0.5s', duration: '7.2s', size: 16, rotate: 28 },
];

export const EnvelopeOpening: React.FC<EnvelopeOpeningProps> = ({
  coupleInitials,
  partner1,
  partner2,
  onOpenComplete,
}) => {
  const [isOpening, setIsOpening] = useState(false);
  const [showPetals, setShowPetals] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const floatWrapperRef = useRef<HTMLDivElement>(null);
  const backWallRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const sideFoldsRef = useRef<HTMLDivElement>(null);
  const frontPocketRef = useRef<HTMLDivElement>(null);
  const flapRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLDivElement>(null);
  const sealShineRef = useRef<HTMLDivElement>(null);
  const promptRef = useRef<HTMLParagraphElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const targets = [
      containerRef.current,
      floatWrapperRef.current,
      backWallRef.current,
      cardRef.current,
      sideFoldsRef.current,
      frontPocketRef.current,
      flapRef.current,
      sealRef.current,
      sealShineRef.current,
      promptRef.current,
    ];
    return () => {
      timelineRef.current?.kill();
      gsap.killTweensOf(targets);
    };
  }, []);

  const handleOpen = () => {
    if (isOpening) return;
    setIsOpening(true);
    setShowPetals(true);

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 0.45,
        ease: 'power2.out',
        onComplete: onOpenComplete,
      });
      return;
    }

    // Settle idle float cleanly before starting master timeline
    gsap.to(floatWrapperRef.current, {
      y: 0,
      duration: 0.25,
      ease: 'power2.out',
    });

    const tl = gsap.timeline({
      onComplete: onOpenComplete,
    });
    timelineRef.current = tl;

    // PHASE 2 — WAX SEAL RELEASE (0.0s – 0.9s)
    tl.to(
      promptRef.current,
      {
        opacity: 0,
        y: 8,
        duration: 0.35,
        ease: 'power2.out',
      },
      0
    );

    // Soft highlight sweep across wax seal
    tl.fromTo(
      sealShineRef.current,
      { xPercent: -120, opacity: 0 },
      {
        xPercent: 140,
        opacity: 0.75,
        duration: 0.5,
        ease: 'power1.inOut',
      },
      0.05
    );

    // Seal presses slightly, then unseals & fades cleanly
    tl.to(
      sealRef.current,
      {
        scale: 0.94,
        duration: 0.16,
        ease: 'power2.out',
      },
      0.1
    ).to(
      sealRef.current,
      {
        scale: 1.08,
        y: -8,
        opacity: 0,
        duration: 0.55,
        ease: 'power2.inOut',
      },
      0.28
    );

    // PHASE 3 — TOP FLAP OPENING (0.75s – 2.05s)
    // Rotates smoothly around top hinge (transformOrigin: 'top center')
    tl.to(
      flapRef.current,
      {
        rotateX: 175,
        duration: 1.3,
        ease: 'power2.inOut',
        transformOrigin: 'top center',
      },
      0.75
    );

    // Mid-rotation (at ~90deg), drop flap behind card (z-15 < card z-20) so card emerges cleanly in front of liner
    tl.set(flapRef.current, { zIndex: 15 }, 1.4);

    // PHASE 4 — INVITATION CARD EMERGENCE (1.85s – 3.55s)
    // Card slides up while envelope simultaneously glides down so the card never hits the top screen edge
    tl.to(
      cardRef.current,
      {
        yPercent: -40,
        duration: 1.55,
        ease: 'power2.out',
      },
      1.85
    );

    tl.to(
      [backWallRef.current, sideFoldsRef.current, frontPocketRef.current, flapRef.current],
      {
        y: 115,
        duration: 1.55,
        ease: 'power2.out',
      },
      1.85
    );

    // PHASE 5 — FINAL REVEAL & HANDOFF TO HERO FRAME (3.4s – 4.9s)
    // Envelope glides smoothly away downward while card settles into the hero frame
    tl.to(
      [backWallRef.current, sideFoldsRef.current, frontPocketRef.current, flapRef.current],
      {
        y: 230,
        scale: 0.92,
        opacity: 0,
        duration: 0.95,
        ease: 'power2.inOut',
      },
      3.4
    );

    tl.to(
      cardRef.current,
      {
        yPercent: 0,
        y: 0,
        scale: 1,
        duration: 0.95,
        ease: 'power2.inOut',
      },
      3.4
    );

    // Smoothly crossfade overlay into the matching WeddingHero frame
    tl.to(
      containerRef.current,
      {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out',
      },
      4.35
    );
  };

  return (
    /* Layer 1: Background */
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden px-5 py-8"
      style={{
        background:
          'radial-gradient(circle at 50% 42%, #F3E6D6 0%, #E5D2BA 58%, #D8C0A3 100%)',
      }}
    >
      {/* Subtle floating creamy-white petals during opening */}
      {showPetals && (
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden z-[65]">
          {PETAL_ITEMS.map((petal, idx) => (
            <span
              key={idx}
              className="animate-petal-drift absolute -top-8 rounded-[65%_35%_60%_40%/60%_40%_60%_40%] bg-gradient-to-br from-[#FFFDF9] to-[#EFE2D0] shadow-sm"
              style={
                {
                  left: petal.left,
                  width: `${petal.size}px`,
                  height: `${Math.round(petal.size * 1.28)}px`,
                  transform: `rotate(${petal.rotate}deg)`,
                  '--petal-delay': petal.delay,
                  '--petal-duration': petal.duration,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      )}

      {/* Idle Float Wrapper (isolated from inner 3D perspective) */}
      <div
        ref={floatWrapperRef}
        className={`relative w-[min(86vw,350px)] sm:w-[375px] aspect-[9/14] ${
          !isOpening ? 'animate-gentle-float' : ''
        }`}
      >
        {/* 3D Perspective Stage */}
        <div
          className="relative w-full h-full isolate"
          style={{ perspective: '1200px' }}
        >
          {/* Dedicated Accessible Trigger Button (avoids <button> 3D-flattening bugs) */}
          {!isOpening && (
            <button
              type="button"
              onClick={handleOpen}
              aria-label={`Tap to open wedding invitation for ${partner1} and ${partner2}`}
              className="group absolute inset-0 z-[70] cursor-pointer rounded-[4px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#47352E] focus-visible:ring-offset-4 focus-visible:ring-offset-[#E5D2BA]"
            />
          )}

          {/* Layer 2: Envelope Back (z-10) */}
          <div
            ref={backWallRef}
            aria-hidden="true"
            className="absolute inset-0 z-[10] rounded-[4px] bg-[#8E3519] paper-grain shadow-[0_24px_60px_-15px_rgba(62,25,12,0.48),0_4px_16px_rgba(62,25,12,0.22)]"
          />

          {/* Layer 3: Invitation Card (z-20: starts inside, rises smoothly behind front pocket) */}
          <div
            ref={cardRef}
            aria-hidden="true"
            className="absolute inset-x-3.5 top-6 bottom-5 z-[20] rounded-[2px] bg-[#FFF9F1] paper-grain border border-[#D5C0A0] shadow-[0_14px_34px_rgba(62,25,12,0.22)] flex flex-col items-center justify-center px-6 text-center overflow-hidden will-change-transform"
          >
            <div className="absolute inset-2.5 border border-[#B49A64]/35 pointer-events-none" />
            <FloralDecoration corner="top-left" surface="ivory" size="sm" />
            <FloralDecoration corner="bottom-right" surface="ivory" size="sm" />
            <p className="relative z-10 font-sans-clean text-[9px] tracking-[0.28em] text-[#47352E]/70 uppercase mb-3">
              {coupleInitials}
            </p>
            <p className="relative z-10 font-display text-3xl tracking-[0.14em] text-[#47352E] uppercase">
              {partner1}
            </p>
            <span className="relative z-10 font-display italic text-xl text-[#B84F2B] my-1">
              &amp;
            </span>
            <p className="relative z-10 font-display text-3xl tracking-[0.14em] text-[#47352E] uppercase">
              {partner2}
            </p>
          </div>

          {/* Layer 4: Left and Right Envelope Folds (z-30) */}
          <div
            ref={sideFoldsRef}
            aria-hidden="true"
            className="absolute inset-0 z-[30] rounded-[4px] overflow-hidden pointer-events-none"
          >
            <svg
              viewBox="0 0 360 560"
              preserveAspectRatio="none"
              className="w-full h-full"
            >
              <defs>
                <linearGradient id="leftFoldGrad" x1="0%" y1="0%" x2="100%" y2="50%">
                  <stop offset="0%" stopColor="#B84F2B" />
                  <stop offset="100%" stopColor="#9E3C1D" />
                </linearGradient>
                <linearGradient id="rightFoldGrad" x1="100%" y1="0%" x2="0%" y2="50%">
                  <stop offset="0%" stopColor="#B44B27" />
                  <stop offset="100%" stopColor="#98381A" />
                </linearGradient>
              </defs>
              <polygon points="0,0 184,280 0,560" fill="url(#leftFoldGrad)" />
              <polygon points="360,0 176,280 360,560" fill="url(#rightFoldGrad)" />
            </svg>
          </div>

          {/* Layer 5: Bottom Front Pocket + Corner Florals (z-40: stays in front of emerging card) */}
          <div
            ref={frontPocketRef}
            aria-hidden="true"
            className="absolute inset-0 z-[40] rounded-[4px] overflow-hidden pointer-events-none"
          >
            <svg
              viewBox="0 0 360 560"
              preserveAspectRatio="none"
              className="w-full h-full"
            >
              <defs>
                <linearGradient id="bottomPocketGrad" x1="50%" y1="0%" x2="50%" y2="100%">
                  <stop offset="0%" stopColor="#BC532F" />
                  <stop offset="100%" stopColor="#9A3B1D" />
                </linearGradient>
                <filter id="pocketShadow" x="-10%" y="-10%" width="120%" height="120%">
                  <feDropShadow dx="0" dy="-3" stdDeviation="4" floodColor="#3A1206" floodOpacity="0.34" />
                </filter>
              </defs>
              <polygon
                points="0,560 180,256 360,560"
                fill="url(#bottomPocketGrad)"
                filter="url(#pocketShadow)"
              />
            </svg>

            {/* Lower-left botanical floral on front pocket */}
            <FloralDecoration corner="bottom-left" surface="terracotta" size="lg" />
          </div>

          {/* Layer 6: Top Envelope Flap (z-50 closed -> z-15 open, rotates backward/open around top hinge) */}
          <div
            ref={flapRef}
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-[54%] z-[50] pointer-events-none will-change-transform"
            style={{
              transformStyle: 'preserve-3d',
              transformOrigin: 'top center',
            }}
          >
            {/* Outer Terracotta Face (holds upper-right floral so it opens with the flap!) */}
            <div
              className="absolute inset-0 overflow-hidden rounded-t-[4px]"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <svg
                viewBox="0 0 360 302"
                preserveAspectRatio="none"
                className="w-full h-full drop-shadow-[0_10px_16px_rgba(45,14,5,0.34)]"
              >
                <defs>
                  <linearGradient id="topFlapOuterGrad" x1="50%" y1="0%" x2="50%" y2="100%">
                    <stop offset="0%" stopColor="#C15632" />
                    <stop offset="70%" stopColor="#B14725" />
                    <stop offset="100%" stopColor="#9F3D1E" />
                  </linearGradient>
                </defs>
                <polygon points="0,0 360,0 180,292" fill="url(#topFlapOuterGrad)" />
                <polyline
                  points="0,0 180,292 360,0"
                  fill="none"
                  stroke="#E08B67"
                  strokeOpacity="0.24"
                  strokeWidth="1.2"
                />
              </svg>
              <FloralDecoration corner="top-right" surface="terracotta" size="lg" />
            </div>

            {/* Inner Champagne-Ivory Liner Face */}
            <div
              className="absolute inset-0"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateX(180deg)',
              }}
            >
              <svg
                viewBox="0 0 360 302"
                preserveAspectRatio="none"
                className="w-full h-full drop-shadow-[0_-6px_14px_rgba(45,14,5,0.2)]"
              >
                <defs>
                  <linearGradient id="topFlapLinerGrad" x1="50%" y1="0%" x2="50%" y2="100%">
                    <stop offset="0%" stopColor="#EFE1CE" />
                    <stop offset="100%" stopColor="#FAF2E6" />
                  </linearGradient>
                </defs>
                <polygon points="0,0 360,0 180,292" fill="url(#topFlapLinerGrad)" />
                <polyline
                  points="10,0 180,278 350,0"
                  fill="none"
                  stroke="#B49A64"
                  strokeOpacity="0.4"
                  strokeWidth="1"
                />
              </svg>
            </div>
          </div>

          {/* Layer 7: Wax Seal (z-60, anchored at flap junction) */}
          <div
            ref={sealRef}
            aria-hidden="true"
            className="absolute left-1/2 top-[51%] -translate-x-1/2 -translate-y-1/2 z-[60] pointer-events-none overflow-hidden rounded-full"
          >
            <WaxSeal initials={coupleInitials.replace(/\s*\|\s*/, '&')} size="md" />
            {/* Soft highlight sweep overlay */}
            <div
              ref={sealShineRef}
              className="absolute inset-0 opacity-0 bg-gradient-to-r from-transparent via-[#FFF7DF]/70 to-transparent -skew-x-12 pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* Subtle tap instruction */}
      <p
        ref={promptRef}
        className="mt-7 font-sans-clean text-[11px] sm:text-xs tracking-[0.26em] uppercase text-[#47352E]/85 text-center"
      >
        Tap to open your invitation
      </p>
    </div>
  );
};
