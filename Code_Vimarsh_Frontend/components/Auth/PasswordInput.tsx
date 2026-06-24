import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PasswordInputProps } from './types';

/**
 * PasswordInput – secure password field with animated visibility toggle.
 * Shares the same floating-label design as FormInput.
 */
const PasswordInput: React.FC<PasswordInputProps> = ({
  id,
  label,
  value,
  onChange,
  onBlur,
  error,
  autoComplete = 'current-password',
  disabled = false,
}) => {
  const [visible, setVisible] = useState(false);
  const [focused, setFocused] = useState(false);

  const handleFocus = () => setFocused(true);
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    onBlur?.(e);
  };

  const isFloated = focused || value.length > 0;

  const hasError = !!error;

  return (
    <div className="relative w-full">
      {/* ── Input shell ── */}
      <motion.div
        animate={{
          boxShadow: hasError
            ? '0 0 0 2px rgba(239,68,68,0.20), 0 0 18px rgba(239,68,68,0.08)'
            : focused
              ? '0 0 0 2px rgba(255,106,0,0.22), 0 0 24px rgba(255,106,0,0.10)'
              : '0 0 0 0px rgba(0,0,0,0)',
        }}
        transition={{ duration: 0.25 }}
        className={`relative rounded-xl border overflow-hidden transition-colors duration-200
          bg-[#0f0f0f]/80 backdrop-blur-sm
          ${ hasError
              ? 'border-red-500/60'
              : focused
                ? 'border-primary/55'
                : 'border-white/[0.07] hover:border-white/[0.14]'
          }
        `}
      >
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoComplete={autoComplete}
          disabled={disabled}
          placeholder=" "
          aria-describedby={error ? `${id}-error` : undefined}
          aria-invalid={hasError}
          className="
            w-full bg-transparent px-4 pt-[22px] pb-[8px] pr-12 text-sm text-white
            placeholder-transparent outline-none caret-primary
            disabled:opacity-40 disabled:cursor-not-allowed
            font-sans tracking-[0.01em]
          "
        />

        {/* ── Animated floating label ── */}
        <motion.label
          htmlFor={id}
          animate={isFloated
            ? { top: '8px',  fontSize: '10px', letterSpacing: '0.08em', color: focused ? '#ff6a00' : '#ff6a00cc' }
            : { top: '50%',  fontSize: '14px', letterSpacing: '0em',    color: '#666666' }
          }
          initial={false}
          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          style={{ translateY: isFloated ? '0%' : '-50%' }}
          className="absolute left-4 pointer-events-none select-none font-sans font-medium uppercase"
        >
          {label}
        </motion.label>

        {/* ── Focus bottom-bar accent ── */}
        <motion.div
          className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-primary to-secondary rounded-b-xl"
          animate={{ scaleX: focused ? 1 : 0, opacity: focused ? 1 : 0 }}
          initial={{ scaleX: 0, opacity: 0 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          style={{ transformOrigin: 'left' }}
        />

        {/* ── Visibility toggle ── */}
        <motion.button
          type="button"
          onClick={() => setVisible((v) => !v)}
          disabled={disabled}
          aria-label={visible ? 'Hide password' : 'Show password'}
          tabIndex={0}
          whileTap={{ scale: 0.88 }}
          className="
            absolute right-3 top-1/2 -translate-y-1/2
            text-white/30 hover:text-primary
            transition-colors duration-150
            focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded
            disabled:pointer-events-none
          "
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={visible ? 'off' : 'on'}
              initial={{ opacity: 0, rotate: -15, scale: 0.7 }}
              animate={{ opacity: 1, rotate: 0,   scale: 1   }}
              exit={{    opacity: 0, rotate: 15,   scale: 0.7 }}
              transition={{ duration: 0.18 }}
              style={{ display: 'inline-flex' }}
            >
              {visible ? <EyeOff size={16} strokeWidth={1.7} /> : <Eye size={16} strokeWidth={1.7} />}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </motion.div>

      {/* ── Animated error ── */}
      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            id={`${id}-error`}
            role="alert"
            key={error}
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0,  height: 'auto' }}
            exit={{    opacity: 0, y: -4, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-1.5 text-[11px] text-red-400 font-medium pl-1 flex items-center gap-1.5 overflow-hidden"
          >
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PasswordInput;
