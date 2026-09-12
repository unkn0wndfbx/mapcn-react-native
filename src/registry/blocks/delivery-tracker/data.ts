import { z } from "zod";

export interface DeliveryMeal {
  name: string;
  price: string;
  quantity: number;
}

export interface OsrmRouteData {
  coordinates: [number, number][];
  duration: number;
  distance: number;
}

export const deliveryMeals: DeliveryMeal[] = [
  { name: "Spicy Tofu Grain Bowl", price: "$44.00", quantity: 1 },
  { name: "Herb Chicken Rice Box", price: "$58.00", quantity: 2 },
  { name: "Roasted Veggie Wrap", price: "$29.00", quantity: 1 },
];

/** Pickup (origin) and dropoff (destination) coordinates. */
export const pickup = { lng: -122.4185, lat: 37.7645 };
export const dropoff = { lng: -122.434, lat: 37.7475 };

/** Initial map viewport. */
export const mapView = {
  center: [-122.4263, 37.756] as [number, number],
  zoom: 13.6,
  minZoom: 12,
  maxZoom: 15,
};

/** Fraction of the route the courier has already covered (0–1). */
export const progressFraction = 0.62;

const osrmRouteGeometrySchema = z.object({
  coordinates: z.array(z.tuple([z.number(), z.number()])),
});

const osrmRouteSchema = z.object({
  duration: z.number(),
  distance: z.number(),
  geometry: osrmRouteGeometrySchema,
});

const osrmResponseSchema = z.object({
  routes: z.array(osrmRouteSchema).min(1),
});

export function parseOsrmRoute(data: unknown): OsrmRouteData | null {
  const result = osrmResponseSchema.safeParse(data);
  if (!result.success) {
    return null;
  }
  const route = result.data.routes[0];
  return {
    coordinates: route.geometry.coordinates,
    duration: route.duration,
    distance: route.distance,
  };
}

/**
 * OSRM demo routing endpoint. Swap in your own routing service by returning a
 * URL that responds with GeoJSON route geometry.
 */
export function buildRouteUrl(
  from: { lng: number; lat: number },
  to: { lng: number; lat: number },
): string {
  return `https://router.project-osrm.org/route/v1/driving/${String(from.lng)},${String(from.lat)};${String(to.lng)},${String(to.lat)}?overview=full&geometries=geojson`;
}

/**
 * Route line styling. WebGL paint can't read CSS variables, so colors are
 * concrete hex. `progress` highlights the covered path; `remaining` is themed
 * for the road still ahead.
 */
export const routeStyle = {
  progress: { color: "#3b82f6", width: 6, opacity: 0.95 },
  remaining: {
    width: 5.2,
    opacity: 0.5,
    color: { light: "#6b7280", dark: "#9ca3af" },
  },
} as const;
