import React from 'react';
import { motion } from 'framer-motion';
import { AuthButtonProps } from './types';

/**
 * AuthButton – animated CTA with:
 *  • Gradient sweep shimmer on hover
 *  • Pulsing glow ring
 *  • Spring press feedback
 *  • Ghost variant for secondary actions
 */
const AuthButton: React.FC<AuthButtonProps> = ({
  children,
  type = 'button',
  isLoading = false,
  disabled = false,
  onClick,
  fullWidth = true,
  variant = 'primary',
}) => {
  const isDisabled = disabled || isLoading;

  if (variant === 'ghost') {
    return (
      <motion.button
        type={type}
        onClick={onClick}
        disabled={isDisabled}
        aria-busy={isLoading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className={`
          relative inline-flex items-center justify-center gap-2
          px-6 py-3.5 rounded-xl text-sm font-semibold
          border border-primary/40 text-primary
          hover:bg-primary/10 hover:border-primary/70
          transition-colors duration-200
          focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50
          disabled:opacity-50 disabled:cursor-not-allowed
          ${fullWidth ? 'w-full' : ''}
        `}
      >
        {isLoading && <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
        {children}
      </motion.button>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      aria-busy={isLoading}
      whileHover={isDisabled ? {} : { scale: 1.025 }}
      whileTap={isDisabled   ? {} : { scale: 0.96  }}
      className={`
        relative inline-flex items-center justify-center gap-2.5 overflow-hidden
        px-6 py-3.5 rounded-xl text-sm font-bold text-black
        focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60
        disabled:cursor-not-allowed disabled:opacity-60
        ${fullWidth ? 'w-full' : ''}
      `}
      style={{
        background: 'linear-gradient(135deg, #ff6a00 0%, #ff9a00 100%)',
        boxShadow: isDisabled ? 'none' : '0 0 22px rgba(255,106,0,0.30)',
      }}
    >
      {/* Sweep shimmer on hover */}
      <motion.span
        className="absolute inset-0 pointer-events-none"
        initial={{ x: '-110%', opacity: 0 }}
        whileHover={{ x: '110%', opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.20), transparent)' }}
      />

      {/* Pulsing glow ring */}
      {!isDisabled && (
        <motion.span
          className="absolute inset-0 rounded-xl pointer-events-none"
          animate={{ boxShadow: [
            '0 0 0px 0px rgba(255,106,0,0)',
            '0 0 20px 6px rgba(255,106,0,0.22)',
            '0 0 0px 0px rgba(255,106,0,0)',
          ]}}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {isLoading && (
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-4 h-4 border-2 border-black/60 border-t-black rounded-full animate-spin shrink-0"
          aria-hidden="true"
        />
      )}

      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

export default AuthButton;