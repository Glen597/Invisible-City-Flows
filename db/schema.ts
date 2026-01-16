import {
  pgTable,
  serial,
  text,
  varchar,
  timestamp,
  doublePrecision,
  integer,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

export const cities = pgTable(
  "cities",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 120 }).notNull(),
    countryCode: varchar("country_code", { length: 2 }),
    timezone: text("timezone"),

    centerLng: doublePrecision("center_lng").notNull(),
    centerLat: doublePrecision("center_lat").notNull(),

    bboxMinLng: doublePrecision("bbox_min_lng").notNull(),
    bboxMinLat: doublePrecision("bbox_min_lat").notNull(),
    bboxMaxLng: doublePrecision("bbox_max_lng").notNull(),
    bboxMaxLat: doublePrecision("bbox_max_lat").notNull(),

    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    nameUq: uniqueIndex("cities_name_uq").on(t.name),
  }),
);

export const metrics = pgTable(
  "metrics",
  {
    id: serial("id").primaryKey(),
    key: varchar("key", { length: 64 }).notNull(), // pm25, no2, temperature...
    category: varchar("category", { length: 16 }).notNull(), // air|meteo|noise|stress
    unit: varchar("unit", { length: 32 }),

    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    keyUq: uniqueIndex("metrics_key_uq").on(t.key),
    catIdx: index("metrics_category_idx").on(t.category),
  }),
);

export const stations = pgTable(
  "stations",
  {
    id: serial("id").primaryKey(),
    source: varchar("source", { length: 16 }).notNull(), // openaq|manual|...
    externalId: varchar("external_id", { length: 128 }).notNull(),
    name: text("name").notNull(),

    cityId: integer("city_id").notNull().references(() => cities.id, { onDelete: "cascade" }),

    lng: doublePrecision("lng").notNull(),
    lat: doublePrecision("lat").notNull(),

    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    sourceExternalUq: uniqueIndex("stations_source_external_uq").on(t.source, t.externalId),
    cityIdx: index("stations_city_idx").on(t.cityId),
  }),
);

export const observations = pgTable(
  "observations",
  {
    id: serial("id").primaryKey(),

    cityId: integer("city_id").notNull().references(() => cities.id, { onDelete: "cascade" }),
    metricId: integer("metric_id").notNull().references(() => metrics.id, { onDelete: "cascade" }),
    stationId: integer("station_id").references(() => stations.id, { onDelete: "set null" }),

    source: varchar("source", { length: 16 }).notNull(), // openaq|openmeteo|manual
    value: doublePrecision("value").notNull(),

    lng: doublePrecision("lng").notNull(),
    lat: doublePrecision("lat").notNull(),

    measuredAt: timestamp("measured_at", { withTimezone: true }).notNull(),
    ingestedAt: timestamp("ingested_at", { withTimezone: true }).notNull().defaultNow(),

    // PostGIS column added via SQL migration:
    // geo geography(Point, 4326)
  },
  (t) => ({
    cityMetricTimeIdx: index("obs_city_metric_time_idx").on(t.cityId, t.metricId, t.measuredAt),
    metricTimeIdx: index("obs_metric_time_idx").on(t.metricId, t.measuredAt),
    measuredAtIdx: index("obs_measured_at_idx").on(t.measuredAt),
    dedupeUq: uniqueIndex("obs_dedupe_uq").on(t.source, t.metricId, t.measuredAt, t.lng, t.lat, t.stationId),
  }),
);
