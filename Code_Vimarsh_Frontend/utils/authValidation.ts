import { SignUpFormData, SignInFormData, SignUpErrors, SignInErrors } from '../components/Auth/types';

// ─── Sign Up Validation ───────────────────────────────────────────────────────

export function validateSignUp(data: SignUpFormData): SignUpErrors {
  const errors: SignUpErrors = {};

  // PRN – numeric only, typically 10–12 digits
  if (!data.prn.trim()) {
    errors.prn = 'PRN is required.';
  } else if (!/^\d+$/.test(data.prn.trim())) {
    errors.prn = 'PRN must contain numbers only.';
  } else if (data.prn.trim().length < 6 || data.prn.trim().length > 12) {
    errors.prn = 'PRN must be between 6 and 12 digits.';
  }

  // Full Name
  if (!data.fullName.trim()) {
    errors.fullName = 'Full name is required.';
  } else if (data.fullName.trim().length < 3) {
    errors.fullName = 'Name must be at least 3 characters.';
  } else if (!/^[a-zA-Z\s.'-]+$/.test(data.fullName.trim())) {
    errors.fullName = 'Name may only contain letters and spaces.';
  }

  // Email
  if (!data.email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email.trim())) {
    errors.email = 'Enter a valid email address.';
  }

  // Password
  const pwd = data.password;
  if (!pwd) {
    errors.password = 'Password is required.';
  } else if (pwd.length < 8) {
    errors.password = 'Password must be at least 8 characters.';
  } else if (!/[A-Z]/.test(pwd)) {
    errors.password = 'Must contain at least one uppercase letter.';
  } else if (!/[a-z]/.test(pwd)) {
    errors.password = 'Must contain at least one lowercase letter.';
  } else if (!/[0-9]/.test(pwd)) {
    errors.password = 'Must contain at least one number.';
  } else if (!/[^A-Za-z0-9]/.test(pwd)) {
    errors.password = 'Must contain at least one special character.';
  }

  // Confirm Password
  if (!data.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password.';
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return errors;
}

// ─── Sign In Validation ───────────────────────────────────────────────────────

export function validateSignIn(data: SignInFormData): SignInErrors {
  const errors: SignInErrors = {};

  if (!data.prn.trim()) {
    errors.prn = 'PRN is required.';
  } else if (!/^\d+$/.test(data.prn.trim())) {
    errors.prn = 'PRN must contain numbers only.';
  }

  if (!data.password) {
    errors.password = 'Password is required.';
  }

  return errors;
}

// ─── Single field validators (for real-time inline feedback) ─────────────────

export function validateField(
  name: keyof SignUpFormData,
  value: string,
  allData?: Partial<SignUpFormData>
): string {
  const stub = {
    prn: '', fullName: '', email: '',
    password: '', confirmPassword: '',
    ...allData,
    [name]: value,
  } as SignUpFormData;

  const errors = validateSignUp(stub);
  return errors[name] ?? '';
}
