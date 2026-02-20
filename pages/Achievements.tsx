import React from 'react';
import { MOCK_ACHIEVEMENTS } from '../constants';

const Achievements: React.FC = () => {
  return (
    <div className="space-y-10 max-w-3xl mx-auto">
      <header className="space-y-4 text-center pb-8 border-b border-surfaceLight">
        <h1 className="text-4xl font-display font-bold">Hall of Fame.</h1>
        <p className="text-textMuted">A timeline of our collective technical excellence and victories.</p>
      </header>

      <div className="relative border-l border-surfaceLight/50 ml-4 md:ml-0 space-y-12">
        {MOCK_ACHIEVEMENTS.map((item, index) => (
          <div key={item.id} className="relative pl-8 md:pl-12 group">
            {/* Timeline dot */}
            <div className="absolute w-4 h-4 rounded-full bg-bgDark border-2 border-primary -left-[9px] top-1 group-hover:bg-primary transition-colors shadow-[0_0_10px_rgba(255,106,0,0.5)]"></div>
            
            <div className="flex flex-col space-y-2">
              <span className="text-primary font-mono text-sm font-bold">{item.year}</span>
              <h3 className="text-xl font-bold">{item.title}</h3>
              <span className="inline-block w-fit text-xs px-2 py-1 bg-surfaceLight rounded text-textMuted mb-2">
                {item.category}
              </span>
              <p className="text-textMuted">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;