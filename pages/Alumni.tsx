import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, Briefcase, GraduationCap, ChevronRight, X } from 'lucide-react';

const MOCK_ALUMNI = [
  { id: '1', name: 'Rohan Mehta', role: 'SDE II', company: 'Google', batch: '2021', advice: 'Focus heavily on core CS fundamentals and distributed systems.', tech: ['C++', 'Go', 'Kubernetes'] },
  { id: '2', name: 'Sneha Rao', role: 'Frontend Engineer', company: 'Vercel', batch: '2022', advice: 'Build side projects that solve your own problems. Learn rendering patterns.', tech: ['React', 'Next.js', 'TypeScript'] },
  { id: '3', name: 'Karan Singh', role: 'Backend Lead', company: 'Stripe', batch: '2020', advice: 'Understand how databases work under the hood, not just the ORMs.', tech: ['Ruby', 'PostgreSQL', 'Redis'] },
  { id: '4', name: 'Aisha Khan', role: 'ML Researcher', company: 'OpenAI', batch: '2021', advice: 'Math is your best friend. Deep dive into linear algebra and probability.', tech: ['Python', 'PyTorch', 'CUDA'] },
];

const Alumni: React.FC = () => {
  const [selectedAlumni, setSelectedAlumni] = useState<typeof MOCK_ALUMNI[0] | null>(null);

  return (
    <div className="space-y-12">
      <header className="space-y-4 text-center">
        <h1 className="text-4xl font-display font-bold">Alumni Ecosystem.</h1>
        <p className="text-textMuted max-w-2xl mx-auto">See where Code Vimarsh members are engineering the future. Connect, learn, and follow their roadmaps.</p>
      </header>

      {/* Interactive Roadmap */}
      <div className="bg-surface border border-surfaceLight rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px]"></div>
        
        <h2 className="text-2xl font-bold mb-8 flex items-center">
          <Map className="mr-3 text-primary" /> The Standard Trajectory
        </h2>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-surfaceLight -z-10 -translate-y-1/2"></div>
          
          {[
            { icon: <GraduationCap size={24}/>, title: 'Code Vimarsh', desc: 'Core Fundamentals' },
            { icon: <Briefcase size={24}/>, title: 'Internships', desc: 'Real-world exposure' },
            { icon: <ChevronRight size={24}/>, title: 'SDE Role', desc: 'Product Companies' },
            { icon: <Map size={24}/>, title: 'Senior Impact', desc: 'Architecture & Leadership' }
          ].map((step, i) => (
            <div key={i} className="bg-bgDark border border-primary/30 p-4 rounded-xl flex flex-col items-center text-center w-full md:w-48 z-10 hover:-translate-y-2 transition-transform shadow-lg cursor-default">
              <div className="bg-primary/10 text-primary w-12 h-12 rounded-full flex items-center justify-center mb-3">
                {step.icon}
              </div>
              <h3 className="font-bold text-sm mb-1">{step.title}</h3>
              <span className="text-xs text-textMuted">{step.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Alumni Directory */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Alumni Network</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_ALUMNI.map(alumni => (
            <div 
              key={alumni.id} 
              onClick={() => setSelectedAlumni(alumni)}
              className="bg-bgDark border border-surfaceLight p-6 rounded-xl hover:border-primary/50 transition-colors cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-surfaceLight rounded-full flex items-center justify-center font-bold text-lg text-white group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                  {alumni.name.charAt(0)}
                </div>
                <span className="text-xs font-mono text-textMuted border border-surfaceLight px-2 py-1 rounded">
                  {alumni.batch}
                </span>
              </div>
              <h3 className="font-bold text-lg">{alumni.name}</h3>
              <p className="text-primary text-sm font-medium mb-1">{alumni.role}</p>
              <p className="text-textMuted text-sm">@ {alumni.company}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Details */}
      <AnimatePresence>
        {selectedAlumni && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedAlumni(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-surface border border-surfaceLight rounded-2xl p-8 max-w-lg w-full relative"
            >
              <button 
                onClick={() => setSelectedAlumni(null)}
                className="absolute top-4 right-4 text-textMuted hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
              
              <div className="mb-6 border-b border-surfaceLight pb-6">
                <h2 className="text-3xl font-bold">{selectedAlumni.name}</h2>
                <p className="text-primary font-medium text-lg mt-1">{selectedAlumni.role} at {selectedAlumni.company}</p>
                <p className="text-sm font-mono text-textMuted mt-2">Class of {selectedAlumni.batch}</p>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-textMuted uppercase tracking-wider mb-2">Tech Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedAlumni.tech.map(t => (
                      <span key={t} className="bg-bgDark border border-surfaceLight px-3 py-1 text-sm rounded-md text-white">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-textMuted uppercase tracking-wider mb-2">Advice for Students</h3>
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 italic text-white/90">
                    "{selectedAlumni.advice}"
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Alumni;