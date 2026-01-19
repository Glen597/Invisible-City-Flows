import "dotenv/config";
import { db, sql } from "./client";
import { cities, metrics, observations } from "./schema";  
import { eq } from "drizzle-orm";


async function main() {

    // Fetch data from Open-Meteo API (example for temperature and windspeed)
    const berlin = await db.query.cities.findFirst({
        where: eq(cities.name, "Berlin"),
    });

    if (!berlin) throw new Error("City not found in the database.");
    
    //2 Fetch temperature data for Berlin
    const tempMetric = await db.query.metrics.findFirst({
        where: eq(metrics.key, "temperature"),
    });

    if (!tempMetric) throw new Error("Temperature metric not found in the database.");

    // Fetch data from Open-Meteo API (example for temperature and windspeed)
    const url =`https://api.open-meteo.com/v1/forecast` +
  `?latitude=${berlin.centerLat}` +
  `&longitude=${berlin.centerLng}` +
  `&current_weather=true` +
  `&timezone=${encodeURIComponent(berlin.timezone || 'UTC')}`;
        
   const response = await fetch(url);
    const data = await response.json();

    const current = data.current_weather;
    if (!current) {
        throw new Error("No current weather data available.");
    }

    const temperature = current.temperature as number;
    const time = current.time as string;

    // Insert observation into the database
    await db.insert(observations).values({
        cityId: berlin.id,
        metricId: tempMetric.id,
        source: "openmeteo",
        value: temperature,
        lng: berlin.centerLng,
        lat: berlin.centerLat,
        measuredAt: new Date(time + "Z"), // Append 'Z' to indicate UTC
    });

    console.log(`✅ Ingested ${temperature}°C for Berlin at ${time}`);
}

main()
.catch(console.error)
.finally( async() => {
   await sql.end({timeout: 5}); 
});