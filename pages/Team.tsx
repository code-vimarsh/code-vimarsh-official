import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, Crown, Code2, Palette, Settings } from 'lucide-react';
import { EmbersBackground } from '../components/Achievements/GlowDots';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
interface TeamMember {
  name: string;
  role?: string;
  image: string;
  linkedin?: string;
  github?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// TEAM DATA  ←  add objects here; they auto-render
// ─────────────────────────────────────────────────────────────────────────────
const teamData: Record<string, TeamMember[]> = {
  // ── 6 Team Leads ──────────────────────────────────────────────────────────
  teamLeads: [
    { name: 'Neel Prajapati', role: 'Founder & Lead', image: '/team/neel.jpg', linkedin: 'https://linkedin.com/', github: 'https://github.com/' },
    { name: 'Priya Sharma', role: 'Co-Founder & Strategy', image: '/team/priya.jpg', linkedin: 'https://linkedin.com/', github: 'https://github.com/' },
    { name: 'Arjun Mehta', role: 'Technical Director', image: '/team/arjun.jpg', linkedin: 'https://linkedin.com/', github: 'https://github.com/' },
    { name: 'Riya Desai', role: 'Operations Director', image: '/team/riya.jpg', linkedin: 'https://linkedin.com/', github: 'https://github.com/' },
    { name: 'Karan Malhotra', role: 'Creative Director', image: '/team/karan.jpg', linkedin: 'https://linkedin.com/', github: 'https://github.com/' },
    { name: 'Simran Kaur', role: 'Community Director', image: '/team/simran.jpg', linkedin: 'https://linkedin.com/', github: 'https://github.com/' },
  ],
  // ── 10 Web Team ───────────────────────────────────────────────────────────
  webTeam: [
    { name: 'Siddharth Verma', role: 'Frontend Developer', image: '/team/siddharth.jpg', linkedin: 'https://linkedin.com/', github: 'https://github.com/' },
    { name: 'Ananya Gupta', role: 'Full Stack Developer', image: '/team/ananya.jpg', linkedin: 'https://linkedin.com/', github: 'https://github.com/' },
    { name: 'Rohan Joshi', role: 'Backend Developer', image: '/team/rohan.jpg', linkedin: 'https://linkedin.com/', github: 'https://github.com/' },
    { name: 'Divya Nair', role: 'UI/UX Engineer', image: '/team/divya.jpg', linkedin: 'https://linkedin.com/', github: 'https://github.com/' },
    { name: 'Sahil Pandey', role: 'React Developer', image: '/team/sahil.jpg', linkedin: 'https://linkedin.com/', github: 'https://github.com/' },
    { name: 'Tanvi Bose', role: 'API & Integrations', image: '/team/tanvi.jpg', linkedin: 'https://linkedin.com/', github: 'https://github.com/' },
    { name: 'Harsh Agarwal', role: 'DevOps Engineer', image: '/team/harsh.jpg', linkedin: 'https://linkedin.com/', github: 'https://github.com/' },
    { name: 'Pooja Rao', role: 'QA Engineer', image: '/team/pooja.jpg', linkedin: 'https://linkedin.com/', github: 'https://github.com/' },
    { name: 'Amit Chauhan', role: 'Mobile Developer', image: '/team/amit.jpg', linkedin: 'https://linkedin.com/', github: 'https://github.com/' },
    { name: 'Neha Singh', role: 'Database Engineer', image: '/team/neha.jpg', linkedin: 'https://linkedin.com/', github: 'https://github.com/' },
  ],
  // ── 10 Management Team ────────────────────────────────────────────────────
  managementTeam: [
    { name: 'Kartik Shah', role: 'Event Manager', image: '/team/kartik.jpg', linkedin: 'https://linkedin.com/', github: 'https://github.com/' },
    { name: 'Meera Patel', role: 'Community Manager', image: '/team/meera.jpg', linkedin: 'https://linkedin.com/', github: 'https://github.com/' },
    { name: 'Yash Dubey', role: 'Operations Lead', image: '/team/yash.jpg', linkedin: 'https://linkedin.com/', github: 'https://github.com/' },
    { name: 'Isha Tiwari', role: 'PR & Outreach', image: '/team/isha.jpg', linkedin: 'https://linkedin.com/', github: 'https://github.com/' },
    { name: 'Rahul Kapoor', role: 'Sponsorship Lead', image: '/team/rahul.jpg', linkedin: 'https://linkedin.com/', github: 'https://github.com/' },
    { name: 'Nidhi Jain', role: 'Finance Manager', image: '/team/nidhi.jpg', linkedin: 'https://linkedin.com/', github: 'https://github.com/' },
    { name: 'Varun Mishra', role: 'Logistics Coordinator', image: '/team/varun.jpg', linkedin: 'https://linkedin.com/', github: 'https://github.com/' },
    { name: 'Shreya Kulkarni', role: 'Social Media Lead', image: '/team/shreya.jpg', linkedin: 'https://linkedin.com/', github: 'https://github.com/' },
    { name: 'Akash Trivedi', role: 'Campus Ambassador', image: '/team/akash.jpg', linkedin: 'https://linkedin.com/', github: 'https://github.com/' },
    { name: 'Bhavna Solanki', role: 'Content Strategist', image: '/team/bhavna.jpg', linkedin: 'https://linkedin.com/', github: 'https://github.com/' },
  ],
  // ── 10 Design Team ────────────────────────────────────────────────────────
  designTeam: [
    { name: 'Aisha Khan', role: 'Brand Designer', image: '/team/aisha.jpg', linkedin: 'https://linkedin.com/', github: 'https://github.com/' },
    { name: 'Dev Rathod', role: 'Motion Designer', image: '/team/dev.jpg', linkedin: 'https://linkedin.com/', github: 'https://github.com/' },
    { name: 'Sneha Mishra', role: 'Visual Designer', image: '/team/sneha.jpg', linkedin: 'https://linkedin.com/', github: 'https://github.com/' },
    { name: 'Raj Thakur', role: 'Graphic Designer', image: '/team/raj.jpg', linkedin: 'https://linkedin.com/', github: 'https://github.com/' },
    { name: 'Ankita Sharma', role: 'UI Designer', image: '/team/ankita.jpg', linkedin: 'https://linkedin.com/', github: 'https://github.com/' },
    { name: 'Vikas Negi', role: 'Illustration Artist', image: '/team/vikas.jpg', linkedin: 'https://linkedin.com/', github: 'https://github.com/' },
    { name: 'Pallavi Reddy', role: '3D Artist', image: '/team/pallavi.jpg', linkedin: 'https://linkedin.com/', github: 'https://github.com/' },
    { name: 'Manav Sethi', role: 'Video Editor', image: '/team/manav.jpg', linkedin: 'https://linkedin.com/', github: 'https://github.com/' },
    { name: 'Disha Oak', role: 'Typography Designer', image: '/team/disha.jpg', linkedin: 'https://linkedin.com/', github: 'https://github.com/' },
    { name: 'Farhan Ali', role: 'Photography Lead', image: '/team/farhan.jpg', linkedin: 'https://linkedin.com/', github: 'https://github.com/' },
  ],
};

const SECTIONS = [
  { key: 'teamLeads' as const, number: '01', title: 'Team Leads', description: 'The architects of our community — setting direction, culture, and momentum.', icon: Crown },
  { key: 'webTeam' as const, number: '02', title: 'Web Team', description: 'Engineers who translate ideas into seamless, performant digital experiences.', icon: Code2 },
  { key: 'managementTeam' as const, number: '03', title: 'Management', description: 'The operational backbone — making sure every event and initiative runs smooth.', icon: Settings },
  { key: 'designTeam' as const, number: '04', title: 'Design Team', description: 'The visual storytellers who craft the aesthetic identity of Code Vimarsh.', icon: Palette },
];

// ─────────────────────────────────────────────────────────────────────────────
// MEMBER CARD — clean glassmorphism, 3D lift on hover, social overlay
// ─────────────────────────────────────────────────────────────────────────────
const MemberCard: React.FC<{ member: TeamMember; index: number }> = ({ member, index }) => {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const initials = member.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.09, ease: [0.25, 0.46, 0.45, 0.94] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        flexShrink: 0,
        width: 200,
        borderRadius: 18,
        overflow: 'hidden',
        cursor: 'pointer',
        position: 'relative',
        background: 'linear-gradient(160deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
        border: hovered ? '1.5px solid rgba(249,115,22,0.8)' : '1px solid rgba(249,115,22,0.3)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: hovered
          ? '0 0 35px -5px rgba(249,115,22,0.5), 0 10px 40px -10px rgba(0,0,0,0.7)'
          : '0 8px 32px -12px rgba(0,0,0,0.5)',
        transform: hovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        scrollSnapAlign: 'start',
      }}
    >
      {/* Image area */}
      <div style={{ position: 'relative', height: 210, overflow: 'hidden' }}>
        {!imgError ? (
          <img
            src={member.image}
            alt={member.name}
            onError={() => setImgError(true)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.5s ease, filter 0.4s ease',
              transform: hovered ? 'scale(1.06)' : 'scale(1)',
              filter: hovered ? 'brightness(1.05) saturate(1.1)' : 'brightness(0.8) grayscale(15%)',
            }}
          />
        ) : (
          /* Fallback avatar */
          <div
            style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(145deg, #1a0e00, #111)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Subtle ring pattern */}
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', opacity: 0.07 }}>
              {[80, 120, 160, 200].map(r => (
                <div
                  key={r}
                  style={{
                    position: 'absolute',
                    top: '50%', left: '50%',
                    width: r, height: r,
                    borderRadius: '50%',
                    border: '1px solid #f97316',
                    transform: 'translate(-50%,-50%)',
                  }}
                />
              ))}
            </div>
            <span
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 900,
                fontSize: '2.4rem',
                color: '#f97316',
                position: 'relative',
                zIndex: 1,
              }}
            >
              {initials}
            </span>
          </div>
        )}

        {/* Gradient fade into card body */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '55%',
            background: 'linear-gradient(0deg, rgba(10,8,6,0.95) 0%, transparent 100%)',
          }}
        />

        {/* Social hover overlay */}
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
                background: 'rgba(0,0,0,0.42)',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'flex-end',
                padding: 10,
                gap: 8,
              }}
            >
              {member.linkedin && (
                <motion.a
                  href={member.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  onClick={e => e.stopPropagation()}
                  initial={{ scale: 0.6, opacity: 0, rotate: -10 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  transition={{ delay: 0.05, type: 'spring', stiffness: 260, damping: 18 }}
                  whileHover={{ scale: 1.12, rotate: 3 }}
                  whileTap={{ scale: 0.92, rotate: 0 }}
                  className="group relative overflow-hidden"
                  style={{
                    width: 38, height: 38,
                    borderRadius: '50%',
                    backdropFilter: 'blur(14px)',
                    WebkitBackdropFilter: 'blur(14px)',
                    background: 'linear-gradient(135deg, rgba(10,102,194,0.18) 0%, rgba(0,0,0,0.55) 100%)',
                    border: '1px solid rgba(10,102,194,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 20px rgba(10,102,194,0.25)',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'border-color 0.3s, box-shadow 0.3s',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(10,102,194,0.7)';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 28px rgba(10,102,194,0.5)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(10,102,194,0.3)';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(10,102,194,0.25)';
                  }}
                >
                  {/* Shimmer sweep */}
                  <motion.div
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(90deg, transparent, rgba(10,102,194,0.35), transparent)',
                      pointerEvents: 'none',
                    }}
                  />
                  <Linkedin size={17} color="#60a5fa" style={{ position: 'relative', zIndex: 1 }} />
                </motion.a>
              )}
              {member.github && (
                <motion.a
                  href={member.github}
                  target="_blank"
                  rel="noreferrer"
                  onClick={e => e.stopPropagation()}
                  initial={{ scale: 0.6, opacity: 0, rotate: 10 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  transition={{ delay: 0.1, type: 'spring', stiffness: 260, damping: 18 }}
                  whileHover={{ scale: 1.12, rotate: -3 }}
                  whileTap={{ scale: 0.92, rotate: 0 }}
                  style={{
                    width: 38, height: 38,
                    borderRadius: '50%',
                    backdropFilter: 'blur(14px)',
                    WebkitBackdropFilter: 'blur(14px)',
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.55) 100%)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 20px rgba(255,255,255,0.08)',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'border-color 0.3s, box-shadow 0.3s',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.35)';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 28px rgba(255,255,255,0.2)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(255,255,255,0.08)';
                  }}
                >
                  {/* Shimmer sweep */}
                  <motion.div
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)',
                      pointerEvents: 'none',
                    }}
                  />
                  <Github size={17} color="#e2e8f0" style={{ position: 'relative', zIndex: 1 }} />
                </motion.a>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Card info */}
      <div style={{ padding: '14px 16px 16px' }}>
        {/* Accent bar */}
        <div
          style={{
            height: 2,
            width: hovered ? '100%' : 28,
            background: 'linear-gradient(90deg,#f97316,#fb923c)',
            borderRadius: 2,
            marginBottom: 10,
            transition: 'width 0.35s ease',
          }}
        />
        <div
          style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 700,
            fontSize: '0.92rem',
            color: '#f0ece6',
            letterSpacing: '-0.01em',
            lineHeight: 1.3,
          }}
        >
          {member.name}
        </div>
        {member.role && (
          <div
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.63rem',
              color: '#f97316',
              marginTop: 5,
              letterSpacing: '0.03em',
              opacity: 0.85,
            }}
          >
            {member.role}
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// TEAM SECTION — cinematic layout: left info + right scroll row
// ─────────────────────────────────────────────────────────────────────────────
const TeamSection: React.FC<{ section: typeof SECTIONS[number]; sectionIndex: number }> = ({
  section,
  sectionIndex,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-80px' });
  const Icon = section.icon;
  const members = teamData[section.key];
  const isEven = sectionIndex % 2 === 0;

  return (
    <motion.div
      ref={sectionRef}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.6, delay: 0.05 }}
      style={{
        position: 'relative',
        paddingTop: 80,
        paddingBottom: 80,
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        overflow: 'hidden',
      }}
    >
      {/* ── Large ghost number ── */}
      <div
        style={{
          position: 'absolute',
          top: -20,
          right: isEven ? 'auto' : undefined,
          left: isEven ? undefined : 0,
          fontFamily: "'Space Grotesk', 'Inter', sans-serif",
          fontWeight: 700,
          fontSize: 'clamp(7rem, 18vw, 14rem)',
          lineHeight: 1,
          color: 'transparent',
          WebkitTextStroke: '1.5px rgba(249,115,22,0.35)',
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

      {/* ── Two-column layout: left info | right cards ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'grid',
          gridTemplateColumns: 'minmax(0,1fr) minmax(0,2.4fr)',
          gap: 48,
          alignItems: 'center',
        }}
      >
        {/* LEFT — section info */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.12 }}
        >
          {/* Icon + number pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '4px 12px 4px 10px',
              borderRadius: 999,
              background: 'rgba(249,115,22,0.08)',
              border: '1px solid rgba(249,115,22,0.18)',
              marginBottom: 20,
            }}
          >
            <Icon size={13} color="#f97316" />
            <span
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.62rem',
                letterSpacing: '0.18em',
                color: '#f97316',
                textTransform: 'uppercase',
              }}
            >
              {section.number}
            </span>
          </div>

          {/* Title */}
          <h2
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 800,
              fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)',
              color: '#f0ece6',
              margin: '0 0 14px',
              letterSpacing: '-0.035em',
              lineHeight: 1.15,
            }}
          >
            {section.title}
          </h2>

          {/* Description */}
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.85rem',
              color: 'rgba(255,255,255,0.38)',
              lineHeight: 1.7,
              margin: '0 0 28px',
              maxWidth: 240,
            }}
          >
            {section.description}
          </p>

          {/* Member count badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#f97316',
                boxShadow: '0 0 8px rgba(249,115,22,0.7)',
              }}
            />
            <span
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.65rem',
                color: 'rgba(255,255,255,0.3)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              {members.length} Member{members.length !== 1 ? 's' : ''}
            </span>
          </div>
        </motion.div>

        {/* RIGHT — wrapping grid (all members visible) */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.2 }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(185px, 1fr))',
              gap: 16,
            }}
          >
            {inView && members.map((member, i) => (
              <MemberCard key={member.name} member={member} index={i} />
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
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        padding: '110px 0 90px',
        position: 'relative',
        textAlign: 'center',
      }}
    >
      {/* ── Label pill ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 28,
          padding: '6px 16px 6px 12px',
          borderRadius: 999,
          background: 'rgba(249,115,22,0.1)',
          border: '1px solid rgba(249,115,22,0.35)',
          color: '#f97316',
          fontSize: 11,
          fontFamily: 'JetBrains Mono, monospace',
          fontWeight: 700,
          letterSpacing: '0.18em',
          textTransform: 'uppercase' as const,
          boxShadow: '0 0 24px rgba(249,115,22,0.15)',
        }}
      >
        <Crown size={12} />
        The Core Team · Code Vimarsh
      </motion.div>

      {/* ── Main Headline ── */}
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 0.18 }}
        style={{
          fontFamily: 'Cinzel Decorative, Cinzel, serif',
          fontWeight: 900,
          fontSize: 'clamp(2.6rem, 6.5vw, 5rem)',
          color: '#f5f0e8',
          margin: '0 auto 20px',
          letterSpacing: '0.04em',
          lineHeight: 1.1,
          maxWidth: 920,
          textShadow: '0 2px 40px rgba(0,0,0,0.5)',
        }}
      >
        Meet the Architects of{' '}
        <span
          style={{
            color: '#f97316',
            textShadow: '0 0 50px rgba(249,115,22,0.65), 0 0 120px rgba(249,115,22,0.2)',
            display: 'inline-block',
          }}
        >
          Innovation
        </span>
      </motion.h1>

      {/* ── Decorative divider ── */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        style={{
          width: 200,
          height: 1,
          margin: '0 auto 24px',
          background: 'linear-gradient(90deg, transparent, rgba(249,115,22,0.7), transparent)',
          position: 'relative',
        }}
      >
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 6, height: 6, borderRadius: '50%',
          background: '#f97316',
          boxShadow: '0 0 14px #f97316',
        }} />
      </motion.div>

      {/* ── Subtitle ── */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.32 }}
        style={{
          color: 'rgba(255,255,255,0.45)',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '11.5px',
          letterSpacing: '0.18em',
          textTransform: 'uppercase' as const,
          maxWidth: 560,
          margin: '0 auto 56px',
          lineHeight: 1.9,
        }}
      >
        A collective of engineers, designers, and visionaries building the community of tomorrow.
      </motion.p>

      {/* ── Stats row ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.42 }}
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 'clamp(1.5rem, 6vw, 4rem)',
          flexWrap: 'wrap',
        }}
      >
        {[
          { value: String(totalMembers), label: 'Core Members' },
          { value: String(SECTIONS.length), label: 'Specialized Teams' },
          { value: '∞', label: 'Collaboration' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.48 + i * 0.08 }}
            style={{
              textAlign: 'center',
              padding: '20px 32px',
              borderRadius: 16,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(249,115,22,0.15)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              minWidth: 130,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Top glow accent line */}
            <div style={{
              position: 'absolute', top: 0, left: '20%', right: '20%',
              height: 1,
              background: 'linear-gradient(90deg, transparent, rgba(249,115,22,0.5), transparent)',
            }} />
            <div
              style={{
                fontFamily: 'Space Grotesk, Inter, sans-serif',
                fontWeight: 800,
                fontSize: '2.8rem',
                color: '#f97316',
                lineHeight: 1,
                textShadow: '0 0 30px rgba(249,115,22,0.4)',
              }}
            >
              {stat.value}
            </div>
            <div
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.58rem',
                color: 'rgba(255,255,255,0.38)',
                letterSpacing: '0.16em',
                textTransform: 'uppercase' as const,
                marginTop: 8,
              }}
            >
              {stat.label}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// BACKGROUND — subtle, non-intrusive
// ─────────────────────────────────────────────────────────────────────────────
const PageBackground: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
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
        backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.7
      }} />

      {/* Dark gradient overlay to blend */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        background: 'linear-gradient(180deg,rgba(11,15,25,0.85) 0%,rgba(11,15,25,0.65) 45%,rgba(11,15,25,0.88) 100%)',
      }} />

      {/* Floating Embers - The "Fire Effects" */}
      <EmbersBackground />

      {/* Subtle mouse glow spotlight */}
      <motion.div
        animate={{
          x: mousePos.x - 450,
          y: mousePos.y - 450,
        }}
        transition={{ type: 'spring', damping: 40, stiffness: 50, mass: 1 }}
        style={{
          position: 'absolute',
          width: 900,
          height: 900,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)',
          zIndex: 1,
        }}
      />

      {/* Technical Mesh Grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(rgba(249,115,22,0.06) 1.2px, transparent 1.2px)',
          backgroundSize: '40px 40px',
          opacity: 0.4,
          zIndex: 2,
        }}
      />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
const Team: React.FC = () => {
  return (
    <div
      style={{
        /* Full-bleed breakout from Layout's max-w-7xl container */
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

      <div
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: 1160,
          margin: '0 auto',
          padding: '0 32px',
        }}
      >
        <Hero />

        {SECTIONS.map((section, i) => (
          <TeamSection key={section.key} section={section} sectionIndex={i} />
        ))}

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            padding: '56px 0 72px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 24,
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.68rem',
              color: 'rgba(255,255,255,0.2)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            Code Vimarsh © {new Date().getFullYear()}
          </div>
          <a
            href="/contact"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              fontSize: '0.82rem',
              color: '#f97316',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              letterSpacing: '-0.01em',
              borderBottom: '1px solid rgba(249,115,22,0.3)',
              paddingBottom: 2,
              transition: 'border-color 0.2s',
            }}
          >
            Want to join? Get in touch →
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default Team;