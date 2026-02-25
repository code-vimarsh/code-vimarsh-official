import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';

/* WhatsApp SVG */
const WhatsAppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" width="16" height="16">
    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
  </svg>
);

/* Instagram SVG */
const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" width="16" height="16">
    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z" />
  </svg>
);

const SOCIAL_LINKS = [
  {
    label: 'GitHub',
    href: 'https://github.com/code-vimarsh',
    icon: <Github size={16} />,
    hoverColor: 'hover:text-white hover:bg-surfaceLight',
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/company/code-vimarsh',
    icon: <Linkedin size={16} />,
    hoverColor: 'hover:text-[#0A66C2] hover:bg-blue-500/10',
  },
  {
    label: 'WhatsApp',
    href: 'https://chat.whatsapp.com/L7IN0PRX9Q61UQYQfzhEpX',
    icon: <WhatsAppIcon />,
    hoverColor: 'hover:text-[#25D366] hover:bg-green-500/10',
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/code_vimarsh/',
    icon: <InstagramIcon />,
    hoverColor: 'hover:text-[#E4405F] hover:bg-pink-500/10',
  },
];

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-surfaceLight bg-bgDark z-10 relative mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img
                src="/CV LOGO.webp"
                alt="Code Vimarsh"
                className="h-10 w-auto object-contain"
              />
              <span className="font-display font-bold text-lg text-white">
                Code<span className="text-primary">Vimarsh</span>
              </span>
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
            <div className="flex flex-wrap gap-2 mb-4">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  title={s.label}
                  className={`text-textMuted transition-all duration-200 p-2 bg-surface rounded-lg border border-transparent hover:border-surfaceLight ${s.hoverColor}`}
                >
                  {s.icon}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-2 text-xs text-textMuted">
              <Mail size={12} className="text-primary flex-shrink-0" />
              <a href="mailto:codingclub-cse@msubaroda.ac.in" className="hover:text-primary transition-colors truncate">
                codingclub-cse@msubaroda.ac.in
              </a>
            </div>
            <p className="text-xs text-textMuted mt-3">
              © {new Date().getFullYear()} Code Vimarsh. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;