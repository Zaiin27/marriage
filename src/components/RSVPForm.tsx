import React, { useEffect, useId, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Check, AlertCircle } from 'lucide-react';
import { InvitationCard } from './InvitationCard';
import { WaxSeal } from './WaxSeal';
import type { WeddingConfig } from '../config/weddingConfig';

interface RSVPFormProps {
  rsvp: WeddingConfig['rsvp'];
  coupleInitials: string;
}

interface RSVPSubmission {
  name: string;
  phone: string;
  attending: 'accept' | 'decline';
  guests: number;
  meal: string;
  message: string;
  submittedAt: string;
}

const STORAGE_KEY = 'wedding_rsvp_submission_v1';

export const RSVPForm: React.FC<RSVPFormProps> = ({ rsvp, coupleInitials }) => {
  const shouldReduceMotion = useReducedMotion();
  const formRef = useRef<HTMLFormElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const nameErrorId = useId();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [attending, setAttending] = useState<'accept' | 'decline'>('accept');
  const [guests, setGuests] = useState(1);
  const [meal, setMeal] = useState(rsvp.mealOptions[0] ?? '');
  const [message, setMessage] = useState('');

  const [nameInvalid, setNameInvalid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedRecord, setSubmittedRecord] = useState<RSVPSubmission | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? (JSON.parse(saved) as RSVPSubmission) : null;
    } catch {
      return null;
    }
  });

  // Fallback for browsers without :user-invalid support (sync aria-invalid cleanly)
  useEffect(() => {
    const input = nameInputRef.current;
    if (!input) return;

    const handleBlur = () => {
      if (input.value.trim().length === 0 && input.dataset.interacted === 'true') {
        setNameInvalid(true);
      }
    };

    const handleInput = () => {
      input.dataset.interacted = 'true';
      if (input.value.trim().length > 0) {
        setNameInvalid(false);
      }
    };

    input.addEventListener('blur', handleBlur);
    input.addEventListener('input', handleInput);
    return () => {
      input.removeEventListener('blur', handleBlur);
      input.removeEventListener('input', handleInput);
    };
  }, [submittedRecord]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const trimmedName = name.trim();
    if (!trimmedName) {
      setNameInvalid(true);
      nameInputRef.current?.focus();
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const payload: RSVPSubmission = {
      name: trimmedName,
      phone: phone.trim(),
      attending,
      guests: attending === 'accept' ? guests : 0,
      meal: attending === 'accept' ? meal : '',
      message: message.trim(),
      submittedAt: new Date().toISOString(),
    };

    try {
      if (rsvp.endpointUrl) {
        const res = await fetch(rsvp.endpointUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          throw new Error('Could not record RSVP right now.');
        }
      } else {
        // Clean development fallback with slight realistic network feel
        await new Promise((resolve) => setTimeout(resolve, 450));
      }

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      } catch {
        // Ignore storage quota issues
      }

      setSubmittedRecord(payload);
    } catch {
      setSubmitError('Something went wrong sending your RSVP. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <InvitationCard
      id="rsvp"
      corners={['top-left', 'bottom-right']}
      floralSize="md"
      innerClassName="text-center"
    >
      {/* Editorial RSVP Header */}
      <div className="mb-8">
        <p className="font-sans-clean text-[10px] tracking-[0.28em] uppercase text-[#47352E]/75 mb-2">
          PLEASE
        </p>
        <h2
          className="font-display text-5xl sm:text-6xl leading-[0.88] tracking-[0.14em] text-[#963C23] uppercase"
          aria-label="RSVP"
        >
          RS
          <br />
          VP
        </h2>
        <p className="mt-4 font-sans-clean text-[11px] tracking-[0.24em] uppercase text-[#47352E]/80">
          {rsvp.deadline}
        </p>
      </div>

      {submittedRecord ? (
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="py-6 px-4 border border-[#D5C0A0]/70 bg-[#F6EBDD]/55"
          role="status"
          aria-live="polite"
        >
          <div className="flex justify-center mb-4">
            <WaxSeal
              initials={coupleInitials.replace(/\s*\|\s*/, '&')}
              size="sm"
              interactive={false}
            />
          </div>
          <h3 className="font-display text-2xl tracking-[0.1em] uppercase text-[#47352E]">
            {submittedRecord.attending === 'accept'
              ? 'We Are Overjoyed!'
              : 'With Warmest Thanks'}
          </h3>
          <p className="mt-2 font-editorial italic text-sm text-[#47352E]/85 leading-relaxed">
            {submittedRecord.attending === 'accept'
              ? `Thank you, ${submittedRecord.name}. We have reserved ${
                  submittedRecord.guests
                } ${submittedRecord.guests === 1 ? 'seat' : 'seats'} in your honor.`
              : `Thank you for letting us know, ${submittedRecord.name}. You will be missed and held warmly in our hearts.`}
          </p>

          <button
            type="button"
            onClick={() => {
              setName(submittedRecord.name);
              setPhone(submittedRecord.phone);
              setAttending(submittedRecord.attending);
              setGuests(submittedRecord.guests || 1);
              if (submittedRecord.meal) setMeal(submittedRecord.meal);
              setMessage(submittedRecord.message);
              setSubmittedRecord(null);
            }}
            className="mt-5 font-sans-clean text-[10px] tracking-[0.22em] uppercase text-[#B84F2B] underline underline-offset-4 hover:text-[#963C23] cursor-pointer"
          >
            Update Response
          </button>
        </motion.div>
      ) : (
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          noValidate
          className="text-left space-y-5 max-w-[300px] mx-auto"
        >
          {/* Guest Name */}
          <div>
            <label
              htmlFor="rsvp-name"
              className="block font-sans-clean text-[10px] tracking-[0.22em] uppercase text-[#47352E]/80 mb-1.5"
            >
              Guest Name <span className="text-[#B84F2B]">*</span>
            </label>
            <input
              ref={nameInputRef}
              id="rsvp-name"
              name="name"
              type="text"
              required
              autoComplete="name"
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-invalid={nameInvalid ? 'true' : 'false'}
              aria-describedby={nameInvalid ? nameErrorId : undefined}
              className={`rsvp-input w-full border bg-[#FFF9F1] px-3.5 py-2.5 font-sans-clean text-sm text-[#47352E] placeholder:text-[#47352E]/40 focus:outline-none focus:border-[#B84F2B] transition-colors ${
                nameInvalid ? 'user-invalid-fallback border-[#963C23]' : 'border-[#D5C0A0]'
              }`}
            />
            <div
              id={nameErrorId}
              className="error-msg items-center gap-1.5 mt-1.5 text-xs text-[#963C23]"
            >
              <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>Please enter your full name.</span>
            </div>
          </div>

          {/* Phone Number (Optional) */}
          <div>
            <label
              htmlFor="rsvp-phone"
              className="block font-sans-clean text-[10px] tracking-[0.22em] uppercase text-[#47352E]/80 mb-1.5"
            >
              Phone Number <span className="text-[#47352E]/45">(Optional)</span>
            </label>
            <input
              id="rsvp-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="(555) 000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-[#D5C0A0] bg-[#FFF9F1] px-3.5 py-2.5 font-sans-clean text-sm text-[#47352E] placeholder:text-[#47352E]/40 focus:outline-none focus:border-[#B84F2B] transition-colors"
            />
          </div>

          {/* Attendance Choice */}
          <fieldset>
            <legend className="block font-sans-clean text-[10px] tracking-[0.22em] uppercase text-[#47352E]/80 mb-2">
              Will You Attend?
            </legend>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setAttending('accept')}
                aria-pressed={attending === 'accept'}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-2 border font-sans-clean text-[10px] tracking-[0.16em] uppercase transition-colors cursor-pointer ${
                  attending === 'accept'
                    ? 'border-[#B84F2B] bg-[#B84F2B] text-[#FFF9F1]'
                    : 'border-[#D5C0A0] bg-[#FFF9F1] text-[#47352E] hover:border-[#B84F2B]'
                }`}
              >
                {attending === 'accept' && <Check className="w-3 h-3" aria-hidden="true" />}
                <span>Joyfully Accept</span>
              </button>

              <button
                type="button"
                onClick={() => setAttending('decline')}
                aria-pressed={attending === 'decline'}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-2 border font-sans-clean text-[10px] tracking-[0.16em] uppercase transition-colors cursor-pointer ${
                  attending === 'decline'
                    ? 'border-[#47352E] bg-[#47352E] text-[#FFF9F1]'
                    : 'border-[#D5C0A0] bg-[#FFF9F1] text-[#47352E] hover:border-[#47352E]'
                }`}
              >
                {attending === 'decline' && <Check className="w-3 h-3" aria-hidden="true" />}
                <span>Regretfully Decline</span>
              </button>
            </div>
          </fieldset>

          {/* Conditional Guest Count & Meal Preference */}
          {attending === 'accept' && (
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label
                  htmlFor="rsvp-guests"
                  className="block font-sans-clean text-[10px] tracking-[0.22em] uppercase text-[#47352E]/80 mb-1.5"
                >
                  Number of Guests
                </label>
                <select
                  id="rsvp-guests"
                  name="guests"
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full border border-[#D5C0A0] bg-[#FFF9F1] px-3.5 py-2.5 font-sans-clean text-sm text-[#47352E] focus:outline-none focus:border-[#B84F2B]"
                >
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? 'Guest' : 'Guests'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="rsvp-meal"
                  className="block font-sans-clean text-[10px] tracking-[0.22em] uppercase text-[#47352E]/80 mb-1.5"
                >
                  Meal Preference <span className="text-[#47352E]/45">(Optional)</span>
                </label>
                <select
                  id="rsvp-meal"
                  name="meal"
                  value={meal}
                  onChange={(e) => setMeal(e.target.value)}
                  className="w-full border border-[#D5C0A0] bg-[#FFF9F1] px-3.5 py-2.5 font-sans-clean text-sm text-[#47352E] focus:outline-none focus:border-[#B84F2B]"
                >
                  {rsvp.mealOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Message to the Couple */}
          <div>
            <label
              htmlFor="rsvp-message"
              className="block font-sans-clean text-[10px] tracking-[0.22em] uppercase text-[#47352E]/80 mb-1.5"
            >
              Note to the Couple <span className="text-[#47352E]/45">(Optional)</span>
            </label>
            <textarea
              id="rsvp-message"
              name="message"
              rows={3}
              placeholder="Dietary notes or a warm wish..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full border border-[#D5C0A0] bg-[#FFF9F1] px-3.5 py-2.5 font-sans-clean text-sm text-[#47352E] placeholder:text-[#47352E]/40 focus:outline-none focus:border-[#B84F2B] resize-none"
            />
          </div>

          {submitError && (
            <p role="alert" className="text-xs text-[#963C23] text-center">
              {submitError}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#B84F2B] hover:bg-[#963C23] disabled:opacity-60 text-[#FFF9F1] py-3.5 px-6 font-sans-clean text-[11px] tracking-[0.26em] uppercase transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#47352E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF9F1]"
          >
            {isSubmitting ? 'Sending Response...' : 'Send RSVP'}
          </button>
        </form>
      )}

      {/* Direct Contact Footer */}
      <div className="mt-8 pt-6 border-t border-[#D5C0A0]/60 text-center space-y-1">
        <p className="font-sans-clean text-[10px] tracking-[0.2em] uppercase text-[#47352E]/70">
          {rsvp.contactEmail}
        </p>
        <p className="font-sans-clean text-[10px] tracking-[0.2em] text-[#47352E]/65">
          {rsvp.contactPhone}
        </p>
      </div>
    </InvitationCard>
  );
};
