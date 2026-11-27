// Example dimensions in metres and time in seconds. Replace them with measured station data.
const speed = 0.25;
const pitch = 0.10;
const sensorX = 0.30;
const rejectX = 0.60;
const drop = 0.16;

export function productAt(id, time) {
  const birth = id * pitch / speed;
  const age = time - birth;
  const inspected = time >= birth + sensorX / speed;
  const defect = id % 5 === 2 ? 'missing cap' : null;
  const release = birth + rejectX / speed;
  const falling = defect !== null && time >= release;
  return {
    id, defect,
    visible: age >= 0 && age * speed < 0.95 && !(falling && 4.905 * (time - release) ** 2 >= drop),
    verdict: inspected ? (defect ? 'NOK' : 'OK') : null,
    x: age * speed,
    y: falling ? -Math.min(drop, 4.905 * (time - release) ** 2) : 0
  };
}
