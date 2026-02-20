import React from 'react';
import { Terminal, Github, Twitter, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-surfaceLight bg-bgDark z-10 relative mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Terminal className="text-primary" size={20} />
              <span className="font-display font-bold text-lg text-white">_CodeVimarsh</span>
            </div>
            <p className="text-textMuted text-sm max-w-xs">
              The official coding ecosystem of MSU Baroda. Fostering innovation, engineering excellence, and a collaborative developer community.
            </p>
          </div>
          
          <div>
            <h3 className="font-display font-semibold text-white mb-4">Platform</h3>
            <ul className="space-y-2 text-sm text-textMuted">
              <li><a href="#/projects" className="hover:text-primary transition-colors">Projects</a></li>
              <li><a href="#/events" className="hover:text-primary transition-colors">Events</a></li>
              <li><a href="#/resources" className="hover:text-primary transition-colors">Resources</a></li>
              <li><a href="#/achievements" className="hover:text-primary transition-colors">Achievements</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-semibold text-white mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-textMuted hover:text-white transition-colors p-2 bg-surface rounded-md hover:bg-surfaceLight">
                <Github size={18} />
              </a>
              <a href="#" className="text-textMuted hover:text-blue-400 transition-colors p-2 bg-surface rounded-md hover:bg-surfaceLight">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-textMuted hover:text-blue-600 transition-colors p-2 bg-surface rounded-md hover:bg-surfaceLight">
                <Linkedin size={18} />
              </a>
            </div>
            <p className="text-xs text-textMuted mt-4">
              © {new Date().getFullYear()} Code Vimarsh. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;