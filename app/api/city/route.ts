import { NextRequest } from "next/server";
import { db } from "@/db/client";
import { cities, metrics, observations } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name");

  if (!name) {
    return Response.json({ error: "City name missing" }, { status: 400 });
  }

  // 1️⃣ Geocoding via Open-Meteo
  const geoRes = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      name
    )}&count=1`
  );
  const geoData = await geoRes.json();

  if (!geoData.results || geoData.results.length === 0) {
    return Response.json({ error: "City not found" }, { status: 404 });
  }

  const geo = geoData.results[0];

  // Bounding box handling
  let bboxMinLat: number;
  let bboxMaxLat: number;
  let bboxMinLng: number;
  let bboxMaxLng: number;

  if (Array.isArray(geo.boundingbox)) {
    [bboxMinLat, bboxMaxLat, bboxMinLng, bboxMaxLng] = geo.boundingbox;
  } else {
    const delta = 0.1;
    bboxMinLat = geo.latitude - delta;
    bboxMaxLat = geo.latitude + delta;
    bboxMinLng = geo.longitude - delta;
    bboxMaxLng = geo.longitude + delta;
  }

  // 2️⃣ Upsert city
  const [city] = await db
    .insert(cities)
    .values({
      name: geo.name,
      countryCode: geo.country_code,
      timezone: geo.timezone,
      centerLat: geo.latitude,
      centerLng: geo.longitude,
      bboxMinLat,
      bboxMaxLat,
      bboxMinLng,
      bboxMaxLng,
    })
    .onConflictDoUpdate({
      target: cities.name,
      set: {
        centerLat: geo.latitude,
        centerLng: geo.longitude,
        timezone: geo.timezone,
        bboxMinLat,
        bboxMaxLat,
        bboxMinLng,
        bboxMaxLng,
      },
    })
    .returning();

  // 3️⃣ Metric lookup
  const metric = await db.query.metrics.findFirst({
    where: eq(metrics.key, "temperature"),
  });

  if (!metric) {
    return Response.json({ error: "Metric not found" }, { status: 500 });
  }

  // 🔁 CHECK CACHE (10 minutes)
  const lastObs = await db.query.observations.findFirst({
    where: and(
      eq(observations.cityId, city.id),
      eq(observations.metricId, metric.id)
    ),
    orderBy: desc(observations.measuredAt),
  });

  const TEN_MINUTES = 10 * 60 * 1000;
  const now = Date.now();

  if (
    lastObs &&
    now - new Date(lastObs.measuredAt).getTime() < TEN_MINUTES
  ) {
    // ✅ Return cached value
    return Response.json({
      city: {
        name: city.name,
        lat: city.centerLat,
        lng: city.centerLng,
      },
      meteo: {
        temperature: lastObs.value,
        time: lastObs.measuredAt,
        source: lastObs.source,
      },
    });
  }

  // 4️⃣ Fetch weather (Open-Meteo)
  const meteoRes = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${city.centerLat}&longitude=${city.centerLng}&current_weather=true&timezone=${encodeURIComponent(
      city.timezone ?? "UTC"
    )}`
  );

  const meteoData = await meteoRes.json();
  const current = meteoData.current_weather;

  if (!current) {
    return Response.json({ error: "No weather data" }, { status: 500 });
  }

  // 5️⃣ Store observation
  await db.insert(observations).values({
    cityId: city.id,
    metricId: metric.id,
    value: current.temperature,
    source: "open-meteo",
    lng: city.centerLng,
    lat: city.centerLat,
    measuredAt: new Date(current.time + "Z"),
  });

  // 6️⃣ Respond
  return Response.json({
    city: {
      name: city.name,
      lat: city.centerLat,
      lng: city.centerLng,
    },
    meteo: {
      temperature: current.temperature,
      time: current.time,
      source: "open-meteo",
    },
  });
}
