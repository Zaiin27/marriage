import { useCallback, useState } from 'react';
import { MotionConfig } from 'framer-motion';
import { weddingConfig } from './config/weddingConfig';
import { EnvelopeOpening } from './components/EnvelopeOpening';
import { WeddingHero, type ExperienceStage } from './components/WeddingHero';
import { Countdown } from './components/Countdown';
import { WeddingTimeline } from './components/WeddingTimeline';
import { VenueDetails } from './components/VenueDetails';
import { DressCode } from './components/DressCode';
import { WeddingGallery } from './components/WeddingGallery';
import { RSVPForm } from './components/RSVPForm';
import { ClosingSection } from './components/ClosingSection';
import { MusicPlayer } from './components/MusicPlayer';

const NAV_LINKS = [
  { href: '#invitation', label: 'Invite' },
  { href: '#timeline', label: 'Timeline' },
  { href: '#venue', label: 'Details' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#rsvp', label: 'RSVP' },
];

export function App() {
  const [stage, setStage] = useState<ExperienceStage>('envelope');

  const handleEnvelopeComplete = useCallback(() => {
    setStage('unfolding');
  }, []);

  const handleArrivalComplete = useCallback(() => {
    setStage('arrived');
  }, []);

  const handleReplayEnvelope = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStage('envelope');
  };

  const isArrived = stage === 'arrived';

  return (
    <MotionConfig reducedMotion="user">
      {/* Screen 1: Interactive 3D Terracotta Envelope */}
      {stage === 'envelope' && (
        <EnvelopeOpening
          coupleInitials={weddingConfig.coupleNames.initials}
          partner1={weddingConfig.coupleNames.partner1}
          partner2={weddingConfig.coupleNames.partner2}
          onOpenComplete={handleEnvelopeComplete}
        />
      )}

      {/* Main Stationery Suite (Centered Mobile-First Column on Desktop & Mobile) */}
      <div
        className={`w-full py-5 sm:py-10 px-3 sm:px-6 ${
          isArrived ? 'min-h-dvh' : 'h-dvh overflow-hidden'
        }`}
        style={{
          background:
            'radial-gradient(circle at 50% 15%, #F4E9DA 0%, #E9DAC6 52%, #DECAB0 100%)',
        }}
      >
        <div className="mx-auto w-full max-w-[430px]">
          {/* Minimal Stationery Section Index (reserved space to prevent layout shift) */}
          <nav
            aria-label="Invitation sections"
            aria-hidden={!isArrived}
            className={`mb-4 flex items-center justify-center gap-3 sm:gap-4 rounded-full border border-[#D5C0A0]/70 bg-[#FFF9F1]/85 px-4 py-2 backdrop-blur-sm shadow-xs transition-opacity duration-700 ${
              isArrived ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                tabIndex={isArrived ? 0 : -1}
                className="font-sans-clean text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-[#47352E]/80 hover:text-[#B84F2B] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Stacked Luxury Stationery Suite */}
          <main className="space-y-6 sm:space-y-8">
            <WeddingHero
              config={weddingConfig}
              stage={stage}
              onArrivalComplete={handleArrivalComplete}
            />

            <div
              className={`space-y-6 sm:space-y-8 transition-opacity duration-700 ${
                isArrived ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <Countdown targetDate={weddingConfig.weddingDate} />

              <WeddingTimeline events={weddingConfig.events} />

              <VenueDetails venue={weddingConfig.venue} />

              <DressCode dressCode={weddingConfig.dressCode} />

              <WeddingGallery items={weddingConfig.gallery} />

              <RSVPForm
                rsvp={weddingConfig.rsvp}
                coupleInitials={weddingConfig.coupleNames.initials}
              />

              <ClosingSection
                config={weddingConfig}
                onReplayEnvelope={handleReplayEnvelope}
              />
            </div>
          </main>
        </div>

        {/* Optional Background Music Control (initially OFF, shown on arrival) */}
        {isArrived && (
          <MusicPlayer
            title={weddingConfig.music.title}
            audioUrl={weddingConfig.music.audioUrl}
          />
        )}
      </div>
    </MotionConfig>
  );
}

export default App;
