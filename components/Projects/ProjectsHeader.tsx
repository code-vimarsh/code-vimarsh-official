import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Search } from 'lucide-react';

interface ProjectsHeaderProps {
  totalCount: number;
  publishedCount: number;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onCreateClick: () => void;
  isLoggedIn?: boolean;
}

// Word-level stagger variants
const CONTAINER = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13, delayChildren: 0.08 } },
};
const WORD = {
  hidden:  { opacity: 0, y: 30, skewY: 4 },
  visible: { opacity: 1, y: 0,  skewY: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] } },
};

export const ProjectsHeader: React.FC<ProjectsHeaderProps> = ({
  publishedCount,
  searchTerm,
  onSearchChange,
  onCreateClick,
  isLoggedIn = false,
}) => (
  <div className="space-y-8">
    {/* Title row + submit button */}
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div className="space-y-4">

        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="text-xs font-mono tracking-[0.22em] uppercase text-primary"
        >
          // community builds
        </motion.p>

        {/* Main title — Cinzel Decorative, staggered words */}
        <motion.h1
          variants={CONTAINER}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap items-baseline gap-x-3 leading-none"
          style={{ fontFamily: 'Cinzel Decorative, Cinzel, serif' }}
        >
          {/* "The" + "Build" — white */}
          {['The', 'Build'].map((w) => (
            <motion.span
              key={w}
              variants={WORD}
              className="font-black text-white"
              style={{
                fontSize: 'clamp(2rem, 5vw, 3.6rem)',
                letterSpacing: '0.04em',
                textShadow: '0 2px 24px rgba(0,0,0,0.6)',
              }}
            >
              {w}
            </motion.span>
          ))}

          {/* "Vault." — orange glow */}
          <motion.span
            variants={WORD}
            className="font-black"
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.6rem)',
              letterSpacing: '0.04em',
              color: '#f97316',
              textShadow: '0 0 40px rgba(249,115,22,0.65), 0 0 80px rgba(249,115,22,0.25)',
            }}
          >
            Vault.
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
            fontSize: 'clamp(0.68rem, 1.3vw, 0.82rem)',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
          }}
        >
          Explore projects built by the Vimarsh community — from low-level systems to modern web apps.{' '}
          <span className="text-textMain font-semibold">
            {publishedCount} project{publishedCount !== 1 ? 's' : ''} published.
          </span>
        </motion.p>
      </div>

      {isLoggedIn && (
        <motion.button
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.35, ease: 'easeOut' }}
          onClick={onCreateClick}
          className="
            group flex items-center gap-2 whitespace-nowrap
            bg-primary text-white font-semibold text-sm
            px-5 py-2.5 rounded-xl
            shadow-[0_0_20px_rgba(255,106,0,0.25)]
            hover:bg-secondary hover:shadow-[0_0_30px_rgba(255,106,0,0.45)]
            active:scale-95
            transition-all duration-200
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60
          "
        >
          <Plus
            size={16}
            className="transition-transform duration-200 group-hover:rotate-90"
          />
          Submit Project
        </motion.button>
      )}
    </div>

    {/* Search */}
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4, ease: 'easeOut' }}
      className="relative max-w-lg"
    >
      <Search
        size={16}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted pointer-events-none"
      />
      <input
        type="text"
        placeholder="Search by project name or tech stack…"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="
          w-full bg-surface border border-surfaceLight rounded-xl
          pl-10 pr-4 py-3 text-sm text-textMain placeholder-textMuted
          focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20
          transition-colors duration-200
        "
      />
    </motion.div>
  </div>
);

