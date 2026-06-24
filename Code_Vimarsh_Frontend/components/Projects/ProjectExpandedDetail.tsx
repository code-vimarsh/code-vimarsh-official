import React from 'react';
import { motion } from 'framer-motion';
import { Github, CheckCircle, User, Layers } from 'lucide-react';
import { ProjectType } from './types';
import { TechBadge } from './TechBadge';

interface ProjectExpandedDetailProps {
  project: ProjectType;
}

export const ProjectExpandedDetail: React.FC<ProjectExpandedDetailProps> = ({ project }) => {
  const fullDescription =
    project.fullDescription ?? project.description;
  const features = project.features ?? [];

  return (
    <motion.div
      key="expanded"
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      style={{ overflow: 'hidden' }}
    >
      {/* Separator */}
      <div className="mx-6 h-px bg-gradient-to-r from-primary/30 via-surfaceLight to-transparent mb-5" />

      <div className="px-6 pb-6 space-y-5">
        {/* Full Description */}
        <div>
          <h4 className="text-xs font-mono uppercase tracking-widest text-primary mb-2 flex items-center gap-1.5">
            <Layers size={12} /> About
          </h4>
          <p className="text-sm text-textMuted leading-relaxed">{fullDescription}</p>
        </div>

        {/* Features */}
        {features.length > 0 && (
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-primary mb-3 flex items-center gap-1.5">
              <CheckCircle size={12} /> Key Features
            </h4>
            <ul className="space-y-2">
              {features.map((feat, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-sm text-textMuted"
                >
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  {feat}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Full Tech Stack */}
        <div>
          <h4 className="text-xs font-mono uppercase tracking-widest text-primary mb-2 flex items-center gap-1.5">
            <Layers size={12} /> Tech Stack
          </h4>
          <div className="flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <TechBadge key={t} label={t} highlight />
            ))}
          </div>
        </div>

        {/* Author Row + GitHub Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 text-xs text-textMuted font-mono">
            <User size={13} className="text-primary/70" />
            <span>
              Built by{' '}
              <span className="text-textMain font-semibold">{project.author}</span>
            </span>
          </div>

          {project.links.github && (
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
              <span className="text-[10px] font-mono text-primary/70 bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded ml-1">
                ↗
              </span>
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};
