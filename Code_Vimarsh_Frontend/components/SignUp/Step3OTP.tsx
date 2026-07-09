import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface Step3OTPProps {
  email: string;
  isLoading: boolean;
  onVerify: (otp: string) => void;
  onResend: () => void;
  direction: number;
}

export const Step3OTP: React.FC<Step3OTPProps> = ({
  email,
  isLoading,
  onVerify,
  onResend,
  direction,
}) => {
  const [digits, setDigits] = useState<string[]>(Array(8).fill(''));
  const [cooldown, setCooldown] = useState(60);
  const [errorMsg, setErrorMsg] = useState('');
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input on mount
    inputsRef.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleChange = (index: number, value: string) => {
    const cleanValue = value.replace(/[^0-9]/g, '');
    if (!cleanValue) return;

    const newDigits = [...digits];
    newDigits[index] = cleanValue.slice(-1);
    setDigits(newDigits);

    if (index < 7) {
      inputsRef.current[index + 1]?.focus();
    }
    setErrorMsg('');
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const cleanValue = pastedData.replace(/[^0-9]/g, '');
    if (!cleanValue) return;

    const newDigits = [...digits];
    const parts = cleanValue.slice(0, 8).split('');
    parts.forEach((char, i) => {
      newDigits[i] = char;
    });
    setDigits(newDigits);

    const nextFocus = Math.min(parts.length, 7);
    inputsRef.current[nextFocus]?.focus();
    setErrorMsg('');
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      const newDigits = [...digits];
      if (digits[index] === '') {
        // Focus previous box and clear it
        if (index > 0) {
          newDigits[index - 1] = '';
          setDigits(newDigits);
          inputsRef.current[index - 1]?.focus();
        }
      } else {
        newDigits[index] = '';
        setDigits(newDigits);
      }
      setErrorMsg('');
    }
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otp = digits.join('');
    if (otp.length < 8) {
      setErrorMsg('Please enter all 8 digits of the OTP.');
      return;
    }
    onVerify(otp);
  };

  const handleResendClick = () => {
    if (cooldown === 0) {
      setDigits(Array(8).fill(''));
      setErrorMsg('');
      setCooldown(60);
      onResend();
      inputsRef.current[0]?.focus();
    }
  };

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  return (
    <motion.div
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="space-y-6 py-4"
    >
      <div className="text-center space-y-2">
        <p className="text-sm text-[#88888b]">
          We have sent an 8-digit verification code to
        </p>
        <p className="text-sm font-semibold text-white truncate max-w-full px-4">
          {email}
        </p>
      </div>

      <div className="flex justify-center gap-1.5 sm:gap-2 py-4">
        {digits.map((digit, index) => (
          <input
            key={index}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            ref={(el) => { inputsRef.current[index] = el; }}
            className="flex-1 min-w-[28px] max-w-[36px] sm:max-w-[40px] aspect-[4/5] text-center text-lg sm:text-xl font-bold bg-[#15151b]/70 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-lg"
          />
        ))}
      </div>

      {errorMsg && (
        <p className="text-xs text-red-500 text-center font-medium">
          {errorMsg}
        </p>
      )}

      <div className="flex justify-between items-center text-xs px-2">
        <span className="text-[#88888b]">
          Didn't receive the email?
        </span>
        <button
          type="button"
          onClick={handleResendClick}
          disabled={cooldown > 0}
          className={`font-semibold transition-colors ${cooldown > 0 ? 'text-[#88888b] cursor-not-allowed' : 'text-primary hover:text-primary/80'}`}
        >
          {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Code'}
        </button>
      </div>

      <button
        type="button"
        onClick={handleVerifySubmit}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-white bg-primary hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/10"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Verifying Code...
          </>
        ) : (
          'Verify & Register'
        )}
      </button>
    </motion.div>
  );
};
