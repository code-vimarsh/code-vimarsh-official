import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MapPin, ExternalLink, Calendar, Clock, X, ChevronDown } from 'lucide-react';

import { EVENTS_DATA } from '../data/eventsData';
import type { Event } from '../components/events/types';
import EventBanner from '../components/events/EventBanner';
import EventSpeakers from '../components/events/EventSpeakers';
import EventRegistrationRenderer from '../components/events/EventRegistrationRenderer';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const Divider: React.FC = () => (
  <hr
    className="border-none h-px"
    style={{ background: 'rgba(255,255,255,0.06)' }}
    aria-hidden="true"
  />
);

// ─── Loading skeleton ─────────────────────────────────────────────────────────

const EventDetailsSkeleton: React.FC = () => (
  <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-pulse">
    <div className="h-4 w-28 rounded-lg" style={{ background: 'rgba(255,255,255,0.06)' }} />
    <div className="w-full h-72 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)' }} />
    <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-8">
      <div className="space-y-4">
        {[80, 90, 60, 75, 55].map((w, i) => (
          <div key={i} className="h-3 rounded-md" style={{ width: `${w}%`, background: 'rgba(255,255,255,0.05)' }} />
        ))}
      </div>
      <div className="h-60 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)' }} />
    </div>
  </div>
);

// ─── 404 fallback ─────────────────────────────────────────────────────────────

const EventNotFound: React.FC<{ id?: string }> = ({ id }) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center py-20">
      <div
        className="w-20 h-20 rounded-2xl flex items-center justify-center"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <span className="text-4xl" aria-hidden="true">🔍</span>
      </div>
      <div className="space-y-2">
        <h1 className="font-display font-bold text-2xl text-white">Event Not Found</h1>
        {id && (
          <p className="text-xs font-mono text-textMuted/60">
            looked up: <span className="text-primary/60">{id}</span>
          </p>
        )}
        <p className="text-textMuted text-sm mt-1">
          The event you're looking for doesn't exist or has been removed.
        </p>
      </div>
      <button
        onClick={() => navigate('/events')}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105"
        style={{ background: 'rgba(255,106,0,0.12)', border: '1px solid rgba(255,106,0,0.25)' }}
      >
        <ArrowLeft size={15} aria-hidden="true" />
        Back to Events
      </button>
    </div>
  );
};

// ─── Main page component ──────────────────────────────────────────────────────

/**
 * EventDetails — Route: /events/:id
 *
 * Data flow (mock):  useParams id → EVENTS_DATA.find()
 * To integrate backend: swap the useEffect body with a fetch/useQuery call.
 */
const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [event, setEvent] = useState<Event | null | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const registrationRef = useRef<HTMLDivElement>(null);

  // ── Scroll to top on every navigation to this page ───────────────────────
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setIsRegisterOpen(false);
  }, [id]);

  // ── Auto-open registration form when ?register=true (from live event banner) ─
  useEffect(() => {
    if (!event || event.status !== 'live') return;
    if (new URLSearchParams(location.search).get('register') === 'true') {
      setIsRegisterOpen(true);
      requestAnimationFrame(() => {
        setTimeout(() => {
          registrationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 120);
      });
    }
  }, [event, location.search]);

  // ── Data resolution (swap with API call for backend integration) ──────────
  useEffect(() => {
    setLoading(true);
    setEvent(undefined);

    if (!id) {
      console.warn('[EventDetails] No id param found in route.');
      setEvent(null);
      setLoading(false);
      return;
    }

    // Simulate minimal async tick so loading state is always visible
    const timer = setTimeout(() => {
      const found = EVENTS_DATA.find((e) => e.id === id) ?? null;
      console.debug(
        `[EventDetails] id="${id}" → found=${found ? `"${found.title}"` : 'null'}`,
        '\nAvailable IDs:',
        EVENTS_DATA.map((e) => e.id),
      );
      setEvent(found);
      setLoading(false);
    }, 60);

    return () => clearTimeout(timer);
  }, [id]);

  const openRegistration = () => {
    setIsRegisterOpen(true);
    // Give React one frame to mount the section before scrolling
    requestAnimationFrame(() => {
      setTimeout(() => {
        registrationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
    });
  };

  const closeRegistration = () => {
    setIsRegisterOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Loading state ─────────────────────────────────────────────────────────
  if (loading || event === undefined) return <EventDetailsSkeleton />;

  // ── Not found ─────────────────────────────────────────────────────────────
  if (event === null) return <EventNotFound id={id} />;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={id}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        className="max-w-4xl mx-auto pb-24"
      >
        {/* ── Back link ── */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <Link
            to="/events"
            className="group inline-flex items-center gap-2 text-sm text-textMuted hover:text-white transition-colors"
          >
            <motion.span
              className="inline-flex"
              whileHover={{ x: -3 }}
              transition={{ type: 'spring', stiffness: 400, damping: 22 }}
            >
              <ArrowLeft size={14} aria-hidden="true" />
            </motion.span>
            <span>Back to Events</span>
          </Link>
        </nav>

        {/* ── Banner ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.4, ease: 'easeOut' }}
          className="mb-10"
        >
          <EventBanner event={event} />
        </motion.div>

        {/* ── Two-column layout on md+ ── */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-8 items-start">

          {/* ── Left: main content ── */}
          <div className="space-y-9">

            {/* About */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.36, ease: 'easeOut' }}
            >
              <h2 className="text-xs font-semibold text-textMuted uppercase tracking-widest mb-4">
                About this event
              </h2>
              <p className="text-white/75 text-sm leading-relaxed whitespace-pre-line">
                {event?.fullDescription ?? event?.description ?? ''}
              </p>
            </motion.div>

            <Divider />

            {/* Date + location inline meta */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.36, ease: 'easeOut' }}
              className="flex flex-wrap gap-6"
            >
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Calendar size={14} className="text-primary/60 shrink-0" aria-hidden="true" />
                <span>{event?.displayDate ?? '—'}</span>
              </div>
              {event?.time && (
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <Clock size={14} className="text-primary/60 shrink-0" aria-hidden="true" />
                  <span>{event.time}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-white/60">
                <MapPin size={14} className="text-primary/60 shrink-0" aria-hidden="true" />
                <span>{event?.location ?? '—'}</span>
              </div>
            </motion.div>

            <Divider />

            {/* Speakers */}
            {(event?.speakers?.length ?? 0) > 0 && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18, duration: 0.36, ease: 'easeOut' }}
                >
                  <EventSpeakers speakers={event!.speakers!} />
                </motion.div>
              </>
            )}
          </div>

          {/* ── Right: sticky sidebar ── */}
          <aside>
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' }}
              className="relative rounded-2xl p-6 space-y-5 sticky top-24"
              style={{
                background: 'rgba(15,15,15,0.90)',
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(14px)',
              }}
            >
              {/* Top orange rim */}
              <div
                className="absolute top-0 left-8 right-8 h-px rounded-full pointer-events-none"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,106,0,0.50), transparent)' }}
                aria-hidden="true"
              />

              {/* ── Registration CTA ── */}
              {event?.status === 'live' ? (
                <div className="space-y-3">
                  <motion.button
                    onClick={openRegistration}
                    disabled={isRegisterOpen}
                    whileHover={isRegisterOpen ? {} : { scale: 1.02 }}
                    whileTap={isRegisterOpen ? {} : { scale: 0.97 }}
                    className="w-full py-3.5 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-default"
                    style={{
                      background: isRegisterOpen
                        ? 'rgba(255,106,0,0.10)'
                        : 'linear-gradient(135deg, #ff6a00, #ff9a00)',
                      border: isRegisterOpen ? '1px solid rgba(255,106,0,0.25)' : 'none',
                      boxShadow: isRegisterOpen ? 'none' : '0 0 28px rgba(255,106,0,0.30)',
                      color: isRegisterOpen ? '#ff6a00' : '#fff',
                    }}
                    aria-expanded={isRegisterOpen}
                    aria-controls="registration-section"
                  >
                    {isRegisterOpen ? (
                      <>
                        <ChevronDown size={15} />
                        Form is Open Below
                      </>
                    ) : (
                      'Register Now'
                    )}
                  </motion.button>
                  {!isRegisterOpen && (
                    <p className="text-center text-xs text-textMuted">
                      Registration is open — spots filling fast
                    </p>
                  )}
                </div>
              ) : (
                <div
                  className="rounded-xl px-4 py-3 text-center text-sm"
                  style={{
                    background: event?.status === 'upcoming'
                      ? 'rgba(59,130,246,0.07)'
                      : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${
                      event?.status === 'upcoming'
                        ? 'rgba(59,130,246,0.18)'
                        : 'rgba(255,255,255,0.07)'
                    }`,
                    color: event?.status === 'upcoming'
                      ? 'rgba(147,197,253,0.8)'
                      : 'rgba(255,255,255,0.3)',
                  }}
                >
                  {event?.status === 'upcoming'
                    ? '🗓 Registration opens when event goes live'
                    : '✓ Event has ended'}
                </div>
              )}

              <hr className="border-none h-px" style={{ background: 'rgba(255,255,255,0.06)' }} aria-hidden="true" />

              {/* Venue */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-textMuted uppercase tracking-widest">Venue</p>
                <div className="flex items-start gap-2.5 text-sm text-white/70">
                  <MapPin size={14} className="text-primary/60 shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="leading-relaxed">{event?.venue ?? event?.location ?? '—'}</span>
                </div>
              </div>

              {/* Tags */}
              {(event?.tags?.length ?? 0) > 0 && (
                <>
                  <hr className="border-none h-px" style={{ background: 'rgba(255,255,255,0.06)' }} aria-hidden="true" />
                  <div className="space-y-2.5">
                    <p className="text-xs font-semibold text-textMuted uppercase tracking-widest">Topics</p>
                    <div className="flex flex-wrap gap-2">
                      {event!.tags!.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium text-textMuted"
                          style={{
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.07)',
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Past: resources link */}
              {event?.status === 'past' && (
                <>
                  <hr className="border-none h-px" style={{ background: 'rgba(255,255,255,0.06)' }} aria-hidden="true" />
                  <Link
                    to="/resources"
                    className="flex items-center gap-2 text-xs text-primary/70 hover:text-primary transition-colors"
                  >
                    <ExternalLink size={12} aria-hidden="true" />
                    Find the recording in Resources
                  </Link>
                </>
              )}
            </motion.div>
          </aside>
        </div>

        {/* ── Inline registration form ─────────────────────────────────── */}
        <AnimatePresence>
          {isRegisterOpen && event.status === 'live' && (
            <motion.div
              id="registration-section"
              ref={registrationRef}
              key="registration-inline"
              initial={{ opacity: 0, y: 32, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              className="mt-12"
            >
              {/* Section separator */}
              <div className="flex items-center gap-4 mb-8">
                <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
                <span
                  className="text-[10px] uppercase tracking-widest font-semibold px-3 py-1 rounded-full"
                  style={{ background: 'rgba(255,106,0,0.10)', color: '#ff6a00' }}
                >
                  Registration Form
                </span>
                <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
              </div>

              {/* Form card */}
              <div
                className="relative rounded-2xl overflow-hidden"
                style={{
                  background: 'rgba(14,14,14,0.95)',
                  border: '1px solid rgba(255,106,0,0.14)',
                  boxShadow: '0 0 60px rgba(255,106,0,0.06)',
                }}
              >
                {/* Glow rim at top */}
                <div
                  className="absolute top-0 left-0 right-0 h-px"
                  style={{
                    background:
                      'linear-gradient(90deg, transparent 0%, rgba(255,106,0,0.5) 40%, rgba(255,154,0,0.5) 60%, transparent 100%)',
                  }}
                  aria-hidden="true"
                />

                {/* Close button */}
                <div className="flex items-center justify-between px-7 pt-6 pb-4">
                  <div>
                    <h3 className="font-display font-bold text-lg text-white">Complete your Registration</h3>
                    <p className="text-xs text-textMuted mt-0.5">{event.title}</p>
                  </div>
                  <button
                    onClick={closeRegistration}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all hover:scale-105"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.09)',
                      color: '#888',
                    }}
                    aria-label="Close registration form"
                  >
                    <X size={13} />
                    Close
                  </button>
                </div>

                <div
                  className="h-px mx-7"
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                  aria-hidden="true"
                />

                {/* Form body */}
                <div className="px-7 py-7 max-w-2xl">
                  <EventRegistrationRenderer
                    eventId={event.id}
                    eventTitle={event.title}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};

export default EventDetails;
