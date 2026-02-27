import React from 'react';
import { motion } from 'framer-motion';
import type { EventStatus } from './types';

interface EventBadgeProps {
  status: EventStatus;
  className?: string;
}

const CONFIG: Record<EventStatus, { label: string; bg: string; text: string; border: string; dot?: boolean }> = {
  live: {
    label: 'Live',
    bg: 'rgba(239,68,68,0.12)',
    text: '#f87171',
    border: 'rgba(239,68,68,0.30)',
    dot: true,
  },
  upcoming: {
    label: 'Upcoming',
    bg: 'rgba(59,130,246,0.12)',
    text: '#60a5fa',
    border: 'rgba(59,130,246,0.30)',
  },
  past: {
    label: 'Past',
    bg: 'rgba(255,255,255,0.05)',
    text: '#6b7280',
    border: 'rgba(255,255,255,0.08)',
  },
};

const EventBadge: React.FC<EventBadgeProps> = ({ status, className = '' }) => {
  const cfg = CONFIG[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase ${className}`}
      style={{
        background: cfg.bg,
        color: cfg.text,
        border: `1px solid ${cfg.border}`,
      }}
      aria-label={`Event status: ${cfg.label}`}
    >
      {cfg.dot && (
        <motion.span
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          className="inline-block w-1.5 h-1.5 rounded-full bg-red-400"
          aria-hidden="true"
        />
      )}
      {cfg.label}
    </span>
  );
};

export default EventBadge;
