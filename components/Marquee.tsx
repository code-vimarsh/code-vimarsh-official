import React from 'react';
import { motion } from 'framer-motion';

interface MarqueeProps {
    children: React.ReactNode;
    direction?: 'left' | 'right';
    speed?: number;
    pauseOnHover?: boolean;
    isPaused?: boolean;
}

const Marquee: React.FC<MarqueeProps> = ({
    children,
    direction = 'left',
    speed = 40,
    pauseOnHover = true,
    isPaused = false
}) => {
    const [hovered, setHovered] = React.useState(false);
    const shouldPause = isPaused || (pauseOnHover && hovered);

    const marqueeVariants = {
        animate: {
            x: direction === 'left' ? ['0%', '-100%'] : ['-100%', '0%'],
            transition: {
                x: {
                    repeat: Infinity,
                    repeatType: "loop" as const,
                    duration: speed,
                    ease: "linear" as any,
                },
            },
        },
    };

    return (
        <div
            className="flex overflow-hidden select-none w-full"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <motion.div
                className="flex shrink-0 min-w-full items-center justify-start gap-8 py-4"
                variants={marqueeVariants}
                animate={shouldPause ? "" : "animate"}
            >
                {children}
                {children}
            </motion.div>

            {/* Second set for seamless loop */}
            <motion.div
                className="flex shrink-0 min-w-full items-center justify-start gap-8 py-4"
                variants={marqueeVariants}
                animate={shouldPause ? "" : "animate"}
            >
                {children}
                {children}
            </motion.div>
        </div>
    );
};

export default Marquee;
