import React from 'react';
import { motion } from 'framer-motion';

interface MarqueeProps {
    children: React.ReactNode;
    direction?: 'left' | 'right';
    speed?: number;
    pauseOnHover?: boolean;
}

const Marquee: React.FC<MarqueeProps> = ({
    children,
    direction = 'left',
    speed = 40,
    pauseOnHover = true
}) => {
    return (
        <div className="flex overflow-hidden select-none group w-full">
            <motion.div
                className="flex shrink-0 min-w-full items-center justify-around gap-6"
                animate={{
                    x: direction === 'left' ? ['0%', '-100%'] : ['-100%', '0%'],
                }}
                transition={{
                    duration: speed,
                    repeat: Infinity,
                    ease: "linear",
                }}
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                }}
            >
                <div className={`flex shrink-0 items-center justify-around gap-6 ${pauseOnHover ? 'group-hover:[animation-play-state:paused]' : ''}`}>
                    {children}
                </div>
                <div className={`flex shrink-0 items-center justify-around gap-6 ${pauseOnHover ? 'group-hover:[animation-play-state:paused]' : ''}`}>
                    {children}
                </div>
            </motion.div>

            {/* Second set for seamless loop */}
            <motion.div
                className="flex shrink-0 min-w-full items-center justify-around gap-6"
                animate={{
                    x: direction === 'left' ? ['0%', '-100%'] : ['-100%', '0%'],
                }}
                transition={{
                    duration: speed,
                    repeat: Infinity,
                    ease: "linear",
                }}
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                }}
            >
                <div className={`flex shrink-0 items-center justify-around gap-6 ${pauseOnHover ? 'group-hover:[animation-play-state:paused]' : ''}`}>
                    {children}
                </div>
                <div className={`flex shrink-0 items-center justify-around gap-6 ${pauseOnHover ? 'group-hover:[animation-play-state:paused]' : ''}`}>
                    {children}
                </div>
            </motion.div>
        </div>
    );
};

export default Marquee;
