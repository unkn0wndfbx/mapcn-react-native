import { z } from "zod";

export const EARTHQUAKE_GEOJSON_URL =
  "https://maplibre.org/maplibre-gl-js/docs/assets/earthquakes.geojson";

const earthquakeCollectionSchema = z
  .object({
    type: z.literal("FeatureCollection"),
    features: z.array(
      z
        .object({
          type: z.literal("Feature"),
          properties: z.record(z.string(), z.unknown()).nullable().optional(),
          geometry: z.object({
            type: z.literal("Point"),
            coordinates: z.tuple([z.number(), z.number()]).rest(z.number()),
          }),
        })
        .passthrough(),
    ),
  })
  .passthrough();

let cachedEarthquakes: GeoJSON.FeatureCollection<GeoJSON.Point> | undefined;

export async function loadEarthquakeGeoJSON(): Promise<
  GeoJSON.FeatureCollection<GeoJSON.Point>
> {
  if (cachedEarthquakes) {
    return cachedEarthquakes;
  }

  const response = await fetch(EARTHQUAKE_GEOJSON_URL);
  if (!response.ok) {
    throw new Error(`Failed to load heatmap data (${String(response.status)})`);
  }

  const parsed = earthquakeCollectionSchema.parse(await response.json());
  const collection: GeoJSON.FeatureCollection<GeoJSON.Point> = {
    type: "FeatureCollection",
    features: parsed.features.map((feature) => ({
      type: "Feature",
      properties: feature.properties ?? null,
      geometry: {
        type: "Point",
        coordinates: feature.geometry.coordinates,
      },
    })),
  };
  cachedEarthquakes = collection;
  return collection;
}
