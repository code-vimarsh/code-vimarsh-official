import React, { useState, useMemo, useCallback } from 'react';
import { useGlobalState } from '../context/GlobalContext';

import { ProjectType } from '../types';
import {
  ProjectsHeader,
  ProjectsGrid,
  ProjectForm,
  Toast,
  useToast,
} from '../components/Projects';
import SectionBackground from '../components/shared/SectionBackground';

const Projects: React.FC = () => {
  const { projects, addProject, isLoggedIn } = useGlobalState();

  const [searchTerm, setSearchTerm]   = useState('');
  const [formOpen, setFormOpen]       = useState(false);
  const { toast, showToast, hideToast } = useToast();

  // Only published projects are visible to the public
  const publishedProjects = useMemo(
    () => projects.filter((p) => p.isPublished !== false),
    [projects]
  );

  // Filter by search term across title and tech stack
  const filteredProjects = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return publishedProjects;
    return publishedProjects.filter(
      (p) =>
        p.title.toLowerCase().includes(term) ||
        p.tech.some((t) => t.toLowerCase().includes(term)) ||
        (p.shortDescription ?? p.description).toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term)
    );
  }, [publishedProjects, searchTerm]);

  const handleProjectSubmit = useCallback(
    (newProject: ProjectType) => {
      addProject(newProject);
      showToast(
        `"${newProject.title}" has been submitted successfully!`,
        'success'
      );
    },
    [addProject, showToast]
  );

  return (
    <SectionBackground contentClassName="space-y-10">

      {/* Header: title, stat, search, submit button */}
      <ProjectsHeader
        totalCount={projects.length}
        publishedCount={publishedProjects.length}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onCreateClick={() => setFormOpen(true)}
        isLoggedIn={isLoggedIn}
      />

      {/* Projects Grid */}
      {/* Spacing between search bar and grid is handled by space-y-10 on the parent (via ProjectsHeader's space-y-6 + outer space-y-10) */}
      <ProjectsGrid projects={filteredProjects} searchTerm={searchTerm} />

      {/* Create / Submit Project Form Modal */}
      <ProjectForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleProjectSubmit}
        defaultAuthor="Alex Developer" // Replace with auth user name when available
      />

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onClose={hideToast}
      />
    </SectionBackground>
  );
};

export default Projects;
