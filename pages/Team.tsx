import React from 'react';
import { useGlobalState } from '../context/GlobalContext';
import { Github, Linkedin } from 'lucide-react';

const Team: React.FC = () => {
  const { team } = useGlobalState();

  return (
    <div className="space-y-10">
      <header className="space-y-4 text-center">
        <h1 className="text-4xl font-display font-bold">The Core Architecture.</h1>
        <p className="text-textMuted max-w-2xl mx-auto">Meet the engineering leaders and organizers running Code Vimarsh.</p>
      </header>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-8">
        {team.map((member) => (
          <div key={member.id} className="group relative">
            <div className="relative overflow-hidden rounded-xl aspect-[3/4] mb-4 bg-surfaceLight border border-surfaceLight group-hover:border-primary/50 transition-colors">
              {/* Image */}
              <img 
                src={member.image} 
                alt={member.name} 
                className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
              />
              
              {/* Pseudo Glitch Effect overlay */}
              <div className="absolute inset-0 bg-primary mix-blend-overlay opacity-0 group-hover:opacity-20 transition-opacity"></div>
              
              {/* Social Links on Hover */}
              <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform bg-gradient-to-t from-black/80 to-transparent flex justify-center space-x-4">
                <a href={member.github || '#'} className="text-white hover:text-primary transition-colors"><Github size={20}/></a>
                <a href={member.linkedin || '#'} className="text-white hover:text-blue-500 transition-colors"><Linkedin size={20}/></a>
              </div>
            </div>
            
            <div className="text-center">
              <h3 className="font-bold text-lg">{member.name}</h3>
              <p className="text-primary text-sm font-mono">{member.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Team;