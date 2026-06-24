import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Calendar, Ban } from 'lucide-react';
import type { EventStatus } from './types';

interface EventRegistrationButtonProps {
  status: EventStatus;
  registrationLink?: string;
  capacity?: number;
  registeredCount?: number;
}

/**
 * EventRegistrationButton
 * ─────────────────────────────────────────────────────────────────────────────
 * • Live  → bright orange "Register Now" CTA with pulse + shimmer
 * • Upcoming → muted "Registration opens soon" notice
 * • Past  → "Event has ended" notice
 *
 * Only the Live variant is interactive/anchor.
 */
const EventRegistrationButton: React.FC<EventRegistrationButtonProps> = ({
  status,
  registrationLink,
  capacity,
  registeredCount,
}) => {
  const spotsLeft =
    capacity !== undefined && registeredCount !== undefined
      ? capacity - registeredCount
      : null;

  /* ── Live ── */
  if (status === 'live') {
    return (
      <div className="flex flex-col gap-2">
        <motion.a
          href={registrationLink ?? '#'}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="relative w-full inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl text-white font-bold text-sm overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #ff6a00 0%, #ff9a00 100%)',
            boxShadow:
              '0 0 32px rgba(255,106,0,0.40), 0 6px 20px rgba(0,0,0,0.45)',
          }}
          aria-label="Register for this live event"
        >
          {/* Sweep shimmer */}
          <motion.span
            initial={{ x: '-110%' }}
            whileHover={{ x: '110%' }}
            transition={{ duration: 0.55, ease: 'easeInOut' }}
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)',
            }}
            aria-hidden="true"
          />
          {/* Pulse ring */}
          <motion.span
            animate={{
              boxShadow: [
                '0 0 0px 0px rgba(255,106,0,0)',
                '0 0 0px 8px rgba(255,106,0,0.18)',
                '0 0 0px 16px rgba(255,106,0,0)',
              ],
            }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
            className="absolute inset-0 rounded-xl pointer-events-none"
            aria-hidden="true"
          />
          <Zap size={16} className="shrink-0" aria-hidden="true" />
          Register Now
        </motion.a>

        {spotsLeft !== null && spotsLeft > 0 && (
          <p className="text-center text-xs text-amber-400/80 font-medium">
            {spotsLeft} spot{spotsLeft !== 1 ? 's' : ''} remaining — register fast
          </p>
        )}
        {spotsLeft === 0 && (
          <p className="text-center text-xs text-red-400/80 font-medium">
            Event is at capacity
          </p>
        )}
      </div>
    );
  }

  /* ── Upcoming ── */
  if (status === 'upcoming') {
    return (
      <div
        className="flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm text-blue-400/80 w-full"
        style={{
          background: 'rgba(59,130,246,0.06)',
          border: '1px solid rgba(59,130,246,0.18)',
        }}
        role="note"
        aria-label="Registration status: opens when event is live"
      >
        <Calendar size={15} className="shrink-0" aria-hidden="true" />
        <span>
          Registration opens when this event goes <strong>Live</strong>. Stay tuned!
        </span>
      </div>
    );
  }

  /* ── Past ── */
  return (
    <div
      className="flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm text-textMuted w-full"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
      role="note"
      aria-label="Registration status: event has ended"
    >
      <Ban size={15} className="shrink-0" aria-hidden="true" />
      <span>This event has ended. Check the Resources section for the recording.</span>
    </div>
  );
};

export default EventRegistrationButton;
