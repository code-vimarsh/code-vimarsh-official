import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Code, Trophy, Users, Activity, Layers, Star } from 'lucide-react';
import Scene3D from '../components/Scene3D';
import { Link } from 'react-router-dom';

const statsData = [
  { label: 'Active Members', value: '500+', icon: Users, color: 'from-orange-500 to-amber-400' },
  { label: 'Projects Built', value: '50+', icon: Layers, color: 'from-orange-400 to-yellow-500' },
  { label: 'Tech Workshops', value: '120+', icon: Activity, color: 'from-amber-500 to-orange-600' },
  { label: 'Prize Achievements', value: '10L+', icon: Trophy, color: 'from-yellow-400 to-orange-500' },
];

const featuresData = [
  {
    icon: Code,
    title: 'Learn by Doing',
    desc: 'Stop watching tutorials. Start building actual software in our guided project cohorts.',
    badge: '01',
  },
  {
    icon: Users,
    title: 'Compete & Collaborate',
    desc: 'Join hackathon teams, participate in competitive programming, and grow together.',
    badge: '02',
  },
  {
    icon: Trophy,
    title: 'Career Focused',
    desc: 'Direct alumni mentorship, resume reviews, and interview prep for top product companies.',
    badge: '03',
  },
];

const Home: React.FC = () => {
  return (
    <div className="flex flex-col space-y-28 py-10">

      {/* Hero Section */}
      <section className="min-h-[70vh] flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-6">

        {/* ── Left: Text Content ── */}
        <div className="flex-1 min-w-0 space-y-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-block px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-mono mb-4"
          >
            v2.0.26_STABLE_RELEASE
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="heading-primary text-5xl md:text-7xl leading-tight"
          >
            Think.<br />
            <span className="heading-accent">Code.</span><br />
            Innovate.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-textMuted max-w-md"
          >
            The official, elite coding ecosystem of MSU Baroda. Build real projects, collaborate with top talent, and accelerate your tech career.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-4"
          >
            <Link
              to="/dashboard"
              className="bg-primary hover:bg-secondary text-black font-semibold px-6 py-3 rounded-lg transition-all flex items-center group shadow-[0_0_20px_rgba(255,106,0,0.35)] hover:shadow-[0_0_35px_rgba(255,106,0,0.55)]"
            >
              Start Your Journey
              <ChevronRight size={18} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/events" className="bg-surface border border-surfaceLight hover:border-primary/50 text-white font-semibold px-6 py-3 rounded-lg transition-all">
              Explore Events
            </Link>
          </motion.div>

          {/* Terminal Snippet */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 bg-[#0d0d0d] border border-surfaceLight rounded-md p-4 font-mono text-sm max-w-md shadow-lg"
          >
            <div className="flex space-x-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <p className="text-textMuted">$ git clone <span className="text-accentBlue">https://code-vimarsh.msu</span></p>
            <p className="text-textMuted">$ cd <span className="text-accentBlue">code-vimarsh</span></p>
            <p className="text-textMuted">$ npm run <span className="text-primary">innovate</span></p>
            <p className="text-accentGreen mt-2">Success! Welcome to Code Vimarsh.</p>
          </motion.div>
        </div>

        {/* ── Right: 3D Animation ── shifted to right with translate, glow local to container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="relative flex-shrink-0 flex items-center justify-center pointer-events-none z-0 lg:translate-x-8 xl:translate-x-14"
          style={{ willChange: 'transform, opacity' }}
        >
          {/* Layered orange glow spread — positioned at exact center of container */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-primary/20 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 bg-orange-400/30 rounded-full blur-[40px] pointer-events-none" />

          {/* Scene container — sized so the wireframe sphere fills ~65% of the canvas for a bold, premium look */}
          <div
            className="w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] md:w-[460px] md:h-[460px] lg:w-[520px] lg:h-[520px]"
            style={{ willChange: 'transform' }}
          >
            <Scene3D />
          </div>
        </motion.div>

      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {statsData.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.03, y: -4 }}
              className="relative bg-surface border border-surfaceLight rounded-2xl p-6 text-center overflow-hidden group cursor-default transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_30px_rgba(255,106,0,0.12)]"
            >
              {/* Background glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
              {/* Icon */}
              <div className="mx-auto mb-3 w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,106,0,0.1)' }}>
                <Icon size={18} className="text-primary" />
              </div>
              {/* Value */}
              <h3 className={`text-3xl md:text-4xl font-display font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1`}>
                {stat.value}
              </h3>
              <p className="text-textMuted text-xs font-medium uppercase tracking-widest">{stat.label}</p>
              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary group-hover:w-2/3 transition-all duration-500 rounded-full" />
            </motion.div>
          );
        })}
      </section>

      {/* Features Section */}
      <section className="space-y-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto space-y-4"
        >
          <span className="inline-block px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-mono mb-2">
            Why Us
          </span>
          <h2 className="heading-primary text-4xl">
            Why Join The{' '}
            <span className="heading-accent">Ecosystem?</span>
          </h2>
          <p className="text-textMuted text-base leading-relaxed">
            We provide the infrastructure and community you need to scale your skills from basic syntax to production-ready architecture.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {featuresData.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                whileHover={{ y: -6 }}
                className="relative bg-bgDark border border-surfaceLight rounded-2xl p-8 overflow-hidden group transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_40px_rgba(255,106,0,0.1)]"
              >
                {/* Top accent bar */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                {/* Corner glow */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-[60px] group-hover:bg-primary/10 transition-colors duration-500" />
                {/* Badge number */}
                <div className="absolute top-5 right-6 text-5xl font-display font-black select-none" style={{ color: 'rgba(255,255,255,0.04)' }}>
                  {feature.badge}
                </div>
                {/* Icon */}
                <div className="relative text-primary mb-6 bg-primary/10 w-14 h-14 rounded-xl flex items-center justify-center group-hover:bg-primary/20 group-hover:shadow-[0_0_20px_rgba(255,106,0,0.2)] transition-all duration-300">
                  <Icon size={26} />
                </div>
                {/* Content */}
                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-textMuted text-sm leading-relaxed">{feature.desc}</p>
                {/* Bottom CTA hint */}
                <div className="flex items-center gap-1 mt-6 text-xs transition-all duration-300 opacity-0 group-hover:opacity-70" style={{ color: 'rgb(255,106,0)' }}>
                  <Star size={11} />
                  <span className="font-medium">Learn more</span>
                  <ChevronRight size={11} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

    </div>
  );
};

export default Home;