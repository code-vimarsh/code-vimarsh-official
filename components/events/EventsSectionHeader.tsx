import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

// Word-level stagger variants
const CONTAINER = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } },
};
const WORD = {
  hidden:  { opacity: 0, y: 30, skewY: 4 },
  visible: { opacity: 1, y: 0,  skewY: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] } },
};

// ─── Events page title + tagline header ───────────────────────────────────────

const EventsSectionHeader: React.FC = () => (
  <motion.header
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    className="space-y-5"
  >
    {/* Eyebrow chip */}
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="flex items-center gap-2.5"
    >
      <span
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-primary/80 uppercase tracking-widest"
        style={{ background: 'rgba(255,106,0,0.08)', border: '1px solid rgba(255,106,0,0.15)' }}
      >
        <Zap size={11} aria-hidden="true" />
        Events
      </span>
    </motion.div>

    {/* Main title — Cinzel Decorative, staggered words */}
    <motion.h1
      variants={CONTAINER}
      initial="hidden"
      animate="visible"
      className="flex flex-wrap items-baseline gap-x-4 leading-none"
      style={{ fontFamily: 'Cinzel Decorative, Cinzel, serif' }}
    >
      {/* "Club" — white */}
      <motion.span
        variants={WORD}
        className="font-black text-white"
        style={{
          fontSize: 'clamp(2.2rem, 5.5vw, 4rem)',
          letterSpacing: '0.04em',
          textShadow: '0 2px 24px rgba(0,0,0,0.6)',
        }}
      >
        Club
      </motion.span>

      {/* "Events" — orange glow */}
      <motion.span
        variants={WORD}
        className="font-black"
        style={{
          fontSize: 'clamp(2.2rem, 5.5vw, 4rem)',
          letterSpacing: '0.04em',
          color: '#f97316',
          textShadow: '0 0 40px rgba(249,115,22,0.65), 0 0 80px rgba(249,115,22,0.25)',
        }}
      >
        Events
      </motion.span>
    </motion.h1>

    {/* Subtitle */}
    <motion.p
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55, duration: 0.45, ease: 'easeOut' }}
      className="text-textMuted max-w-xl leading-relaxed"
      style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 'clamp(0.68rem, 1.4vw, 0.82rem)',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
      }}
    >
      Workshops, hackathons, open-source sprints, and tech talks — built for developers who ship.
    </motion.p>
  </motion.header>
);

export default EventsSectionHeader;

