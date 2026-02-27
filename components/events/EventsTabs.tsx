import React, { useRef, useState, useLayoutEffect } from 'react';
import { motion } from 'framer-motion';
import type { FilterTab, EventStatus } from './types';
import type { Event } from './types';

interface EventsTabsProps {
  activeTab: FilterTab;
  onTabChange: (tab: FilterTab) => void;
  events: Event[];
}

const TABS: FilterTab[] = ['All', 'Live', 'Upcoming', 'Past'];

const STATUS_MAP: Record<Exclude<FilterTab, 'All'>, EventStatus> = {
  Live: 'live',
  Upcoming: 'upcoming',
  Past: 'past',
};

const TAB_COLORS: Record<FilterTab, string> = {
  All: '#e0e0e0',
  Live: '#f87171',
  Upcoming: '#60a5fa',
  Past: '#6b7280',
};

const EventsTabs: React.FC<EventsTabsProps> = ({ activeTab, onTabChange, events }) => {
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [pillStyle, setPillStyle] = useState<{ left: number; width: number }>({ left: 0, width: 0 });

  // Counts per tab
  const counts: Record<FilterTab, number> = {
    All: events.length,
    Live: events.filter((e) => e.status === 'live').length,
    Upcoming: events.filter((e) => e.status === 'upcoming').length,
    Past: events.filter((e) => e.status === 'past').length,
  };

  // Update pill position whenever active tab changes
  useLayoutEffect(() => {
    const el = tabRefs.current[activeTab];
    if (el) {
      const parent = el.parentElement;
      if (parent) {
        const parentRect = parent.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();
        setPillStyle({
          left: elRect.left - parentRect.left,
          width: elRect.width,
        });
      }
    }
  }, [activeTab]);

  return (
    <div
      role="tablist"
      aria-label="Filter events by status"
      className="relative flex items-center gap-0 p-1 rounded-xl w-fit"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* Sliding pill */}
      <motion.div
        className="absolute top-1 bottom-1 rounded-lg pointer-events-none z-0"
        animate={{ left: pillStyle.left, width: pillStyle.width }}
        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
        style={{
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
        aria-hidden="true"
      />

      {TABS.map((tab) => {
        const isActive = tab === activeTab;
        const label = tab === 'All' ? 'All Events' : tab;

        return (
          <button
            key={tab}
            ref={(el) => { tabRefs.current[tab] = el; }}
            role="tab"
            aria-selected={isActive}
            aria-controls={`events-panel-${tab.toLowerCase()}`}
            onClick={() => onTabChange(tab)}
            className="relative z-10 flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary whitespace-nowrap"
            style={{ color: isActive ? TAB_COLORS[tab] : '#6b7280' }}
          >
            {tab === 'Live' && counts.Live > 0 && (
              <motion.span
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.4, repeat: Infinity }}
                className="inline-block w-1.5 h-1.5 rounded-full bg-red-400 shrink-0"
                aria-hidden="true"
              />
            )}
            {label}
            {counts[tab] > 0 && (
              <span
                className="ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                style={{
                  background: isActive ? `${TAB_COLORS[tab]}20` : 'rgba(255,255,255,0.05)',
                  color: isActive ? TAB_COLORS[tab] : '#6b7280',
                }}
                aria-hidden="true"
              >
                {counts[tab]}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default EventsTabs;
