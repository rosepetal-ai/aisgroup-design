// Metres and illustrative seconds. The trial follows one indexed, side-pushed carton.
export const rejectX = 0.66;
export const parkedZ = 0.31;
export const homeFace = -0.18;
export const contactFace = -0.105;
export const rejectEnd = 16.65;
export const cycle = { stop: 12.25, approach: 12.3, contact: 12.85, deposit: 14.3, return: 14.6, home: 15.75, advance: 16 };

function ease(t, start, end) {
  const u = Math.max(0,Math.min(1,(t-start)/(end-start)));
  return u*u*u*(10+u*(-15+6*u));
}

export function rejectPose(t) {
  const z = parkedZ * ease(t, cycle.contact, cycle.deposit);
  const extendedFace = homeFace + (contactFace-homeFace)*ease(t, cycle.approach, cycle.contact) + z;
  const face = extendedFace + (homeFace-extendedFace)*ease(t,cycle.return,cycle.home);
  return { z, face };
}
