import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, Crown, Code2, Palette, Settings } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
interface TeamMember {
  name: string;
  role: string;
  image: string;
  linkedin?: string;
  github?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// TEAM DATA  ← Edit this object to add / remove members
// Images live in /public/  — use exact filename with extension
// ─────────────────────────────────────────────────────────────────────────────
const teamData: Record<string, TeamMember[]> = {

  // ── LEADS: President · VP · Secretary · All Dept Heads ───────────────────
  teamLeads: [
    {
      name: 'Mann Shah',
      role: 'President',
      image: '/Mann Shah President.jpg',
      linkedin: 'https://www.linkedin.com/in/mann-shah-b9b8592ab/',
      github: 'https://www.github.com/mannshah24',
    },
    {
      name: 'Dhriti Gandhi',
      role: 'Vice President',
      image: '/Dhriti Gandhi Vice President.jpg',
      linkedin: 'https://www.linkedin.com/in/dhriti-gandhi-0758372b5/',
      github: 'https://github.com/Dhriti-5',
    },
    {
      name: 'Kanav Modi',
      role: 'Secretary',
      image: '/Kanav Modi Secratory.jpg',
      linkedin: 'https://www.linkedin.com/in/kanav-modi',
      github: 'https://github.com/KanavCode',
    },
    {
      name: 'Het Patel',
      role: 'Management Head',
      image: '/Het Patel Management Head.webp',
      linkedin: 'https://www.linkedin.com/in/hetppatel16',
      github: 'https://github.com/hetppatel16',
    },
    {
      name: 'Daxa Dubey',
      role: 'Event Head',
      image: '/Daxa Dubey Event Head.jpg',
      linkedin: 'https://ln.run/S5zUj',
      github: 'https://github.com/Daxadubey',
    },
    {
      name: 'Kirtan Patel',
      role: 'Design Head',
      image: '/Kirtan Patel Design Head.jpg',
      linkedin: 'https://www.linkedin.com/in/kirtan-patel-988218301',
      github: 'https://github.com/KirtanKRP',
    },
  ],

  // ── WEB TEAM ─────────────────────────────────────────────────────────────
  webTeam: [
    {
      name: 'Neel Prajapati',
      role: 'Frontend Team Lead',
      image: '/Neel Prajapati Web Team Member.png',
      linkedin: 'https://www.linkedin.com/in/neel-prajapati-447531330',
      github: 'https://github.com/Neel-2606',
    },

    {
      name: 'Aryan Buha',
      role: 'Web Team Member',
      image: '/Aryan Buha Frontend Team Member.jpg',
      linkedin: 'https://www.linkedin.com/in/aryan-buha-874a5434b',
      github: 'https://github.com/Aryanbuha89',
    },


    {
      name: 'Krushit Prajapati',
      role: 'Web Team Member',
      image: '/Krushit Prajapati Web Team Member.jpg',
      linkedin: 'https://www.linkedin.com/in/krushit-prajapati-2b11a832b',
      github: 'https://github.com/krushit1307',
    },

    {
      name: 'Dhruv Pathak',
      role: 'Web Team Member',
      image: '/Dhruv Pathak Web Team Member.jpg',
      linkedin: 'https://www.linkedin.com/in/dhruv-pathak-a3041a317',
      github: 'https://github.com/DhruvPathak767',
    },
    {
      name: 'Ashish Gokani',
      role: 'Web Team Member',
      image: '/Ashish Gokani Web Team Member.png',
      linkedin: 'https://www.linkedin.com/in/ashishgokani',
      github: 'https://github.com/ashishgokani',
    },
    
    {
      name: 'Deep Jaiswal',
      role: 'Web Team Member',
      image: '/Deep Jaiswal Web Team Member.jpeg',
      linkedin: 'https://www.linkedin.com/in/deep-jaiswal-4145a23a1',
      github: 'https://github.com/Deep2812msu2006',
    },
    {
      name: 'Shivam Suthar',
      role: 'Web Team Member',
      image: '/Shivam Suthar Web Team Member.jpg',
      linkedin: 'https://www.linkedin.com/in/shivam-suthar-3b3024392',
      github: 'https://github.com/shiv-05-07',
    },
    {
      name: 'Dhruvil Dattani',
      role: 'Web Team Member',
      image: '/Dhruvil Dattani Web Team Member.png',
      linkedin: 'https://www.linkedin.com/in/dhruvil-dattani-b43599317/',
      github: 'https://github.com/DhruvilTech/',
    },
  ],

  // ── MANAGEMENT TEAM ───────────────────────────────────────────────────────
  managementTeam: [

    {
      name: 'Kesha Babriya',
      role: 'Management Team Member',
      image: '/Kesha Babriya Management Team Member.jpg',
      linkedin: 'https://www.linkedin.com/in/kesha-babriya-09151a350',
      github: 'https://github.com/Kesha-Babriya',
    },

    {
      name: 'Ansh Mistry',
      role: 'Management Team',
      image: '/Ansh Mistry Management Member.jpg',
      linkedin: 'https://www.linkedin.com/in/ansh-mistry-ab7805340/',
      github: 'https://github.com/Ansh-Mistry',
    },
    {
      name: 'Krish Barvaliya',
      role: 'Management Team Member',
      image: '/Krish Baravaliya Management Team Member.jpeg',
      linkedin: 'https://www.linkedin.com/in/krish-barvaliya-74a493278',
      github: 'https://github.com/barvaliyakrish013',
    },
    {
      name: 'Vaishnavi Patel',
      role: 'Management Team Member',
      image: '/Vaishnavi Patel Management Meber.jpeg',
      linkedin: 'https://www.linkedin.com/in/vaishnavi-patel-03431730b',
      github: 'https://github.com/Vaishnavi3406',
    },
    
    {
      name: 'Priyal Dalal',
      role: 'Management Team Member',
      image: '/Priyal Dalal Management Team.jpg',
      linkedin: 'https://www.linkedin.com/in/priyal-dalal-911746363',
      github: 'https://github.com/Priyal028',
    },
    {
      name: 'Harshita Goyal',
      role: 'Management Team Member',
      image: '/Harshita Goyal Management Team Member .jpg',
      linkedin: 'https://www.linkedin.com/in/harshita-goyal-8b69903b2',
      github: 'https://github.com/harshitagoyal27',
    },
  ],

  // ── DESIGN TEAM ───────────────────────────────────────────────────────────
  designTeam: [
    {
      name: 'Manthan Khedekar',
      role: 'Design Team Member',
      image: '/Manthan Khedkar Design Team Member.webp',
      linkedin: 'https://www.linkedin.com/in/manthan-khedekar-9286b0238',
      github: 'https://github.com/Manthan2806',
    },
    {
      name: 'Sneh Bhikadiya',
      role: 'Design Team Member',
      image: '/Sneh Bhikhadiya Design Team Member.png',
      linkedin: 'https://www.linkedin.com/in/sneh-bhikadiya-97b9a9377',
      github: 'https://github.com/snehbhikadiya87-pixel',
    },
    {
      name: 'Darshan Vasava',
      role: 'Design Team Member',
      image: '/Darshan Vasava Design Team Member.jpg',
      linkedin: 'https://www.linkedin.com/in/vasava-darshankumar-53a27a379',
      github: 'https://github.com/swt-drx08',
    },
    {
      name: 'Srushti Dadhania',
      role: 'Design Team Member',
      image: '/Srushti Dadhania Design Team Member.jpg',
      linkedin: 'https://www.linkedin.com/in/srushti-dadhania-741262240',
      github: 'https://github.com/srushti28-web',
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// SECTIONS CONFIG
// ─────────────────────────────────────────────────────────────────────────────
const SECTIONS = [
  {
    key: 'teamLeads' as const,
    number: '01',
    title: 'Team Leads',
    description: 'President, Vice President, Secretary, and department heads who define direction, culture, and momentum for Code Vimarsh.',
    icon: Crown,
  },
  {
    key: 'webTeam' as const,
    number: '02',
    title: 'Web Team',
    description: 'Engineers who build and maintain the digital infrastructure — front-end, back-end, and everything in between.',
    icon: Code2,
  },
  {
    key: 'managementTeam' as const,
    number: '03',
    title: 'Management',
    description: 'The operational backbone that keeps events, communications, and community engagement running seamlessly.',
    icon: Settings,
  },
  {
    key: 'designTeam' as const,
    number: '04',
    title: 'Design Team',
    description: 'Visual storytellers who craft the aesthetic identity — from brand and graphics to motion and photography.',
    icon: Palette,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// MEMBER CARD
// ─────────────────────────────────────────────────────────────────────────────
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
        border: hovered ? '1px solid rgba(249,115,22,0.4)' : '1px solid rgba(255,255,255,0.09)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: hovered
          ? '0 20px 50px -12px rgba(249,115,22,0.25), 0 8px 24px -8px rgba(0,0,0,0.6)'
          : '0 8px 32px -12px rgba(0,0,0,0.5)',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
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

// ─────────────────────────────────────────────────────────────────────────────
// TEAM SECTION — cinematic: left info | right wrapping grid
// ─────────────────────────────────────────────────────────────────────────────
const TeamSection: React.FC<{ section: typeof SECTIONS[number]; sectionIndex: number }> = ({ section, sectionIndex }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const Icon = section.icon;
  const members = teamData[section.key];

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
      {/* Ghost section number */}
      <div
        style={{
          position: 'absolute',
          top: -20,
          right: isEven ? 'auto' : undefined,
          left: isEven ? undefined : 0,
          fontFamily: 'Inter, sans-serif',
          fontWeight: 900,
          fontSize: 'clamp(7rem, 18vw, 14rem)',
          lineHeight: 1,
          color: 'transparent',
          WebkitTextStroke: '1px rgba(249,115,22,0.08)',
          userSelect: 'none',
          letterSpacing: '0.01em',
          pointerEvents: 'none',
          zIndex: 0,
          opacity: 1,
        }}
      >
        {section.number}
      </div>

      {/* ── Section Divider (except for last) ── */}
      {sectionIndex < SECTIONS.length - 1 && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: '5%',
            right: '5%',
            height: '2px',
            background: 'linear-gradient(90deg, transparent 0%, rgba(249,115,22,0.65) 30%, rgba(249,115,22,0.85) 50%, rgba(249,115,22,0.65) 70%, transparent 100%)',
            boxShadow: '0 0 12px rgba(249,115,22,0.4)',
            zIndex: 1,
          }}
        >
          {/* Center glow dot */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 4,
              height: 4,
              borderRadius: '50%',
              background: '#f97316',
              boxShadow: '0 0 10px #f97316',
            }}
          />
        </div>
      )}

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

          <h2 style={{ fontFamily: 'Inter,sans-serif', fontWeight: 800, fontSize: 'clamp(1.4rem,3vw,2rem)', color: '#f0ece6', margin: '0 0 12px', letterSpacing: '-0.03em', lineHeight: 1.15 }}>
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

        {/* RIGHT — all members, wrapping grid */}
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

// ─────────────────────────────────────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────────────────────────────────────
const Hero: React.FC = () => {
  const totalMembers = Object.values(teamData).flat().length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        padding: '100px 0 80px',
        position: 'relative',
        textAlign: 'center',
      }}
    >
      {/* Small label */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border text-[11px] font-bold uppercase tracking-[0.2em]"
        style={{ background: 'rgba(249,115,22,0.08)', borderColor: 'rgba(249,115,22,0.3)', color: '#f97316' }}
      >
        <Crown size={12} /> The Core Team · Code Vimarsh
      </motion.div>

      {/* Main Headline */}
      <h1
        style={{
          fontFamily: 'Cinzel Decorative, Cinzel, serif',
          fontWeight: 900,
          fontSize: 'clamp(2.5rem, 6vw, 4.8rem)',
          color: '#f5f0e8',
          margin: '0 auto 16px',
          letterSpacing: '0.04em',
          lineHeight: 1.1,
          maxWidth: 900,
        }}
      >
        Meet the Architects of{' '}
        <span
          style={{
            color: '#f97316',
            textShadow: '0 0 40px rgba(249,115,22,0.55)',
            display: 'inline-block',
          }}
        >
          Innovation
        </span>
      </h1>

      {/* Professional Subtitle */}
      <p style={{
        color: '#6a5a4a',
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '11px',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        maxWidth: 600,
        margin: '0 auto 48px'
      }}>
        A collective of engineers, designers, and visionaries building the community of tomorrow.
      </p>

      {/* Stats row - Centered */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 'clamp(2rem, 8vw, 6rem)',
          paddingBottom: 8,
          flexWrap: 'wrap',
        }}
      >
        {[
          { value: String(totalMembers), label: 'Core Members' },
          { value: String(SECTIONS.length), label: 'Specialized Teams' },
          { value: '∞', label: 'Collaboration' },
        ].map(stat => (
          <div key={stat.label} style={{ textAlign: 'center' }}>
            <div
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 900,
                fontSize: '2.5rem',
                color: '#f0ece6',
                lineHeight: 1,
              }}
            >
              {stat.value}
            </div>
            <div
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.6rem',
                color: 'rgba(255,255,255,0.28)',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                marginTop: 6,
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// BACKGROUND — subtle, non-intrusive
// ─────────────────────────────────────────────────────────────────────────────
const PageBackground: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const fn = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', fn, { passive: true });
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
        backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.5
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

// ─────────────────────────────────────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────────────────────────────────────
const Hero: React.FC = () => {
  const total = Object.values(teamData).flat().length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{ padding: '90px 0 70px', position: 'relative' }}
    >
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        style={{ height: 1, width: 100, background: 'linear-gradient(90deg,#f97316,transparent)', marginBottom: 36, transformOrigin: 'left' }}
      />

      <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.65rem', letterSpacing: '0.24em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', marginBottom: 18 }}>
        Code Vimarsh — Core Team
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 32, flexWrap: 'wrap' }}>
        <h1
          style={{
            fontFamily: 'Inter,sans-serif', fontWeight: 900,
            fontSize: 'clamp(2.6rem,7vw,5rem)',
            color: '#f0ece6', margin: 0,
            letterSpacing: '-0.045em', lineHeight: 1.0, maxWidth: 560,
          }}
        >
          Meet the{' '}
          <span style={{ background: 'linear-gradient(135deg,#f97316 0%,#fb923c 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            People
          </span>
          {' '}Behind It
        </h1>

        <div style={{ display: 'flex', gap: 36, paddingBottom: 6, flexWrap: 'wrap' }}>
          {[
            { v: String(total), l: 'Total Members' },
            { v: String(SECTIONS.length), l: 'Teams' },
            { v: '∞', l: 'Ambition' },
          ].map(s => (
            <div key={s.l}>
              <div style={{ fontFamily: 'Inter,sans-serif', fontWeight: 900, fontSize: '1.9rem', color: '#f0ece6', letterSpacing: '-0.04em', lineHeight: 1 }}>{s.v}</div>
              <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.58rem', color: 'rgba(255,255,255,0.26)', letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 5 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,rgba(249,115,22,0.2),transparent)', marginTop: 50 }} />
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE — full-bleed breakout from Layout max-w container
// ─────────────────────────────────────────────────────────────────────────────
const Team: React.FC = () => (
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
        <TeamSection key={s.key} section={s} sectionIndex={i} />
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
          Code Vimarsh © {new Date().getFullYear()}
        </div>
        <a
          href="/contact"
          style={{ fontFamily: 'Inter,sans-serif', fontWeight: 600, fontSize: '0.8rem', color: '#f97316', textDecoration: 'none', borderBottom: '1px dashed rgba(249,115,22,0.4)', paddingBottom: 2 }}
        >
          Want to join? Get in touch →
        </a>
      </motion.div>
    </div>
  </div>
);

export default Team;