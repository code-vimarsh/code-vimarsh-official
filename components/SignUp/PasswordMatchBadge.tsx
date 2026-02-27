import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';

// ─── Props ─────────────────────────────────────────────────────────────────────

interface PasswordMatchBadgeProps {
  /** Show the badge only when confirm field has content and no validation error */
  visible: boolean;
  passwordMatch: boolean | null;
}

// ─── Animated match / mismatch indicator under the confirm password field ──────

const PasswordMatchBadge: React.FC<PasswordMatchBadgeProps> = ({ visible, passwordMatch }) => (
  <AnimatePresence>
    {visible && (
      <motion.p
        key={passwordMatch ? 'match' : 'mismatch'}
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className={`mt-2 text-[11px] font-semibold flex items-center gap-1.5 pl-1 ${
          passwordMatch ? 'text-emerald-400' : 'text-red-400'
        }`}
      >
        {passwordMatch ? (
          <><CheckCircle2 size={12} />Passwords match</>
        ) : (
          <><XCircle size={12} />Passwords do not match</>
        )}
      </motion.p>
    )}
  </AnimatePresence>
);

export default PasswordMatchBadge;
