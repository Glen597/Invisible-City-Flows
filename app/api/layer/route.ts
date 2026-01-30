import { NextResponse } from "next/server";
import { generateGrid } from "@/utils/grid";
import { seeded01 } from "@/utils/seeded";
import { normalize } from "@/utils/normalize";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const layer = searchParams.get("layer"); // noise | stress
  const bboxStr = searchParams.get("bbox");

  if (!layer || !bboxStr) {
    return NextResponse.json({ error: "Missing layer or bbox" }, { status: 400 });
  }

  const parts = bboxStr.split(",").map(Number);
  if (parts.length !== 4 || parts.some(Number.isNaN)) {
    return NextResponse.json({ error: "Invalid bbox format" }, { status: 400 });
  }

  const [minLng, minLat, maxLng, maxLat] = parts;

  const cells = generateGrid(minLng, minLat, maxLng, maxLat, 12, 12);

  const features = cells.map((cell) => {
    const key = `${Math.round(cell.centerLng * 1000)}:${Math.round(cell.centerLat * 1000)}`;
    const noise = seeded01(key);

    // Stress: for now only based on noise (we'll improve later using temp)
    const stress = normalize(noise, 0, 1); // 0..1

    const value = layer === "stress" ? stress : noise;

    return {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [[
          [cell.minLng, cell.minLat],
          [cell.maxLng, cell.minLat],
          [cell.maxLng, cell.maxLat],
          [cell.minLng, cell.maxLat],
          [cell.minLng, cell.minLat],
        ]],
      },
      properties: { value },
    };
  });

  return NextResponse.json({ type: "FeatureCollection", features });
}
