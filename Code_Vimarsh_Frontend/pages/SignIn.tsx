import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../services/supabase';

import { AuthCard, PasswordInput, AuthButton } from '../components/Auth';
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

  // Password Recovery / Reset States
  const [isRecoveryMode, setIsRecoveryMode]   = useState(() => {
    return typeof window !== 'undefined' && sessionStorage.getItem('cv_is_recovering') === 'true';
  });
  const [newPassword, setNewPassword]         = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetError, setResetError]           = useState('');
  const [resetSuccess, setResetSuccess]       = useState(false);

  useEffect(() => {
    // Listen for PASSWORD_RECOVERY event
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsRecoveryMode(true);
        sessionStorage.setItem('cv_is_recovering', 'true');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Clean up trailing '#' from the URL address bar once recovery mode is active
  useEffect(() => {
    if (isRecoveryMode && typeof window !== 'undefined') {
      const timer = setTimeout(() => {
        window.history.replaceState(
          null,
          document.title,
          window.location.pathname + window.location.search
        );
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isRecoveryMode]);

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

    try {
      // Direct Supabase Authentication
      // 1. Fetch user's email via their PRN from the profiles table
      const { data: profileData, error: profileErr } = await supabase
        .from('profiles')
        .select('email')
        .eq('prn', form.prn)
        .single();

      if (profileErr || !profileData?.email) {
        throw new Error('No registered account was found with this PRN.');
      }

      // 2. Sign in using email & password
      const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
        email: profileData.email,
        password: form.password,
      });

      if (authErr) {
        throw authErr;
      }

      if (authData?.session) {
        localStorage.setItem('cv_token', authData.session.access_token);
        setIsLoggedIn(true);
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error('Supabase authentication failed:', err);
      setAuthError(err.message || 'Failed to sign in. Please verify your PRN and password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim()) {
      setResetError('New password is required.');
      return;
    }
    if (newPassword.length < 6) {
      setResetError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setResetError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setResetError('');
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;

      setResetSuccess(true);
      sessionStorage.removeItem('cv_is_recovering');

      // Auto login: retrieve session to save the access token
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        localStorage.setItem('cv_token', session.access_token);
        setIsLoggedIn(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        setTimeout(() => {
          setIsRecoveryMode(false);
          setNewPassword('');
          setConfirmPassword('');
        }, 2000);
      }
    } catch (err: any) {
      console.error('Password update failed:', err);
      setResetError(err.message || 'Failed to update password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <motion.div
        key={isRecoveryMode ? 'recovery-page' : 'signin-page'}
        variants={PAGE_VARIANTS}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {isRecoveryMode ? (
          <AuthCard
            title="Update Password"
            subtitle="Enter your new secure password below"
          >
            {resetSuccess ? (
              <div className="flex flex-col items-center gap-3 py-4 text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                  <span className="text-2xl text-emerald-400">✓</span>
                </div>
                <p className="text-white font-semibold">Password updated successfully!</p>
                <p className="text-sm text-textMuted">Redirecting you to dashboard...</p>
              </div>
            ) : (
              <form onSubmit={handleUpdatePassword} className="space-y-5">
                <PasswordInput
                  id="recovery-password"
                  label="New Password"
                  value={newPassword}
                  onChange={(e) => { setNewPassword(e.target.value); setResetError(''); }}
                />
                <PasswordInput
                  id="recovery-confirm-password"
                  label="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setResetError(''); }}
                />
                {resetError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl text-center">
                    {resetError}
                  </div>
                )}
                <AuthButton type="submit" isLoading={isLoading}>
                  {isLoading ? 'Updating...' : 'Update Password'}
                </AuthButton>
                
                <button
                  type="button"
                  onClick={() => {
                    sessionStorage.removeItem('cv_is_recovering');
                    setIsRecoveryMode(false);
                  }}
                  className="w-full text-center text-xs text-textMuted hover:text-primary transition-colors pt-2"
                >
                  Back to Sign In
                </button>
              </form>
            )}
          </AuthCard>
        ) : (
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
        )}
      </motion.div>

      {/* ── Forgot Password Modal ── */}
      <AnimatePresence>
        {showForgot && (
          <ForgotPasswordModal onClose={() => setShowForgot(false)} prn={form.prn} />
        )}
      </AnimatePresence>
    </>
  );
};

export default SignIn;
