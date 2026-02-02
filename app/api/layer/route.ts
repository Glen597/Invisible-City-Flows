import { NextRequest } from "next/server";
import { db } from "@/db/client";
import { observations, metrics} from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const layer = searchParams.get("layer");

  if (layer !== "temperature") {
    return Response.json({ error: "Invalid layer" }, { status: 400 });
  }

  // 1️⃣ Get temperature metric
  const metric = await db.query.metrics.findFirst({
    where: eq(metrics.key, "temperature"),
  });

  if (!metric) {
    return Response.json({ error: "Metric not found" }, { status: 500 });
  }

  // 2️⃣ Get latest temperature per city
  const rows = await db
    .select({
      value: observations.value,
      lng: observations.lng,
      lat: observations.lat,
    })
    .from(observations)
    .where(eq(observations.metricId, metric.id))
    .orderBy(desc(observations.measuredAt))
    .limit(50);

  // 3️⃣ Convert to GeoJSON
  const features = rows.map((r) => ({
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [r.lng, r.lat],
    },
    properties: {
      value: r.value,
    },
  }));

  return Response.json({
    type: "FeatureCollection",
    features,
  });
}
