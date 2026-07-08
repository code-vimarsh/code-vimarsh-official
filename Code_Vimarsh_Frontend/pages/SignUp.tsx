import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { supabase } from '../services/supabase';

import { AuthCard } from '../components/Auth';
import {
  StepDots,
  Step1Identity,
  Step2Password,
  SuccessScreen,
  Step3OTP,
} from '../components/SignUp';
import type { SignUpFormData, SignUpErrors } from '../components/Auth/types';
import { validateSignUp, validateField } from '../utils/authValidation';

const INITIAL_FORM: SignUpFormData = {
  prn: '', fullName: '', email: '', password: '', confirmPassword: '',
};

const SignUp: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm]                 = useState<SignUpFormData>(INITIAL_FORM);
  const [errors, setErrors]             = useState<SignUpErrors>({});
  const [touched, setTouched]           = useState<Partial<Record<keyof SignUpFormData, boolean>>>({});
  const [step, setStep]                 = useState<1 | 2 | 3>(1);
  const [direction, setDirection]       = useState(1);
  const [isLoading, setIsLoading]       = useState(false);
  const [authError, setAuthError]       = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [submitted, setSubmitted]       = useState(false);
  const [otpLoading, setOtpLoading]     = useState(false);

  const passwordMatch =
    form.confirmPassword.length > 0 ? form.password === form.confirmPassword : null;

  const handleChange = useCallback(
    (field: keyof SignUpFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setForm((prev) => ({ ...prev, [field]: value }));
      setAuthError('');
      setSuccessMessage('');
      if (touched[field]) {
        const err = validateField(field, value, { ...form, [field]: value });
        setErrors((prev) => ({ ...prev, [field]: err }));
      }
      if (field === 'password' && touched.confirmPassword) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: form.confirmPassword === value ? '' : 'Passwords do not match.',
        }));
      }
    },
    [form, touched]
  );

  const handleBlur = useCallback(
    (field: keyof SignUpFormData) => () => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      const err = validateField(field, form[field], form);
      setErrors((prev) => ({ ...prev, [field]: err }));
    },
    [form]
  );

  const handleContinue = () => {
    setAuthError('');
    setSuccessMessage('');
    setTouched({ prn: true, fullName: true, email: true });
    const errs = validateSignUp(form);
    const step1Errors: SignUpErrors = {};
    if (errs.prn)      step1Errors.prn      = errs.prn;
    if (errs.fullName) step1Errors.fullName = errs.fullName;
    if (errs.email)    step1Errors.email    = errs.email;
    setErrors(step1Errors);
    if (Object.keys(step1Errors).length > 0) return;
    setDirection(1);
    setStep(2);
  };

  const handleBack = () => {
    setAuthError('');
    setSuccessMessage('');
    setDirection(-1);
    setStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ prn: true, fullName: true, email: true, password: true, confirmPassword: true });
    const errs = validateSignUp(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setIsLoading(true);
    setSuccessMessage('');
    try {
      // 1. Check if a profile with the same PRN or Email already exists and is verified
      const { data: existingProfiles, error: checkErr } = await supabase
        .from('profiles')
        .select('prn, email, is_verified')
        .or(`prn.eq.${form.prn},email.eq.${form.email}`);

      if (checkErr) {
        console.warn('Pre-signup existence check skipped:', checkErr);
      }

      if (existingProfiles && existingProfiles.length > 0) {
        // Only block if the account has already completed OTP verification
        const verifiedProfiles = existingProfiles.filter(p => p.is_verified === true);
        
        if (verifiedProfiles.length > 0) {
          const hasPrn = verifiedProfiles.some(p => p.prn === form.prn);
          const hasEmail = verifiedProfiles.some(p => p.email === form.email);
          if (hasPrn && hasEmail) {
            throw new Error('An account with this PRN and Email already exists. Please sign in instead.');
          } else if (hasPrn) {
            throw new Error('An account with this PRN already exists. Please check your PRN or sign in.');
          } else {
            throw new Error('An account with this Email already exists. Please check your Email or sign in.');
          }
        }
      }

      // 2. Trigger Supabase Sign Up which auto-sends verification OTP email via your configured SMTP server
      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            full_name: form.fullName,
            prn: form.prn,
          }
        }
      });

      if (error) throw error;

      setIsLoading(false);
      setDirection(1);
      setStep(3);
    } catch (err: any) {
      console.error('Supabase Sign Up failed:', err);
      setIsLoading(false);
      
      let errMsg = 'Failed to initialize signup. Please check your network and try again.';
      if (err) {
        if (typeof err === 'string') {
          errMsg = err;
        } else {
          const detail: Record<string, any> = {};
          try {
            Object.getOwnPropertyNames(err).forEach(key => {
              detail[key] = err[key];
            });
            errMsg = detail.message || detail.msg || JSON.stringify(detail);
          } catch (e) {
            errMsg = err.message || String(err);
          }
        }
      }
      setAuthError(errMsg);
    }
  };

  const handleVerifyOtp = async (enteredOtp: string) => {
    setOtpLoading(true);
    try {
      // Verify OTP against Supabase Auth using type: 'signup' (or type: 'email')
      const { data, error } = await supabase.auth.verifyOtp({
        email: form.email,
        token: enteredOtp,
        type: 'signup'
      });

      if (error) throw error;

      // Mark the profile as verified in the database profiles table
      if (data.user) {
        const { error: profileErr } = await supabase
          .from('profiles')
          .update({ is_verified: true })
          .eq('user_id', data.user.id);
        if (profileErr) {
          console.warn('Profile verification update failed:', profileErr);
        }
      }

      setOtpLoading(false);
      setSubmitted(true);
      setTimeout(() => { window.location.href = '/signin'; }, 1700);
    } catch (err: any) {
      console.error('Supabase OTP verification failed:', err);
      setOtpLoading(false);
      
      let errMsg = 'Failed to verify code. Please try again.';
      if (err) {
        if (typeof err === 'string') {
          errMsg = err;
        } else {
          const detail: Record<string, any> = {};
          try {
            Object.getOwnPropertyNames(err).forEach(key => {
              detail[key] = err[key];
            });
            errMsg = detail.message || detail.msg || JSON.stringify(detail);
          } catch (e) {
            errMsg = err.message || String(err);
          }
        }
      }
      setAuthError(errMsg);
    }
  };

  const handleResendOtp = async () => {
    try {
      setSuccessMessage('');
      setAuthError('');
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: form.email
      });
      if (error) throw error;
      setSuccessMessage('A new verification code has been sent to your email.');
    } catch (err: any) {
      console.error('Supabase OTP resend failed:', err);
      
      let errMsg = 'Failed to resend verification code.';
      if (err) {
        if (typeof err === 'string') {
          errMsg = err;
        } else {
          const detail: Record<string, any> = {};
          try {
            Object.getOwnPropertyNames(err).forEach(key => {
              detail[key] = err[key];
            });
            errMsg = detail.message || detail.msg || JSON.stringify(detail);
          } catch (e) {
            errMsg = err.message || String(err);
          }
        }
      }
      setAuthError(errMsg);
    }
  };

  if (submitted) return <SuccessScreen />;

  return (
    <AuthCard
      title={step === 1 ? 'Create your account' : step === 2 ? 'Secure your account' : 'Verify your email'}
      subtitle={step === 1
        ? 'Join the Code Vimarsh developer community'
        : step === 2
        ? 'Set a strong password to protect your account'
        : 'Enter the OTP code sent to your email'
      }
    >
      <form onSubmit={handleSubmit} noValidate>
        {authError && (
          <div
            className="rounded-xl border border-red-500/30 bg-red-500/5 px-4 py-3 mb-4 text-sm text-red-400"
            role="alert"
          >
            {authError}
          </div>
        )}
        {successMessage && (
          <div
            className="rounded-xl border border-green-500/30 bg-green-500/5 px-4 py-3 mb-4 text-sm text-green-400"
            role="alert"
          >
            {successMessage}
          </div>
        )}
        <StepDots step={step} />

        <div className="overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            {step === 1 && (
              <Step1Identity
                form={form}
                errors={errors}
                direction={direction}
                handleChange={handleChange}
                handleBlur={handleBlur}
                onContinue={handleContinue}
              />
            )}
            {step === 2 && (
              <Step2Password
                form={form}
                errors={errors}
                direction={direction}
                isLoading={isLoading}
                passwordMatch={passwordMatch}
                handleChange={handleChange}
                handleBlur={handleBlur}
                onBack={handleBack}
              />
            )}
            {step === 3 && (
              <Step3OTP
                email={form.email}
                isLoading={otpLoading}
                onVerify={handleVerifyOtp}
                onResend={handleResendOtp}
                direction={direction}
              />
            )}
          </AnimatePresence>
        </div>
      </form>
    </AuthCard>
  );
};

export default SignUp;
