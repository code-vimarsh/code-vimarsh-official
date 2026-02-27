import React from 'react';
import { motion } from 'framer-motion';

// ─── Step progress dots shown at the top of the SignUp form ───────────────────

const StepDots: React.FC<{ step: 1 | 2 }> = ({ step }) => (
  <div className="flex items-center justify-center gap-2 mb-6" aria-label={`Step ${step} of 2`}>
    {[1, 2].map((s) => (
      <motion.div
        key={s}
        animate={
          s === step
            ? { width: 24, backgroundColor: '#ff6a00', opacity: 1 }
            : { width: 8, backgroundColor: 'rgba(255,255,255,0.12)', opacity: 1 }
        }
        transition={{ duration: 0.35, ease: 'easeInOut' }}
        className="h-1.5 rounded-full"
      />
    ))}
    <span className="sr-only">Step {step} of 2</span>
  </div>
);

export default StepDots;
