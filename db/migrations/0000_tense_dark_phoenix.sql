CREATE TABLE "cities" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(120) NOT NULL,
	"country_code" varchar(2),
	"timezone" text,
	"center_lng" double precision NOT NULL,
	"center_lat" double precision NOT NULL,
	"bbox_min_lng" double precision NOT NULL,
	"bbox_min_lat" double precision NOT NULL,
	"bbox_max_lng" double precision NOT NULL,
	"bbox_max_lat" double precision NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "metrics" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar(64) NOT NULL,
	"category" varchar(16) NOT NULL,
	"unit" varchar(32),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "observations" (
	"id" serial PRIMARY KEY NOT NULL,
	"city_id" integer NOT NULL,
	"metric_id" integer NOT NULL,
	"station_id" integer,
	"source" varchar(16) NOT NULL,
	"value" double precision NOT NULL,
	"lng" double precision NOT NULL,
	"lat" double precision NOT NULL,
	"measured_at" timestamp with time zone NOT NULL,
	"ingested_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stations" (
	"id" serial PRIMARY KEY NOT NULL,
	"source" varchar(16) NOT NULL,
	"external_id" varchar(128) NOT NULL,
	"name" text NOT NULL,
	"city_id" integer NOT NULL,
	"lng" double precision NOT NULL,
	"lat" double precision NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "observations" ADD CONSTRAINT "observations_city_id_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "observations" ADD CONSTRAINT "observations_metric_id_metrics_id_fk" FOREIGN KEY ("metric_id") REFERENCES "public"."metrics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "observations" ADD CONSTRAINT "observations_station_id_stations_id_fk" FOREIGN KEY ("station_id") REFERENCES "public"."stations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stations" ADD CONSTRAINT "stations_city_id_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "cities_name_uq" ON "cities" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX "metrics_key_uq" ON "metrics" USING btree ("key");--> statement-breakpoint
CREATE INDEX "metrics_category_idx" ON "metrics" USING btree ("category");--> statement-breakpoint
CREATE INDEX "obs_city_metric_time_idx" ON "observations" USING btree ("city_id","metric_id","measured_at");--> statement-breakpoint
CREATE INDEX "obs_metric_time_idx" ON "observations" USING btree ("metric_id","measured_at");--> statement-breakpoint
CREATE INDEX "obs_measured_at_idx" ON "observations" USING btree ("measured_at");--> statement-breakpoint
CREATE UNIQUE INDEX "obs_dedupe_uq" ON "observations" USING btree ("source","metric_id","measured_at","lng","lat","station_id");--> statement-breakpoint
CREATE UNIQUE INDEX "stations_source_external_uq" ON "stations" USING btree ("source","external_id");--> statement-breakpoint
CREATE INDEX "stations_city_idx" ON "stations" USING btree ("city_id");