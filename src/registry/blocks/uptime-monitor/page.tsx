import { useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { edgeNodes, mapView, WORLD_GEOJSON } from "./data";
import { EdgeNodeMarker } from "./ui/edge-node-marker";
import { StatusSidebar } from "./ui/status-sidebar";

import { Map, MapControls, MapGeoJSON } from "@/registry/map";

export default function Page() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isCompact = width < 768;
  const pagePadding = isCompact ? 12 : 16;

  return (
    <View
      className="flex-1 items-center justify-center p-3 md:p-4"
      style={{ paddingBottom: pagePadding + insets.bottom }}
    >
      <View
        className={
          isCompact
            ? "bg-card h-full w-full flex-col overflow-hidden rounded-xl border border-border shadow-sm"
            : "bg-card h-[500px] w-full max-w-4xl flex-row overflow-hidden rounded-xl border border-border shadow-sm"
        }
      >
        <View className={isCompact ? "h-[55%] min-h-72" : "min-w-0 flex-1"}>
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
          >
            <MapGeoJSON
              data={WORLD_GEOJSON}
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
