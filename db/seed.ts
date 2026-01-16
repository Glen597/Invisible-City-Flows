import "dotenv/config";
import { db, sql } from "./client";
import { cities, metrics } from "./schema";

async function main() {
  // Cities
  await db
    .insert(cities)
    .values([
      {
        name: "Berlin",
        countryCode: "DE",
        timezone: "Europe/Berlin",
        centerLng: 13.405,
        centerLat: 52.52,
        bboxMinLng: 13.0884,
        bboxMinLat: 52.3383,
        bboxMaxLng: 13.7612,
        bboxMaxLat: 52.6755,
      },
      {
        name: "Paris",
        countryCode: "FR",
        timezone: "Europe/Paris",
        centerLng: 2.3522,
        centerLat: 48.8566,
        bboxMinLng: 2.2241,
        bboxMinLat: 48.8156,
        bboxMaxLng: 2.4699,
        bboxMaxLat: 48.9022,
      },
      {
        name: "Nürnberg",
        countryCode: "DE",
        timezone: "Europe/Berlin",
        centerLng: 11.0767,
        centerLat: 49.4521,
        bboxMinLng: 10.9666,
        bboxMinLat: 49.3754,
        bboxMaxLng: 11.1799,
        bboxMaxLat: 49.5113,
      },
    ])
    // onConflictDoNothing to avoid duplicate entries when re-running the seed
    .onConflictDoNothing();

  // Metrics
  await db
    .insert(metrics)
    .values([
      { key: "pm25", category: "air", unit: "µg/m³" },
      { key: "no2", category: "air", unit: "µg/m³" },
      { key: "temperature", category: "meteo", unit: "°C" },
      { key: "windspeed", category: "meteo", unit: "km/h" },
    ])
    .onConflictDoNothing();

  console.log("✅ Seed done (cities + metrics)");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await sql.end({ timeout: 5 });
  });
