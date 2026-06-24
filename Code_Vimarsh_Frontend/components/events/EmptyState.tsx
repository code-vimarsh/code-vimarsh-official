import React from 'react';
import { motion } from 'framer-motion';
import { CalendarDays } from 'lucide-react';

import type { FilterTab } from './types';

// ─── Empty state placeholder for filtered event grids ─────────────────────────

const EmptyState: React.FC<{ tab: FilterTab }> = ({ tab }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="col-span-full flex flex-col items-center justify-center py-20 text-center"
  >
    <div
      className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      <CalendarDays size={28} className="text-textMuted" aria-hidden="true" />
    </div>
    <p className="text-white/60 font-medium mb-1">
      No {tab === 'All' ? '' : tab.toLowerCase()} events found
    </p>
    <p className="text-sm text-textMuted">Check back later for upcoming events.</p>
  </motion.div>
);

export default EmptyState;
