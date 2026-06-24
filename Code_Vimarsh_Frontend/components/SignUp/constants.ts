// ─── Shared animation constants for SignUp step transitions ───────────────────

export const SLIDE = {
  enter: (dir: number) => ({ x: dir * 48, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:   (dir: number) => ({ x: dir * -48, opacity: 0 }),
};

export const SLIDE_TRANSITION = { duration: 0.38, ease: [0.32, 0.72, 0, 1] as [number, number, number, number] };
