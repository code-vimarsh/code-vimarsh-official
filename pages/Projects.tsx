import React, { useState } from 'react';
import { useGlobalState } from '../context/GlobalContext';
import { Github, ExternalLink, Plus } from 'lucide-react';

const Projects: React.FC = () => {
  const { projects } = useGlobalState();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.tech.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <h1 className="text-4xl font-display font-bold">Ship Software.</h1>
          <p className="text-textMuted max-w-2xl">Explore projects built by the Vimarsh community. From low-level systems to modern web apps.</p>
        </div>
        <button className="bg-surface border border-surfaceLight hover:border-primary text-white font-medium px-4 py-2 rounded-lg transition-colors flex items-center whitespace-nowrap">
          <Plus size={16} className="mr-2 text-primary" />
          Submit Project
        </button>
      </header>

      {/* Search & Filter */}
      <div className="flex gap-4 mb-8">
        <input 
          type="text" 
          placeholder="Search projects or tech stacks..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 bg-surface border border-surfaceLight rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary/50 text-white"
        />
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
        {filteredProjects.map((project) => (
          <div key={project.id} className="group relative bg-surface border border-surfaceLight rounded-xl overflow-hidden hover:border-primary/50 transition-all flex flex-col">
            {/* Image Placeholder */}
            <div className="w-full h-48 bg-surfaceLight flex items-center justify-center overflow-hidden shrink-0">
              <div className="w-full h-full bg-[#1e1e1e] group-hover:scale-105 transition-transform duration-500 flex items-center justify-center text-surface text-6xl font-black opacity-50">
                {project.title.charAt(0)}
              </div>
            </div>
            
            <div className="p-6 flex flex-col flex-1">
              <h3 className="text-xl font-bold mb-2">{project.title}</h3>
              <p className="text-sm text-textMuted mb-4">Built by {project.author}</p>
              
              <div className="flex flex-wrap gap-2 mb-6 mt-auto">
                {project.tech.map(t => (
                  <span key={t} className="text-xs font-mono bg-bgDark border border-surfaceLight px-2 py-1 rounded text-textMain">
                    {t}
                  </span>
                ))}
              </div>

              <div className="flex space-x-4 border-t border-surfaceLight pt-4">
                {project.links.github && (
                  <a href={project.links.github} className="text-textMuted hover:text-white flex items-center text-sm transition-colors">
                    <Github size={16} className="mr-1" /> Source
                  </a>
                )}
                {project.links.live && (
                  <a href={project.links.live} className="text-textMuted hover:text-primary flex items-center text-sm transition-colors">
                    <ExternalLink size={16} className="mr-1" /> Live Demo
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center text-textMuted py-10 border border-dashed border-surfaceLight rounded-xl">
          No projects found matching your search.
        </div>
      )}
    </div>
  );
};

export default Projects;