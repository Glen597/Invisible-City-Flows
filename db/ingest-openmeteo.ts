import "dotenv/config";
import { db, sql } from "./client";
import { cities, metrics, observations } from "./schema";
import { eq } from "drizzle-orm";

async function main() {

  // 1️⃣ Récupérer TOUTES les villes
  const allCities = await db.select().from(cities);

  if (allCities.length === 0) {
    throw new Error("No cities found in database.");
  }

  // 2️⃣ Récupérer la métrique "temperature"
  const tempMetric = await db.query.metrics.findFirst({
    where: eq(metrics.key, "temperature"),
  });

  if (!tempMetric) {
    throw new Error("Temperature metric not found.");
  }

  // 3️⃣ Boucle sur chaque ville
  for (const city of allCities) {

    console.log(`🌍 Fetching weather for ${city.name}...`);

    // 4️⃣ Appel Open-Meteo pour la ville
    const url =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${city.centerLat}` +
      `&longitude=${city.centerLng}` +
      `&current_weather=true` +
      `&timezone=${encodeURIComponent(city.timezone ?? "UTC")}`;

    const response = await fetch(url);
    const data = await response.json();

    const current = data.current_weather;
    if (!current) {
      console.warn(`⚠️ No weather data for ${city.name}`);
      continue;
    }

    const temperature = current.temperature as number;
    const time = current.time as string;

    // 5️⃣ Insertion en base
    await db.insert(observations).values({
      cityId: city.id,
      metricId: tempMetric.id,
      value: temperature,
      source: "open-meteo",
      lng: city.centerLng,
      lat: city.centerLat,
      measuredAt: new Date(time + "Z"),
    });

    console.log(`✅ ${city.name}: ${temperature}°C at ${time}`);
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await sql.end({ timeout: 5 });
  });
