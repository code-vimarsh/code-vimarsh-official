import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Briefcase, GraduationCap, Github, Linkedin, Globe,
  ChevronRight, Star, Code2, Brain, Server, Shield, Palette,
  Database, ArrowRight, CheckCircle, Trophy, ChevronDown, X,
} from 'lucide-react';
import { EmbersBackground } from '../components/Achievements/GlowDots';

/* ── Domain meta ─────────────────────────────────────────────── */
type Domain = 'Software Dev' | 'Machine Learning' | 'Backend / DevOps' | 'Cybersecurity' | 'UI/UX Design' | 'Data Engineering';

const DM: Record<Domain, { icon: React.ReactNode; color: string; bg: string }> = {
  'Software Dev': { icon: <Code2 size={11} />, color: '#ff6a00', bg: 'rgba(255,106,0,0.12)' },
  'Machine Learning': { icon: <Brain size={11} />, color: '#a855f7', bg: 'rgba(168,85,247,0.12)' },
  'Backend / DevOps': { icon: <Server size={11} />, color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
  'Cybersecurity': { icon: <Shield size={11} />, color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
  'UI/UX Design': { icon: <Palette size={11} />, color: '#ec4899', bg: 'rgba(236,72,153,0.12)' },
  'Data Engineering': { icon: <Database size={11} />, color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
};

interface Alum {
  id: string; name: string; initials: string; photo?: string;
  role: string; company: string; batch: string; location: string; domain: Domain;
  bio: string; advice: string; tech: string[];
  linkedin?: string; github?: string; website?: string;
  achievements: string[];
  roadmap: { phase: string; title: string; items: string[] }[];
}

const ALUMNI: Alum[] = [
  {
    id: '1', name: 'Rohan Mehta', initials: 'RM',
    role: 'SDE II', company: 'Google', batch: '2021', location: 'Bengaluru, India', domain: 'Software Dev',
    bio: 'Systems engineer focused on distributed computing and large-scale infra at Google.',
    advice: 'CS fundamentals never go out of style. Own your 20% time projects.',
    tech: ['C++', 'Go', 'Kubernetes', 'gRPC', 'Spanner'],
    linkedin: '#', github: '#',
    achievements: ['Contributed to Google Spanner', 'ICPC Regional Finalist', 'Open-source maintainer'],
    roadmap: [
      { phase: '01', title: 'CS Fundamentals', items: ['DSA – Arrays to Graphs', 'OS & Processes', 'DBMS internals', 'Computer Networks'] },
      { phase: '02', title: 'Systems & Languages', items: ['C++ / Go deep dive', 'Concurrency patterns', 'Memory management', 'Compiler basics'] },
      { phase: '03', title: 'Distributed Systems', items: ['CAP theorem & Raft', 'gRPC / Protobuf', 'Kubernetes', 'Database internals'] },
      { phase: '04', title: 'Career Prep', items: ['Startup internships', 'Competitive programming', 'System design mocks', 'FAANG interviews'] },
    ],
  },
  {
    id: '2', name: 'Sneha Rao', initials: 'SR',
    role: 'Frontend Engineer', company: 'Vercel', batch: '2022', location: 'Remote, India', domain: 'Software Dev',
    bio: 'Obsessed with web performance, DX and building the future of the web at Vercel.',
    advice: "Ship early, iterate fast. Your first project will be bad — that's the point.",
    tech: ['React', 'Next.js', 'TypeScript', 'Rust/WASM', 'Turbo'],
    linkedin: '#', github: '#',
    achievements: ['Core Vercel OG contributor', 'Speaker at React India 2023', 'Tools used by 10k+ devs'],
    roadmap: [
      { phase: '01', title: 'Web Basics', items: ['HTML5 semantics', 'CSS Flexbox & Grid', 'Vanilla JS ES6+', 'Browser DevTools'] },
      { phase: '02', title: 'React Ecosystem', items: ['React hooks & patterns', 'State management', 'TypeScript', 'Testing (Vitest)'] },
      { phase: '03', title: 'Performance', items: ['Next.js SSR / ISR', 'Core Web Vitals', 'Bundle optimization', 'Edge computing'] },
      { phase: '04', title: 'Ship It', items: ['Personal portfolio', 'Open-source PRs', 'Technical writing', 'Build a devtool'] },
    ],
  },
  {
    id: '3', name: 'Karan Singh', initials: 'KS',
    role: 'Backend Lead', company: 'Stripe', batch: '2020', location: 'San Francisco, US', domain: 'Backend / DevOps',
    bio: 'Payments infra engineer. If it moves money at scale, he builds it.',
    advice: 'Learn SQL deeply before touching NoSQL. DBs are the heart of every system.',
    tech: ['Ruby', 'PostgreSQL', 'Redis', 'Kafka', 'Terraform'],
    linkedin: '#', github: '#',
    achievements: ['Scaled Stripe billing 100×', 'Built idempotency layer', 'AWS Solutions Architect'],
    roadmap: [
      { phase: '01', title: 'Backend Basics', items: ['REST APIs (Express/FastAPI)', 'SQL mastery', 'Auth (JWT/OAuth)', 'Docker basics'] },
      { phase: '02', title: 'Data & Messaging', items: ['PostgreSQL internals', 'Redis caching', 'Kafka / RabbitMQ', 'Linux & shell'] },
      { phase: '03', title: 'Cloud & DevOps', items: ['AWS / GCP essentials', 'Terraform IaC', 'CI/CD pipelines', 'OpenTelemetry'] },
      { phase: '04', title: 'Scale', items: ['Distributed transactions', 'Rate limiting', 'Service mesh (Istio)', 'Production on-call'] },
    ],
  },
  {
    id: '4', name: 'Aisha Khan', initials: 'AK',
    role: 'ML Research Engineer', company: 'OpenAI', batch: '2021', location: 'Seattle, US', domain: 'Machine Learning',
    bio: 'Researching emergent behaviours in LLMs. Believes math is the most beautiful language.',
    advice: 'Reproduce 3 papers from scratch before writing your own.',
    tech: ['Python', 'PyTorch', 'CUDA', 'JAX', 'Triton'],
    linkedin: '#', github: '#',
    achievements: ['Co-author on GPT-4 tech report', 'NeurIPS 2023 nominee', 'Kaggle Grandmaster'],
    roadmap: [
      { phase: '01', title: 'Math Foundation', items: ['Linear Algebra (3B1B)', 'Probability & Stats', 'Calculus & backprop', 'Optimization'] },
      { phase: '02', title: 'ML Core', items: ['Classical ML (sklearn)', 'Neural nets from scratch', 'CNNs, RNNs, LSTMs', 'Transformers'] },
      { phase: '03', title: 'Deep Learning', items: ['PyTorch internals', 'CUDA programming', 'Distributed training', 'Fine-tuning (LoRA)'] },
      { phase: '04', title: 'Research Track', items: ['Read 1 paper / week', 'Reproduce SOTA', 'Kaggle competitions', 'Publish / contribute'] },
    ],
  },
  {
    id: '5', name: 'Dev Patel', initials: 'DP',
    role: 'Security Engineer', company: 'CrowdStrike', batch: '2022', location: 'Hyderabad, India', domain: 'Cybersecurity',
    bio: 'Offensive security enthusiast turned defender. Breaks things responsibly for a living.',
    advice: "Set up a home lab. Reading theory alone won't cut it.",
    tech: ['Python', 'C', 'Burp Suite', 'Metasploit', 'Wireshark'],
    linkedin: '#',
    achievements: ['3 CVE discoveries (critical)', 'CTF Top 100 globally', 'Bug bounty $40k+ earned'],
    roadmap: [
      { phase: '01', title: 'Foundations', items: ['Networking (TCP/IP, TLS)', 'Linux internals', 'Python scripting', 'Cryptography basics'] },
      { phase: '02', title: 'Offensive', items: ['Web pentesting (OWASP)', 'Buffer overflows', 'HackTheBox / CTFs', 'Burp Suite'] },
      { phase: '03', title: 'Defensive', items: ['SIEM & log analysis', 'Threat hunting', 'Malware analysis', 'Incident response'] },
      { phase: '04', title: 'Career', items: ['OSCP certification', 'Bug bounty programs', 'CVE research', 'Red team internships'] },
    ],
  },
  {
    id: '6', name: 'Priya Nair', initials: 'PN',
    role: 'Product Designer', company: 'Figma', batch: '2022', location: 'San Francisco, US', domain: 'UI/UX Design',
    bio: 'Designs the tools that designers use. Obsessed with micro-interactions and accessibility.',
    advice: 'Understand user psychology before opening Figma. Design is problem solving.',
    tech: ['Figma', 'React', 'Framer', 'Principle', 'Lottie'],
    linkedin: '#', website: '#',
    achievements: ['Redesigned Figma AutoLayout', 'Speaker at Config 2024', 'WCAG 2.2 advocate'],
    roadmap: [
      { phase: '01', title: 'Design Basics', items: ['Typography & colour theory', 'Gestalt principles', 'Figma mastery', 'Design systems'] },
      { phase: '02', title: 'UX Research', items: ['User interviews', 'Usability testing', 'Information architecture', 'Journey mapping'] },
      { phase: '03', title: 'Interaction', items: ['Motion design (Framer)', 'Micro-animations', 'Prototyping', 'Accessibility (WCAG)'] },
      { phase: '04', title: 'Portfolio', items: ['3 case studies', 'Design system on GitHub', 'Dribbble / Behance', 'OSS contributions'] },
    ],
  },
];

/* ── Roadmap Modal ───────────────────────────────────────────────────── */
const RoadmapModal: React.FC<{ alum: Alum; onClose: () => void }> = ({ alum, onClose }) => {
  const dm = DM[alum.domain];
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
              <div className="absolute top-[25px] left-[12.5%] right-[12.5%] h-[2px] pointer-events-none"
                style={{ background: `linear-gradient(90deg, ${dm.color}40, ${dm.color}80, ${dm.color}40)` }} />
              {alum.roadmap.map((step, i) => (
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
              {alum.roadmap.map((step, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full border-2 flex items-center justify-center text-[11px] font-black flex-shrink-0"
                      style={{ borderColor: dm.color, color: dm.color, background: '#0b0f19', boxShadow: `0 0 12px ${dm.color}30` }}>
                      {step.phase}
                    </div>
                    {i < alum.roadmap.length - 1 && <div className="w-px flex-1 mt-1.5" style={{ background: `${dm.color}25` }} />}
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
                {alum.achievements.map((a, i) => (
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
  const dm = DM[alum.domain];
  const isLeft = side === 'left';

  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      /* Zigzag: left cards push left margin, right cards push right margin */
      className={`flex cursor-pointer rounded-2xl overflow-hidden group transition-all duration-300 ${isLeft ? 'mr-auto' : 'ml-auto'
        }`}
      style={{
        width: '68%',
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
          <img src={alum.photo} alt={alum.name} className="w-full h-full object-cover" />
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
          {alum.tech.slice(0, 4).map(t => (
            <span
              key={t}
              className="text-[10px] px-2 py-0.5 rounded-md border"
              style={{ borderColor: `${dm.color}25`, background: `${dm.color}08`, color: 'rgba(255,255,255,0.4)' }}
            >{t}</span>
          ))}
          {alum.tech.length > 4 && (
            <span className="text-[10px] px-2 py-0.5 rounded-md border" style={{ borderColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.2)' }}>
              +{alum.tech.length - 4}
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
            className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-all"
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
  const [modalAlum, setModalAlum] = useState<Alum | null>(null);

  return (
    <>
      {/* Achievement-matched full-bleed section */}
      <div
        style={{
          position: 'relative',
          width: '100vw',
          left: '50%',
          right: '50%',
          marginLeft: '-50vw',
          marginRight: '-50vw',
          backgroundColor: '#0b0f19',
          overflow: 'hidden',
          paddingBottom: '80px',
        }}
      >
        {/* Castle background */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: `url('/assets/castle-bg.jpeg')`,
          backgroundSize: 'cover', backgroundPosition: 'center top',
        }} />
        {/* Dark overlay */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          background: 'linear-gradient(180deg,rgba(11,15,25,0.82) 0%,rgba(11,15,25,0.70) 45%,rgba(11,15,25,0.92) 100%)',
        }} />

        {/* Embers */}
        <EmbersBackground />

        {/* ── Hero header ── */}
        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', paddingTop: '80px', paddingBottom: '52px' }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div
              className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border text-[11px] font-bold uppercase tracking-widest"
              style={{ background: 'rgba(249,115,22,0.08)', borderColor: 'rgba(249,115,22,0.3)', color: '#f97316' }}
            >
              <GraduationCap size={11} /> Alumni Network · Code Vimarsh
            </div>
            <h1 style={{
              fontFamily: 'Cinzel Decorative,Cinzel,serif',
              fontWeight: 900,
              fontSize: 'clamp(2rem,4.5vw,3.2rem)',
              color: '#f5f0e8',
              margin: '0 0 12px',
              letterSpacing: '0.04em',
              lineHeight: 1.2,
            }}>
              Where CVians Build{' '}
              <span style={{ color: '#f97316', textShadow: '0 0 40px rgba(249,115,22,0.55)' }}>the Future</span>
            </h1>
            <p style={{ color: '#6a5a4a', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
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
          <div style={{
            position: 'absolute',
            top: 0, bottom: 0,
            left: '50%',
            width: '1px',
            background: 'linear-gradient(180deg, transparent, rgba(249,115,22,0.25) 20%, rgba(249,115,22,0.25) 80%, transparent)',
            transform: 'translateX(-50%)',
            pointerEvents: 'none',
          }} />

          {ALUMNI.map((alum, i) => {
            const side: 'left' | 'right' = i % 2 === 0 ? 'left' : 'right';
            return (
              <div key={alum.id} className="relative">
                {/* Center dot */}
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%,-50%)',
                  width: '10px', height: '10px',
                  borderRadius: '50%',
                  background: '#f97316',
                  border: '2px solid #0b0f19',
                  boxShadow: '0 0 12px rgba(249,115,22,0.7)',
                  zIndex: 20,
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