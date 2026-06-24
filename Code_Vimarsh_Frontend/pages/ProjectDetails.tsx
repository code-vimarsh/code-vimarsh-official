import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Github, CheckCircle, User, Layers, ExternalLink, ImageOff } from 'lucide-react';

import { useGlobalState } from '../context/GlobalContext';
import { ProjectType } from '../types';
import { TechBadge } from '../components/Projects';
import { EmbersBackground } from '../components/Achievements/GlowDots';

// ── Category accent map ───────────────────────────────────────────────────────
const CATEGORY_COLORS: Record<string, string> = {
  'Web':         '#00f0ff',
  'Mobile':      '#00ff9d',
  'AI / ML':     '#7000ff',
  'Systems':     '#ff6a00',
  'Open Source': '#ff9a00',
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const Divider: React.FC = () => (
  <hr
    className="border-none h-px"
    style={{ background: 'rgba(255,255,255,0.06)' }}
    aria-hidden="true"
  />
);

// ── Background (matches Projects page) ───────────────────────────────────────
const SectionBackground: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const fn = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', fn, { passive: true });
    return () => window.removeEventListener('mousemove', fn);
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden', background: '#0a0a0a' }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg,rgba(10,10,10,0.98) 0%,rgba(10,10,10,0.96) 50%,rgba(10,10,10,0.99) 100%)',
      }} />
      <EmbersBackground />
      <motion.div
        animate={{ x: mousePos.x - 300, y: mousePos.y - 300 }}
        transition={{ type: 'spring', damping: 45, stiffness: 40 }}
        style={{
          position: 'absolute', width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(249,115,22,0.055) 0%, transparent 70%)',
          zIndex: 1,
        }}
      />
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(rgba(249,115,22,0.06) 1px, transparent 1px)',
        backgroundSize: '38px 38px', opacity: 0.55, zIndex: 2,
      }} />
    </div>
  );
};

// ── Skeleton ──────────────────────────────────────────────────────────────────
const ProjectDetailsSkeleton: React.FC = () => (
  <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-pulse">
    <div className="h-4 w-28 rounded-lg" style={{ background: 'rgba(255,255,255,0.06)' }} />
    <div className="w-full h-72 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)' }} />
    <div className="space-y-4">
      {[80, 90, 60, 75, 55].map((w, i) => (
        <div key={i} className="h-3 rounded-md" style={{ width: `${w}%`, background: 'rgba(255,255,255,0.05)' }} />
      ))}
    </div>
  </div>
);

// ── Not found ─────────────────────────────────────────────────────────────────
const ProjectNotFound: React.FC<{ id?: string }> = ({ id }) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center py-20">
      <div
        className="w-20 h-20 rounded-2xl flex items-center justify-center"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <span className="text-4xl" aria-hidden="true">🔍</span>
      </div>
      <div className="space-y-2">
        <h1 className="font-display font-bold text-2xl text-white">Project Not Found</h1>
        {id && (
          <p className="text-xs font-mono text-textMuted/60">
            looked up: <span className="text-primary/60">{id}</span>
          </p>
        )}
        <p className="text-textMuted text-sm mt-1">
          This project doesn't exist or has been removed.
        </p>
      </div>
      <button
        onClick={() => navigate('/projects')}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105"
        style={{ background: 'rgba(255,106,0,0.12)', border: '1px solid rgba(255,106,0,0.25)' }}
      >
        <ArrowLeft size={15} aria-hidden="true" />
        Back to Projects
      </button>
    </div>
  );
};

// ── Main page ─────────────────────────────────────────────────────────────────
const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { projects } = useGlobalState();
  const [project, setProject] = useState<ProjectType | null | undefined>(undefined);
  const [loading, setLoading]   = useState(true);
  const [imgError, setImgError] = useState(false);

  // Scroll to top on mount / id change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [id]);

  // Resolve project from context (swap with API fetch when backend is ready)
  useEffect(() => {
    setLoading(true);
    setProject(undefined);
    setImgError(false);

    if (!id) { setProject(null); setLoading(false); return; }

    const timer = setTimeout(() => {
      const found = projects.find((p) => p.id === id) ?? null;
      setProject(found);
      setLoading(false);
    }, 60);

    return () => clearTimeout(timer);
  }, [id, projects]);

  if (loading || project === undefined) return (
    <div className="relative">
      <SectionBackground />
      <div className="relative z-10"><ProjectDetailsSkeleton /></div>
    </div>
  );

  if (project === null) return (
    <div className="relative">
      <SectionBackground />
      <div className="relative z-10"><ProjectNotFound id={id} /></div>
    </div>
  );

  const accent   = CATEGORY_COLORS[project.category] ?? '#ff6a00';
  const full     = project.fullDescription ?? project.description;
  const features = project.features ?? [];

  return (
    <div className="relative">
      <SectionBackground />

      <AnimatePresence mode="wait">
        <motion.div
          key={id}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
          className="relative z-10 max-w-4xl mx-auto pb-24"
        >
          {/* ── Back link ── */}
          <nav aria-label="Breadcrumb" className="mb-8">
            <Link
              to="/projects"
              className="group inline-flex items-center gap-2 text-sm text-textMuted hover:text-white transition-colors"
            >
              <motion.span
                className="inline-flex"
                whileHover={{ x: -3 }}
                transition={{ type: 'spring', stiffness: 400, damping: 22 }}
              >
                <ArrowLeft size={14} aria-hidden="true" />
              </motion.span>
              <span>Back to Projects</span>
            </Link>
          </nav>

          {/* ── Hero banner ── */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.4, ease: 'easeOut' }}
            className="mb-10 relative w-full rounded-2xl overflow-hidden"
            style={{ border: '1px solid rgba(255,255,255,0.07)' }}
          >
            {/* Top accent rim */}
            <div
              className="absolute top-0 left-0 right-0 h-px z-10"
              style={{ background: `linear-gradient(90deg, transparent 5%, ${accent}99 38%, ${accent}99 62%, transparent 95%)` }}
              aria-hidden="true"
            />

            <div className="relative h-64 md:h-80 bg-surfaceLight overflow-hidden">
              {project.image && !imgError ? (
                <img
                  src={project.image}
                  alt={project.title}
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #111 0%, #0a0a0a 100%)' }}
                >
                  {imgError
                    ? <ImageOff size={48} className="text-surfaceLight" />
                    : <span className="text-[10rem] font-black font-display opacity-10 select-none" style={{ color: accent }}>
                        {project.title.charAt(0)}
                      </span>
                  }
                </div>
              )}

              {/* Fade overlay */}
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to top, rgba(13,13,13,1) 0%, rgba(13,13,13,0.3) 60%, rgba(13,13,13,0.05) 100%)' }}
                aria-hidden="true"
              />

              {/* Category badge */}
              <div className="absolute bottom-5 left-6 z-10">
                <span
                  className="px-3 py-1 rounded-full text-[11px] font-mono tracking-widest uppercase border"
                  style={{ background: `${accent}18`, borderColor: `${accent}55`, color: accent }}
                >
                  {project.category}
                </span>
              </div>
            </div>

            {/* Title row under image */}
            <div
              className="px-6 md:px-8 py-6"
              style={{ background: 'rgba(13,13,13,0.97)' }}
            >
              <h1 className="font-display font-bold text-3xl md:text-4xl text-white leading-tight">
                {project.title}
              </h1>
              <p className="text-textMuted text-sm mt-2 leading-relaxed max-w-2xl">
                {project.shortDescription ?? project.description}
              </p>
            </div>
          </motion.div>

          {/* ── Two-column layout on md+ ── */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-8 items-start">

            {/* ── Left: main content ── */}
            <div className="space-y-8">

              {/* About */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12, duration: 0.36, ease: 'easeOut' }}
              >
                <h2 className="text-xs font-mono uppercase tracking-widest text-primary mb-3 flex items-center gap-1.5">
                  <Layers size={12} aria-hidden="true" /> About
                </h2>
                <p className="text-white/70 text-sm leading-relaxed">{full}</p>
              </motion.div>

              <Divider />

              {/* Key Features */}
              {features.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.16, duration: 0.36, ease: 'easeOut' }}
                >
                  <h2 className="text-xs font-mono uppercase tracking-widest text-primary mb-4 flex items-center gap-1.5">
                    <CheckCircle size={12} aria-hidden="true" /> Key Features
                  </h2>
                  <ul className="space-y-3">
                    {features.map((feat, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.18 + i * 0.06, duration: 0.3 }}
                        className="flex items-start gap-3 text-sm text-white/65"
                      >
                        <span
                          className="mt-[6px] w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ background: accent }}
                          aria-hidden="true"
                        />
                        {feat}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}

              <Divider />

              {/* Tech Stack */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22, duration: 0.36, ease: 'easeOut' }}
              >
                <h2 className="text-xs font-mono uppercase tracking-widest text-primary mb-3 flex items-center gap-1.5">
                  <Layers size={12} aria-hidden="true" /> Tech Stack
                </h2>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((t) => (
                    <TechBadge key={t} label={t} highlight />
                  ))}
                </div>
              </motion.div>

            </div>

            {/* ── Right: sticky sidebar ── */}
            <aside>
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' }}
                className="relative rounded-2xl p-6 space-y-5 sticky top-24"
                style={{
                  background: 'rgba(15,15,15,0.92)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(14px)',
                }}
              >
                {/* Top orange rim */}
                <div
                  className="absolute top-0 left-8 right-8 h-px rounded-full pointer-events-none"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(255,106,0,0.50), transparent)' }}
                  aria-hidden="true"
                />

                {/* Author */}
                <div className="flex items-center gap-2.5 text-sm text-textMuted font-mono">
                  <User size={14} className="text-primary/70 shrink-0" aria-hidden="true" />
                  <span>
                    Built by{' '}
                    <span className="text-white font-semibold">{project.author}</span>
                  </span>
                </div>

                <Divider />

                {/* GitHub CTA */}
                {project.links?.github ? (
                  <a
                    href={project.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      group w-full inline-flex items-center justify-center gap-2
                      px-4 py-3 rounded-xl text-sm font-semibold
                      bg-[#161b22] border border-[#30363d]
                      text-[#e6edf3] hover:text-white
                      hover:bg-[#21262d] hover:border-[#8b949e]
                      hover:shadow-[0_0_20px_rgba(255,106,0,0.20)]
                      transition-all duration-200
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60
                    "
                  >
                    <Github
                      size={16}
                      className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:text-primary"
                    />
                    View on GitHub
                    <ExternalLink size={12} className="text-primary/60 ml-0.5" aria-hidden="true" />
                  </a>
                ) : (
                  <div
                    className="rounded-xl px-4 py-3 text-center text-xs text-textMuted/50"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    No public repository yet
                  </div>
                )}

                <Divider />

                {/* Category badge */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-textMuted uppercase tracking-widest">Category</p>
                  <span
                    className="inline-block px-3 py-1 rounded-full text-[11px] font-mono tracking-widest uppercase border"
                    style={{ background: `${accent}14`, borderColor: `${accent}40`, color: accent }}
                  >
                    {project.category}
                  </span>
                </div>

                {/* All tech */}
                <div className="space-y-2.5">
                  <p className="text-xs font-semibold text-textMuted uppercase tracking-widest">Stack</p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tech.map((t) => (
                      <TechBadge key={t} label={t} />
                    ))}
                  </div>
                </div>
              </motion.div>
            </aside>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ProjectDetails;
