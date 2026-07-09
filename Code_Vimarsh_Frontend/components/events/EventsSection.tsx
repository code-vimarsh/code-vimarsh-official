import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import type { FilterTab, Event } from './types';
import EventsTabs from './EventsTabs';
import EventCard from './EventCard';
import LiveHeroBanner from './LiveHeroBanner';
import EmptyState from './EmptyState';
import EventsSectionHeader from './EventsSectionHeader';
import SectionBackground from '../shared/SectionBackground';
import { useGlobalState } from '../../context/GlobalContext';


// Helpers

/**
 * Sort events: live first, then upcoming nearest first, then past most-recent first.
 */
const sortEvents = (evts: Event[]): Event[] =>
  [...evts].sort((a, b) => {
    const priority: Record<string, number> = { live: 0, upcoming: 1, past: 2 };
    if (priority[a.status] !== priority[b.status]) {
      return priority[a.status] - priority[b.status];
    }
    if (a.date === 'live') return -1;
    if (b.date === 'live') return 1;
    return a.status === 'past'
      ? new Date(b.date).getTime() - new Date(a.date).getTime()
      : new Date(a.date).getTime() - new Date(b.date).getTime();
  });

const filterEvents = (evts: Event[], tab: FilterTab): Event[] => {
  if (tab === 'All') return evts;
  return evts.filter((e) => e.status === tab.toLowerCase());
};

const fmtDisplayDate = (isoDate: string, status: string): string => {
  if (status === 'live') return 'Happening Now';
  try {
    return new Date(isoDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return isoDate;
  }
};


// Main section

/**
 * EventsSection
 * Self-contained; reads from GlobalContext (database).
 * Manages filter tab state and selected event for modal.
 */
const EventsSection: React.FC = () => {
  const { events } = useGlobalState();
  const [activeTab, setActiveTab] = useState<FilterTab>('All');

  // Map EventType from GlobalContext → local Event shape for display components
  const eventsData: Event[] = useMemo(() => events.map(e => ({
    id: e.id,
    title: e.title,
    description: e.description || '',
    fullDescription: e.long_description || e.description || '',
    date: e.status?.toLowerCase() === 'live' ? 'live' : (e.date || ''),
    displayDate: fmtDisplayDate(e.date, e.status?.toLowerCase() || ''),
    time: '',
    location: (e as any).location || 'TBA',
    venue: (e as any).location || '',
    status: (e.status?.toLowerCase() || 'upcoming') as any,
    image: e.image || e.images?.[0] || '',
    images: e.images || [],
    tags: (e as any).tags || [],
    capacity: (e as any).capacity,
    registeredCount: 0,
  })), [events]);

  // Derived data
  const sorted   = useMemo(() => sortEvents(eventsData), [eventsData]);
  const filtered = useMemo(() => filterEvents(sorted, activeTab), [sorted, activeTab]);
  const liveEvents = useMemo(() => sorted.filter((e) => e.status === 'live'), [sorted]);

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide live events carousel every 5 seconds
  useEffect(() => {
    if (liveEvents.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % liveEvents.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [liveEvents.length]);

  // Reset index if liveEvents list changes or gets out of bounds
  useEffect(() => {
    if (currentIndex >= liveEvents.length) {
      setCurrentIndex(0);
    }
  }, [liveEvents.length, currentIndex]);

  return (
    <SectionBackground>
      <section className="relative z-10 space-y-12" aria-label="Events">
      <EventsSectionHeader />

      {/* Live heroes carousel — only when "All" or "Live" tab is active */}
      <AnimatePresence mode="wait">
        {(activeTab === 'All' || activeTab === 'Live') && liveEvents.length > 0 && (
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-2xl">
              <motion.div
                key={liveEvents[currentIndex]?.id || currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
              >
                {liveEvents[currentIndex] && (
                  <LiveHeroBanner event={liveEvents[currentIndex]} />
                )}
              </motion.div>
            </div>

            {/* Slide indicators (dots) */}
            {liveEvents.length > 1 && (
              <div className="flex justify-center items-center gap-1.5">
                {liveEvents.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      idx === currentIndex 
                        ? 'bg-primary w-3.5' 
                        : 'bg-white/20 hover:bg-white/40'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </AnimatePresence>

      {/* Toolbar: tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
      >
        <EventsTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          events={sorted}
        />
      </motion.div>

      {/* Events grid */}
      <div
        role="tabpanel"
        id={`events-panel-${activeTab.toLowerCase()}`}
        aria-label={`${activeTab} events`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {filtered.length === 0 ? (
              <EmptyState tab={activeTab} />
            ) : (
              filtered.map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.35, ease: 'easeOut' }}
                >
                  <EventCard event={event} />
                </motion.div>
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </div>

    </section>
    </SectionBackground>
  );
};

export default EventsSection;
