import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

interface RegisterButtonProps {
  href: string;
  /** capacity and registeredCount are optional – shown as a progress hint when provided */
  capacity?: number;
  registeredCount?: number;
  className?: string;
}

const RegisterButton: React.FC<RegisterButtonProps> = ({
  href,
  capacity,
  registeredCount,
  className = '',
}) => {
  const spotsLeft =
    capacity !== undefined && registeredCount !== undefined
      ? capacity - registeredCount
      : null;

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="relative w-full flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #ff6a00 0%, #ff9a00 100%)',
          boxShadow: '0 0 24px rgba(255,106,0,0.35), 0 4px 16px rgba(0,0,0,0.4)',
        }}
        aria-label="Register for this live event"
      >
        {/* Sweep shimmer */}
        <motion.span
          initial={{ x: '-110%' }}
          whileHover={{ x: '110%' }}
          transition={{ duration: 0.55, ease: 'easeInOut' }}
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)',
          }}
          aria-hidden="true"
        />
        {/* Pulse ring */}
        <motion.span
          animate={{
            boxShadow: [
              '0 0 0px 0px rgba(255,106,0,0)',
              '0 0 0px 6px rgba(255,106,0,0.20)',
              '0 0 0px 12px rgba(255,106,0,0)',
            ],
          }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
          className="absolute inset-0 rounded-xl pointer-events-none"
          aria-hidden="true"
        />

        <Zap size={15} className="shrink-0" />
        Register Now
      </motion.a>

      {spotsLeft !== null && spotsLeft > 0 && (
        <p className="text-center text-[11px] text-amber-400/80 font-medium">
          {spotsLeft} spot{spotsLeft !== 1 ? 's' : ''} remaining
        </p>
      )}
      {spotsLeft === 0 && (
        <p className="text-center text-[11px] text-red-400/80 font-medium">
          Event is full — join the waitlist
        </p>
      )}
    </div>
  );
};

export default RegisterButton;
