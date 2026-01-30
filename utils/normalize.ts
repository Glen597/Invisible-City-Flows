export function clamp01(x: number): number {
  return Math.max(0, Math.min(1, x));
}

export function normalize(x: number, min: number, max: number): number {
  if (max <= min) return 0;
  return clamp01((x - min) / (max - min));
}

