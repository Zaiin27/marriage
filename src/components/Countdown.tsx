import React, { useEffect, useState } from 'react';
import { InvitationCard } from './InvitationCard';

interface CountdownProps {
  targetDate: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(targetDate: string): TimeLeft {
  const diff = Math.max(0, new Date(targetDate).getTime() - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export const Countdown: React.FC<CountdownProps> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft(targetDate));

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [targetDate]);

  const units = [
    { label: 'Days', value: String(timeLeft.days).padStart(2, '0') },
    { label: 'Hours', value: String(timeLeft.hours).padStart(2, '0') },
    { label: 'Minutes', value: String(timeLeft.minutes).padStart(2, '0') },
    { label: 'Seconds', value: String(timeLeft.seconds).padStart(2, '0') },
  ];

  return (
    <InvitationCard
      id="countdown"
      corners={['top-right', 'bottom-left']}
      floralSize="sm"
      innerClassName="text-center py-12 sm:py-14"
    >
      <p className="font-sans-clean text-[10px] tracking-[0.28em] uppercase text-[#963C23] mb-2">
        COUNTING DOWN TO FOREVER
      </p>
      <h2 className="font-editorial italic text-lg text-[#47352E]/85 mb-7">
        Until we say &ldquo;I do&rdquo;
      </h2>

      <div
        className="grid grid-cols-4 divide-x divide-[#D5C0A0]/70 max-w-[310px] mx-auto"
        aria-live="off"
      >
        {units.map((unit) => (
          <div key={unit.label} className="px-1.5 py-1">
            <span className="block font-display text-3xl sm:text-4xl tracking-[0.04em] text-[#47352E] tabular-nums">
              {unit.value}
            </span>
            <span className="mt-1 block font-sans-clean text-[9px] tracking-[0.2em] uppercase text-[#47352E]/65">
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </InvitationCard>
  );
};
