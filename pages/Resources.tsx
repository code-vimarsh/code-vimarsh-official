import React from 'react';
import { useGlobalState } from '../context/GlobalContext';
import { BookOpen, Terminal, Database, Shield, ChevronRight, Play, ExternalLink, Sparkles, Layers, Globe, Youtube, ArrowRight } from 'lucide-react';
import Marquee from '../components/Marquee';
import { motion } from 'framer-motion';

const paths = [
  { id: 'frontend', title: 'Modern Frontend', icon: <Terminal size={24} />, desc: 'React, Next.js, WebGL' },
  { id: 'backend', title: 'Backend Systems', icon: <Database size={24} />, desc: 'Node, Go, System Design' },
  { id: 'security', title: 'Cybersecurity', icon: <Shield size={24} />, desc: 'CTFs, Network Security' }
];

const Resources: React.FC = () => {
  const { videoResources, linkResources } = useGlobalState();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-bgDark py-20 px-4 md:px-8 space-y-24">
      {/* Hero Section */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6 relative"
      >
        <div className="absolute inset-0 -top-20 bg-primary/20 blur-[120px] rounded-full w-1/2 mx-auto h-64 opacity-20 pointer-events-none"></div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-primary text-xs font-bold uppercase tracking-widest backdrop-blur-md mb-4">
          <Sparkles size={12} /> Curated Learning Ecosystem
        </div>

        <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight text-white leading-tight">
          Learning <span className="bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent italic">Vault.</span>
        </h1>
        <p className="text-textMuted max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
          Discover and learn from our curated collection of high-fidelity resources and expert roadmaps.
        </p>
      </motion.header>

      {/* YT Playlists - Infinite Scroll */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="space-y-12"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-2">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-4 text-white">
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center border border-red-500/20 shadow-lg shadow-red-500/5">
                <Youtube className="text-red-500" size={24} />
              </div>
              Youtube Playlists
            </h2>
            <p className="text-textMuted text-sm font-medium pl-16">Deep-dives into programming fundamentals and masterclasses.</p>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-bgDark to-transparent z-10 pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-bgDark to-transparent z-10 pointer-events-none"></div>

          <Marquee direction="left" speed={60}>
            {videoResources.map((video) => (
              <motion.a
                key={video.id}
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -8 }}
                className="group block w-[320px] shrink-0 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:border-red-500/40 transition-all duration-500 shadow-2xl"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/400x225/1f2937/ef4444?text=YouTube+Video';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-90 group-hover:scale-100">
                    <div className="w-16 h-16 bg-red-600/90 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-2xl shadow-red-500/40">
                      <Play className="text-white fill-white ml-1" size={24} />
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <h3 className="text-lg font-bold text-white line-clamp-2 min-h-[3.5rem] group-hover:text-red-400 transition-colors uppercase tracking-tight">{video.title}</h3>
                  <div className="flex flex-wrap gap-2">
                    {video.tags?.map(t => (
                      <span key={t} className="text-[10px] uppercase font-black bg-white/5 text-textMuted px-3 py-1 rounded-full border border-white/5">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.a>
            ))}
          </Marquee>
        </div>
      </motion.section>

      {/* DSA Sheets - Infinite Scroll */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="space-y-12"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-2">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-4 text-white">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-lg shadow-primary/5">
                <BookOpen className="text-primary" size={24} />
              </div>
              DSA Practice Sheets
            </h2>
            <p className="text-textMuted text-sm font-medium pl-16">The gold standard for software engineering interview preparation.</p>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-bgDark to-transparent z-10 pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-bgDark to-transparent z-10 pointer-events-none"></div>

          <Marquee direction="right" speed={50}>
            {linkResources.map((link) => {
              const domain = new URL(link.url).hostname;
              const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

              return (
                <motion.div
                  key={link.id}
                  whileHover={{ scale: 1.02 }}
                  className="w-[320px] shrink-0 bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl hover:border-primary/50 transition-all duration-300 group shadow-xl relative overflow-hidden"
                >
                  <div className="flex items-start justify-between mb-6 relative z-10">
                    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center p-3 group-hover:bg-primary/10 border border-white/10 group-hover:border-primary/20 transition-all duration-500">
                      <img src={faviconUrl} alt="Logo" className="w-8 h-8 object-contain" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold mb-4 h-14 line-clamp-2 text-white group-hover:text-primary transition-colors tracking-tight uppercase leading-tight">{link.title}</h3>

                  <div className="space-y-4 mb-8 min-h-[100px]">
                    {link.bestFor && (
                      <div className="flex items-start gap-3">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] flex-shrink-0" />
                        <p className="text-xs text-textMuted leading-relaxed"><span className="text-white/80 font-bold uppercase tracking-wider text-[10px]">Best for:</span> {link.bestFor}</p>
                      </div>
                    )}
                    {link.contentType && (
                      <div className="flex items-start gap-3">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(255,122,0,0.6)] flex-shrink-0" />
                        <p className="text-xs text-textMuted leading-relaxed"><span className="text-white/80 font-bold uppercase tracking-wider text-[10px]">Type:</span> {link.contentType}</p>
                      </div>
                    )}
                  </div>

                  <a
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-white/5 border border-white/10 hover:border-primary hover:bg-primary/10 text-white font-bold transition-all text-sm group/btn"
                  >
                    Explore Resources <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                  </a>
                </motion.div>
              );
            })}
          </Marquee>
        </div>
      </motion.section>

      {/* Domain Masterclass (Static Grid) */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="pt-20"
      >
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Domain Masterclasses</h2>
          <p className="text-textMuted max-w-xl mx-auto">Focused tracks for engineers who want to reach the top 1%.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {paths.map((path, idx) => (
            <motion.div
              key={path.id}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="group relative bg-white/5 border border-white/10 rounded-[2.5rem] p-10 hover:border-primary/40 transition-all duration-500 overflow-hidden shadow-2xl"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-[80px] translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"></div>

              <div className="text-primary mb-8 p-5 bg-primary/5 rounded-3xl w-fit border border-primary/20 scale-110 group-hover:scale-125 group-hover:rotate-6 transition-all duration-500">
                {path.icon}
              </div>

              <h3 className="text-3xl font-bold mb-4 text-white group-hover:text-primary transition-colors uppercase tracking-tight">{path.title}</h3>
              <p className="text-textMuted text-lg leading-relaxed mb-10">{path.desc}</p>

              <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs font-bold text-white group-hover:text-primary transition-colors flex items-center gap-2 uppercase tracking-widest">
                  Launch Roadmap <ChevronRight size={16} className="group-hover:translate-x-2 transition-transform" />
                </span>
                <div className="text-[10px] font-mono text-textMuted border border-white/10 px-2 py-1 rounded tracking-tighter uppercase font-bold">
                  24+ Modules
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Authentic Library Access */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto"
      >
        <div className="relative overflow-hidden bg-gradient-to-br from-bgDark to-surface/40 border border-white/10 rounded-[2.5rem] p-12 md:p-16 flex flex-col items-center justify-center text-center space-y-8 group shadow-2xl">
          <div className="absolute inset-0 bg-primary/5 opacity-30 blur-[150px] pointer-events-none transition-all duration-700 group-hover:scale-150"></div>

          <div className="p-6 bg-primary/10 rounded-3xl border border-primary/20 relative z-10 shadow-inner">
            <BookOpen size={48} className="text-primary animate-pulse" />
          </div>

          <div className="space-y-3 relative z-10">
            <h3 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tighter uppercase">The Internal Archive</h3>
            <p className="text-textMuted max-w-xl mx-auto text-lg leading-relaxed">
              Access 500+ leaked technical case studies, internal startup frameworks, and 1-on-1 mentorship blueprints.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(255, 122, 0, 0.3)" }}
            whileTap={{ scale: 0.98 }}
            className="bg-primary text-black font-extrabold px-10 py-4 rounded-xl transition-all shadow-xl shadow-primary/20 relative z-10 text-lg tracking-tight uppercase"
          >
            Authenticate with Student ID
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default Resources;