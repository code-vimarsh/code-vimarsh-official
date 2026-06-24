import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error';

interface ToastProps {
  message: string;
  type: ToastType;
  visible: boolean;
  onClose: () => void;
  durationMs?: number;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type,
  visible,
  onClose,
  durationMs = 4000,
}) => {
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(onClose, durationMs);
    return () => clearTimeout(timer);
  }, [visible, durationMs, onClose]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          className="
            fixed bottom-6 right-6 z-[9999]
            flex items-center gap-3
            min-w-[280px] max-w-sm
            bg-surface border rounded-xl px-4 py-3.5
            shadow-2xl
          "
          style={{
            borderColor: type === 'success' ? 'rgba(0,255,157,0.35)' : 'rgba(255,80,80,0.35)',
            boxShadow:
              type === 'success'
                ? '0 8px 40px rgba(0,255,157,0.1)'
                : '0 8px 40px rgba(255,80,80,0.1)',
          }}
        >
          {type === 'success' ? (
            <CheckCircle size={18} className="text-accentGreen shrink-0" />
          ) : (
            <XCircle size={18} className="text-red-400 shrink-0" />
          )}

          <p className="text-sm text-textMain flex-1 leading-snug">{message}</p>

          <button
            onClick={onClose}
            className="text-textMuted hover:text-textMain transition-colors shrink-0 ml-1"
            aria-label="Dismiss notification"
          >
            <X size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/** Simple hook to manage Toast state */
export function useToast() {
  const [toast, setToast] = React.useState<{
    message: string;
    type: ToastType;
    visible: boolean;
  }>({ message: '', type: 'success', visible: false });

  const showToast = React.useCallback((message: string, type: ToastType = 'success') => {
    setToast({ message, type, visible: true });
  }, []);

  const hideToast = React.useCallback(() => {
    setToast((prev) => ({ ...prev, visible: false }));
  }, []);

  return { toast, showToast, hideToast };
}
