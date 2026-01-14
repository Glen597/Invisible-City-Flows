'use client'
import React from "react";
import { useRef } from "react";
import { useEffect } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import maplibregl from "maplibre-gl";

const MappView: React.FC = () => {
     const mapContainerRef = useRef<HTMLDivElement | null>(null);
     const mapRef = useRef<maplibregl.Map | null>(null);

     useEffect(() => {
  if (!mapContainerRef.current) return;
      console.log("DOM exists", mapContainerRef.current);
  if (mapRef.current) return;

  const map = new maplibregl.Map({
    container: mapContainerRef.current,
    style:"https://demotiles.maplibre.org/style.json",
    center: [13.4050, 52.5200], // Longitude, Latitude for Berlin
    zoom: 12,
  });
  mapRef.current = map;
  map.on("load", () => console.log("map loaded"));
  map.addControl(new maplibregl.NavigationControl(), "top-right");

  return () => {
    map.remove();
  };
  

}, []);
  return (
    <div ref={mapContainerRef} className="h-screen w-full">
        
    

    </div>
  );
};

export default MappView;