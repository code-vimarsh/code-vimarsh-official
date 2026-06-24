import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TerminalLoaderProps {
  onComplete: () => void;
}

const TerminalLoader: React.FC<TerminalLoaderProps> = ({ onComplete }) => {
  const [lines, setLines] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [memoryHex, setMemoryHex] = useState('0x000000');

  const bootSequence = [
    "INITIALIZING KERNEL...",
    "MOUNTING VFS... [OK]",
    "LOADING 3D CONTEXT... [OK]",
    "ESTABLISHING DATABASE CONNECTION...",
    "AUTHENTICATING SECURE PAYLOADS...",
    "SYSTEM READY. WELCOME TO CODE VIMARSH."
  ];

  useEffect(() => {
    let currentLine = 0;

    // Line typing sequence
    const lineInterval = setInterval(() => {
      if (currentLine >= bootSequence.length) {
        clearInterval(lineInterval);
        return;
      }

      const line = bootSequence[currentLine];

      if (line) {
        setLines(prev => [...prev, `> ${line}`]);
      }

      currentLine++;
    }, 350);

    // Progress bar logic
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(onComplete, 800);
          return 100;
        }

        const next = prev + Math.floor(Math.random() * 15) + 5;
        return next > 100 ? 100 : next;
      });
    }, 150);

    // Memory hex flasher
    const hexInterval = setInterval(() => {
      setMemoryHex(
        `0x${Math.floor(Math.random() * 16777215)
          .toString(16)
          .toUpperCase()
          .padStart(6, '0')}`
      );
    }, 50);

    return () => {
      clearInterval(lineInterval);
      clearInterval(progressInterval);
      clearInterval(hexInterval);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-bgDark flex flex-col items-center justify-center p-6 font-mono selection:bg-primary"
      exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <div className="w-full max-w-3xl flex flex-col justify-between h-[60vh]">
        
        {/* Terminal Header */}
        <div className="text-xs text-textMuted flex justify-between border-b border-surfaceLight pb-2 mb-4">
          <span>VIMARSH_OS v2.0.26</span>
          <span>MEM: {memoryHex}</span>
        </div>

        {/* Console Output */}
        <div className="flex-1 overflow-hidden flex flex-col justify-end space-y-2 text-sm sm:text-base">
          {lines.map((line, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`${
                index === bootSequence.length - 1
                  ? 'text-primary font-bold drop-shadow-[0_0_8px_rgba(255,106,0,0.8)] mt-4'
                  : 'text-textMuted'
              }`}
            >
              {line}
            </motion.div>
          ))}

          {/* Blinking Cursor */}
          <motion.div
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="w-3 h-5 bg-primary mt-2"
          />
        </div>

        {/* Progress Bar */}
        <div className="mt-8 space-y-2">
          <div className="flex justify-between text-xs font-bold text-textMuted">
            <span>BOOT PROGRESS</span>
            <span className="text-primary">{progress}%</span>
          </div>

          <div className="w-full h-1 bg-surface border border-surfaceLight overflow-hidden">
            <motion.div
              className="h-full bg-primary shadow-[0_0_15px_rgba(255,106,0,0.8)]"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "linear" }}
            />
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default TerminalLoader;
