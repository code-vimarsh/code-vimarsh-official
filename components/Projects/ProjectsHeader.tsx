import React from 'react';
import { Plus, Search } from 'lucide-react';

interface ProjectsHeaderProps {
  totalCount: number;
  publishedCount: number;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onCreateClick: () => void;
  isLoggedIn?: boolean;
}

export const ProjectsHeader: React.FC<ProjectsHeaderProps> = ({
  totalCount,
  publishedCount,
  searchTerm,
  onSearchChange,
  onCreateClick,
  isLoggedIn = false,
}) => (
  <div className="space-y-6">
    {/* Title + Submit Button */}
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div className="space-y-3">
        {/* Eyebrow */}
        <p className="text-xs font-mono tracking-[0.2em] uppercase text-primary">
          // community builds
        </p>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-textMain leading-tight">
          The Build Vault.
        </h1>
        <p className="text-textMuted max-w-xl text-sm leading-relaxed">
          Explore projects built by the Vimarsh community — from low-level systems to modern web apps.{' '}
          <span className="text-textMain">
            {publishedCount} project{publishedCount !== 1 ? 's' : ''} published.
          </span>
        </p>
      </div>

      {isLoggedIn && (
        <button
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
        </button>
      )}
    </div>

    {/* Search */}
    <div className="relative max-w-lg">
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
    </div>
  </div>
);
