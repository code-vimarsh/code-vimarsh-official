import React, { useRef } from 'react';
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
} from 'framer-motion';
import { AuthCardProps } from './types';
import AuthBackground from './AuthBackground';

/**
 * AuthCard – glassmorphism card with:
 *  • Animated floating-orb background
 *  • Entrance: fade + upward slide + scale
 *  • Desktop hover 3D tilt using mouse position
 *  • Dynamic glow following cursor inside the card
 *  • Orange top-rim highlight line
 */
const AuthCard: React.FC<AuthCardProps> = ({ children, title, subtitle }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const spring = { stiffness: 120, damping: 22, mass: 0.5 };
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [ 4, -4]),  spring);
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-4,  4]),  spring);
  const glowX   = useSpring(useTransform(rawX, [-0.5, 0.5], [25, 75]), spring);
  const glowY   = useSpring(useTransform(rawY, [-0.5, 0.5], [25, 75]), spring);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    rawX.set((e.clientX - left) / width  - 0.5);
    rawY.set((e.clientY - top)  / height - 0.5);
  };

  const handleMouseLeave = () => { rawX.set(0); rawY.set(0); };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-12"
      style={{ background: '#0a0a0a' }}
    >
      <AuthBackground />

      {/* ── Brand logotype ── */}
      <motion.a
        href="/"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1,  y: 0   }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex items-center gap-2.5 mb-8 group"
      >
        <img src="/CV LOGO.webp" alt="Code Vimarsh"
          className="h-9 w-auto object-contain group-hover:opacity-80 transition-opacity" />
        <span className="font-display font-bold text-xl tracking-tight text-white group-hover:text-primary transition-colors">
          Code<span className="text-primary">Vimarsh</span>
        </span>
      </motion.a>

      {/* ── Tiltable card ── */}
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        initial={{ opacity: 0, y: 32, scale: 0.96 }}
        animate={{ opacity: 1, y: 0,  scale: 1    }}
        exit={{    opacity: 0, y: -24, scale: 0.97 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ rotateX, rotateY, transformPerspective: 900, transformStyle: 'preserve-3d' }}
        className="relative z-10 w-full max-w-md group"
      >
        <div className="
          relative
          bg-[#0f0f0f]/85 backdrop-blur-2xl
          border border-white/[0.06] group-hover:border-[rgba(255,106,0,0.22)]
          rounded-2xl
          shadow-[0_32px_80px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,106,0,0.04)]
          group-hover:shadow-[0_32px_80px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,106,0,0.12),0_0_40px_rgba(255,106,0,0.06)]
          transition-[border-color,box-shadow] duration-500
          p-8 sm:p-10 overflow-hidden
        ">
          {/* Mouse-following glow */}
          <motion.div
            className="absolute -inset-px rounded-2xl pointer-events-none"
            style={{
              background: useTransform(
                [glowX, glowY] as const,
                ([gx, gy]: number[]) =>
                  `radial-gradient(360px circle at ${gx}% ${gy}%, rgba(255,106,0,0.07), transparent 65%)`
              ),
            }}
          />

          {/* Top orange rim */}
          <div className="absolute top-0 left-0 right-0 h-px rounded-t-2xl" style={{
            background: 'linear-gradient(90deg, transparent 5%, rgba(255,106,0,0.55) 40%, rgba(255,154,0,0.55) 60%, transparent 95%)',
          }} />

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.45, ease: 'easeOut' }}
            className="mb-8 text-center"
          >
            <h1 className="font-display font-bold text-[1.6rem] leading-tight text-white mb-2 tracking-tight">
              {title}
            </h1>
            <p className="text-sm text-white/40 leading-relaxed">{subtitle}</p>
          </motion.div>

          {children}
        </div>
      </motion.div>

      {/* Legal */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="relative z-10 mt-8 text-[11px] text-white/25 text-center max-w-xs leading-relaxed"
      >
        By continuing you agree to Code Vimarsh’s{' '}
        <span className="text-primary/70 hover:text-primary cursor-pointer transition-colors">Terms</span>{' '}
        &amp;{' '}
        <span className="text-primary/70 hover:text-primary cursor-pointer transition-colors">Privacy Policy</span>.
      </motion.p>
    </div>
  );
};

export default AuthCard;