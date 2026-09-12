import { useMemo, useState } from "react";
import { useColorScheme, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { mapConfig, visitorsByCountry, type Theme } from "./data";
import { buildFillColor } from "./utils";

import { Text } from "@/atoms/Text";
import { useWorldData } from "@/hooks/WorldData";
import { Map, MapControls, MapGeoJSON, MapPopup } from "@/registry/map";

interface SelectedInfo {
  name: string;
  visitors: number;
  lng: number;
  lat: number;
}

interface CountryProperties {
  NAME_LONG: string;
  visitors: number;
}

type CountryFeatureCollection = GeoJSON.FeatureCollection<
  GeoJSON.Geometry,
  CountryProperties
>;

export default function Page() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const theme: Theme = colorScheme === "dark" ? "dark" : "light";
  const [selected, setSelected] = useState<SelectedInfo | null>(null);
  const world = useWorldData();
  const bottomInset = 8 + insets.bottom;

  const countries = useMemo<CountryFeatureCollection | null>(() => {
    if (!world) return null;
    return {
      type: "FeatureCollection",
      features: world.features.map((f) => ({
        ...f,
        properties: {
          NAME_LONG: f.properties.NAME_LONG,
          visitors: visitorsByCountry[f.properties.NAME_LONG] ?? 0,
        },
      })),
    };
  }, [world]);

  const fillPaint = useMemo(
    () => ({
      "fill-color": buildFillColor(theme) as never,
      "fill-opacity": 0.92,
    }),
    [theme],
  );

  const selectedPaint = useMemo(
    () => ({
      "fill-color": mapConfig.colors[theme].hover,
    }),
    [theme],
  );

  return (
    <View className="bg-card relative flex-1 overflow-hidden">
      <Map
        blank
        viewport={{
          center: mapConfig.view.center,
          zoom: mapConfig.view.zoom,
        }}
        minZoom={mapConfig.view.minZoom}
        maxZoom={mapConfig.view.maxZoom}
        touchRotate={false}
        touchPitch={false}
        loading={!countries}
        attributionPosition={{ bottom: bottomInset, right: 8 }}
        logoPosition={{ bottom: bottomInset, left: 8 }}
      >
        {countries ? (
          <MapGeoJSON<CountryProperties>
            data={countries}
            promoteId="NAME_LONG"
            fillPaint={fillPaint}
            selectedPaint={selectedPaint}
            selectedId={selected?.name ?? null}
            interactive
            onClick={(e) => {
              const visitors = e.feature.properties?.visitors ?? 0;
              if (visitors <= 0) {
                setSelected(null);
                return;
              }
              setSelected({
                name: e.feature.properties.NAME_LONG,
                visitors,
                lng: e.longitude,
                lat: e.latitude,
              });
            }}
          />
        ) : null}
        <MapControls
          className="bottom-2"
          style={{ bottom: bottomInset }}
        />
        {selected ? (
          <MapPopup
            longitude={selected.lng}
            latitude={selected.lat}
            closeOnClick={false}
            className="p-2"
          >
            <Text className="text-xs font-medium">{selected.name}</Text>
            <View className="flex-row items-center justify-between gap-4 pt-1">
              <View className="flex-row items-center gap-1.5">
                <View
                  className="size-2 rounded-full"
                  style={{ backgroundColor: mapConfig.colors[theme].hover }}
                />
                <Text className="text-muted-foreground text-[11px]">
                  Visitors
                </Text>
              </View>
              <Text className="text-foreground text-xs font-semibold tabular-nums">
                {selected.visitors.toLocaleString()}
              </Text>
            </View>
          </MapPopup>
        ) : null}
      </Map>

      <View
        className="bg-card absolute left-4 z-10 rounded-lg border border-border px-3 py-2.5"
        style={{ bottom: 16 + insets.bottom }}
      >
        <Text className="text-foreground text-xs font-medium">
          Visitors by country
        </Text>
        <View className="mt-2 h-2 w-40 flex-row overflow-hidden rounded-full">
          {mapConfig.colors[theme].ramp.map((color) => (
            <View
              key={color}
              className="flex-1"
              style={{ backgroundColor: color }}
            />
          ))}
        </View>
        <View className="flex-row items-center justify-between pt-1.5">
          <Text className="text-muted-foreground text-[10px]">Low</Text>
          <Text className="text-muted-foreground text-[10px]">High</Text>
        </View>
      </View>
    </View>
  );
}
