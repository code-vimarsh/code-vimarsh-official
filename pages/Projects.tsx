import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGlobalState } from '../context/GlobalContext';

import { ProjectType } from '../types';
import {
  ProjectsHeader,
  ProjectsGrid,
  ProjectForm,
  Toast,
  useToast,
} from '../components/Projects';
import { EmbersBackground } from '../components/Achievements/GlowDots';

// ── Background identical to Team page ────────────────────────────────────────
const SectionBackground: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const fn = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', fn, { passive: true });
    return () => window.removeEventListener('mousemove', fn);
  }, []); 

  return (
    <div style={{ position: 'absolute', inset: 0, minHeight: '100vh', zIndex: 0, pointerEvents: 'none', overflow: 'hidden', background: '#0a0a0a' }}>
      {/* Solid black base — no image bleed, no navy tint */}
      {/* Dark gradient overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg,rgba(10,10,10,0.98) 0%,rgba(10,10,10,0.96) 50%,rgba(10,10,10,0.99) 100%)',
      }} />
      {/* Ember glow particles */}
      <EmbersBackground />
      {/* Mouse spotlight */}
      <motion.div
        animate={{ x: mousePos.x - 300, y: mousePos.y - 300 }}
        transition={{ type: 'spring', damping: 45, stiffness: 40 }}
        style={{
          position: 'absolute', width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(249,115,22,0.055) 0%, transparent 70%)',
          zIndex: 1,
        }}
      />
      {/* Dot grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(rgba(249,115,22,0.06) 1px, transparent 1px)',
        backgroundSize: '38px 38px', opacity: 0.55, zIndex: 2,
      }} />
    </div>
  );
};

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
    <div className="relative">
      {/* Unified black background: embers + mouse glow + dot grid */}
      <SectionBackground />

      {/* Content sits above background */}
      <div className="relative z-10 space-y-10">

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
      </div>{/* end z-10 content */}
    </div>
  );
};

export default Projects;
