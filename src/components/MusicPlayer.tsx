import React, { useEffect, useRef, useState } from 'react';
import { Music, Pause, Play, Volume2, VolumeX } from 'lucide-react';

interface MusicPlayerProps {
  title: string;
  audioUrl?: string;
}

// Gentle F-major / D-minor romantic piano arpeggio frequencies (Hz)
const PIANO_NOTES = [
  174.61, 220.0, 261.63, 349.23, 329.63, 261.63, // Fmaj7
  146.83, 220.0, 261.63, 329.63, 293.66, 220.0, // Dm7
  233.08, 293.66, 349.23, 440.0, 392.0, 349.23, // Bbmaj7
  196.0, 261.63, 329.63, 392.0, 349.23, 261.63, // Csus4 -> C
];

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ title, audioUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const timerRef = useRef<number | null>(null);
  const stepRef = useRef(0);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      ctxRef.current?.close().catch(() => {});
      audioRef.current?.pause();
    };
  }, []);

  // Sync mute state
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
    if (masterGainRef.current && ctxRef.current) {
      masterGainRef.current.gain.setTargetAtTime(
        isMuted ? 0 : 0.14,
        ctxRef.current.currentTime,
        0.05
      );
    }
  }, [isMuted]);

  const playSynthNote = (freq: number) => {
    const ctx = ctxRef.current;
    const master = masterGainRef.current;
    if (!ctx || !master) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const oscOver = ctx.createOscillator();
    const noteGain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);

    oscOver.type = 'sine';
    oscOver.frequency.setValueAtTime(freq * 2, now);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, now);

    noteGain.gain.setValueAtTime(0.0001, now);
    noteGain.gain.exponentialRampToValueAtTime(0.45, now + 0.04);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.1);

    osc.connect(filter);
    oscOver.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(master);

    osc.start(now);
    oscOver.start(now);
    osc.stop(now + 2.2);
    oscOver.stop(now + 2.2);
  };

  const togglePlay = async () => {
    if (audioUrl) {
      if (!audioRef.current) {
        audioRef.current = new Audio(audioUrl);
        audioRef.current.loop = true;
        audioRef.current.muted = isMuted;
      }
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch {
          setIsPlaying(false);
        }
      }
      return;
    }

    // Built-in Web Audio API gentle piano arpeggio
    if (isPlaying) {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setIsPlaying(false);
      return;
    }

    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!ctxRef.current) {
      ctxRef.current = new AudioCtx();
      masterGainRef.current = ctxRef.current.createGain();
      masterGainRef.current.gain.value = isMuted ? 0 : 0.14;
      masterGainRef.current.connect(ctxRef.current.destination);
    }
    if (ctxRef.current.state === 'suspended') {
      await ctxRef.current.resume();
    }

    playSynthNote(PIANO_NOTES[stepRef.current % PIANO_NOTES.length]);
    stepRef.current += 1;

    timerRef.current = window.setInterval(() => {
      playSynthNote(PIANO_NOTES[stepRef.current % PIANO_NOTES.length]);
      stepRef.current += 1;
    }, 680);

    setIsPlaying(true);
  };

  return (
    <div
      className="fixed bottom-4 right-4 z-40 flex items-center gap-1.5 rounded-full border border-[#D5C0A0] bg-[#FFF9F1]/95 px-3 py-1.5 shadow-[0_8px_24px_rgba(71,53,46,0.16)] backdrop-blur-sm"
      role="region"
      aria-label="Background music controls"
    >
      <Music className="w-3.5 h-3.5 text-[#B84F2B]" aria-hidden="true" />
      <span className="hidden sm:inline font-sans-clean text-[10px] tracking-[0.14em] uppercase text-[#47352E]/80 pr-1">
        {title}
      </span>

      <button
        type="button"
        onClick={togglePlay}
        aria-label={isPlaying ? 'Pause music' : 'Play music'}
        className="flex h-7 w-7 items-center justify-center rounded-full bg-[#B84F2B] text-[#FFF9F1] hover:bg-[#963C23] transition-colors cursor-pointer"
      >
        {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
      </button>

      {isPlaying && (
        <button
          type="button"
          onClick={() => setIsMuted((m) => !m)}
          aria-label={isMuted ? 'Unmute music' : 'Mute music'}
          className="flex h-7 w-7 items-center justify-center rounded-full border border-[#D5C0A0] text-[#47352E] hover:border-[#B84F2B] transition-colors cursor-pointer"
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>
      )}
    </div>
  );
};
