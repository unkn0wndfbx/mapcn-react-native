import { useEffect, useState } from "react";
import { useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { edgeNodes, loadWorldGeoJSON, mapView } from "./data";
import { EdgeNodeMarker } from "./ui/edge-node-marker";
import { StatusSidebar } from "./ui/status-sidebar";

import { Map, MapControls, MapGeoJSON } from "@/registry/map";

const EMPTY_WORLD: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [],
};

export default function Page() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isCompact = width < 768;
  const pagePadding = isCompact ? 12 : 16;
  const [world, setWorld] = useState<GeoJSON.FeatureCollection | null>(null);

  useEffect(() => {
    let active = true;
    void loadWorldGeoJSON()
      .then((data) => {
        if (active) setWorld(data);
      })
      .catch(() => {
        if (active) setWorld(EMPTY_WORLD);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <View
      className="flex-1 items-center justify-center p-3 md:p-4"
      style={{ paddingBottom: pagePadding + insets.bottom }}
    >
      <View
        className={
          isCompact
            ? "bg-card h-full w-full flex-col rounded-xl border border-border shadow-sm overflow-hidden"
            : "bg-card h-[500px] w-full max-w-4xl flex-row rounded-xl border border-border shadow-sm overflow-hidden"
        }
      >
        <View
          collapsable={false}
          className={isCompact ? "min-h-0 flex-[1.2]" : "min-w-0 flex-1"}
        >
          <Map
            blank
            viewport={{
              center: mapView.center,
              zoom: mapView.zoom,
            }}
            minZoom={mapView.minZoom}
            maxZoom={mapView.maxZoom}
            touchRotate={false}
            touchPitch={false}
            loading={!world}
          >
            <MapGeoJSON
              id="world"
              data={world ?? EMPTY_WORLD}
              linePaint={false}
            />

            {edgeNodes.map((node) => (
              <EdgeNodeMarker
                key={node.id}
                node={node}
              />
            ))}

            <MapControls className="bottom-2" />
          </Map>
        </View>

        <StatusSidebar
          nodes={edgeNodes}
          compact={isCompact}
        />
      </View>
    </View>
  );
}
