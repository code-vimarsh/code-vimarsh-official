import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { ProjectType } from './types';
import { TechBadge } from './TechBadge';
import ImageCarousel from '../shared/ImageCarousel';

// Category accent colours keep cards visually distinct
const CATEGORY_COLORS: Record<string, string> = {
  'Web':        '#00f0ff',
  'Mobile':     '#00ff9d',
  'AI / ML':    '#7000ff',
  'Systems':    '#ff6a00',
  'Open Source':'#ff9a00',
};

interface ProjectCardProps {
  project: ProjectType;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const navigate = useNavigate();

  const accent = CATEGORY_COLORS[project.category] ?? '#ff6a00';
  const preview = project.shortDescription ?? project.description;

  // Build the images array: prefer project.images; fall back to single project.image
  const galleryImages: string[] =
    project.images && project.images.length > 0
      ? project.images
      : project.image
      ? [project.image]
      : [];

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="
        group relative bg-surface border border-surfaceLight rounded-2xl overflow-hidden
        flex flex-col
        transition-all duration-300 ease-out
        hover:border-primary/40
        hover:shadow-[0_8px_40px_rgba(255,106,0,0.12)]
        hover:-translate-y-0.5
        hover:scale-[1.01]
      "
    >
      {/* ── Top accent line ── */}
      <div
        className="absolute top-0 inset-x-0 h-[2px] opacity-60"
        style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
      />

      {/* ── Project Image / Carousel ── */}
      <ImageCarousel
        images={galleryImages}
        alt={project.title}
        className="h-48 shrink-0"
        autoPlayMs={galleryImages.length > 1 ? 4000 : 0}
        overlay={
          <>
            {/* Category badge */}
            <div
              className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-md text-[10px] font-mono tracking-widest uppercase border"
              style={{
                background: `${accent}14`,
                borderColor: `${accent}40`,
                color: accent,
              }}
            >
              {project.category}
            </div>
            {/* Gradient fade at bottom */}
            <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-surface to-transparent z-10" />
            {/* Letter placeholder when no images */}
            {galleryImages.length === 0 && (
              <span
                className="absolute inset-0 flex items-center justify-center text-7xl font-black font-display opacity-20 select-none"
                style={{ color: accent }}
              >
                {project.title.charAt(0)}
              </span>
            )}
          </>
        }
      />

      {/* ── Card Body ── */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-lg font-display font-bold text-textMain mb-2 leading-snug">
          {project.title}
        </h3>

        <p className="text-sm text-textMuted leading-relaxed mb-4 line-clamp-3 flex-1">
          {preview}
        </p>

        {/* Tech badges — preview (first 3) */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.tech.slice(0, 3).map((t) => (
            <TechBadge key={t} label={t} />
          ))}
          {project.tech.length > 3 && (
            <span className="text-xs font-mono text-textMuted border border-surfaceLight rounded-md px-2 py-1">
              +{project.tech.length - 3}
            </span>
          )}
        </div>

        {/* More Info → navigates to /projects/:id */}
        <button
          onClick={() => navigate(`/projects/${project.id}`)}
          aria-label={`View details for ${project.title}`}
          className="
            group/btn flex items-center justify-center gap-2
            w-full py-2.5 rounded-lg text-sm font-semibold
            border transition-all duration-200
            border-surfaceLight text-textMuted
            hover:border-primary/60 hover:text-primary
            hover:bg-primary/5
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50
          "
        >
          <span>More Info</span>
          <ChevronRight size={15} className="transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:text-primary" />
        </button>
      </div>
    </motion.article>
  );
};
