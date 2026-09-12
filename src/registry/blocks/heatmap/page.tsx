import { GeoJSONSource, Layer } from "@maplibre/maplibre-react-native";
import { useEffect, useId, useState } from "react";
import { View } from "react-native";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";

import { loadEarthquakeGeoJSON } from "./utils";

import { Text } from "@/atoms/Text";
import { Map, useMap } from "@/registry/map";

const HEATMAP_GRADIENT_COLORS = [
  "#fff7bc",
  "#fee391",
  "#fec44f",
  "#fe9929",
  "#d7301f",
];

function useEarthquakeData() {
  const [data, setData] =
    useState<GeoJSON.FeatureCollection<GeoJSON.Point> | null>(null);

  useEffect(() => {
    let active = true;

    void loadEarthquakeGeoJSON()
      .then((collection) => {
        if (active) {
          setData(collection);
        }
      })
      .catch(() => {
        if (active) {
          setData(null);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return data;
}

function HeatmapLegendBar() {
  const gradientId = useId().replace(/:/g, "");
  const lastIndex = HEATMAP_GRADIENT_COLORS.length - 1;

  return (
    <Svg
      width="100%"
      height="100%"
      viewBox="0 0 100 8"
      preserveAspectRatio="none"
    >
      <Defs>
        <LinearGradient
          id={gradientId}
          x1="0"
          y1="0"
          x2="1"
          y2="0"
        >
          {HEATMAP_GRADIENT_COLORS.map((color, index) => (
            <Stop
              key={color}
              offset={`${String((index / lastIndex) * 100)}%`}
              stopColor={color}
            />
          ))}
        </LinearGradient>
      </Defs>
      <Rect
        width="100"
        height="8"
        fill={`url(#${gradientId})`}
      />
    </Svg>
  );
}

function GlobeHeatmapLayers({
  data,
}: {
  data: GeoJSON.FeatureCollection<GeoJSON.Point>;
}) {
  const { isLoaded } = useMap();

  if (!isLoaded) {
    return null;
  }

  return (
    <GeoJSONSource
      id="heatmap-source"
      data={data}
    >
      <Layer
        id="heatmap-layer"
        type="heatmap"
        maxzoom={6}
        paint={{
          "heatmap-weight": [
            "interpolate",
            ["linear"],
            ["get", "mag"],
            0,
            0,
            6,
            0.8,
          ],
          "heatmap-intensity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            0,
            0.55,
            6,
            1.25,
          ],
          "heatmap-color": [
            "interpolate",
            ["linear"],
            ["heatmap-density"],
            0,
            "rgba(59, 130, 246, 0)",
            0.15,
            HEATMAP_GRADIENT_COLORS[0],
            0.35,
            HEATMAP_GRADIENT_COLORS[1],
            0.55,
            HEATMAP_GRADIENT_COLORS[2],
            0.75,
            HEATMAP_GRADIENT_COLORS[3],
            1,
            HEATMAP_GRADIENT_COLORS[4],
          ],
          "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 0, 8, 6, 34],
          "heatmap-opacity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            4.5,
            0.75,
            6.5,
            0.08,
          ],
        }}
      />
      <Layer
        id="heatmap-point-layer"
        type="circle"
        minzoom={4.5}
        paint={{
          "circle-radius": [
            "interpolate",
            ["linear"],
            ["get", "mag"],
            1,
            3,
            6,
            10,
          ],
          "circle-color": [
            "interpolate",
            ["linear"],
            ["get", "mag"],
            1,
            HEATMAP_GRADIENT_COLORS[1],
            2.5,
            HEATMAP_GRADIENT_COLORS[2],
            4,
            HEATMAP_GRADIENT_COLORS[3],
            6,
            HEATMAP_GRADIENT_COLORS[4],
          ],
          "circle-stroke-width": 1,
          "circle-stroke-color": "rgba(255,255,255,0.8)",
          "circle-opacity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            4.5,
            0,
            6.5,
            0.7,
          ],
        }}
      />
    </GeoJSONSource>
  );
}

export default function Page() {
  const data = useEarthquakeData();

  return (
    <View className="bg-card relative flex-1">
      <View className="relative flex-1">
        <Map
          viewport={{
            center: [-113, 43],
            zoom: 3.2,
            pitch: 24,
          }}
          minZoom={1.2}
          maxZoom={8}
          loading={!data}
        >
          {data ? <GlobeHeatmapLayers data={data} /> : null}
        </Map>
      </View>

      <View className="bg-card/90 absolute top-4 right-4 left-4 z-10 max-w-72 rounded-lg  border-border px-3 py-2.5">
        <Text className="text-foreground text-sm font-medium">
          Global Earthquakes Heatmap
        </Text>

        <View className="mt-3 h-2 w-full overflow-hidden rounded-full">
          <HeatmapLegendBar />
        </View>
        <View className="flex-row items-center justify-between pt-1.5">
          <Text className="text-muted-foreground text-[10px]">Low</Text>
          <Text className="text-muted-foreground text-[10px]">High</Text>
        </View>
      </View>
    </View>
  );
}
