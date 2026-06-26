import React, { useState, useMemo } from 'react';
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
  const liveEvent = useMemo(() => sorted.find((e) => e.status === 'live'), [sorted]);

  return (
    <SectionBackground>
      <section className="relative z-10 space-y-12" aria-label="Events">
      <EventsSectionHeader />

      {/* Live hero — only when "All" or "Live" tab is active */}
      <AnimatePresence>
        {liveEvent && (activeTab === 'All' || activeTab === 'Live') && (
          <motion.div
            key="live-hero"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35 }}
          >
            <LiveHeroBanner event={liveEvent} />
          </motion.div>
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
