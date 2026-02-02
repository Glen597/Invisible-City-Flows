'use client'

import MapView from "../Component/Mappview";
import DataCard from "@/Component/DataCard";
import { PointApiResponse } from "@/type";
import { useState } from "react";

export default function Home() {

  const [pointData, setPointData] = useState<PointApiResponse | null>(null);
  const [searchCity, setSearchCity] = useState("");
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(false);



 async function handleCitySearch() {
  const q = searchCity.trim();
  if (!q) return;

  setLoading(true);

  try {
    // 1️⃣ Ingestion + geocoding
    const resCity = await fetch(`/api/city?name=${encodeURIComponent(q)}`);
    const cityData = await resCity.json();

    if (!resCity.ok) {
      alert(cityData?.error ?? "City not found");
      return;
    }

    const lng = cityData.city.lng;
    const lat = cityData.city.lat;

    // 2️⃣ Move map
    setMapCenter([lng, lat]);

    // 3️⃣ READ DB (single source of truth)
    const resPoint = await fetch(`/api/point?lng=${lng}&lat=${lat}`);
    const pointJson: PointApiResponse = await resPoint.json();

    if (!resPoint.ok) {
      alert("Could not load point data");
      return;
    }

    setPointData(pointJson);
  } catch (err) {
    console.error(err);
    alert("Server error");
  } finally {
    setLoading(false);
  }
}

  async function handleMapClick(coords: { lng: number; lat: number }) {
  try {
    const res = await fetch(
      `/api/point?lng=${coords.lng}&lat=${coords.lat}`
    );
    const data: PointApiResponse = await res.json();
    console.log("API RESPONSE:", data);
    setPointData(data);
  } catch (err) {
    console.error("API error", err);
  }
}

  return (
    <div className="h-screen w-full flex flex-col">
      
      {/* HEADER */}
      <header className="h-14 flex items-center justify-between px-4 border-b bg-white">
  <div className="flex items-center gap-2">
    <div className="w-2 h-2 rounded-full bg-blue-500" />
    <span className="font-semibold text-lg">Invisible City Flows</span>
  </div>
  <input
  type="text"
  placeholder="Search a city..."
  className="border rounded-md px-3 py-1 text-sm w-56 bg-gray-50"
  value={searchCity}
  onChange={(e) => setSearchCity(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      handleCitySearch();
    }
  }}
/>
</header>

      {/* MAIN CONTENT */}
      <div className="flex flex-1 overflow-hidden">

        {/* LEFT PANEL */}
        <aside className="w-[320px] border-r bg-gray-50 p-3 overflow-y-auto"> 
  <div className="space-y-3">

    <DataCard
      title="Air"
       value={
  pointData?.air?.pm25 != null
    ? `${Math.round(pointData.air.pm25)} μg/m³`
    : "—"
}
      subtitle="Air quality index"
       className="border-l-4 border-green-400"
    />

    <DataCard
      title="Meteo"
      value={pointData?.meteo.temperature !== null
        ? `${pointData?.meteo.temperature} °C`
        : "—"}
      subtitle="City-level temperature"
      className="border-l-4 border-orange-400"
      
    />

    <DataCard
      title="Noise"
      value={
  pointData?.noise?.level != null
    ? `${Math.round(pointData.noise.level * 100)} %`
    : "—"
}
subtitle={pointData?.noise?.label ?? ""}
       className="border-l-4 border-yellow-400"
    />

    <DataCard
      title="Stress"
      value={pointData
        ? `${Math.round(pointData.stress.index * 100)} %`
        : "—"}
      subtitle={pointData?.stress.label}
       className="border-l-4 border-red-400"
    />

  </div>
</aside>

        {/* MAP */}
        <main className="flex-1 relative">
          <MapView onMapClick={handleMapClick} 
          center={mapCenter}/>
        </main>

      </div>
    </div>
  );
}
