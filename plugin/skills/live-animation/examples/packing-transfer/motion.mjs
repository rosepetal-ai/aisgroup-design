// Metres and seconds. X follows the cylinder stroke. Y is the carrying plane normal.
export const deck = 1.0,
  size = [0.118, 0.145, 0.15],
  duration = 9;
const start = -0.105,
  pickup = 0.045,
  destination = 0.299;
const strokeStart = start - size[0] / 2 - 0.04;
function blend(t, a, b) {
  const u = Math.min(1, Math.max(0, (t - a) / (b - a)));
  return u * u * u * (10 + u * (6 * u - 15));
}
export function stateAt(t) {
  const stroke = blend(t, 0.25, 2.35),
    retraction = blend(t, 2.48, 3.7);
  const extended = pickup - size[0] / 2;
  const blade = strokeStart + (extended - strokeStart) * stroke * (1 - retraction);
  // A carton moves only after the blade has taken up the clearance.
  const pushed = Math.max(
    start,
    Math.min(pickup, strokeStart + (extended - strokeStart) * stroke + size[0] / 2),
  );
  const carry = blend(t, 4.95, 6.4),
    rise = blend(t, 4.28, 5.12) - blend(t, 6.27, 7.1);
  const x = pushed + (destination - pickup) * carry;
  const y = deck + size[1] / 2 + 0.105 * rise;
  const engage = blend(t, 2.85, 4.05),
    release = blend(t, 7.28, 8.65);
  // Hands start near the operator, approach the waiting carton, then separate after set-down.
  const grip = (side) => {
    const homeX = 0.16 + side * 0.165,
      homeY = 1.095,
      homeZ = -0.18;
    const holdX = pickup + (destination - pickup) * carry + (side * size[0]) / 2;
    const mix = (a, b, k) => a + (b - a) * k;
    return [
      mix(mix(homeX, holdX, engage), homeX, release) +
        side * 0.058 * (Math.sin(Math.PI * engage) + Math.sin(Math.PI * release)),
      mix(mix(homeY, y + 0.01, engage), homeY, release),
      mix(mix(homeZ, 0, engage), homeZ, release),
    ];
  };
  return {
    blade,
    x,
    y,
    carry,
    rise,
    engage,
    release,
    grip,
    phase:
      t < 0.25
        ? 'Ready'
        : t < 2.48
          ? 'Transfer'
          : t < 4.28
            ? 'Grasp'
            : t < 6.27
              ? 'Lift and carry'
              : t < 7.28
                ? 'Set down'
                : 'Release',
  };
}
