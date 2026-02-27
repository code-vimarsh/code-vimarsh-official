import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import { AuthCard } from '../components/Auth';
import { ForgotPasswordModal, SignInFormFields } from '../components/SignIn';
import type { SignInFormData, SignInErrors } from '../components/Auth/types';
import { validateSignIn } from '../utils/authValidation';
import { useGlobalState } from '../context/GlobalContext';

// ─── Animation variants ────────────────────────────────────────────────────────

const PAGE_VARIANTS = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
  exit:    { opacity: 0, y: -16, transition: { duration: 0.28, ease: [0.4, 0, 1, 1] as [number, number, number, number] } },
};

// ─── Sign In page ─────────────────────────────────────────────────────────────

const INITIAL_FORM: SignInFormData = { prn: '', password: '' };

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const { setIsLoggedIn } = useGlobalState();

  const [form, setForm]             = useState<SignInFormData>(INITIAL_FORM);
  const [errors, setErrors]         = useState<SignInErrors>({});
  const [touched, setTouched]       = useState<Partial<Record<keyof SignInFormData, boolean>>>({});
  const [isLoading, setIsLoading]   = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [authError, setAuthError]   = useState('');

  // ── Real-time field change ──
  const handleChange = useCallback(
    (field: keyof SignInFormData) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setForm((prev) => ({ ...prev, [field]: value }));
        setAuthError('');
        if (touched[field]) {
          const errs = validateSignIn({ ...form, [field]: value });
          setErrors((prev) => ({ ...prev, [field]: errs[field] ?? '' }));
        }
      },
    [form, touched]
  );

  // ── Blur ──
  const handleBlur = useCallback(
    (field: keyof SignInFormData) =>
      () => {
        setTouched((prev) => ({ ...prev, [field]: true }));
        const errs = validateSignIn(form);
        setErrors((prev) => ({ ...prev, [field]: errs[field] ?? '' }));
      },
    [form]
  );

  // ── Submit ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ prn: true, password: true });
    const errs = validateSignIn(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setIsLoading(true);
    setAuthError('');

    // Simulated auth call – replace with real API integration
    await new Promise((res) => setTimeout(res, 1800));
    setIsLoading(false);

    // Demo: always succeeds → mark as logged in and navigate to dashboard
    setIsLoggedIn(true);
    navigate('/dashboard');
  };

  return (
    <>
      <motion.div
        key="signin-page"
        variants={PAGE_VARIANTS}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <AuthCard
          title="Welcome back"
          subtitle="Sign in to your Code Vimarsh account"
        >
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <SignInFormFields
              form={form}
              errors={errors}
              isLoading={isLoading}
              authError={authError}
              handleChange={handleChange}
              handleBlur={handleBlur}
              onForgotClick={() => setShowForgot(true)}
            />
          </form>
        </AuthCard>
      </motion.div>

      {/* ── Forgot Password Modal ── */}
      <AnimatePresence>
        {showForgot && (
          <ForgotPasswordModal onClose={() => setShowForgot(false)} />
        )}
      </AnimatePresence>
    </>
  );
};

export default SignIn;
