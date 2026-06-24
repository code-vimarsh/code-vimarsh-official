// ─── Auth Form Types ──────────────────────────────────────────────────────────

export interface SignUpFormData {
  prn: string;
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface SignInFormData {
  prn: string;
  password: string;
}

export type PasswordStrengthLevel = 'idle' | 'weak' | 'medium' | 'strong';

export interface PasswordStrengthResult {
  level: PasswordStrengthLevel;
  score: number; // 0–4
  label: string;
}

// ─── Validation Error Map ─────────────────────────────────────────────────────

export type SignUpErrors = Partial<Record<keyof SignUpFormData, string>>;
export type SignInErrors = Partial<Record<keyof SignInFormData, string>>;

// ─── Shared Component Props ───────────────────────────────────────────────────

export interface FormInputProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  maxLength?: number;
  disabled?: boolean;
  placeholder?: string;
}

export interface PasswordInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  autoComplete?: string;
  disabled?: boolean;
}

export interface AuthButtonProps {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  fullWidth?: boolean;
  variant?: 'primary' | 'ghost';
}

export interface AuthCardProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}
