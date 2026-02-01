'use client'
import React, { useRef, useEffect, useState } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import maplibregl from "maplibre-gl";
import { SelectedPoint } from "../types";

type Props = {
  onMapClick: (coords: SelectedPoint) => void;
};

const MapView: React.FC<Props> = ({ onMapClick }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);
  
  const [noiseVisible, setNoiseVisible] = useState(true);
  const [noiseOpacity, setNoiseOpacity] = useState(0.5);

  // Main map initialization
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapRef.current) return; // Initialize map only once
    

    console.log("Initializing map...", mapContainerRef.current);

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: "/styles/osm-raster.json",
      center: [13.4050, 52.5200], // Berlin
      zoom: 12,
    });

    mapRef.current = map;
    map.getCanvas().style.cursor = "crosshair";

    map.on("load", () => {
      console.log("Map loaded");

      // Add noise source
      map.addSource("noise-source", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });

      // Add noise layer
      map.addLayer({
        id: "noise-fill",
        type: "fill",
        source: "noise-source",
        paint: {
          "fill-color": [
            "interpolate",
            ["linear"],
            ["get", "value"],
            0, "#00ff00",
            0.5, "#ffff00",
            1, "#ff0000"
          ],
          "fill-opacity": noiseOpacity,
        },
      });

      // Initial noise data load
      refreshNoise();
    });

    // Add navigation controls
    map.addControl(new maplibregl.NavigationControl(), "top-right");

    // Refresh noise data when map moves
    map.on("moveend", () => {
      refreshNoise();
    });

    // Handle map clicks
    map.on("click", (e: maplibregl.MapMouseEvent) => {
      const { lng, lat } = e.lngLat;
      onMapClick({ lng, lat });
      console.log(`Clicked at Longitude: ${lng}, Latitude: ${lat}`);

      if (markerRef.current) {
        markerRef.current.setLngLat([lng, lat]);
      } else {
        markerRef.current = new maplibregl.Marker()
          .setLngLat([lng, lat])
          .addTo(map);
      }
    });

    // Function to refresh noise layer
    async function refreshNoise() {
      if (!map.isStyleLoaded()) return;
      
      const b = map.getBounds();
      const bbox = `${b.getWest()},${b.getSouth()},${b.getEast()},${b.getNorth()}`;

      try {
        const res = await fetch(`/api/layers?layer=noise&bbox=${bbox}`);
        const geojson = await res.json();

        const source = map.getSource("noise-source") as maplibregl.GeoJSONSource;
        if (source) {
          source.setData(geojson);
        }
      } catch (error) {
        console.error("Error fetching noise data:", error);
      }
    }

    // Cleanup function
    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
      }
      map.remove();
      mapRef.current = null;
    };
  }, []); // Empty dependency array - run once

  // Update noise layer visibility when state changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (!map.getLayer("noise-fill")) return;

    map.setLayoutProperty(
      "noise-fill",
      "visibility",
      noiseVisible ? "visible" : "none"
    );
  }, [noiseVisible]);

  // Update noise layer opacity when state changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (!map.getLayer("noise-fill")) return;

    map.setPaintProperty("noise-fill", "fill-opacity", noiseOpacity);
  }, [noiseOpacity]);

  return (
    <div ref={mapContainerRef} className="h-screen w-full" />
  );
};

export default MapView;