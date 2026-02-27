import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

import { AuthCard } from '../Auth';

// ─── Post-submit success screen shown before redirect to Sign In ───────────────

const SuccessScreen: React.FC = () => (
  <AuthCard title="Account Created!" subtitle="Welcome to the Code Vimarsh community.">
    <motion.div
      initial={{ opacity: 0, scale: 0.88 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      className="flex flex-col items-center gap-5 py-8 text-center"
    >
      <div className="relative">
        <motion.div
          className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center"
          animate={{
            boxShadow: [
              '0 0 0px rgba(52,211,153,0)',
              '0 0 32px rgba(52,211,153,0.3)',
              '0 0 0px rgba(52,211,153,0)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <CheckCircle2 size={36} className="text-emerald-400" />
        </motion.div>
      </div>
      <div>
        <p className="text-white font-semibold text-base">You're all set!</p>
        <p className="text-white/40 text-sm mt-1">Redirecting to sign in…</p>
      </div>
    </motion.div>
  </AuthCard>
);

export default SuccessScreen;
