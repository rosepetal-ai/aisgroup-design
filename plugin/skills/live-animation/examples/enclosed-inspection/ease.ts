// AIS motion curves as plain easing functions p -> eased p (CSS cubic-bezier semantics), usable both as GSAP `ease`
// values and inside pure functions of t. GSAP core has no cubic-bezier ease and CustomEase is not registered here.

/** CSS cubic-bezier(x1, y1, x2, y2) as a function of progress in [0, 1] (Newton + bisection on x). */
export function cubicBezier(x1: number, y1: number, x2: number, y2: number): (p: number) => number {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const sx = (u: number) => ((ax * u + bx) * u + cx) * u;
  const sy = (u: number) => ((ay * u + by) * u + cy) * u;
  const dx = (u: number) => (3 * ax * u + 2 * bx) * u + cx;
  return (p: number) => {
    if (p <= 0) return 0;
    if (p >= 1) return 1;
    let u = p;
    for (let i = 0; i < 8; i++) {
      const e = sx(u) - p;
      if (Math.abs(e) < 1e-7) return sy(u);
      const d = dx(u);
      if (Math.abs(d) < 1e-6) break;
      u -= e / d;
    }
    let lo = 0, hi = 1;
    u = p;
    for (let i = 0; i < 40; i++) {
      if (sx(u) < p) lo = u; else hi = u;
      u = (lo + hi) / 2;
    }
    return sy(u);
  };
}

/** Entrances: cubic-bezier(0.16, 1, 0.3, 1). */
export const AIS_IN = cubicBezier(0.16, 1, 0.3, 1);
/** Exits: cubic-bezier(0.4, 0, 1, 1). */
export const AIS_OUT = cubicBezier(0.4, 0, 1, 1);
/** Standard: cubic-bezier(0.2, 0, 0, 1). */
export const AIS_STD = cubicBezier(0.2, 0, 0, 1);
