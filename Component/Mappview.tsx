'use client'
import React from "react";
import { useRef } from "react";
import { useEffect } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import maplibregl, { LngLat } from "maplibre-gl";
import {SelectedPoint} from "../types";


type Props = {
  onMapClick: (coords: SelectedPoint) => void;
};
const MappView: React.FC<Props> = ({onMapClick}) => {
     const mapContainerRef = useRef<HTMLDivElement | null>(null);
     const mapRef = useRef<maplibregl.Map | null>(null);
     const markerRef = useRef<maplibregl.Marker | null>(null);

     useEffect(() => {
  if (!mapContainerRef.current)
    {
      return
    } ;
      console.log("DOM exists", mapContainerRef.current);
  if (mapRef.current) 
    {
      return
    } ; // Initialize map only once

  const map = new maplibregl.Map({
    container: mapContainerRef.current,
    style:"https://demotiles.maplibre.org/style.json",
    center: [13.4050, 52.5200], // Longitude, Latitude for Berlin
    zoom: 12,
  });
  mapRef.current = map;
  map.on("load", () => console.log("map loaded"));
  map.addControl(new maplibregl.NavigationControl(), "top-right");
  map.on("click", (e) => {
    const coords: LngLat = e.lngLat;
    const lng = coords.lng;
    const lat = coords.lat;
    onMapClick({ lng, lat });
    console.log(`Clicked at Longitude: ${lng}, Latitude: ${lat}`);

     if (markerRef.current) {
    markerRef.current.setLngLat([lng, lat]);
    }else{
       markerRef.current = new maplibregl.Marker()
    .setLngLat([lng, lat])
    .addTo(map); // Add marker to the map                            
    }
  }); // You can handle map click events here to get the latitude and the longitude
 
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