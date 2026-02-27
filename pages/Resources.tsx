import React, { useEffect, useRef } from 'react';
import { Youtube, BookOpen, ArrowRight, Play, Sparkles } from 'lucide-react';
import { Resource } from '../types';
import { motion } from 'framer-motion';
import { EmbersBackground } from '../components/Achievements/GlowDots';

const YT_RESOURCES: Resource[] = [
  {
    id: "java-full",
    title: "Java Full Course (Beginner to Advanced)",
    category: "youtube",
    url: "https://youtu.be/eIrMbAQSU34?si=6fk454xxKQu_ta-g",
    thumbnail: "https://img.youtube.com/vi/eIrMbAQSU34/maxresdefault.jpg",
    tags: ["Java", "Beginner", "OOP"]
  },
  {
    id: "c-full",
    title: "C Programming Full Course",
    category: "youtube",
    url: "https://youtu.be/rQoqCP7LX60?si=ldtuSiE543obcHa3",
    thumbnail: "https://img.youtube.com/vi/rQoqCP7LX60/maxresdefault.jpg",
    tags: ["C Language", "Basics", "Programming"]
  },
  {
    id: "python-full",
    title: "Python Full Course",
    category: "youtube",
    url: "https://youtu.be/UrsmFxEIp5k?si=YncVWzSPAXW0Ku5S",
    thumbnail: "https://img.youtube.com/vi/UrsmFxEIp5k/maxresdefault.jpg",
    tags: ["Python", "Beginner", "Programming"]
  },
  {
    id: "dsa-series",
    title: "Complete DSA Series",
    category: "youtube",
    url: "https://youtu.be/VTLCoHnyACE?si=hPPA-4nphOFHuY5J",
    thumbnail: "https://img.youtube.com/vi/VTLCoHnyACE/maxresdefault.jpg",
    tags: ["DSA", "Algorithms", "Problem Solving"]
  },
  {
    id: "cpp-full",
    title: "C++ Full Course",
    category: "youtube",
    url: "https://youtu.be/e7sAf4SbS_g?si=v_hQalT02OZIJN5K",
    thumbnail: "https://img.youtube.com/vi/e7sAf4SbS_g/maxresdefault.jpg",
    tags: ["C++", "OOP", "Placement Prep"]
  }
];

const SITE_RESOURCES: Resource[] = [
  {
    id: '6',
    title: "Striver's SDE Sheet",
    category: 'website',
    url: 'https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/',
    tags: ['Curated', 'Video Support'],
    bestFor: 'Complete roadmap from basics to advanced',
    contentType: 'Curated sheet + Video support'
  },
  {
    id: '7',
    title: "Love Babbar DSA 450",
    category: 'website',
    url: 'https://450dsa.com/',
    tags: ['Topic-wise', 'Checklist'],
    bestFor: 'Fixed checklist style revision',
    contentType: 'Topic-wise categorized list'
  },
  {
    id: '8',
    title: "NeetCode 150",
    category: 'website',
    url: 'https://neetcode.io/practice',
    tags: ['Patterns', 'LeetCode'],
    bestFor: 'LeetCode-pattern mastery',
    contentType: 'Patterns like DP, Graphs, Trees'
  },
  {
    id: '9',
    title: "Blind 75",
    category: 'website',
    url: 'https://www.teamblind.com/post/Blind-75-LeetCode-Questions-8pdhm1h2',
    tags: ['FAANG', 'Fast Prep'],
    bestFor: 'Fastest FAANG-style prep',
    contentType: 'Only the most asked 75 questions'
  },
  {
    id: '10',
    title: "LeetCode Study Plans",
    category: 'website',
    url: 'https://leetcode.com/study-plan/',
    tags: ['Structured', 'Daily Practice'],
    bestFor: 'Guided daily structured practice',
    contentType: 'Arrays, DP, SQL, Graphs tracks'
  },
  {
    id: '11',
    title: "InterviewBit Path",
    category: 'website',
    url: 'https://www.interviewbit.com/coding-interview-questions/',
    tags: ['Competitive', 'Gamified'],
    bestFor: 'Competitive interview-oriented prep',
    contentType: 'Level progression + hints'
  },
  {
    id: '12',
    title: "GeeksforGeeks DSA",
    category: 'website',
    url: 'https://www.geeksforgeeks.org/must-do-coding-questions-for-product-based-companies/',
    tags: ['Topic-wise', 'Explanations'],
    bestFor: 'Topic explanation + questions',
    contentType: 'Beginner-friendly'
  },
  {
    id: '13',
    title: "Coding Ninjas Paths",
    category: 'website',
    url: 'https://www.codingninjas.com/codestudio/guided-paths',
    tags: ['Structured', 'Incremental'],
    bestFor: 'Topic-wise structured lists',
    contentType: 'Incremental difficulty'
  },
  {
    id: '14',
    title: "CS50 Harvard Problem Sets",
    category: 'website',
    url: 'https://cs50.harvard.edu/x/2024/psets/',
    tags: ['Logic', 'Fundamentals'],
    bestFor: 'Logic + fundamentals',
    contentType: 'Strong conceptual base'
  },
  {
    id: '15',
    title: "AlgoExpert",
    category: 'website',
    url: 'https://www.algoexpert.io/',
    tags: ['Premium', 'System Design'],
    bestFor: 'Premium polished explanations',
    contentType: 'Coding + system design'
  },
];

const Resources: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const sheetsScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollPosition = 0;
    const scrollSpeed = 0.5;
    let animationId: number;

    const scroll = () => {
      if (!scrollContainer) return;
      scrollPosition += scrollSpeed;
      const limit = scrollContainer.scrollWidth / 3;
      if (scrollPosition >= limit) {
        scrollPosition = 0;
      }
      scrollContainer.scrollLeft = scrollPosition;
      animationId = requestAnimationFrame(scroll);
    };

    const timeoutId = setTimeout(() => {
      animationId = requestAnimationFrame(scroll);
    }, 500);

    const handleMouseEnter = () => cancelAnimationFrame(animationId);
    const handleMouseLeave = () => { animationId = requestAnimationFrame(scroll); };

    scrollContainer.addEventListener('mouseenter', handleMouseEnter);
    scrollContainer.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(animationId);
      scrollContainer.removeEventListener('mouseenter', handleMouseEnter);
      scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    const scrollContainer = sheetsScrollRef.current;
    if (!scrollContainer) return;

    let scrollPosition = 0;
    const scrollSpeed = 0.5;
    let animationId: number;

    const scroll = () => {
      if (!scrollContainer) return;
      scrollPosition -= scrollSpeed;
      const limit = scrollContainer.scrollWidth / 2;
      if (scrollPosition <= 0) {
        scrollPosition = limit;
      }
      scrollContainer.scrollLeft = scrollPosition;
      animationId = requestAnimationFrame(scroll);
    };

    const timeoutId = setTimeout(() => {
      scrollPosition = scrollContainer.scrollWidth / 2;
      animationId = requestAnimationFrame(scroll);
    }, 500);

    const handleMouseEnter = () => cancelAnimationFrame(animationId);
    const handleMouseLeave = () => { animationId = requestAnimationFrame(scroll); };

    scrollContainer.addEventListener('mouseenter', handleMouseEnter);
    scrollContainer.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(animationId);
      scrollContainer.removeEventListener('mouseenter', handleMouseEnter);
      scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const itemVariants = {
    hidden: { y: 16, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 120 }
    }
  };

  return (
    <>
      {/* ── Full-viewport fixed background ── bypasses Layout's max-w-7xl ── */}
      <div style={{ position: 'fixed', inset: 0, zIndex: -2, pointerEvents: 'none', overflow: 'hidden' }}>
        {/* Castle background image */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url('/assets/castle-bg.jpeg')`, backgroundSize: 'cover', backgroundPosition: 'center top', backgroundRepeat: 'no-repeat' }} />
        {/* Dark overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(11,15,25,0.78) 0%,rgba(11,15,25,0.65) 45%,rgba(11,15,25,0.88) 100%)' }} />
        {/* Ember / dot particles — fills fixed container = full viewport */}
        <EmbersBackground />
      </div>

      {/* Page content — sits in normal flow above the fixed background */}
      <div className="pb-20" style={{ position: 'relative', minHeight: '100vh' }}>

      {/* Hero */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ position: 'relative', zIndex: 10 }}
        className="pt-28 pb-24 px-6"
      >
        <div className="container mx-auto text-center space-y-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest"
          >
            <Sparkles size={12} className="animate-pulse" /> Curated Learning Ecosystem
          </motion.div>
          <h1 className="heading-primary" style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', margin: 0 }}>
            Resources For{' '}
            <span className="heading-accent-glow">DSA</span>
          </h1>
          <p className="text-textMuted text-base md:text-lg max-w-2xl mx-auto">
            Curated playlists and practice sheets to boost your interview preparation.
          </p>
        </div>
      </motion.header>

      <div className="container mx-auto px-6 -mt-8 space-y-16 relative z-10">
        {/* YT Playlists */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-[#B45309]/10 flex items-center justify-center border border-[#B45309]/30">
              <Youtube className="text-[#B45309]" size={22} />
            </div>
            <div>
              <h2 className="text-2xl font-bold font-heading text-white">Youtube Playlists</h2>
              <p className="text-textMuted text-sm">Foundational deep-dives into data structures.</p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-bgDark to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-bgDark to-transparent z-10 pointer-events-none" />

            <div
              ref={scrollRef}
              className="overflow-x-hidden cursor-grab active:cursor-grabbing py-10"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <div className="flex gap-5 px-8" style={{ width: 'max-content' }}>
                {[...YT_RESOURCES, ...YT_RESOURCES, ...YT_RESOURCES].map((res, index) => (
                  <motion.a
                    key={`${res.id}-${index}`}
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    variants={itemVariants}
                    whileHover={{
                      y: -8,
                      scale: 1.02,
                      borderColor: "#f97316",
                      boxShadow: "0 0 30px -8px rgba(249, 115, 22, 0.5)"
                    }}
                    style={{ borderColor: '#B45309' }}
                    className="flex-shrink-0 w-[260px] sm:w-[340px] group/card block bg-surface border-2 rounded-3xl overflow-hidden"
                  >
                    <div className="flex flex-col">
                      <div className="relative aspect-video overflow-hidden">
                        <img
                          src={res.thumbnail}
                          alt={res.title}
                          className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/400x225/111/f97316?text=YouTube';
                          }}
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-xl">
                            <Play className="text-white fill-white ml-1" size={22} />
                          </div>
                        </div>
                      </div>

                      <div className="p-5 flex flex-col gap-3">
                        <h3 className="font-bold text-base text-white line-clamp-2 leading-snug group-hover/card:text-primary transition-colors">
                          {res.title}
                        </h3>
                        <div className="flex flex-wrap gap-1.5">
                          {res.tags.map(t => (
                            <span
                              key={t}
                              className="text-[10px] uppercase font-bold tracking-wider bg-white/5 text-textMuted px-2.5 py-1 rounded-full border border-white/10 group-hover/card:border-primary/30 transition-all"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* DSA Sheets */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-[#B45309]/10 flex items-center justify-center border border-[#B45309]/30">
              <BookOpen className="text-[#B45309]" size={22} />
            </div>
            <div>
              <h2 className="text-2xl font-bold font-heading text-white">DSA Practice Sheets</h2>
              <p className="text-textMuted text-sm">Structured roadmaps for interview mastery.</p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-bgDark to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-bgDark to-transparent z-10 pointer-events-none" />

            <div
              ref={sheetsScrollRef}
              className="overflow-x-hidden cursor-grab active:cursor-grabbing py-10"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <div className="flex gap-5 px-8" style={{ width: 'max-content' }}>
                {[...SITE_RESOURCES, ...SITE_RESOURCES].map((res, index) => {
                  const domain = new URL(res.url).hostname;
                  const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

                  return (
                    <motion.div
                      key={`${res.id}-${index}`}
                      variants={itemVariants}
                      whileHover={{
                        y: -8,
                        scale: 1.02,
                        borderColor: "#f97316",
                        boxShadow: "0 0 30px -8px rgba(249, 115, 22, 0.5)"
                      }}
                      style={{ borderColor: '#B45309' }}
                      className="flex-shrink-0 w-[260px] sm:w-[340px] bg-surface border-2 rounded-3xl p-6 group/sheet transition-colors duration-300 flex flex-col gap-4"
                    >
                      {/* Icon row */}
                      <div className="flex items-center justify-between">
                        {res.id === '7' ? (
                          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/30 group-hover/sheet:scale-110 transition-transform duration-300">
                            <span className="text-xl font-black text-primary">450</span>
                          </div>
                        ) : (
                          <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center p-2.5 border border-white/10 group-hover/sheet:border-primary/30 group-hover/sheet:bg-primary/10 group-hover/sheet:scale-110 transition-all duration-300">
                            <img
                              src={faviconUrl}
                              alt="Logo"
                              className="w-8 h-8 object-contain filter grayscale group-hover/sheet:grayscale-0 transition-all duration-300"
                            />
                          </div>
                        )}
                        <div className="opacity-0 group-hover/sheet:opacity-100 transition-opacity duration-300">
                          <Sparkles className="text-primary animate-pulse" size={18} />
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-base font-bold text-white line-clamp-2 leading-snug group-hover/sheet:text-primary transition-colors">
                        {res.title}
                      </h3>

                      {/* Meta */}
                      <div className="space-y-2 flex-grow">
                        {res.bestFor && (
                          <div className="flex items-start gap-2">
                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                            <p className="text-xs text-textMuted leading-relaxed">
                              <span className="text-white/70 font-semibold">Best for: </span>
                              {res.bestFor}
                            </p>
                          </div>
                        )}
                        {res.contentType && (
                          <div className="flex items-start gap-2">
                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#B45309] flex-shrink-0" />
                            <p className="text-xs text-textMuted leading-relaxed">
                              <span className="text-white/70 font-semibold">Type: </span>
                              {res.contentType}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* CTA button */}
                      <a
                        href={res.url}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-2xl bg-white/5 border border-white/10 hover:border-primary hover:bg-primary/15 text-white text-sm font-semibold transition-all duration-300 group/btn"
                      >
                        Visit Website <ArrowRight size={15} className="group-hover/btn:translate-x-1 transition-transform" />
                      </a>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.section>
      </div>
      </div>
    </>
  );
};

export default Resources;