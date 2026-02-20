import React from 'react';
import { BookOpen, Terminal, Database, Shield, ChevronRight } from 'lucide-react';

const paths = [
  { id: 'frontend', title: 'Modern Frontend', icon: <Terminal size={24}/>, desc: 'React, Next.js, WebGL' },
  { id: 'backend', title: 'Backend Systems', icon: <Database size={24}/>, desc: 'Node, Go, System Design' },
  { id: 'security', title: 'Cybersecurity', icon: <Shield size={24}/>, desc: 'CTFs, Network Security' }
];

const Resources: React.FC = () => {
  return (
    <div className="space-y-10">
      <header className="space-y-4">
        <h1 className="text-4xl font-display font-bold">Learning Ecosystem.</h1>
        <p className="text-textMuted max-w-2xl">Curated roadmaps and resources to master specific domains. Stop guessing what to learn next.</p>
      </header>

      <div className="grid md:grid-cols-3 gap-6">
        {paths.map(path => (
          <div key={path.id} className="bg-surface border border-surfaceLight rounded-xl p-6 hover:border-primary/50 transition-all group cursor-pointer">
            <div className="text-primary mb-4">{path.icon}</div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{path.title}</h3>
            <p className="text-sm text-textMuted mb-6">{path.desc}</p>
            <div className="flex items-center text-sm font-semibold text-white group-hover:text-primary transition-colors">
              Explore Path <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 bg-bgDark border border-surfaceLight rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-4">
        <BookOpen size={48} className="text-surfaceLight" />
        <h3 className="text-xl font-bold">Library Access</h3>
        <p className="text-textMuted max-w-md">Access our internal notion database containing interview prep sheets, previous year questions, and premium courses.</p>
        <button className="bg-surfaceLight hover:bg-surface text-white font-medium px-6 py-2 rounded-lg transition-colors border border-surface border-transparent hover:border-primary/30 mt-4">
          Authenticate with University ID
        </button>
      </div>
    </div>
  );
};

export default Resources;