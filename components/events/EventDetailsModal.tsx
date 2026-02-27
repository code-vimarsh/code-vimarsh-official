import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, Clock, Users, ExternalLink } from 'lucide-react';
import type { Event } from './types';
import EventBadge from './EventBadge';
import RegisterButton from './RegisterButton';

interface EventDetailsModalProps {
  event: Event | null;
  onClose: () => void;
}

const BACKDROP_VARIANTS = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const MODAL_VARIANTS = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 28 } },
  exit: { opacity: 0, y: 24, scale: 0.97, transition: { duration: 0.22, ease: 'easeIn' as const } },
};

const EventDetailsModal: React.FC<EventDetailsModalProps> = ({ event, onClose }) => {
  // ESC key closes the modal
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!event) return;
    document.addEventListener('keydown', handleKeyDown);
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [event, handleKeyDown]);

  return (
    <AnimatePresence>
      {event && (
        <motion.div
          key="modal-backdrop"
          variants={BACKDROP_VARIANTS}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-start justify-center px-4 py-6 md:py-10 overflow-y-auto"
          style={{ background: 'rgba(10,10,10,0.87)', backdropFilter: 'blur(14px)' }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={`Event details: ${event.title}`}
        >
          <motion.div
            key="modal-card"
            variants={MODAL_VARIANTS}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-3xl rounded-2xl overflow-hidden my-auto"
            style={{
              background: 'rgba(13,13,13,0.95)',
              border: '1px solid rgba(255,255,255,0.07)',
              boxShadow: '0 40px 100px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,106,0,0.06)',
              backdropFilter: 'blur(20px)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top orange rim */}
            <div
              className="absolute top-0 left-0 right-0 h-px z-10"
              style={{
                background:
                  'linear-gradient(90deg, transparent 5%, rgba(255,106,0,0.55) 40%, rgba(255,154,0,0.55) 60%, transparent 95%)',
              }}
              aria-hidden="true"
            />

            {/* Close button */}
            <motion.button
              whileHover={{ scale: 1.08, backgroundColor: 'rgba(255,255,255,0.08)' }}
              whileTap={{ scale: 0.92 }}
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 rounded-full text-textMuted hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <X size={18} />
            </motion.button>

            {/* ── Banner image ── */}
            <div className="relative h-52 md:h-64 overflow-hidden bg-surfaceLight">
              {event.image ? (
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-surfaceLight to-bgDark" />
              )}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(to top, rgba(13,13,13,1) 0%, rgba(13,13,13,0.5) 40%, rgba(13,13,13,0.1) 100%)',
                }}
                aria-hidden="true"
              />
              {/* Badge over image */}
              <div className="absolute bottom-4 left-6">
                <EventBadge status={event.status} />
              </div>
            </div>

            {/* ── Content ── */}
            <div className="p-6 md:p-8 space-y-6">

              {/* Title + Tags */}
              <div className="space-y-3">
                <h2 className="font-display font-bold text-2xl md:text-3xl text-white leading-tight">
                  {event.title}
                </h2>
                {event.tags && event.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2" aria-label="Tags">
                    {event.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium text-textMuted"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Two-column: meta + register */}
              <div className="grid md:grid-cols-[1fr_auto] gap-6">

                {/* Meta */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2.5 text-sm text-textMuted">
                    <Calendar size={14} className="text-primary/70 shrink-0" aria-hidden="true" />
                    <span>{event.displayDate}</span>
                  </div>
                  {event.time && (
                    <div className="flex items-center gap-2.5 text-sm text-textMuted">
                      <Clock size={14} className="text-primary/70 shrink-0" aria-hidden="true" />
                      <span>{event.time}</span>
                    </div>
                  )}
                  <div className="flex items-start gap-2.5 text-sm text-textMuted">
                    <MapPin size={14} className="text-primary/70 shrink-0 mt-0.5" aria-hidden="true" />
                    <span>{event.venue ?? event.location}</span>
                  </div>
                  {event.capacity && event.registeredCount !== undefined && (
                    <div className="flex items-center gap-2.5 text-sm text-textMuted">
                      <Users size={14} className="text-primary/70 shrink-0" aria-hidden="true" />
                      <span>{event.registeredCount} / {event.capacity} registered</span>
                    </div>
                  )}
                </div>

                {/* Register (live only) */}
                {event.status === 'live' && event.registrationLink && (
                  <div className="flex items-start md:w-44">
                    <RegisterButton
                      href={event.registrationLink}
                      capacity={event.capacity}
                      registeredCount={event.registeredCount}
                      className="w-full"
                    />
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="h-px" style={{ background: 'rgba(255,255,255,0.06)' }} aria-hidden="true" />

              {/* Full description */}
              <div>
                <h3 className="text-xs font-semibold text-textMuted uppercase tracking-widest mb-3">
                  About this event
                </h3>
                <p className="text-sm text-white/70 leading-relaxed">
                  {event.fullDescription}
                </p>
              </div>

              {/* Speakers */}
              {event.speakers && event.speakers.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-textMuted uppercase tracking-widest mb-4">
                    Speakers
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {event.speakers.map((speaker, i) => (
                      <motion.div
                        key={speaker.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.07, duration: 0.3 }}
                        className="flex items-center gap-3 p-3 rounded-xl"
                        style={{
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.06)',
                        }}
                      >
                        {/* Avatar */}
                        {speaker.avatar ? (
                          <img
                            src={speaker.avatar}
                            alt={speaker.name}
                            className="w-9 h-9 rounded-full object-cover shrink-0"
                          />
                        ) : (
                          <div
                            className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-sm font-bold text-white"
                            style={{ background: 'linear-gradient(135deg, #ff6a00, #ff9a00)' }}
                            aria-hidden="true"
                          >
                            {speaker.name.charAt(0)}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-white truncate">{speaker.name}</p>
                          <p className="text-[10px] text-textMuted truncate">{speaker.title}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Schedule */}
              {event.schedule && event.schedule.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-textMuted uppercase tracking-widest mb-4">
                    Schedule
                  </h3>
                  <ol className="relative space-y-0" aria-label="Event schedule">
                    {/* Vertical track */}
                    <div
                      className="absolute left-[7px] top-2 bottom-2 w-px"
                      style={{ background: 'linear-gradient(to bottom, rgba(255,106,0,0.4), rgba(255,106,0,0.05))' }}
                      aria-hidden="true"
                    />
                    {event.schedule.map((item, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 + i * 0.06, duration: 0.28 }}
                        className="relative flex gap-4 pb-5 last:pb-0"
                      >
                        {/* Dot */}
                        <div
                          className="relative z-10 w-3.5 h-3.5 rounded-full shrink-0 mt-0.5 border-2"
                          style={{
                            background: i === 0 && event.status === 'live' ? '#ff6a00' : 'rgba(255,106,0,0.25)',
                            borderColor: 'rgba(255,106,0,0.5)',
                          }}
                          aria-hidden="true"
                        />
                        <div>
                          <p className="text-[10px] font-mono text-primary/70 mb-0.5">{item.time}</p>
                          <p className="text-sm font-semibold text-white">{item.title}</p>
                          {item.description && (
                            <p className="text-xs text-textMuted mt-0.5">{item.description}</p>
                          )}
                        </div>
                      </motion.li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Past event note */}
              {event.status === 'past' && (
                <div
                  className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-textMuted"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                  role="note"
                >
                  <ExternalLink size={13} className="shrink-0 text-primary/50" aria-hidden="true" />
                  Recording of this event may be available in the Resources section.
                </div>
              )}

              {/* Upcoming note */}
              {event.status === 'upcoming' && (
                <div
                  className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-blue-400/80"
                  style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)' }}
                  role="note"
                >
                  <Calendar size={13} className="shrink-0" aria-hidden="true" />
                  Registration opens when this event goes live. Stay tuned!
                </div>
              )}

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EventDetailsModal;
