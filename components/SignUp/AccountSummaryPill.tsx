import React from 'react';
import { motion } from 'framer-motion';

// ─── Props ─────────────────────────────────────────────────────────────────────

interface AccountSummaryPillProps {
  fullName: string;
  email: string;
}

// ─── Mini card showing the user's name/email recap at the top of Step 2 ────────

const AccountSummaryPill: React.FC<AccountSummaryPillProps> = ({ fullName, email }) => (
  <motion.div
    initial={{ opacity: 0, y: -8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1, duration: 0.3 }}
    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06]"
  >
    <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center shrink-0">
      <span className="text-primary text-xs font-bold">
        {fullName.trim().charAt(0).toUpperCase() || '?'}
      </span>
    </div>
    <div className="min-w-0">
      <p className="text-white text-[13px] font-semibold truncate">{fullName || '—'}</p>
      <p className="text-white/35 text-[11px] truncate">{email || '—'}</p>
    </div>
  </motion.div>
);

export default AccountSummaryPill;
