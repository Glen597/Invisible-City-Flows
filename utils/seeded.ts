export function seeded01(key: string): number {
  // simple hash -> [0,1)
  let h = 2166136261;
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  // convert to [0,1)
  return (h >>> 0) / 4294967296;
}
