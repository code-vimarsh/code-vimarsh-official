import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import { AuthCard } from '../components/Auth';
import {
  StepDots,
  Step1Identity,
  Step2Password,
  SuccessScreen,
} from '../components/SignUp';
import type { SignUpFormData, SignUpErrors } from '../components/Auth/types';
import { validateSignUp, validateField } from '../utils/authValidation';

const INITIAL_FORM: SignUpFormData = {
  prn: '', fullName: '', email: '', password: '', confirmPassword: '',
};

const SignUp: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm]           = useState<SignUpFormData>(INITIAL_FORM);
  const [errors, setErrors]       = useState<SignUpErrors>({});
  const [touched, setTouched]     = useState<Partial<Record<keyof SignUpFormData, boolean>>>({});
  const [step, setStep]           = useState<1 | 2>(1);
  const [direction, setDirection] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const passwordMatch =
    form.confirmPassword.length > 0 ? form.password === form.confirmPassword : null;

  const handleChange = useCallback(
    (field: keyof SignUpFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setForm((prev) => ({ ...prev, [field]: value }));
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
    await new Promise((res) => setTimeout(res, 1800));
    setIsLoading(false);
    setSubmitted(true);
    setTimeout(() => navigate('/signin'), 1700);
  };

  if (submitted) return <SuccessScreen />;

  return (
    <AuthCard
      title={step === 1 ? 'Create your account' : 'Secure your account'}
      subtitle={step === 1
        ? 'Join the Code Vimarsh developer community'
        : 'Set a strong password to protect your account'
      }
    >
      <form onSubmit={handleSubmit} noValidate>
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
          </AnimatePresence>
        </div>
      </form>
    </AuthCard>
  );
};

export default SignUp;
