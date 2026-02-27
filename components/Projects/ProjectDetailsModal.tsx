import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Github, CheckCircle, User, Layers, ExternalLink } from 'lucide-react';
import { ProjectType } from './types';
import { TechBadge } from './TechBadge';

interface ProjectDetailsModalProps {
  project: ProjectType | null;
  onClose: () => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  'Web':         '#00f0ff',
  'Mobile':      '#00ff9d',
  'AI / ML':     '#7000ff',
  'Systems':     '#ff6a00',
  'Open Source': '#ff9a00',
};

const BACKDROP_VARIANTS = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1 },
  exit:    { opacity: 0 },
};

const MODAL_VARIANTS = {
  hidden:  { opacity: 0, y: 40, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 28 } },
  exit:    { opacity: 0, y: 24, scale: 0.97, transition: { duration: 0.22, ease: 'easeIn' as const } },
};

const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({ project, onClose }) => {
  const handleKey = useCallback(
    (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); },
    [onClose]
  );

  useEffect(() => {
    if (!project) return;
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [project, handleKey]);

  return (
    <AnimatePresence>
      {project && (() => {
        const accent  = CATEGORY_COLORS[project.category] ?? '#ff6a00';
        const full    = project.fullDescription ?? project.description;
        const features = project.features ?? [];

        return (
          <motion.div
            key="project-modal-backdrop"
            variants={BACKDROP_VARIANTS}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-start justify-center px-4 py-6 md:py-10 overflow-y-auto"
            style={{ background: 'rgba(10,10,10,0.88)', backdropFilter: 'blur(14px)' }}
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-label={`Project details: ${project.title}`}
          >
            <motion.div
              key="project-modal-card"
              variants={MODAL_VARIANTS}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative w-full max-w-3xl rounded-2xl overflow-hidden my-auto"
              style={{
                background: 'rgba(13,13,13,0.97)',
                border: '1px solid rgba(255,255,255,0.07)',
                boxShadow: '0 40px 100px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,106,0,0.06)',
                backdropFilter: 'blur(20px)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top accent rim */}
              <div
                className="absolute top-0 left-0 right-0 h-px z-10"
                style={{
                  background: `linear-gradient(90deg, transparent 5%, ${accent}99 38%, ${accent}99 62%, transparent 95%)`,
                }}
                aria-hidden="true"
              />

              {/* Close button */}
              <motion.button
                whileHover={{ scale: 1.08, backgroundColor: 'rgba(255,255,255,0.08)' }}
                whileTap={{ scale: 0.92 }}
                onClick={onClose}
                className="absolute top-4 right-4 z-20 p-2 rounded-full text-textMuted hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <X size={18} />
              </motion.button>

              {/* ── Banner image ── */}
              <div className="relative h-52 md:h-64 overflow-hidden bg-surfaceLight">
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center bg-gradient-to-br from-surfaceLight to-bgDark"
                    aria-hidden="true"
                  >
                    <span
                      className="text-9xl font-black font-display opacity-10 select-none"
                      style={{ color: accent }}
                    >
                      {project.title.charAt(0)}
                    </span>
                  </div>
                )}

                {/* Fade overlay */}
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, rgba(13,13,13,1) 0%, rgba(13,13,13,0.45) 45%, rgba(13,13,13,0.1) 100%)' }}
                  aria-hidden="true"
                />

                {/* Category badge over image */}
                <div className="absolute bottom-4 left-6">
                  <span
                    className="px-3 py-1 rounded-full text-[11px] font-mono tracking-widest uppercase border"
                    style={{
                      background: `${accent}18`,
                      borderColor: `${accent}50`,
                      color: accent,
                    }}
                  >
                    {project.category}
                  </span>
                </div>
              </div>

              {/* ── Content ── */}
              <div className="p-6 md:p-8 space-y-6">

                {/* Title */}
                <h2 className="font-display font-bold text-2xl md:text-3xl text-white leading-tight pr-8">
                  {project.title}
                </h2>

                {/* Divider */}
                <div className="h-px" style={{ background: 'rgba(255,255,255,0.06)' }} aria-hidden="true" />

                {/* About */}
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-widest text-primary mb-2 flex items-center gap-1.5">
                    <Layers size={12} aria-hidden="true" /> About
                  </h3>
                  <p className="text-sm text-white/70 leading-relaxed">{full}</p>
                </div>

                {/* Key Features */}
                {features.length > 0 && (
                  <div>
                    <h3 className="text-xs font-mono uppercase tracking-widest text-primary mb-3 flex items-center gap-1.5">
                      <CheckCircle size={12} aria-hidden="true" /> Key Features
                    </h3>
                    <ul className="space-y-2">
                      {features.map((feat, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.05 + i * 0.055, duration: 0.28 }}
                          className="flex items-start gap-2.5 text-sm text-white/65"
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
                  </div>
                )}

                {/* Tech Stack */}
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-widest text-primary mb-3 flex items-center gap-1.5">
                    <Layers size={12} aria-hidden="true" /> Tech Stack
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((t) => (
                      <TechBadge key={t} label={t} highlight />
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px" style={{ background: 'rgba(255,255,255,0.06)' }} aria-hidden="true" />

                {/* Author + GitHub */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-2 text-sm text-textMuted font-mono">
                    <User size={14} className="text-primary/70 shrink-0" aria-hidden="true" />
                    <span>
                      Built by{' '}
                      <span className="text-white font-semibold">{project.author}</span>
                    </span>
                  </div>

                  {project.links?.github && (
                    <a
                      href={project.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                        group inline-flex items-center justify-center gap-2
                        px-5 py-2.5 rounded-lg text-sm font-semibold
                        bg-[#161b22] border border-[#30363d]
                        text-[#e6edf3] hover:text-white
                        hover:bg-[#21262d] hover:border-[#8b949e]
                        hover:shadow-[0_0_18px_rgba(255,106,0,0.25)]
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
                  )}
                </div>

              </div>
            </motion.div>
          </motion.div>
        );
      })()}
    </AnimatePresence>
  );
};

export default ProjectDetailsModal;
