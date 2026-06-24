import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { PasswordStrengthResult } from './types';

interface Props {
  result: PasswordStrengthResult;
  visible: boolean;
  password: string;
}

// ─── Per-rule config ──────────────────────────────────────────────────────────
const RULES: { label: string; test: (p: string) => boolean }[] = [
  { label: '8+ characters',  test: (p) => p.length >= 8           },
  { label: 'Uppercase',      test: (p) => /[A-Z]/.test(p)         },
  { label: 'Lowercase',      test: (p) => /[a-z]/.test(p)         },
  { label: 'Number',         test: (p) => /[0-9]/.test(p)         },
  { label: 'Special char',   test: (p) => /[^A-Za-z0-9]/.test(p) },
];

const BAR_COLORS: Record<string, string>   = { weak: 'bg-red-500',   medium: 'bg-amber-400',  strong: 'bg-emerald-400' };
const LABEL_COLORS: Record<string, string> = { weak: 'text-red-400', medium: 'text-amber-400', strong: 'text-emerald-400' };
const BAR_GLOW: Record<string, string>     = {
  weak:   'shadow-[0_0_8px_rgba(239,68,68,0.55)]',
  medium: 'shadow-[0_0_8px_rgba(251,191,36,0.55)]',
  strong: 'shadow-[0_0_8px_rgba(52,211,153,0.55)]',
};

// ─── Component ────────────────────────────────────────────────────────────────
const PasswordStrengthBar: React.FC<Props> = ({ result, visible, password }) => {
  if (!visible) return null;

  const { level, score, label } = result;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="mt-3 space-y-3 overflow-hidden"
      role="status"
      aria-live="polite"
      aria-label={`Password strength: ${label}`}
    >
      {/* ── Strength bar + animated label ── */}
      <div className="flex gap-2 items-center">
        <div className="flex gap-1.5 flex-1">
          {[1, 2, 3, 4].map((seg) => {
            const filled = seg <= score;
            return (
              <div key={seg} className="h-1.5 flex-1 rounded-full overflow-hidden bg-white/[0.05]">
                <motion.div
                  className={`h-full rounded-full ${filled ? `${BAR_COLORS[level]} ${BAR_GLOW[level]}` : ''}`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: filled ? 1 : 0 }}
                  transition={{ duration: 0.38, ease: [0.34, 1.56, 0.64, 1], delay: seg * 0.06 }}
                  style={{ transformOrigin: 'left' }}
                />
              </div>
            );
          })}
        </div>
        <AnimatePresence mode="wait">
          <motion.span
            key={level}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{    opacity: 0, y: -5 }}
            transition={{ duration: 0.22 }}
            className={`text-[11px] font-bold tracking-wide shrink-0 ${LABEL_COLORS[level]}`}
          >
            {label}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* ── Animated requirements checklist ── */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
        {RULES.map(({ label: ruleName, test }, i) => {
          const met = test(password);
          return (
            <motion.div
              key={ruleName}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04, duration: 0.22 }}
              className="flex items-center gap-2"
            >
              <motion.div
                animate={met
                  ? { backgroundColor: 'rgba(52,211,153,0.15)', borderColor: 'rgba(52,211,153,0.60)' }
                  : { backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.10)' }
                }
                transition={{ duration: 0.25 }}
                className="w-[18px] h-[18px] rounded-full border flex items-center justify-center shrink-0"
              >
                <AnimatePresence>
                  {met && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{    scale: 0, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 420, damping: 18 }}
                    >
                      <Check size={10} className="text-emerald-400" strokeWidth={3} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
              <motion.span
                animate={{ color: met ? 'rgba(52,211,153,0.90)' : 'rgba(255,255,255,0.30)' }}
                transition={{ duration: 0.25 }}
                className="text-[11px] font-medium leading-none"
              >
                {ruleName}
              </motion.span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default PasswordStrengthBar;

// ─── Utility ─────────────────────────────────────────────────────────────────
export function computePasswordStrength(password: string): PasswordStrengthResult {
  if (!password) return { level: 'idle', score: 0, label: '' };
  let score = 0;
  if (password.length >= 8)           score++;
  if (/[A-Z]/.test(password))         score++;
  if (/[a-z]/.test(password))         score++;
  if (/[0-9]/.test(password))         score++;
  if (/[^A-Za-z0-9]/.test(password))  score++;
  if (score <= 1) return { level: 'weak',   score: 1, label: 'Weak'   };
  if (score <= 3) return { level: 'medium', score: 2, label: 'Medium' };
  if (score === 4) return { level: 'medium', score: 3, label: 'Good'  };
  return             { level: 'strong', score: 4, label: 'Strong'     };
}
