import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, ChevronRight } from 'lucide-react';
import type { Event } from './types';
import EventBadge from './EventBadge';

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const navigate = useNavigate();

  const goToDetails = useCallback(() => {
    navigate(`/events/${event.id}`);
  }, [event.id, navigate]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        goToDetails();
      }
    },
    [goToDetails]
  );

  return (
    <motion.article
      role="button"
      tabIndex={0}
      aria-label={`View details for ${event.title}`}
      onClick={goToDetails}
      onKeyDown={handleKeyDown}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      whileHover="hover"
      className="group relative flex flex-col rounded-2xl overflow-hidden cursor-pointer outline-none
        focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bgDark"
      style={{
        background: 'rgba(15,15,15,0.85)',
        border: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
      }}
    >
      {/* Hover border glow */}
      <motion.span
        variants={{
          hover: { opacity: 1 },
        }}
        initial={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 rounded-2xl pointer-events-none z-10"
        style={{
          border: '1px solid rgba(255,106,0,0.35)',
          boxShadow: '0 0 28px rgba(255,106,0,0.10) inset',
        }}
        aria-hidden="true"
      />

      {/* ── Banner image ── */}
      <div className="relative h-44 overflow-hidden bg-surfaceLight shrink-0">
        {event.image ? (
          <motion.img
            src={event.image}
            alt={event.title}
            loading="lazy"
            className="w-full h-full object-cover"
            variants={{ hover: { scale: 1.06 } }}
            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-surfaceLight to-bgDark">
            <span className="text-4xl opacity-20">⚡</span>
          </div>
        )}
        {/* Bottom gradient overlay for readability */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(15,15,15,0.85) 0%, rgba(15,15,15,0.1) 55%, transparent 100%)',
          }}
          aria-hidden="true"
        />
        {/* Badge – top right */}
        <div className="absolute top-3 right-3 z-10">
          <EventBadge status={event.status} />
        </div>
        {/* Live pulsing overlay */}
        {event.status === 'live' && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at 50% 100%, rgba(239,68,68,0.10) 0%, transparent 70%)',
            }}
            aria-hidden="true"
          />
        )}
      </div>

      {/* ── Body ── */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Tags */}
        {event.tags && event.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5" aria-label="Event tags">
            {event.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md text-[10px] font-medium text-textMuted"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h3 className="font-display font-bold text-[1.05rem] text-white leading-snug group-hover:text-primary transition-colors duration-200">
          {event.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-textMuted leading-relaxed line-clamp-2 flex-1">
          {event.description}
        </p>

        {/* Meta row */}
        <div className="flex flex-col gap-1.5 pt-1">
          <div className="flex items-center gap-2 text-xs text-textMuted">
            <Calendar size={12} className="shrink-0 text-primary/70" aria-hidden="true" />
            <span>{event.displayDate}{event.time ? ` · ${event.time}` : ''}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-textMuted">
            <MapPin size={12} className="shrink-0 text-primary/70" aria-hidden="true" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>

        {/* CTA footer */}
        <div
          className="flex items-center justify-between pt-2 mt-auto border-t"
          style={{ borderColor: 'rgba(255,255,255,0.06)' }}
        >
          <span className="text-xs text-textMuted group-hover:text-white transition-colors duration-200">
            {event.status === 'live' ? 'Happening now' : 'View details'}
          </span>
          <motion.span
            variants={{ hover: { x: 4 } }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="text-primary"
            aria-hidden="true"
          >
            <ChevronRight size={16} />
          </motion.span>
        </div>
      </div>
    </motion.article>
  );
};

export default EventCard;
