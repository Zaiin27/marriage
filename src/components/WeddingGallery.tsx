import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { InvitationCard } from './InvitationCard';
import type { GalleryItem } from '../config/weddingConfig';

interface WeddingGalleryProps {
  items: GalleryItem[];
}

export const WeddingGallery: React.FC<WeddingGalleryProps> = ({ items }) => {
  const shouldReduceMotion = useReducedMotion();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const touchStartX = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setActiveIndex(index);
    dialogRef.current?.showModal();
  };

  const closeLightbox = () => {
    dialogRef.current?.close();
  };

  const showPrev = () => {
    setActiveIndex((prev) => (prev === null ? null : (prev - 1 + items.length) % items.length));
  };

  const showNext = () => {
    setActiveIndex((prev) => (prev === null ? null : (prev + 1) % items.length));
  };

  // Sync React state when native dialog closes (Esc, backdrop, or close button)
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => {
      dialog.returnValue = '';
      setActiveIndex(null);
    };

    dialog.addEventListener('close', handleClose);

    // Light-dismiss fallback for browsers without native closedby="any" (e.g. Safari)
    let cleanupFallback: (() => void) | undefined;
    if (!('closedBy' in HTMLDialogElement.prototype)) {
      let pressedOutside = false;
      const isOutside = (e: PointerEvent) => {
        const r = dialog.getBoundingClientRect();
        return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
      };
      const onDown = (e: PointerEvent) => {
        pressedOutside = isOutside(e);
      };
      const onUp = (e: PointerEvent) => {
        if (pressedOutside && isOutside(e)) dialog.close();
      };
      dialog.addEventListener('pointerdown', onDown);
      dialog.addEventListener('pointerup', onUp);
      cleanupFallback = () => {
        dialog.removeEventListener('pointerdown', onDown);
        dialog.removeEventListener('pointerup', onUp);
      };
    }

    return () => {
      dialog.removeEventListener('close', handleClose);
      cleanupFallback?.();
    };
  }, []);

  // Keyboard arrow navigation while lightbox is open
  useEffect(() => {
    if (activeIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  const currentItem = activeIndex !== null ? items[activeIndex] : null;

  return (
    <InvitationCard
      id="gallery"
      corners={['top-left', 'bottom-right']}
      floralSize="sm"
      innerClassName="px-5 sm:px-8"
    >
      <div className="text-center mb-9">
        <p className="font-sans-clean text-[10px] tracking-[0.28em] uppercase text-[#963C23] mb-2">
          OUR MOMENTS
        </p>
        <h2 className="font-display text-3xl sm:text-4xl tracking-[0.16em] uppercase text-[#47352E]">
          GALLERY
        </h2>
      </div>

      {/* Editorial Staggered Portrait Layout */}
      <div className="space-y-6">
        {items.map((item, idx) => (
          <motion.figure
            key={item.id}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.65, delay: idx * 0.06, ease: [0.22, 1, 0.36, 1] }}
            className="group"
          >
            <button
              type="button"
              onClick={() => openLightbox(idx)}
              aria-label={`View photograph: ${item.caption}`}
              className="block w-full text-left border border-[#D5C0A0]/80 bg-[#F6EBDD] p-1.5 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B84F2B] cursor-pointer"
            >
              <div
                className={`overflow-hidden ${
                  item.aspect === 'portrait' ? 'aspect-[3/4]' : 'aspect-[16/10]'
                }`}
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </div>
            </button>
            <figcaption className="mt-2 text-center font-editorial italic text-xs text-[#47352E]/75">
              {item.caption}
            </figcaption>
          </motion.figure>
        ))}
      </div>

      {/* Native <dialog> Lightbox with Swipe & Keyboard Navigation */}
      <dialog
        ref={dialogRef}
        {...({ closedby: 'any' } as Record<string, string>)}
        aria-labelledby="lightbox-caption"
        className="w-full max-w-[440px] px-3 py-6 outline-none"
        onTouchStart={(e) => {
          touchStartX.current = e.changedTouches[0]?.clientX ?? null;
        }}
        onTouchEnd={(e) => {
          if (touchStartX.current === null) return;
          const deltaX = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
          if (deltaX > 45) showPrev();
          else if (deltaX < -45) showNext();
          touchStartX.current = null;
        }}
      >
        {currentItem && (
          <div className="relative bg-[#FFF9F1] border border-[#D5C0A0] p-2.5 shadow-2xl">
            <button
              type="button"
              onClick={closeLightbox}
              aria-label="Close gallery lightbox"
              className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-[#47352E]/80 text-[#FFF9F1] hover:bg-[#963C23] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="relative overflow-hidden bg-[#F6EBDD]">
              <img
                src={currentItem.src}
                alt={currentItem.alt}
                className="w-full max-h-[72dvh] object-contain mx-auto"
              />

              <button
                type="button"
                onClick={showPrev}
                aria-label="Previous photograph"
                className="absolute left-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-[#FFF9F1]/85 text-[#47352E] shadow hover:bg-[#FFF9F1] transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={showNext}
                aria-label="Next photograph"
                className="absolute right-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-[#FFF9F1]/85 text-[#47352E] shadow hover:bg-[#FFF9F1] transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="pt-3 pb-1 px-2 flex items-center justify-between gap-4">
              <p
                id="lightbox-caption"
                className="font-editorial italic text-sm text-[#47352E]"
              >
                {currentItem.caption}
              </p>
              <span className="font-sans-clean text-[10px] tracking-[0.2em] text-[#47352E]/60 shrink-0">
                {(activeIndex ?? 0) + 1} / {items.length}
              </span>
            </div>
          </div>
        )}
      </dialog>
    </InvitationCard>
  );
};
