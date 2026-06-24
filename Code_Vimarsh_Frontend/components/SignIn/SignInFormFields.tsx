import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

import { FormInput, PasswordInput, AuthButton } from '../Auth';
import type { SignInFormData, SignInErrors } from '../Auth/types';

// ─── Props ─────────────────────────────────────────────────────────────────────

interface SignInFormFieldsProps {
  form: SignInFormData;
  errors: SignInErrors;
  isLoading: boolean;
  authError: string;
  handleChange: (field: keyof SignInFormData) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (field: keyof SignInFormData) => () => void;
  onForgotClick: () => void;
}

// ─── Component ─────────────────────────────────────────────────────────────────

const SignInFormFields: React.FC<SignInFormFieldsProps> = ({
  form,
  errors,
  isLoading,
  authError,
  handleChange,
  handleBlur,
  onForgotClick,
}) => (
  <>
    {/* ── Global auth error ── */}
    <AnimatePresence>
      {authError && (
        <motion.div
          initial={{ opacity: 0, height: 0, marginBottom: 0 }}
          animate={{ opacity: 1, height: 'auto', marginBottom: 8 }}
          exit={{ opacity: 0, height: 0, marginBottom: 0 }}
          transition={{ duration: 0.22 }}
          className="overflow-hidden"
        >
          <div
            className="rounded-xl border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-400"
            role="alert"
          >
            {authError}
          </div>
        </motion.div>
      )}
    </AnimatePresence>

    {/* ── PRN ── */}
    <FormInput
      id="prn"
      label="PRN (Permanent Registration Number)"
      value={form.prn}
      onChange={handleChange('prn')}
      onBlur={handleBlur('prn')}
      error={errors.prn}
      inputMode="numeric"
      maxLength={12}
      autoComplete="username"
    />

    {/* ── Password ── */}
    <div>
      <PasswordInput
        id="password"
        label="Password"
        value={form.password}
        onChange={handleChange('password')}
        onBlur={handleBlur('password')}
        error={errors.password}
        autoComplete="current-password"
      />
      <div className="text-right mt-2">
        <motion.button
          type="button"
          whileHover={{ color: '#ff6a00', x: 1 }}
          onClick={onForgotClick}
          className="text-xs text-textMuted transition-colors font-medium"
        >
          Forgot Password?
        </motion.button>
      </div>
    </div>

    {/* ── Submit ── */}
    <div className="pt-1">
      <AuthButton type="submit" isLoading={isLoading}>
        <span className="flex items-center justify-center gap-2">
          {isLoading ? 'Signing in…' : <>Sign In <ArrowRight size={15} /></>}
        </span>
      </AuthButton>
    </div>

    {/* ── Divider ── */}
    <div className="flex items-center gap-3">
      <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
      <span className="text-xs text-textMuted">or</span>
      <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
    </div>

    {/* ── Toggle to Sign Up ── */}
    <p className="text-center text-sm text-textMuted">
      Don't have an account?{' '}
      <Link
        to="/signup"
        className="text-primary font-semibold hover:underline underline-offset-4 transition-colors"
      >
        Create Account
      </Link>
    </p>
  </>
);

export default SignInFormFields;
