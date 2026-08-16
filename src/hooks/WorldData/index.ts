"use client";

import { useEffect, useState } from "react";

import { WORLD_GEOJSON } from "@/lib/Data/WorldGeoJson";

export interface WorldFeatureProperties {
  NAME_LONG: string;
}

export type WorldData = GeoJSON.FeatureCollection<
  GeoJSON.Geometry,
  WorldFeatureProperties
>;

export function useWorldData(url: string = WORLD_GEOJSON): WorldData | null {
  const [data, setData] = useState<WorldData | null>(null);

  useEffect(() => {
    let active = true;
    fetch(url)
      .then((res) => res.json() as Promise<WorldData>)
      .then((world) => {
        if (active) setData(world);
      });
    return () => {
      active = false;
    };
  }, [url]);

  return data;
}
