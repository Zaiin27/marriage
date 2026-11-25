import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { InvitationCard } from './InvitationCard';
import type { WeddingEvent } from '../config/weddingConfig';

interface WeddingTimelineProps {
  events: WeddingEvent[];
}

export const WeddingTimeline: React.FC<WeddingTimelineProps> = ({ events }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <InvitationCard
      id="timeline"
      corners={['top-left', 'bottom-right']}
      floralSize="md"
      innerClassName="text-center"
    >
      {/* Section Header */}
      <div className="mb-10">
        <p className="font-sans-clean text-[10px] tracking-[0.28em] uppercase text-[#963C23] mb-2">
          ORDER OF EVENTS
        </p>
        <h2 className="font-display text-3xl sm:text-4xl tracking-[0.16em] uppercase text-[#47352E]">
          TIMELINE
        </h2>
        <div className="mx-auto mt-3 flex items-center justify-center gap-2">
          <span className="h-px w-10 bg-[#D5C0A0]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#B84F2B]" />
          <span className="h-px w-10 bg-[#D5C0A0]" />
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-8">
        {events.map((event, idx) => (
          <motion.article
            key={event.id}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            {/* Time & Date */}
            <p className="font-sans-clean text-[11px] tracking-[0.22em] uppercase text-[#963C23] font-medium">
              {event.time} &middot; {event.date}
            </p>

            {/* Event Name */}
            <h3 className="mt-1.5 font-display text-2xl tracking-[0.12em] uppercase text-[#47352E]">
              {event.name}
            </h3>

            {/* Venue */}
            <p className="mt-1 font-sans-clean text-xs tracking-[0.14em] uppercase text-[#47352E]/75">
              {event.venue}
            </p>

            {/* Editorial Description */}
            <p className="mt-2.5 max-w-[270px] mx-auto font-editorial italic text-[13px] leading-relaxed text-[#47352E]/80">
              {event.description}
            </p>

            {/* Dress Code & Map Link */}
            <div className="mt-2.5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[10px] tracking-[0.16em] uppercase text-[#47352E]/65">
              {event.dressCode && <span>Attire: {event.dressCode}</span>}
              {event.mapUrl && (
                <a
                  href={event.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#B84F2B] hover:text-[#963C23] underline underline-offset-4 transition-colors"
                >
                  <MapPin className="w-3 h-3" aria-hidden="true" />
                  Directions
                </a>
              )}
            </div>

            {/* Subtle Divider between events */}
            {idx < events.length - 1 && (
              <div
                aria-hidden="true"
                className="mx-auto mt-8 flex items-center justify-center gap-2.5"
              >
                <span className="h-px w-8 bg-[#D5C0A0]/80" />
                <span className="h-1 w-1 rounded-full bg-[#B49A64]" />
                <span className="h-px w-8 bg-[#D5C0A0]/80" />
              </div>
            )}
          </motion.article>
        ))}
      </div>
    </InvitationCard>
  );
};
