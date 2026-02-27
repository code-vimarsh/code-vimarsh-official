import React from 'react';

interface TechBadgeProps {
  label: string;
  /** Pass `highlight` true for the first few badges or important ones */
  highlight?: boolean;
}

export const TechBadge: React.FC<TechBadgeProps> = ({ label, highlight = false }) => (
  <span
    className={`
      inline-flex items-center text-xs font-mono px-2.5 py-1 rounded-md border
      transition-colors duration-200 select-none
      ${highlight
        ? 'bg-primary/10 border-primary/30 text-primary hover:bg-primary/20'
        : 'bg-bgDark border-surfaceLight text-textMuted hover:border-primary/40 hover:text-textMain'
      }
    `}
  >
    {label}
  </span>
);
