export function levelLabel01(v: number): "low" | "moderate" | "high" | "extreme" {
  if (v < 0.25) return "low";
  if (v < 0.5) return "moderate";
  if (v < 0.75) return "high";
  return "extreme";
}
