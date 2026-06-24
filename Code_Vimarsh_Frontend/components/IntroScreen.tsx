import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const IntroScreen: React.FC<{ onExplore: () => void }> = ({ onExplore }) => {
  const [showButton, setShowButton] = useState(false);
  const [particles, setParticles] = useState<{ id: number, left: number, duration: number, delay: number, size: number }[]>([]);
  const [glowOrbs, setGlowOrbs] = useState<{ id: number, x: number, y: number }[]>([]);

  const mainText = "Code Vimarsh";

  useEffect(() => {
    // Optimized particles
    const p = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      duration: Math.random() * 1.8 + 1.5,
      delay: Math.random() * 1.8,
      size: Math.random() * 5 + 2
    }));
    setParticles(p);

    // Glow orbs around text
    const orbs = Array.from({ length: 5 }).map((_, i) => ({
      id: i,
      x: Math.cos((i / 5) * Math.PI * 2) * 150,
      y: Math.sin((i / 5) * Math.PI * 2) * 100
    }));
    setGlowOrbs(orbs);

    const timer = setTimeout(() => setShowButton(true), 3500);
    return () => clearTimeout(timer);
  }, []);

  // Stagger animation for letters
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2,
      },
    },
  };

  const letterVariants = {
    hidden: { 
      opacity: 0, 
      y: 60,
      scale: 0.8,
    },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        delay: i * 0.05,
        type: "spring" as const,
        stiffness: 80,
        damping: 15,
      },
    }),
  } as any;

  return (
    <motion.div 
      className="fixed inset-0 z-[200] bg-bgDark flex flex-col items-center justify-center overflow-hidden"
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <style>{`
        /* Modern premium letter effect */
        .premium-letter {
          background: linear-gradient(135deg, #ffffff 0%, #e8d5ff 20%, #ffaa44 60%, #ff6a00 100%);
          background-size: 300% 300%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          filter: drop-shadow(0 0 20px rgba(255, 106, 0, 0.4)) 
                  drop-shadow(0 0 40px rgba(255, 165, 100, 0.2));
          animation: luxeGlow 3.5s ease-in-out forwards;
        }

        @keyframes luxeGlow {
          0% {
            background-position: 0% 50%;
            filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.6)) 
                    drop-shadow(0 0 20px rgba(200, 150, 255, 0.2));
          }
          40% {
            filter: drop-shadow(0 0 25px rgba(255, 255, 200, 0.5)) 
                    drop-shadow(0 0 45px rgba(255, 165, 100, 0.3));
          }
          100% {
            background-position: 100% 50%;
            filter: drop-shadow(0 0 30px rgba(255, 106, 0, 0.7)) 
                    drop-shadow(0 0 60px rgba(255, 106, 0, 0.4)) 
                    drop-shadow(0 0 90px rgba(255, 106, 0, 0.2));
          }
        }

        /* Floating particles with enhance glow */
        .elite-particle {
          position: absolute;
          bottom: -20px;
          background: radial-gradient(circle, rgba(255, 200, 100, 0.8), rgba(255, 106, 0, 0));
          border-radius: 50%;
          filter: blur(0.5px);
          animation: eliteFloat var(--duration) ease-in infinite;
          will-change: transform;
          box-shadow: 0 0 15px rgba(255, 106, 0, 0.6);
        }

        @keyframes eliteFloat {
          0% {
            transform: translateY(0) translateX(0px) scale(1);
            opacity: 0.8;
          }
          50% {
            transform: translateY(-50vh) translateX(var(--offsetX, 0px)) scale(0.8);
          }
          100% {
            transform: translateY(-100vh) translateX(var(--offsetX, 0px)) scale(0);
            opacity: 0;
          }
        }

        /* Ambient glow orbs */
        .glow-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(40px);
          animation: orbFloat var(--duration, 6s) ease-in-out infinite;
          will-change: transform, opacity;
        }

        @keyframes orbFloat {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.3;
          }
          50% {
            transform: translate(var(--tx, 0px), var(--ty, 0px)) scale(1.2);
            opacity: 0.6;
          }
        }

        /* Subtitle shimmer */
        .subtitle-shimmer {
          background: linear-gradient(90deg, #888 0%, #ccc 25%, #888 50%, #ccc 75%, #888 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: subtleShimmer 3s ease-in-out infinite;
        }

        @keyframes subtleShimmer {
          0% { background-position: 0 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>

      {/* Glowing orbs background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {glowOrbs.map((orb, idx) => (
          <div
            key={orb.id}
            className="glow-orb"
            style={{
              left: `calc(50% + ${orb.x}px)`,
              top: `calc(50% + ${orb.y}px)`,
              width: '300px',
              height: '300px',
              background: idx % 2 === 0 ? 'rgba(255, 106, 0, 0.3)' : 'rgba(255, 165, 100, 0.2)',
              '--duration': `${6 + idx * 2}s`,
              '--tx': `${Math.sin(idx) * 80}px`,
              '--ty': `${Math.cos(idx) * 60}px`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Particle effects */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {particles.map((p) => (
          <div 
            key={p.id} 
            className="elite-particle" 
            style={{ 
              left: `${p.left}%`, 
              width: `${p.size}px`, 
              height: `${p.size}px`, 
              '--duration': `${p.duration}s`,
              '--offsetX': `${(Math.random() - 0.5) * 100}px`,
              animationDelay: `${p.delay}s`
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center z-10 relative"
      >
        {/* Title with letter-by-letter animation */}
        <motion.div
          className="text-5xl sm:text-7xl md:text-9xl font-display font-black tracking-tighter uppercase"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {mainText.split('').map((char, index) => (
            <motion.span
              key={index}
              custom={index}
              variants={letterVariants}
              className="inline-block premium-letter"
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </motion.div>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.9, ease: "easeOut" }}
          className="mt-8 text-sm sm:text-lg md:text-xl font-mono tracking-[0.3em] uppercase subtitle-shimmer"
        >
          Ignite The Future
        </motion.p>

        {/* Decorative line */}
        <motion.div 
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 0.5 }}
          transition={{ delay: 2.3, duration: 0.8 }}
          className="mt-6 h-px bg-gradient-to-r from-transparent via-primary to-transparent w-32 mx-auto"
        />
      </motion.div>

      {/* CTA Button */}
      <motion.button
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: showButton ? 1 : 0, y: showButton ? 0 : 30, scale: showButton ? 1 : 0.9 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        onClick={onExplore}
        disabled={!showButton}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`absolute bottom-20 px-8 py-4 font-bold text-lg rounded-full transition-all duration-300 flex items-center group z-10 
          bg-gradient-to-r from-primary/10 to-primary/5 backdrop-blur-xl
          border border-primary/30 hover:border-primary/60
          text-primary hover:text-white
          shadow-[0_0_30px_rgba(255,106,0,0.2)] hover:shadow-[0_0_60px_rgba(255,106,0,0.5)]
          ${!showButton && 'pointer-events-none'}
        `}
      >
        <span className="relative">
          Explore Ecosystem
        </span>
        <ChevronRight className="ml-3 group-hover:translate-x-1 transition-transform duration-300" size={20} />
      </motion.button>
    </motion.div>
  );
};

export default IntroScreen;