# Invisible City Flows

Invisible City Flows is an experimental urban visualization web app that reveals invisible environmental data such as air quality, weather, noise, and urban stress through an interactive map.

This repository contains the Frontend MVP, built with Next.js, TypeScript, Tailwind CSS, and MapLibre GL JS.

✨ Features (MVP)

🗺️ Interactive Map (MapLibre + OpenStreetMap, no API key)

🧩 4 Data Layers

Air Quality (PM2.5, NO₂)

Weather (Temperature)

Noise Level (dB)

Stress Index (synthetic indicator)

🎛️ Sidebar Controls

Toggle each layer on/off

Adjust layer opacity in real time

Simple color legend (min/max)

📍 Map Interaction

Click on the map to place a marker

Info panel updates with coordinates and mock values

🌍 City Selector (Mock)

Berlin

Paris

Nürnberg

📡 Locate Me

Uses browser geolocation

Recenters the map on the user position

🧪 Demo Mode

No real APIs

Stable mock data using seeded random values

🧱 Tech Stack

Framework: Next.js 14+ (App Router)

Language: TypeScript

Styling: Tailwind CSS

Mapping: MapLibre GL JS

Data: In-memory GeoJSON (mocked)

📁 Project Structure
app/
  layout.tsx
  page.tsx
  globals.css

components/
  Header.tsx
  Sidebar.tsx
  InfoPanel.tsx
  ui/
    Toggle.tsx
    OpacitySlider.tsx

map/
  MapView.tsx
  layers/
    airLayer.ts
    meteoLayer.ts
    noiseLayer.ts
    stressLayer.ts

demo/
  demoData.ts

utils/
  seededRandom.ts
  normalize.ts
  stressIndex.ts

types.ts

🚀 Getting Started
1️⃣ Install dependencies
npm install

2️⃣ Run the development server
npm run dev

3️⃣ Open the app
http://localhost:3000

🧠 How It Works (High-Level)

MapLibre is rendered client-side only to avoid SSR issues.

Each environmental layer is:

A GeoJSON source

A dedicated MapLibre layer

Layer visibility is controlled via:

setLayoutProperty(visibility)

Opacity is controlled via:

setPaintProperty(circle-opacity | fill-opacity)

Mock values are deterministic:

Generated from latitude/longitude using a seeded random function

Values remain stable between clicks and renders

🧪 Demo Data

Air Layer
Random points around city center with PM2.5 / NO₂ values

Weather Layer
Generated at click position

Noise Layer
Grid-based polygons colored by noise intensity

Stress Layer
Grid-based polygons using a synthetic stress index

⚠️ No real APIs are used in the MVP.

🔮 Roadmap / TODO

🔌 Connect real data sources:

OpenAQ (Air Quality)

Open-Meteo (Weather)

OpenStreetMap / Urban datasets

🧭 Time-based visualization (temporal slider)

📊 Charts and trends per location

💾 Persistent state (URL / local storage)

📱 Mobile UX improvements

🧑‍💻 Author

Built as an experimental frontend MVP for exploring urban data visualization and map-based UI architecture.

📄 License

MIT — feel free to use, modify, and build upon it.

