import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

import { PasswordInput, AuthButton, PasswordStrengthBar, computePasswordStrength } from '../Auth';
import type { SignUpFormData, SignUpErrors } from '../Auth/types';
import { SLIDE, SLIDE_TRANSITION } from './constants';
import AccountSummaryPill from './AccountSummaryPill';
import PasswordMatchBadge from './PasswordMatchBadge';

// ─── Props ─────────────────────────────────────────────────────────────────────

interface Step2PasswordProps {
  form: SignUpFormData;
  errors: SignUpErrors;
  direction: number;
  isLoading: boolean;
  passwordMatch: boolean | null;
  handleChange: (field: keyof SignUpFormData) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (field: keyof SignUpFormData) => () => void;
  onBack: () => void;
}

// ─── Step 2: Password + Confirm ────────────────────────────────────────────────

const Step2Password: React.FC<Step2PasswordProps> = ({
  form,
  errors,
  direction,
  isLoading,
  passwordMatch,
  handleChange,
  handleBlur,
  onBack,
}) => {
  const strength = computePasswordStrength(form.password);

  return (
    <motion.div
      key="step2"
      custom={direction}
      variants={SLIDE}
      initial="enter"
      animate="center"
      exit="exit"
      transition={SLIDE_TRANSITION}
      className="space-y-4"
    >
      {/* Account summary recap */}
      <AccountSummaryPill fullName={form.fullName} email={form.email} />

      {/* Password with strength bar */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12, duration: 0.32 }}
      >
        <PasswordInput
          id="password"
          label="Secure Password"
          value={form.password}
          onChange={handleChange('password')}
          onBlur={handleBlur('password')}
          error={errors.password}
          autoComplete="new-password"
        />
        <PasswordStrengthBar
          result={strength}
          visible={form.password.length > 0}
          password={form.password}
        />
      </motion.div>

      {/* Confirm password with match badge */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22, duration: 0.32 }}
      >
        <PasswordInput
          id="confirmPassword"
          label="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange('confirmPassword')}
          onBlur={handleBlur('confirmPassword')}
          error={errors.confirmPassword}
          autoComplete="new-password"
        />
        <PasswordMatchBadge
          visible={form.confirmPassword.length > 0 && !errors.confirmPassword}
          passwordMatch={passwordMatch}
        />
      </motion.div>

      {/* Submit + Back */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.3 }}
        className="pt-1 space-y-3"
      >
        <AuthButton type="submit" isLoading={isLoading}>
          {isLoading ? 'Creating account…' : 'Create Account'}
        </AuthButton>

        <button
          type="button"
          onClick={onBack}
          className="w-full flex items-center justify-center gap-2 text-sm text-white/35
            hover:text-white/60 transition-colors duration-200 py-1"
        >
          <ArrowLeft size={14} />
          Back
        </button>
      </motion.div>
    </motion.div>
  );
};

export default Step2Password;
