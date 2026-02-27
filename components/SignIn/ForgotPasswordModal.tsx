import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, X } from 'lucide-react';

import { FormInput, AuthButton } from '../Auth';

// ─── Forgot Password Modal ─────────────────────────────────────────────────────

const ForgotPasswordModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [email, setEmail]     = useState('');
  const [sent, setSent]       = useState(false);
  const [sending, setSending] = useState(false);
  const [err, setErr]         = useState('');

  const handleSend = async () => {
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setErr('Enter a valid email address.');
      return;
    }
    setSending(true);
    await new Promise((res) => setTimeout(res, 1400));
    setSending(false);
    setSent(true);
  };

  return (
    <motion.div
      key="forgot-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(10,10,10,0.88)', backdropFilter: 'blur(12px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.88, y: 28, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.92, y: 16, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 340, damping: 28 }}
        className="relative w-full max-w-sm rounded-2xl p-8 shadow-[0_32px_80px_rgba(0,0,0,0.75)]"
        style={{
          background: 'rgba(15,15,15,0.92)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top orange rim */}
        <div
          className="absolute top-0 left-8 right-8 h-px rounded-full"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,106,0,0.50), transparent)' }}
        />

        {/* Close button */}
        <motion.button
          whileHover={{ scale: 1.1, color: '#ff6a00' }}
          whileTap={{ scale: 0.88 }}
          onClick={onClose}
          className="absolute top-4 right-4 text-textMuted transition-colors"
          aria-label="Close"
        >
          <X size={18} />
        </motion.button>

        <AnimatePresence mode="wait">
          {!sent ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <h2 className="font-display font-bold text-lg text-white mb-1">Reset password</h2>
              <p className="text-sm text-textMuted mb-6">
                Enter your registered email and we'll send you reset instructions.
              </p>

              <FormInput
                id="reset-email"
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErr(''); }}
                error={err}
                autoComplete="email"
              />

              <div className="flex gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl text-sm text-textMuted transition-all"
                  style={{ border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  Cancel
                </motion.button>
                <div className="flex-1">
                  <AuthButton
                    type="button"
                    isLoading={sending}
                    onClick={handleSend}
                  >
                    {sending ? 'Sending…' : 'Send Reset Link'}
                  </AuthButton>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="sent"
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              className="flex flex-col items-center gap-3 py-4 text-center"
            >
              <motion.div
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
                className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center"
              >
                <CheckCircle2 size={28} className="text-emerald-400" />
              </motion.div>
              <p className="text-white font-semibold">Email sent!</p>
              <p className="text-sm text-textMuted">Check your inbox for the password reset link.</p>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={onClose}
                className="mt-2 text-sm text-primary hover:underline underline-offset-4 font-medium"
              >
                Close
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default ForgotPasswordModal;
