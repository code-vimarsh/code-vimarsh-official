import React from 'react';
import { ProjectType } from './types';
import { ProjectCard } from './ProjectCard';
import { FolderOpen } from 'lucide-react';

interface ProjectsGridProps {
  projects: ProjectType[];
  searchTerm?: string;
}

export const ProjectsGrid: React.FC<ProjectsGridProps> = ({ projects, searchTerm }) => {
  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 border border-dashed border-surfaceLight rounded-2xl text-center gap-4">
        <div className="w-16 h-16 rounded-full bg-surface border border-surfaceLight flex items-center justify-center">
          <FolderOpen size={28} className="text-textMuted" />
        </div>
        <div>
          <p className="text-textMain font-semibold mb-1">No projects found</p>
          <p className="text-textMuted text-sm">
            {searchTerm
              ? `No results for "${searchTerm}". Try different keywords.`
              : 'No published projects yet. Be the first to submit one!'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
};
