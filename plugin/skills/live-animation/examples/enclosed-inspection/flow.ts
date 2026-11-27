// Illustrative dimensions and timing; the installation brief supplies the method of transfer.
import job from "./job.mjs";
import { cycle, rejectX, rejectEnd, rejectPose } from "./reject-cycle.mjs";

if (job.items.length !== 2 || job.items[0].id === job.items[1].id)
  throw new Error("This two-item mechanism needs two distinct product IDs.");
export const sideReject = job.reject === "side-pusher";
if (job.reject && !sideReject)
  throw new Error("Select or build the reject mechanism described in the brief.");
if (sideReject && (job.transport !== "indexing" || job.product.construction !== "taped-carton" ||
    !job.items[0].readable || job.items[1].readable))
  throw new Error("The side-pusher study requires indexed taped cartons, a readable leading carton and an unreadable trailing carton.");

export const duration = sideReject ? rejectEnd : 13;
export function travel(t: number) {
  if (job.transport === "continuous") return 0.168 * t;
  if (t < 3) return 0.24 * t;
  if (t < 4.5) return 0.72;
  if (t < 8) return 0.72 + 0.24 * (t - 4.5);
  if (t < 9.5) return 1.56;
  if (sideReject && t >= cycle.stop) return 1.56 + rejectX + 0.24 * Math.max(0,t-cycle.advance);
  return 1.56 + 0.24 * (t - 9.5);
}

export const cartons = job.items.map((item, index) => {
  const read = index === 0 ? 3 : 8;
  return {
    id: item.id,
    label: job.product.name + " " + item.id,
    pass: item.readable,
    start: -travel(read),
    read,
  };
});
export function state(t: number) {
  return cartons.map((c) => ({
    ...c,
    x: sideReject && !c.pass && t>=cycle.stop ? rejectX : c.start + travel(t),
    z: sideReject && !c.pass ? rejectPose(t).z : 0,
    result: t >= c.read + 0.32 ? (c.pass ? "OK" : "NOK") : null,
  }));
}
