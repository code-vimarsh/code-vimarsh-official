import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

import type { Event } from './types';
import EventBadge from './EventBadge';

// ─── Live Hero Banner ─────────────────────────────────────────────────────────
// Shown at the top of the events list when a live event is active.

const LiveHeroBanner: React.FC<{ event: Event }> = ({ event }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative rounded-2xl overflow-hidden cursor-pointer"
      style={{
        background: 'rgba(13,13,13,0.9)',
        border: '1px solid rgba(239,68,68,0.25)',
        boxShadow: '0 0 60px rgba(239,68,68,0.08), 0 16px 40px rgba(0,0,0,0.5)',
      }}
      onClick={() => navigate(`/events/${event.id}`)}
    >
      {/* Background image */}
      {event.image && (
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={event.image}
            alt=""
            className="w-full h-full object-cover opacity-25"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(90deg, rgba(13,13,13,0.95) 40%, rgba(13,13,13,0.6) 100%)' }}
            aria-hidden="true"
          />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3">
            <EventBadge status="live" />
            <span className="text-xs text-red-400/70 font-mono">Happening right now</span>
          </div>
          <h2 className="font-display font-bold text-2xl md:text-3xl text-white leading-tight">
            {event.title}
          </h2>
          <p className="text-sm text-white/60 max-w-lg leading-relaxed">{event.description}</p>
          <div className="flex flex-wrap gap-4 text-xs text-white/50">
            <span>{event.displayDate}</span>
            <span>·</span>
            <span>{event.location}</span>
          </div>
        </div>

        {/* Right: register + details */}
        <div className="flex flex-col gap-3 md:w-48 shrink-0">
          {/* Register Now → opens inline form in EventDetails */}
          <div className="flex flex-col gap-2">
            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={(e) => { e.stopPropagation(); navigate(`/events/${event.id}?register=true`); }}
              className="relative w-full flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #ff6a00 0%, #ff9a00 100%)',
                boxShadow: '0 0 24px rgba(255,106,0,0.35), 0 4px 16px rgba(0,0,0,0.4)',
              }}
              aria-label="Register for this live event"
            >
              {/* Sweep shimmer */}
              <motion.span
                initial={{ x: '-110%' }}
                whileHover={{ x: '110%' }}
                transition={{ duration: 0.55, ease: 'easeInOut' }}
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)' }}
                aria-hidden="true"
              />
              {/* Pulse ring */}
              <motion.span
                animate={{
                  boxShadow: [
                    '0 0 0px 0px rgba(255,106,0,0)',
                    '0 0 0px 6px rgba(255,106,0,0.20)',
                    '0 0 0px 12px rgba(255,106,0,0)',
                  ],
                }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
                className="absolute inset-0 rounded-xl pointer-events-none"
                aria-hidden="true"
              />
              <Zap size={15} className="shrink-0" />
              Register Now
            </motion.button>

            {event.capacity !== undefined && event.registeredCount !== undefined && (() => {
              const spotsLeft = event.capacity! - event.registeredCount!;
              return spotsLeft > 0
                ? <p className="text-center text-[11px] text-amber-400/80 font-medium">{spotsLeft} spot{spotsLeft !== 1 ? 's' : ''} remaining</p>
                : <p className="text-center text-[11px] text-red-400/80 font-medium">Event is full — join the waitlist</p>;
            })()}
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); navigate(`/events/${event.id}`); }}
            className="text-sm text-white/50 hover:text-white transition-colors underline underline-offset-4 text-center"
          >
            View full details
          </button>
        </div>
      </div>

      {/* Glowing left border accent */}
      <div
        className="absolute left-0 top-4 bottom-4 w-0.5 rounded-full"
        style={{ background: 'linear-gradient(to bottom, transparent, #ef4444, transparent)' }}
        aria-hidden="true"
      />
    </motion.div>
  );
};

export default LiveHeroBanner;
