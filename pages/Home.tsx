import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Code, Trophy, Users } from 'lucide-react';
import Scene3D from '../components/Scene3D';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col space-y-32 py-10">
      
      {/* Hero Section */}
      <section className="min-h-[70vh] flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="flex-1 space-y-8 z-10">
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
            className="text-5xl md:text-7xl font-display font-bold leading-tight"
          >
            Think.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Code.</span><br/>
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
            <Link to="/dashboard" className="bg-primary hover:bg-secondary text-black font-semibold px-6 py-3 rounded-lg transition-all flex items-center group">
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

        {/* 3D Visual */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="flex-1 w-full h-full relative flex items-center justify-center"
        >
          {/* Subtle glow behind 3D object */}
          <div className="absolute w-64 h-64 bg-primary/20 rounded-full blur-[100px]"></div>
          <Scene3D />
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
        {[
          { label: 'Active Members', value: '500+' },
          { label: 'Projects Built', value: '50+' },
          { label: 'Tech Workshops', value: '120+' },
          { label: 'Prize Achievements', value: '10L+' }
        ].map((stat, i) => (
          <div key={i} className="bg-surface border border-surfaceLight rounded-xl p-6 text-center hover:border-primary/30 transition-colors">
            <h3 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">{stat.value}</h3>
            <p className="text-textMuted text-sm font-medium">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* Features */}
      <section className="space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl font-display font-bold">Why Join The Ecosystem?</h2>
          <p className="text-textMuted">We provide the infrastructure and community you need to scale your skills from basic syntax to production-ready architecture.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: <Code size={24}/>, title: 'Learn by Doing', desc: 'Stop watching tutorials. Start building actual software in our guided project cohorts.' },
            { icon: <Users size={24}/>, title: 'Compete & Collaborate', desc: 'Join hackathon teams, participate in competitive programming, and grow together.' },
            { icon: <Trophy size={24}/>, title: 'Career Focused', desc: 'Direct alumni mentorship, resume reviews, and interview prep for top product companies.' }
          ].map((feature, i) => (
            <div key={i} className="bg-bgDark border border-surfaceLight p-8 rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[50px] group-hover:bg-primary/10 transition-colors"></div>
              <div className="text-primary mb-6 bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-textMuted text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Home;