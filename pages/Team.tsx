import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, Crown, Code2, Palette, Settings } from 'lucide-react';
import { EmbersBackground } from '../components/Achievements/GlowDots';
import { useGlobalState } from '../context/GlobalContext';
import type { TeamMember } from '../types';


const SECTIONS = [
  {
    sectionKey: 'Team Leads' as const,
    number: '01',
    title: 'Team Leads',
    description: 'President, Vice President, Secretary, and department heads who define direction, culture, and momentum for Code Vimarsh.',
    icon: Crown,
  },
  {
    sectionKey: 'Web Team' as const,
    number: '02',
    title: 'Web Team',
    description: 'Engineers who build and maintain the digital infrastructure â€” front-end, back-end, and everything in between.',
    icon: Code2,
  },
  {
    sectionKey: 'Management' as const,
    number: '03',
    title: 'Management',
    description: 'The operational backbone that keeps events, communications, and community engagement running seamlessly.',
    icon: Settings,
  },
  {
    sectionKey: 'Design Team' as const,
    number: '04',
    title: 'Design Team',
    description: 'Visual storytellers who craft the aesthetic identity â€” from brand and graphics to motion and photography.',
    icon: Palette,
  },
];

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// MEMBER CARD
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const MemberCard: React.FC<{ member: TeamMember; index: number }> = ({ member, index }) => {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const initials = member.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        borderRadius: 16,
        overflow: 'hidden',
        cursor: 'default',
        position: 'relative',
        background: 'linear-gradient(160deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
        border: hovered ? '1.5px solid rgba(249,115,22, 0.9)' : '1px solid rgba(249,115,22, 0.45)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: hovered
          ? '0 0 50px -5px rgba(249,115,22, 0.6), 0 15px 40px -10px rgba(0,0,0,0.8)'
          : '0 0 25px -10px rgba(249,115,22, 0.35), 0 8px 30px -15px rgba(0,0,0,0.6)',
        transform: hovered ? 'translateY(-10px) scale(1.02)' : 'translateY(0) scale(1)',
        transition: 'all 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        scrollSnapAlign: 'start',
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: 230, overflow: 'hidden' }}>
        {!imgError ? (
          <img
            src={member.image}
            alt={member.name}
            onError={() => setImgError(true)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 25%',
              transition: 'transform 0.45s ease, filter 0.35s ease',
              transform: hovered ? 'scale(1.07)' : 'scale(1)',
              filter: hovered ? 'brightness(1.08) saturate(1.1)' : 'brightness(0.82) grayscale(10%)',
            }}
          />
        ) : (
          <div
            style={{
              width: '100%', height: '100%',
              background: 'linear-gradient(145deg, #1c0e00, #101010)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <span style={{ fontFamily: 'Inter,sans-serif', fontWeight: 900, fontSize: '2.2rem', color: '#f97316' }}>
              {initials}
            </span>
          </div>
        )}

        {/* Bottom gradient */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%', background: 'linear-gradient(0deg,rgba(8,6,4,0.96) 0%,transparent 100%)' }} />

        {/* Social icons overlay */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0,0,0,0.38)',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'flex-end',
                padding: 12,
                gap: 8,
              }}
            >
              {member.linkedin && (
                <motion.a
                  href={member.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  onClick={e => e.stopPropagation()}
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.05 }}
                  whileHover={{ scale: 1.12 }}
                  style={{
                    width: 34, height: 34,
                    borderRadius: '50%',
                    background: 'rgba(10,102,194,0.92)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 2px 12px rgba(10,102,194,0.4)',
                    textDecoration: 'none',
                  }}
                >
                  <Linkedin size={16} color="#fff" />
                </motion.a>
              )}
              {member.github && (
                <motion.a
                  href={member.github}
                  target="_blank"
                  rel="noreferrer"
                  onClick={e => e.stopPropagation()}
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  whileHover={{ scale: 1.12 }}
                  style={{
                    width: 34, height: 34,
                    borderRadius: '50%',
                    background: 'rgba(22,22,22,0.95)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.5)',
                    textDecoration: 'none',
                  }}
                >
                  <Github size={16} color="#fff" />
                </motion.a>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Info */}
      <div style={{ padding: '13px 14px 15px' }}>
        <div
          style={{
            height: 2,
            width: hovered ? '100%' : 24,
            background: 'linear-gradient(90deg,#f97316,#fb923c)',
            borderRadius: 2,
            marginBottom: 9,
            transition: 'width 0.32s ease',
          }}
        />
        <div style={{ fontFamily: 'Inter,sans-serif', fontWeight: 700, fontSize: '0.88rem', color: '#f0ece6', letterSpacing: '-0.01em', lineHeight: 1.3 }}>
          {member.name}
        </div>
        <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.6rem', color: '#f97316', marginTop: 4, letterSpacing: '0.03em', opacity: 0.85 }}>
          {member.role}
        </div>
      </div>
    </motion.div>
  );
};

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// TEAM SECTION â€” cinematic: left info | right wrapping grid
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const TeamSection: React.FC<{ section: typeof SECTIONS[number]; sectionIndex: number; members: TeamMember[] }> = ({ section, sectionIndex, members }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const Icon = section.icon;
  const isEven = sectionIndex % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.55 }}
      style={{
        position: 'relative',
        paddingTop: 72,
        paddingBottom: 72,
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        overflow: 'hidden',
      }}
    >

      {/* Layout: left sidebar | right grid */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'grid',
          gridTemplateColumns: 'minmax(200px,260px) 1fr',
          gap: 48,
          alignItems: 'start',
        }}
      >
        {/* LEFT */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{ paddingTop: 6 }}
        >
          <div
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              padding: '4px 12px 4px 10px', borderRadius: 999,
              background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.18)',
              marginBottom: 18,
            }}
          >
            <Icon size={12} color="#f97316" />
            <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.6rem', letterSpacing: '0.18em', color: '#f97316', textTransform: 'uppercase' }}>
              {section.number}
            </span>
          </div>

          <h2
            className="heading-primary"
            style={{ fontSize: 'clamp(1.4rem,3vw,2rem)', margin: '0 0 12px', lineHeight: 1.15 }}
          >
            {section.title}
          </h2>

          <p style={{ fontFamily: 'Inter,sans-serif', fontSize: '0.82rem', color: 'rgba(255,255,255,0.35)', lineHeight: 1.7, margin: '0 0 24px' }}>
            {section.description}
          </p>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#f97316', boxShadow: '0 0 8px rgba(249,115,22,0.7)' }} />
            <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.62rem', color: 'rgba(255,255,255,0.28)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              {members.length} Member{members.length !== 1 ? 's' : ''}
            </span>
          </div>
        </motion.div>

        {/* RIGHT â€” all members, wrapping grid */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.18 }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
              gap: 14,
            }}
          >
            {inView && members.map((m, i) => (
              <MemberCard key={m.name} member={m} index={i} />
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// BACKGROUND â€” subtle, non-intrusive
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const PageBackground: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const [bgLoaded, setBgLoaded] = useState(false);

  useEffect(() => {
    const fn = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', fn, { passive: true });

    // Robust preloader
    const img = new Image();
    img.src = '/assets/team-bg.png';
    if (img.complete) {
      setBgLoaded(true);
    } else {
      img.onload = () => setBgLoaded(true);
    }

    return () => window.removeEventListener('mousemove', fn);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        backgroundColor: '#0b0f19',
      }}
    >
      {/* Generated professional tech background image */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        backgroundImage: `url('/assets/team-bg.png')`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        opacity: bgLoaded ? 0.5 : 0,
        transition: 'opacity 1.2s ease-in-out'
      }} />

      {/* Dark gradient overlay to blend */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        background: 'linear-gradient(180deg,rgba(11,15,25,0.92) 0%,rgba(11,15,25,0.78) 45%,rgba(11,15,25,0.95) 100%)',
      }} />

      {/* Floating Embers - The "Fire Effects" */}
      <EmbersBackground />

      {/* Subtle mouse glow spotlight */}
      <motion.div
        animate={{ x: mousePos.x - 300, y: mousePos.y - 300 }}
        transition={{ type: 'spring', damping: 45, stiffness: 40 }}
        style={{
          position: 'absolute', width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(249,115,22,0.055) 0%, transparent 70%)',
          zIndex: 1,
        }}
      />
      {/* Dot grid */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(249,115,22,0.06) 1px, transparent 1px)', backgroundSize: '38px 38px', opacity: 0.55, zIndex: 2 }} />
    </div>
  );
};

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// HERO
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const Hero: React.FC = () => {
  const { team } = useGlobalState();
  const total = team.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
      style={{ padding: '120px 0 80px', position: 'relative', textAlign: 'center' }}
    >
      {/* Decorative label */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          padding: '8px 20px', borderRadius: 999,
          background: 'rgba(249,115,22, 0.08)', border: '1px solid rgba(249,115,22, 0.2)',
          color: '#f97316', fontSize: '0.7rem', fontFamily: 'JetBrains Mono, monospace',
          letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 32,
          boxShadow: '0 0 20px rgba(249,115,22, 0.1)'
        }}
      >
        <Crown size={14} />
        Core Community Architects
      </motion.div>

      <h1
        className="heading-primary"
        style={{
          fontSize: 'clamp(3rem, 10vw, 6.5rem)',
          margin: '0 auto 28px',
          lineHeight: 0.95,
          maxWidth: 1000,
        }}
      >
        Engineering the{' '}
        <span className="heading-accent">
          Future
        </span>
        {' '}Together
      </h1>

      <p style={{
        fontFamily: 'Inter, sans-serif', fontSize: '1.1rem',
        color: 'rgba(255,255,255,0.4)', lineHeight: 1.6,
        maxWidth: 600, margin: '0 auto 50px'
      }}>
        A diverse collective of designers, developers, and strategists dedicated to pushing the boundaries of digital innovation.
      </p>

      {/* Stats row */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 48, flexWrap: 'wrap' }}>
        {[
          { v: String(total), l: 'Total Members' },
          { v: String(SECTIONS.length), l: 'Specialized Teams' },
          { v: 'âˆž', l: 'Shared Ambition' },
        ].map((s, i) => (
          <motion.div
            key={s.l}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.1 }}
            style={{ textAlign: 'center' }}
          >
            <div style={{
              fontFamily: 'Inter, sans-serif', fontWeight: 900, fontSize: '2.5rem',
              color: '#f0ece6', letterSpacing: '-0.04em', lineHeight: 1,
              marginBottom: 8
            }}>
              {s.v}
            </div>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: '0.6rem',
              color: '#f97316', letterSpacing: '0.15em',
              textTransform: 'uppercase', opacity: 0.7
            }}>
              {s.l}
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{
        height: 1, width: '100%', maxWidth: 800, margin: '60px auto 0',
        background: 'linear-gradient(90deg, transparent, rgba(249,115,22,0.2), transparent)'
      }} />
    </motion.div>
  );
};

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// MAIN PAGE â€” full-bleed breakout from Layout max-w container
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const Team: React.FC = () => {
  const { team } = useGlobalState();
  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        left: '50%',
        right: '50%',
        marginLeft: '-50vw',
        marginRight: '-50vw',
        minHeight: '100vh',
        overflowX: 'hidden',
      }}
    >
      <PageBackground />

      <div style={{ position: 'relative', zIndex: 10, maxWidth: 1200, margin: '0 auto', padding: '0 28px' }}>
        <Hero />

        {SECTIONS.map((s, i) => (
          <TeamSection
            key={s.sectionKey}
            section={s}
            sectionIndex={i}
            members={team.filter(m => m.section === s.sectionKey)}
          />
        ))}

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ padding: '48px 0 64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}
        >
          <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.65rem', color: 'rgba(255,255,255,0.18)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Code Vimarsh Â© {new Date().getFullYear()}
          </div>
          <a
            href="/contact"
            style={{ fontFamily: 'Inter,sans-serif', fontWeight: 600, fontSize: '0.8rem', color: '#f97316', textDecoration: 'none', borderBottom: '1px dashed rgba(249,115,22,0.4)', paddingBottom: 2 }}
          >
            Want to join? Get in touch â†’
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default Team;
