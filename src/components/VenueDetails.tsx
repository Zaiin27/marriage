import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { MapPin, ExternalLink } from 'lucide-react';
import { InvitationCard } from './InvitationCard';
import type { WeddingConfig } from '../config/weddingConfig';

interface VenueDetailsProps {
  venue: WeddingConfig['venue'];
}

export const VenueDetails: React.FC<VenueDetailsProps> = ({ venue }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <InvitationCard
      id="venue"
      corners={['top-left', 'bottom-right']}
      floralSize="sm"
      innerClassName="text-center px-5 sm:px-8"
    >
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
        whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="font-sans-clean text-[10px] tracking-[0.28em] uppercase text-[#963C23] mb-2">
          THE VENUE
        </p>
        <h2 className="font-display text-3xl sm:text-4xl tracking-[0.16em] uppercase text-[#47352E] mb-7">
          DETAILS
        </h2>

        {/* Editorial Venue Photograph */}
        <div className="relative mx-auto mb-8 overflow-hidden border border-[#D5C0A0]/80 bg-[#F6EBDD] p-1.5 shadow-sm">
          <div className="overflow-hidden aspect-[16/10]">
            <img
              src={venue.image}
              alt={`${venue.name} outdoor garden wedding reception`}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.03]"
            />
          </div>
        </div>

        {/* Location Details */}
        <div className="space-y-2">
          <div className="inline-flex items-center justify-center gap-1.5 text-[#963C23]">
            <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="font-sans-clean text-[11px] tracking-[0.26em] uppercase font-medium">
              LOCATION
            </span>
          </div>

          <h3 className="font-display text-2xl tracking-[0.1em] uppercase text-[#47352E] pt-1">
            {venue.name}
          </h3>

          <address className="not-italic font-sans-clean text-xs leading-relaxed text-[#47352E]/80">
            {venue.addressLines.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </address>

          <p className="pt-2 font-editorial italic text-sm text-[#47352E]/85">
            {venue.dateTimeLabel}
          </p>
        </div>

        {/* Google Maps Action */}
        <div className="mt-7">
          <a
            href={venue.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 border border-[#B84F2B] bg-[#B84F2B] px-6 py-3 font-sans-clean text-[11px] tracking-[0.22em] uppercase text-[#FFF9F1] transition-colors hover:bg-[#963C23] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#47352E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF9F1]"
          >
            <span>Open in Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
          </a>
        </div>
      </motion.div>
    </InvitationCard>
  );
};
