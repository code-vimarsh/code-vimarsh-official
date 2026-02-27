import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock } from 'lucide-react';
import type { Event } from './types';
import EventBadge from './EventBadge';

interface EventBannerProps {
  event: Event;
}

const EventBanner: React.FC<EventBannerProps> = ({ event }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(13,13,13,0.95)',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
      }}
    >
      {/* ── Banner image ── */}
      <div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden">
        {event.image ? (
          <img
            src={event.image}
            alt={`${event.title} banner`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{
              background:
                'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%)',
            }}
          />
        )}
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(13,13,13,0.15) 0%, rgba(13,13,13,0.6) 60%, rgba(13,13,13,0.97) 100%)',
          }}
          aria-hidden="true"
        />
        {/* Left accent line (live only) */}
        {event.status === 'live' && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at 50% 100%, rgba(239,68,68,0.15) 0%, transparent 65%)',
            }}
            aria-hidden="true"
          />
        )}
        {/* Top orange rim */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background:
              'linear-gradient(90deg, transparent 5%, rgba(255,106,0,0.6) 40%, rgba(255,154,0,0.6) 60%, transparent 95%)',
          }}
          aria-hidden="true"
        />
      </div>

      {/* ── Text content below image ── */}
      <div className="px-6 pb-7 pt-4 md:px-10 md:pb-9">
        {/* Badge row */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <EventBadge status={event.status} />
          {event.tags &&
            event.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 rounded-md text-[11px] font-medium text-textMuted"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
              >
                {tag}
              </span>
            ))}
        </div>

        {/* Title */}
        <h1 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-white leading-tight tracking-tight mb-4">
          {event.title}
        </h1>

        {/* Meta grid */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-textMuted">
          <div className="flex items-center gap-2">
            <Calendar
              size={14}
              className="text-primary/70 shrink-0"
              aria-hidden="true"
            />
            <span>{event.displayDate}</span>
          </div>
          {event.time && (
            <div className="flex items-center gap-2">
              <Clock
                size={14}
                className="text-primary/70 shrink-0"
                aria-hidden="true"
              />
              <span>{event.time}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <MapPin
              size={14}
              className="text-primary/70 shrink-0"
              aria-hidden="true"
            />
            <span>{event.location}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EventBanner;
