import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { observations } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

const lat = Number(searchParams.get("lat"));
  const lng = Number(searchParams.get("lng"));

  if(isNaN(lat) || isNaN(lng)) {
    return NextResponse.json({ error: "Invalid or missing lat/lng parameters" }, { status: 400 });
  }

  //we fetch the last observation nearby

    const result = await db.execute(sql`
      SELECT 
      value,
      measured_at,
      lng,
      lat,
      source
      FROM ${observations}
      ORDER BY  measured_at DESC
    LIMIT 1
    `);

    if (result.length === 0) {
      return NextResponse.json({ error: "No observations found" }, { status: 404 });
    }

    const observation = result[0];

    return NextResponse.json({
      temperature: observation.value,
      measuredAt: observation.measured_at,
      lng: observation.lng,
      lat: observation.lat,
      source: observation.source,
    });

}