import { useState, useEffect, useRef, useCallback } from 'react';

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function useScrollProgress(sectionRef: React.RefObject<HTMLElement | null>) {
    const [progress, setProgress] = useState(0);
    const smoothProg = useRef<number>(0);
    const rafRef = useRef<number>(0);

    const calcTarget = useCallback(() => {
        const s = sectionRef.current;
        if (!s) return 0;
        const r = s.getBoundingClientRect();
        const vh = window.innerHeight;
        const scrollable = Math.max(r.height - vh, 1);
        const scrolled = -r.top;
        return Math.min(Math.max(scrolled / scrollable, 0), 1);
    }, [sectionRef]);

    useEffect(() => {
        smoothProg.current = calcTarget();
        setProgress(smoothProg.current);

        let alive = true;
        const tick = () => {
            if (!alive) return;
            smoothProg.current = lerp(smoothProg.current, calcTarget(), 0.10);
            setProgress(smoothProg.current);
            rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);
        return () => { alive = false; cancelAnimationFrame(rafRef.current); };
    }, [calcTarget]);

    return progress;
}
