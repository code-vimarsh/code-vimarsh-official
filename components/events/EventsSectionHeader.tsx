import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

// ─── Events page title + tagline header ───────────────────────────────────────

const EventsSectionHeader: React.FC = () => (
  <motion.header
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    className="space-y-4"
  >
    <div className="flex items-center gap-2.5">
      <span
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-primary/80 uppercase tracking-widest"
        style={{ background: 'rgba(255,106,0,0.08)', border: '1px solid rgba(255,106,0,0.15)' }}
      >
        <Zap size={11} aria-hidden="true" />
        Events
      </span>
    </div>
    <h1 className="font-display font-bold text-4xl md:text-5xl text-white leading-tight tracking-tight">
      Club{' '}
      <span
        className="bg-clip-text text-transparent"
        style={{ backgroundImage: 'linear-gradient(135deg, #ff6a00, #ff9a00)' }}
      >
        Events
      </span>
    </h1>
    <p className="text-textMuted text-base md:text-lg max-w-xl leading-relaxed">
      Workshops, hackathons, open-source sprints, and tech talks — built for developers who ship.
    </p>
  </motion.header>
);

export default EventsSectionHeader;
