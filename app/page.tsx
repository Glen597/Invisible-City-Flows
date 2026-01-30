'use client'
import MappView from "../Component/Mappview";
import InfoPanel from "@/Component/infoPanel";
import { useState } from "react";
import {SelectedPoint} from "../types";
import type { PointApiResponse } from "../app/api/point/type";


export default function Home() {
  const [selectedPoint, setSelectedPoint] = useState<SelectedPoint | null>(null);; // Placeholder for state management
  const [pointData, setPointData] = useState<PointApiResponse | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleMapClick(coords: SelectedPoint) {
    setSelectedPoint(coords); // ✅ Set coords immediately for marker
    setLoading(true);
    
    try {
      const res = await fetch(`/api/point?lng=${coords.lng}&lat=${coords.lat}`);
      const data: PointApiResponse = await res.json();
      setPointData(data);
    } catch (error) {
      console.error("Error fetching point data:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
  
    <div>
      <section>
        <MappView onMapClick={handleMapClick} />
      </section>
      <section className="">
        <InfoPanel pointData={pointData} loading={loading}/>
      </section>
        
    </div>

  );
}
