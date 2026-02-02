# Invisible City Flows

Invisible City Flows is an interactive web application designed to explore hidden urban data such as air quality, weather, noise levels, and urban stress through a map-based interface.

The project focuses on geospatial visualization, clean API design, and a scalable modern web architecture.

---

## Features

- Interactive map with geolocation-based queries
- Environmental data retrieval per geographic point
- Modular user interface built with reusable data cards
- PostgreSQL database with a fully typed ORM
- High-performance API powered by Next.js (App Router)

```

## Project Structure

Invisible-City-Flows/
├── app/
│ ├── api/
│ │ └── point/ # Main endpoint (GET ?lng=&lat=)
│ └── page.tsx # Main page (UI + Map)
│
├── Component/
│ ├── MapView.tsx # Interactive map
│ └── DataCard.tsx # Reusable data card component
│
├── db/
│ ├── schema.ts # Drizzle database schema
│ └── index.ts # Database client
│
├── drizzle/ # Generated SQL migrations
├── drizzle.config.ts
├── types/ # Shared API types
└── README.md

```

## Tech Stack

### Frontend
- Next.js 14 (App Router)
- React
- TypeScript
- Tailwind CSS

### Backend
- Next.js API Routes
- Drizzle ORM
- PostgreSQL
- pg driver

---

## Database

The database schema consists of four main tables:

| Table | Description |
|------|------------|
| cities | City information |
| stations | Measurement stations |
| metrics | Metric definitions (air, noise, etc.) |
| observations | Environmental observations |

Relationships are enforced using foreign keys and optimized with indexes for performance and data integrity.

---

## Data Flow

1. The user clicks on the map
2. Geographic coordinates (lng, lat) are sent to the API
3. The backend queries the database
4. Data is aggregated by category
5. The user interface updates the data cards accordingly

---

## API Response Example
```ts
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
```
##  Database Migrations
 Generate migrations:

npm run db:gen

Apply migrations:

npm run db:migrate

 If Drizzle reports no schema changes, the database is already synchronized.

## Running the Project

npm install
npm run dev

Then open:

http://localhost:3000

## Roadmap
- Historical data visualization
- Dark mode support
- Dynamic city selection
- Automated database seeding
- Mobile responsiveness

    Composite urban comfort index
---
## Author
Personal project focused on urban data visualization, software architecture, and code quality.
