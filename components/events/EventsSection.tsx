import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import type { FilterTab, Event } from './types';
import { EVENTS_DATA } from '../../data/eventsData';
import EventsTabs from './EventsTabs';
import EventCard from './EventCard';
import LiveHeroBanner from './LiveHeroBanner';
import EmptyState from './EmptyState';
import EventsSectionHeader from './EventsSectionHeader';
import { EmbersBackground } from '../Achievements/GlowDots';


// Helpers

/**
 * Sort events: live first, then upcoming nearest first, then past most-recent first.
 * Backend integration: replace EVENTS_DATA with a useQuery / fetch call.
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


// Main section

/**
 * EventsSection
 * Self-contained; reads from EVENTS_DATA (swappable with API hook).
 * Manages filter tab state and selected event for modal.
 */
const EventsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FilterTab>('All');

  // Derived data
  const sorted   = useMemo(() => sortEvents(EVENTS_DATA), []);
  const filtered = useMemo(() => filterEvents(sorted, activeTab), [sorted, activeTab]);
  const liveEvent = useMemo(() => sorted.find((e) => e.status === 'live'), [sorted]);

  return (
    <div className="relative">
      <EmbersBackground />
    <section className="relative z-10 space-y-10" aria-label="Events">
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
    </div>
  );
};

export default EventsSection;
