export type PointApiResponse = {
  point: { lng: number; lat: number };
  meteo: { temperature: number | null; time: string | null; source: string };
  air: { pm25: number | null; no2: number | null; time: string | null; source: string };
  noise: { level: number; label: string; source: string };
  stress: { index: number; label: string; source: string };
};
