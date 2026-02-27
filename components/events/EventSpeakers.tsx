import React from 'react';
import { motion } from 'framer-motion';
import type { Speaker } from './types';

interface EventSpeakersProps {
  speakers: Speaker[];
}

const EventSpeakers: React.FC<EventSpeakersProps> = ({ speakers }) => {
  if (!speakers || speakers.length === 0) return null;

  return (
    <section aria-labelledby="speakers-heading">
      <h2
        id="speakers-heading"
        className="text-xs font-semibold text-textMuted uppercase tracking-widest mb-5"
      >
        Speakers
      </h2>

      <div
        className={`grid gap-4 ${
          speakers.length === 1
            ? 'grid-cols-1 max-w-xs'
            : speakers.length === 2
            ? 'grid-cols-1 sm:grid-cols-2 max-w-md'
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        }`}
      >
        {speakers.map((speaker, i) => (
          <motion.div
            key={speaker.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.32, ease: 'easeOut' }}
            className="flex items-center gap-4 p-4 rounded-xl"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            {/* Avatar */}
            {speaker.avatar ? (
              <img
                src={speaker.avatar}
                alt={speaker.name}
                className="w-12 h-12 rounded-full object-cover shrink-0 ring-1 ring-primary/25"
              />
            ) : (
              <div
                className="w-12 h-12 rounded-full shrink-0 flex items-center justify-center text-lg font-bold text-white ring-1 ring-primary/20"
                style={{
                  background: 'linear-gradient(135deg, #ff6a00 0%, #ff9a00 100%)',
                }}
                aria-hidden="true"
              >
                {speaker.name.charAt(0)}
              </div>
            )}

            {/* Info */}
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white leading-snug truncate">
                {speaker.name}
              </p>
              <p className="text-xs text-textMuted leading-relaxed mt-0.5 line-clamp-2">
                {speaker.title}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default EventSpeakers;
