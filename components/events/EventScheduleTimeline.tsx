import React from 'react';
import { motion } from 'framer-motion';
import type { ScheduleItem, EventStatus } from './types';

interface EventScheduleTimelineProps {
  items: ScheduleItem[];
  eventStatus: EventStatus;
}

const EventScheduleTimeline: React.FC<EventScheduleTimelineProps> = ({
  items,
  eventStatus,
}) => {
  if (!items || items.length === 0) return null;

  return (
    <section aria-labelledby="schedule-heading">
      <h2
        id="schedule-heading"
        className="text-xs font-semibold text-textMuted uppercase tracking-widest mb-6"
      >
        Schedule
      </h2>

      <ol
        className="relative space-y-0 pl-6"
        aria-label="Event schedule"
        style={{ borderLeft: '1px solid rgba(255,106,0,0.18)' }}
      >
        {items.map((item, i) => {
          const isCurrentOrFirst = i === 0 && eventStatus === 'live';

          return (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 + i * 0.07, duration: 0.32, ease: 'easeOut' }}
              className="relative pb-7 last:pb-0"
            >
              {/* Timeline dot */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1 + i * 0.07, type: 'spring', stiffness: 300 }}
                className="absolute -left-[23px] top-0.5 w-3.5 h-3.5 rounded-full border-2 z-10"
                style={{
                  background: isCurrentOrFirst
                    ? '#ff6a00'
                    : 'rgba(255,106,0,0.18)',
                  borderColor: isCurrentOrFirst
                    ? 'rgba(255,106,0,0.7)'
                    : 'rgba(255,106,0,0.35)',
                  boxShadow: isCurrentOrFirst
                    ? '0 0 10px rgba(255,106,0,0.45)'
                    : 'none',
                }}
                aria-hidden="true"
              />

              {/* Live pulse ring */}
              {isCurrentOrFirst && (
                <motion.div
                  animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                  className="absolute -left-[23px] top-0.5 w-3.5 h-3.5 rounded-full pointer-events-none"
                  style={{ background: 'rgba(255,106,0,0.4)' }}
                  aria-hidden="true"
                />
              )}

              {/* Content */}
              <div className="space-y-1">
                <p
                  className="text-[11px] font-mono tracking-wider"
                  style={{ color: 'rgba(255,106,0,0.75)' }}
                >
                  {item.time}
                  {isCurrentOrFirst && (
                    <span className="ml-2 text-[10px] font-sans text-red-400 uppercase tracking-widest">
                      · in progress
                    </span>
                  )}
                </p>
                <p
                  className="text-sm font-semibold leading-snug"
                  style={{ color: isCurrentOrFirst ? '#ffffff' : 'rgba(255,255,255,0.85)' }}
                >
                  {item.title}
                </p>
                {item.description && (
                  <p className="text-xs text-textMuted leading-relaxed pt-0.5">
                    {item.description}
                  </p>
                )}
              </div>
            </motion.li>
          );
        })}
      </ol>
    </section>
  );
};

export default EventScheduleTimeline;
