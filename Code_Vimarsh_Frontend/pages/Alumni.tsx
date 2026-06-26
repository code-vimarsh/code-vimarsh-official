import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Briefcase, GraduationCap, Github, Linkedin, Globe,
  ChevronRight, Star, Code2, Brain, Server, Shield, Palette,
  Database, ArrowRight, CheckCircle, Trophy, ChevronDown, X,
} from 'lucide-react';
import { EmbersBackground } from '../components/Achievements/GlowDots';
import { useGlobalState } from '../context/GlobalContext';
import { Domain, Alum } from '../types';

const DM: Record<Domain, { icon: React.ReactNode; color: string; bg: string }> = {
  'Software Dev': { icon: <Code2 size={11} />, color: '#ff6a00', bg: 'rgba(255,106,0,0.12)' },
  'Machine Learning': { icon: <Brain size={11} />, color: '#a855f7', bg: 'rgba(168,85,247,0.12)' },
  'Backend / DevOps': { icon: <Server size={11} />, color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
  'Cybersecurity': { icon: <Shield size={11} />, color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
  'UI/UX Design': { icon: <Palette size={11} />, color: '#ec4899', bg: 'rgba(236,72,153,0.12)' },
  'Data Engineering': { icon: <Database size={11} />, color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
  'Frontend / Web': { icon: <Globe size={11} />, color: '#06b6d4', bg: 'rgba(6,182,212,0.12)' },
};

const DEFAULT_DOMAIN: Domain = 'Software Dev';

const getDomainMeta = (domain?: string) => {
  return domain && domain in DM ? DM[domain as Domain] : DM[DEFAULT_DOMAIN];
};


/* ── Roadmap Modal ───────────────────────────────────────────────────── */
const RoadmapModal: React.FC<{ alum: Alum; onClose: () => void }> = ({ alum, onClose }) => {
  const dm = getDomainMeta(alum.domain);
  const roadmap = Array.isArray(alum.roadmap) ? alum.roadmap : [];
  const achievements = Array.isArray(alum.achievements) ? alum.achievements : [];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-8"
      style={{ background: 'rgba(5,7,14,0.92)', backdropFilter: 'blur(10px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        transition={{ type: 'spring', stiffness: 280, damping: 26 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl relative"
        style={{
          background: 'linear-gradient(160deg,#0b0f19 0%,#0f1520 100%)',
          border: `1px solid ${dm.color}35`,
          boxShadow: `0 0 60px ${dm.color}20, 0 0 0 1px ${dm.color}20`,
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all"
          style={{ background: 'rgba(255,255,255,0.05)', color: '#888' }}
        >
          <X size={14} />
        </button>

        {/* Modal Header */}
        <div className="px-8 pt-8 pb-6 border-b" style={{ borderColor: `${dm.color}20` }}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: dm.color }}>
              {dm.icon} {alum.domain} Roadmap
            </span>
          </div>
          <h2 className="text-2xl font-black" style={{ color: '#f5f0e8' }}>
            {alum.name.split(' ')[0]}'s Journey to {alum.company}
          </h2>
          <p className="text-sm mt-1" style={{ color: '#6b7280' }}>{alum.role} · Class of {alum.batch} · {alum.location}</p>
        </div>

        <div className="p-8 space-y-8">
          {/* Roadmap phases — desktop horizontal */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-5" style={{ color: dm.color }}>Step-by-Step Roadmap</p>
            <div className="hidden md:grid grid-cols-4 gap-4 relative">
              {/* Connector */}
              {roadmap.length > 1 && (
                <div className="absolute top-[25px] left-[12.5%] h-[2px] pointer-events-none"
                  style={{ 
                    right: `${100 - (Math.min(roadmap.length, 4) - 0.5) * 25}%`,
                    background: `linear-gradient(90deg, ${dm.color}40, ${dm.color}80, ${dm.color}40)` 
                  }} />
              )}
              {roadmap.map((step, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div
                    className="w-12 h-12 rounded-full border-2 flex items-center justify-center z-10 mb-4 text-xs font-black"
                    style={{ borderColor: dm.color, background: '#0b0f19', color: dm.color, boxShadow: `0 0 18px ${dm.color}40` }}
                  >
                    {step.phase}
                  </div>
                  <div className="w-full rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${dm.color}18` }}>
                    <p className="text-sm font-bold text-center mb-3" style={{ color: '#f5f0e8' }}>{step.title}</p>
                    <ul className="space-y-2">
                      {step.items.map((item, j) => (
                        <li key={j} className="flex items-start gap-1.5 text-[11px] leading-snug" style={{ color: '#6b7280' }}>
                          <CheckCircle size={10} className="mt-0.5 flex-shrink-0" style={{ color: dm.color }} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
            {/* Mobile vertical */}
            <div className="md:hidden space-y-4">
              {roadmap.map((step, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full border-2 flex items-center justify-center text-[11px] font-black flex-shrink-0"
                      style={{ borderColor: dm.color, color: dm.color, background: '#0b0f19', boxShadow: `0 0 12px ${dm.color}30` }}>
                      {step.phase}
                    </div>
                    {i < roadmap.length - 1 && <div className="w-px flex-1 mt-1.5" style={{ background: `${dm.color}25` }} />}
                  </div>
                  <div className="flex-1 pb-3">
                    <p className="font-bold text-sm mb-2" style={{ color: '#f5f0e8' }}>{step.title}</p>
                    <div className="rounded-xl p-3 space-y-1.5" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${dm.color}18` }}>
                      {step.items.map((item, j) => (
                        <div key={j} className="flex items-center gap-1.5 text-[11px]" style={{ color: '#6b7280' }}>
                          <ChevronRight size={10} style={{ color: dm.color, flexShrink: 0 }} /> {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom row: advice + achievements */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-2xl p-5" style={{ background: `${dm.bg}`, border: `1px solid ${dm.color}22` }}>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: dm.color }}>💬 Advice</p>
              <p className="text-sm italic leading-relaxed" style={{ color: '#d1c9bd' }}>"{alum.advice}"</p>
            </div>
            <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${dm.color}18` }}>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: dm.color }}>🏆 Achievements</p>
              <ul className="space-y-2">
                {achievements.map((a, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs" style={{ color: '#9ca3af' }}>
                    <Star size={10} className="mt-0.5 flex-shrink-0" style={{ color: dm.color }} /> {a}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ── Horizontal Card (photo left, details right) ─────────────── */
const AlumniCard: React.FC<{ alum: Alum; side: 'left' | 'right'; onOpen: () => void }> = ({ alum, side, onOpen }) => {
  const dm = getDomainMeta(alum.domain);
  const tech = Array.isArray(alum.tech) ? alum.tech : [];
  const isLeft = side === 'left';

  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      /* Zigzag: left cards push left margin, right cards push right margin */
      className={`flex rounded-2xl overflow-hidden group transition-all duration-300 w-full md:w-[60%] ${isLeft ? 'mr-auto' : 'ml-auto'
        }`}
      style={{
        zIndex: 10,
        minHeight: '140px',
        background: 'rgba(11,15,25,0.85)',
        border: `1px solid rgba(255,255,255,0.07)`,
        backdropFilter: 'blur(12px)',
      }}
      whileHover={{
        borderColor: `${dm.color}55`,
        boxShadow: `0 0 32px ${dm.color}20, 0 8px 40px rgba(0,0,0,0.5)`,
      }}
    >
      {/* ── Photo panel (left side of card) ── */}
      <div
        className="relative flex-shrink-0 flex flex-col items-center justify-center"
        style={{
          width: '120px',
          background: `radial-gradient(circle at 50% 40%, ${dm.color}22 0%, rgba(11,15,25,0.9) 70%)`,
          borderRight: `1px solid rgba(255,255,255,0.06)`,
        }}
      >
        {alum.photo ? (
          <div className="w-full h-full overflow-hidden flex items-start justify-center">
            <img
              src={alum.photo}
              alt={alum.name}
              className="w-full h-full object-cover object-top scale-100 group-hover:scale-110 transition-transform duration-500"
              style={{ minHeight: '140px' }}
            />
          </div>
        ) : (
          <div
            className="w-[68px] h-[68px] rounded-2xl flex items-center justify-center text-xl font-black select-none"
            style={{
              background: `radial-gradient(135deg, ${dm.color}30, ${dm.bg})`,
              border: `2px solid ${dm.color}55`,
              color: dm.color,
              boxShadow: `0 0 24px ${dm.color}35`,
              fontFamily: 'Arial, sans-serif',
            }}
          >
            {alum.initials}
          </div>
        )}
        <span className="absolute bottom-2 text-[9px] font-mono" style={{ color: 'rgba(255,255,255,0.25)' }}>
          {alum.batch}
        </span>
      </div>

      {/* ── Details panel (right side of card) ── */}
      <div className="flex-1 px-5 py-4 flex flex-col justify-between min-w-0">
        <div>
          {/* Top row: name + domain badge */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-black text-base leading-tight" style={{ color: '#f5f0e8' }}>{alum.name}</h3>
              <p className="text-[13px] font-bold mt-0.5" style={{ color: dm.color }}>{alum.role}</p>
            </div>
            <span
              className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold flex-shrink-0 border"
              style={{ background: dm.bg, color: dm.color, borderColor: `${dm.color}35` }}
            >
              {dm.icon} {alum.domain}
            </span>
          </div>
          {/* Company + location */}
          <div className="flex items-center gap-4 mt-1.5 flex-wrap" style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px' }}>
            <span className="flex items-center gap-1"><Briefcase size={9} />{alum.company}</span>
            <span className="flex items-center gap-1"><MapPin size={9} />{alum.location}</span>
          </div>
        </div>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {tech.slice(0, 4).map(t => (
            <span
              key={t}
              className="text-[10px] px-2 py-0.5 rounded-md border"
              style={{ borderColor: `${dm.color}25`, background: `${dm.color}08`, color: 'rgba(255,255,255,0.4)' }}
            >{t}</span>
          ))}
          {tech.length > 4 && (
            <span className="text-[10px] px-2 py-0.5 rounded-md border" style={{ borderColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.2)' }}>
              +{tech.length - 4}
            </span>
          )}
        </div>

        {/* Bottom: social + CTA */}
        <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex gap-3">
            {alum.linkedin && (
              <a href={alum.linkedin} onClick={e => e.stopPropagation()} target="_blank" rel="noreferrer"
                style={{ color: 'rgba(255,255,255,0.2)' }} className="hover:text-white transition-colors"><Linkedin size={13} /></a>
            )}
            {alum.github && (
              <a href={alum.github} onClick={e => e.stopPropagation()} target="_blank" rel="noreferrer"
                style={{ color: 'rgba(255,255,255,0.2)' }} className="hover:text-white transition-colors"><Github size={13} /></a>
            )}
            {alum.website && (
              <a href={alum.website} onClick={e => e.stopPropagation()} target="_blank" rel="noreferrer"
                style={{ color: 'rgba(255,255,255,0.2)' }} className="hover:text-white transition-colors"><Globe size={13} /></a>
            )}
          </div>
          <button
            onClick={onOpen}
            className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer"
            style={{ background: dm.bg, color: dm.color, border: `1px solid ${dm.color}30` }}
          >
            View Roadmap <ArrowRight size={11} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

/* ── Main Page ───────────────────────────────────────────────── */
const Alumni: React.FC = () => {
  const { alumni } = useGlobalState();
  const [modalAlum, setModalAlum] = useState<Alum | null>(null);
  const alumniList = Array.isArray(alumni) ? [...alumni].reverse() : [];

  return (
    <>
      {/* ── Full-viewport fixed background — bypasses Layout pt-24 / max-w-7xl ── */}
      <div style={{ position: 'fixed', inset: 0, zIndex: -2, pointerEvents: 'none', overflow: 'hidden' }}>
        {/* Castle background */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url('/assets/castle-bg.jpeg')`,
          backgroundSize: 'cover', backgroundPosition: 'center top',
        }} />
        {/* Dark overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg,rgba(11,15,25,0.82) 0%,rgba(11,15,25,0.70) 45%,rgba(11,15,25,0.92) 100%)',
        }} />
        {/* Embers fill the full viewport */}
        <EmbersBackground />
      </div>

      {/* Achievement-matched full-bleed section */}
      <div
        style={{
          position: 'relative',
          width: '100vw',
          left: '50%',
          right: '50%',
          marginLeft: '-50vw',
          marginRight: '-50vw',
          paddingBottom: '80px',
        }}
      >

        {/* ── Hero header ── */}
        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', paddingTop: '80px', paddingBottom: '52px' }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div
              className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border text-[11px] font-bold uppercase tracking-widest"
              style={{ background: 'rgba(249,115,22,0.08)', borderColor: 'rgba(249,115,22,0.3)', color: '#f97316' }}
            >
              <GraduationCap size={11} /> Alumni Network · Code Vimarsh
            </div>
            <h1 className="heading-primary" style={{ fontSize: 'clamp(2rem,4.5vw,3.2rem)', margin: '0 0 12px', lineHeight: 1.2 }}>
              Where CVians Build{' '}
              <span className="heading-accent-glow">the Future</span>
            </h1>
            <p className="section-subtitle" style={{ marginTop: 0 }}>
              Real alumni · Real companies · Real domain roadmaps
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-10 mt-8 flex-wrap">
              {[['6+', 'Alumni'], ['6+', 'Companies'], ['6', 'Domains'], ['3+', 'Countries']].map(([v, l]) => (
                <div key={l} className="text-center">
                  <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#f5f0e8', lineHeight: 1 }}>{v}</div>
                  <div style={{ fontSize: '9px', color: '#6a5a4a', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: '4px' }}>{l}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Zigzag Cards ── */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            maxWidth: '900px',
            margin: '0 auto',
            padding: '0 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '28px',
          }}
        >
          {/* Vertical center line */}
          <div className="hidden md:block" style={{
            position: 'absolute',
            top: 0, bottom: 0,
            left: '50%',
            width: '1px',
            background: 'linear-gradient(180deg, transparent, rgba(249,115,22,0.25) 20%, rgba(249,115,22,0.25) 80%, transparent)',
            transform: 'translateX(-50%)',
            pointerEvents: 'none',
            zIndex: 0,
          }} />

          {alumniList.map((alum, i) => {
            const side: 'left' | 'right' = i % 2 === 0 ? 'left' : 'right';
            return (
              <div key={alum.id} className="relative">
                {/* Center dot */}
                <div className="hidden md:block" style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%,-50%)',
                  width: '10px', height: '10px',
                  borderRadius: '50%',
                  background: '#f97316',
                  border: '2px solid #0b0f19',
                  boxShadow: '0 0 12px rgba(249,115,22,0.7)',
                  zIndex: 0,
                }} />
                <AlumniCard alum={alum} side={side} onOpen={() => setModalAlum(alum)} />
              </div>
            );
          })}
        </div>

        {/* Bottom note */}
        <p style={{
          position: 'relative', zIndex: 10, textAlign: 'center', marginTop: '52px',
          fontSize: '11px', color: '#6a5a4a', fontFamily: 'JetBrains Mono, monospace',
          letterSpacing: '0.14em',
        }}>
          Click "View Roadmap" to explore their full domain path
        </p>
      </div>

      {/* ── Roadmap Modal ── */}
      <AnimatePresence>
        {modalAlum && <RoadmapModal alum={modalAlum} onClose={() => setModalAlum(null)} />}
      </AnimatePresence>
    </>
  );
};

export default Alumni;