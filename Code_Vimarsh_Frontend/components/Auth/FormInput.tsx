import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FormInputProps } from './types';

/**
 * FormInput – animated floating-label input with framer-motion label
 * transition, orange focus glow, and animated error reveal.
 */
const FormInput: React.FC<FormInputProps> = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  autoComplete,
  inputMode,
  maxLength,
  disabled = false,
  placeholder = ' ',
}) => {
  const [focused, setFocused] = useState(false);

  const handleFocus = () => setFocused(true);
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    onBlur?.(e);
  };

  const isFloated = focused || value.length > 0;
  const hasError  = !!error;

  return (
    <div className="relative w-full group">
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
          type={type}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={inputMode}
          maxLength={maxLength}
          disabled={disabled}
          aria-describedby={error ? `${id}-error` : undefined}
          aria-invalid={hasError}
          className="
            w-full bg-transparent px-4 pt-[22px] pb-[8px] text-sm text-white
            placeholder-transparent outline-none caret-primary
            disabled:opacity-40 disabled:cursor-not-allowed
            font-sans tracking-[0.01em]
          "
        />

        {/* ── Animated floating label ── */}
        <motion.label
          htmlFor={id}
          animate={isFloated
            ? { top: '8px',   fontSize: '10px', letterSpacing: '0.08em', color: focused ? '#ff6a00' : '#ff6a00cc' }
            : { top: '50%',   fontSize: '14px', letterSpacing: '0em',    color: '#666666' }
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

export default FormInput;
