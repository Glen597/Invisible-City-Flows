import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { observations, metrics } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { seeded01 } from "@/utils/seeded";
import { normalize } from "@/utils/normalize";
import { levelLabel01 } from "@/utils/label";

// Define the type for our query result
interface TemperatureRow extends Record<string, unknown>{
  value: number;
  measured_at: Date;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lng = Number(searchParams.get("lng"));
  const lat = Number(searchParams.get("lat"));
  const cityName = searchParams.get("city") ?? "Berlin";

  
  if (Number.isNaN(lng) || Number.isNaN(lat)) {
    return NextResponse.json({ error: "Invalid lng/lat" }, { status: 400 });
  }

  // --- 1) Meteo: latest temperature from DB
  const tempMetric = await db.query.metrics.findFirst({
    where: eq(metrics.key, "temperature"),
  });
  
  let temperature: number | null = null;
  let tempTime: string | null = null;
  
  if (tempMetric) {
    const rows = await db.execute<TemperatureRow>(sql`
      SELECT value, measured_at
      FROM observations
      WHERE metric_id = ${tempMetric.id}
      ORDER BY measured_at DESC
      LIMIT 1
    `);
    
    if (rows.length > 0) {
      const r = rows[0];
      temperature = Number(r.value);
      tempTime = new Date(r.measured_at).toISOString();
    }
  }

  // --- 2) Noise: computed stable 0..1
  const noiseKey = `${Math.round(lng * 1000)}:${Math.round(lat * 1000)}`;
  const noiseLevel = seeded01(noiseKey);
  const noiseLabel = levelLabel01(noiseLevel);

  // --- 3) Air: not implemented yet (OpenAQ ingestion later)
  const pm25: number | null = null;
  const no2: number | null = null;
  const airScore01 = 0;

  // --- 4) Stress: computed from temp + air + noise
  const tempScore01 =
    temperature === null ? 0 : normalize(temperature, 0, 35);
  const stress01 = Math.max(
    0,
    Math.min(1, 0.4 * tempScore01 + 0.3 * airScore01 + 0.3 * noiseLevel)
  );
  const stressLabel = levelLabel01(stress01);

  return NextResponse.json({
    point: { lng, lat },
    meteo: { temperature, time: tempTime, source: "openmeteo" },
    air: { pm25, no2, time: null, source: "openaq" },
    noise: { level: noiseLevel, label: noiseLabel, source: "computed" },
    stress: { index: stress01, label: stressLabel, source: "computed" },
  });
}