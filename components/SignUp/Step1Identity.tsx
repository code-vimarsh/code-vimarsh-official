import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

import { FormInput, AuthButton } from '../Auth';
import type { SignUpFormData, SignUpErrors } from '../Auth/types';
import { SLIDE, SLIDE_TRANSITION } from './constants';

// ─── Props ─────────────────────────────────────────────────────────────────────

interface Step1IdentityProps {
  form: SignUpFormData;
  errors: SignUpErrors;
  direction: number;
  handleChange: (field: keyof SignUpFormData) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (field: keyof SignUpFormData) => () => void;
  onContinue: () => void;
}

// ─── Step 1: PRN, Full Name, Email ─────────────────────────────────────────────

const Step1Identity: React.FC<Step1IdentityProps> = ({
  form,
  errors,
  direction,
  handleChange,
  handleBlur,
  onContinue,
}) => (
  <motion.div
    key="step1"
    custom={direction}
    variants={SLIDE}
    initial="enter"
    animate="center"
    exit="exit"
    transition={SLIDE_TRANSITION}
    className="space-y-4"
  >
    <FormInput
      id="prn"
      label="PRN"
      value={form.prn}
      onChange={handleChange('prn')}
      onBlur={handleBlur('prn')}
      error={errors.prn}
      inputMode="numeric"
      maxLength={12}
      autoComplete="username"
    />
    <FormInput
      id="fullName"
      label="Full Name"
      value={form.fullName}
      onChange={handleChange('fullName')}
      onBlur={handleBlur('fullName')}
      error={errors.fullName}
      autoComplete="name"
    />
    <FormInput
      id="email"
      label="Email Address"
      type="email"
      value={form.email}
      onChange={handleChange('email')}
      onBlur={handleBlur('email')}
      error={errors.email}
      autoComplete="email"
    />

    <div className="pt-1">
      <AuthButton type="button" onClick={onContinue}>
        <span className="flex items-center justify-center gap-2">
          Continue <ArrowRight size={16} />
        </span>
      </AuthButton>
    </div>

    <p className="text-center text-sm text-white/30 pt-1">
      Already have an account?{' '}
      <Link
        to="/signin"
        className="text-primary font-semibold hover:underline underline-offset-4 transition-colors"
      >
        Sign In
      </Link>
    </p>
  </motion.div>
);

export default Step1Identity;
