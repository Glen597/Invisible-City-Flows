'use client'
import MappView from "../Component/Mappview";
import InfoPanel from "@/Component/infoPanel";
import { useState } from "react";
import {SelectedPoint} from "../types";


export default function Home() {
  const [selectedPoint, setSelectedPoint] = useState<SelectedPoint | null>(null);; // Placeholder for state management

  return (
  
    <div>
      <section>
        <MappView onMapClick={(coords:SelectedPoint) => setSelectedPoint(coords)} />
      </section>
      <section className="">
        <InfoPanel selectedPoint={selectedPoint}/>
      </section>
        
    </div>

  );
}
