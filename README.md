Invisible City Flows is an interactive web application that reveals hidden urban data—such as air quality, weather, noise, and urban stress—based on a geographical point selected on a map.
The project focuses on combining geospatial interaction, environmental data, and a modern full-stack architecture.

✨ Key Features

🗺️ Interactive map with click-based location selection

📊 Real-time environmental indicators per location

🧱 Modular UI using reusable data cards

🧠 Aggregation of multiple urban metrics

🛢️ Relational database with PostgreSQL & Drizzle ORM

⚡ API built with Next.js App Router

🧩 Project Architecture
~~~
Invisible-City-Flows/
├── app/
│   ├── api/
│   │   └── point/            # Main API endpoint (GET ?lng=&lat=)
│   └── page.tsx              # Main page (Map + UI)
│
├── Component/
│   ├── MapView.tsx           # Interactive map component
│   └── DataCard.tsx          # Reusable metric card
│
├── db/
│   ├── schema.ts             # Drizzle database schema
│   └── index.ts              # Database client
│
├── drizzle/                  # Generated SQL migrations
├── drizzle.config.ts
├── types/                    # Shared TypeScript types
└── README.md

~~~
🛠️ Tech Stack
Frontend

Next.js 14 (App Router)

React

TypeScript

Tailwind CSS

Backend

Next.js API Routes

Drizzle ORM

PostgreSQL

pg driver

🗄️ Database Schema

The current database design includes four core tables:

Table	Description
cities	City-level metadata
stations	Measurement stations
metrics	Metric definitions (air, noise, etc.)
observations	Measured values per station

All relations are enforced using foreign keys and optimized with indexes.

🔁 Data Flow

User clicks on the map

Coordinates (longitude, latitude) are sent to /api/point

The API:

queries the database

aggregates relevant metrics

returns a structured response

The frontend updates the UI using DataCard components

📦 Example API Response
type PointApiResponse = {
  air: {
    pm25: number | null
  }
  meteo: {
    temperature: number | null
  }
  noise: {
    level: number
    label: string
  }
  stress: {
    index: number
    label: string
  }
}

🧱 DataCard Component

Reusable UI component for displaying a single metric:

<DataCard
  title="Air"
  value="12 μg/m³"
  subtitle="Air quality index"
  className="border-l-4 border-blue-400"
/>

Characteristics

Accepts external styling via className

Fully reusable and data-agnostic

Suitable for a scalable design system

🧪 Database Migrations
Generate migrations
npm run db:gen

Apply migrations
npm run db:migrate


If Drizzle outputs “No schema changes, nothing to migrate”, the database is already synchronized ✅

🚀 Running the Project
npm install
npm run dev


Then open:

http://localhost:3000

🔮 Planned Improvements

📈 Historical data & time series

🌙 Dark mode

🧭 Dynamic city selection

🌱 Database seeding

📱 Mobile responsiveness

🧠 Composite urban comfort index

👤 Author

Personal project focused on urban data visualization, modern full-stack architecture, and clean, scalable code design.

If you want next:

a more academic / report-style documentation

a final polished README with badges

or an API documentation (Swagger-style)

just tell me 👌
