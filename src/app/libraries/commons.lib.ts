export function randomBoxMuller({ mean = 0, variance = 1, min = -Infinity, max = Infinity }) {
  let u = 0., v = 0.;

  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();

  const Z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return Math.min(Math.max(Z * variance + mean, min), max);
}

