import { useMemo } from "react";
import { View } from "react-native";

import {
  modeConfig,
  regionLabels,
  statusConfig,
  type Hub,
  type Route,
} from "../data";

import { Separator } from "@/atoms/Separator";
import { Text } from "@/atoms/Text";
import {
  Map,
  MapArc,
  MapControls,
  MapMarker,
  MarkerContent,
  MarkerTooltip,
} from "@/registry/map";

interface NetworkMapProps {
  hubs: Hub[];
  routes: Route[];
  compact?: boolean;
}

function MapControlsCard({ compact }: { compact: boolean }) {
  return (
    <View
      className={
        compact
          ? "border-border/40 bg-background/85 absolute top-3 right-3 left-3 z-20 rounded-lg border px-2.5 py-2"
          : "border-border/40 bg-background/70 absolute top-4 left-4 z-20 rounded-lg border px-2.5 py-1.5"
      }
    >
      <View className="flex-row flex-wrap items-center gap-x-3 gap-y-2">
        <View className="flex-row items-center gap-1.5">
          <View
            className="h-0.5 w-4 shrink-0 rounded-full"
            style={{ backgroundColor: modeConfig.air.color }}
          />
          <Text className="text-xs">{modeConfig.air.label}</Text>
        </View>
        <View className="flex-row items-center gap-1.5">
          <View
            className="h-0.5 w-4 shrink-0 rounded-full"
            style={{ backgroundColor: modeConfig.ground.color }}
          />
          <Text className="text-xs">{modeConfig.ground.label}</Text>
        </View>
        <View className="flex-row items-center gap-1.5">
          <View
            className="h-0.5 w-4 shrink-0 rounded-full"
            style={{ backgroundColor: statusConfig.delayed.color }}
          />
          <Text className="text-xs">{statusConfig.delayed.label}</Text>
        </View>
        <Separator
          orientation="vertical"
          className="h-4"
        />
        <View className="flex-row items-center gap-1.5">
          <View className="size-2.5 shrink-0 rounded-full border border-white bg-blue-500 shadow-sm" />
          <Text className="text-xs">Hub</Text>
        </View>
      </View>
    </View>
  );
}

export function NetworkMap({ hubs, routes, compact = false }: NetworkMapProps) {
  const arcs = useMemo(() => {
    const hubById: Record<string, Hub> = Object.fromEntries(
      hubs.map((hub) => [hub.id, hub]),
    );
    return routes.flatMap((route) => {
      const fromHub = hubById[route.from];
      const toHub = hubById[route.to];
      if (!fromHub || !toHub) return [];
      return [
        {
          id: `${route.from}-${route.to}`,
          from: [fromHub.lng, fromHub.lat] as [number, number],
          to: [toHub.lng, toHub.lat] as [number, number],
          color:
            route.status === "delayed"
              ? statusConfig.delayed.color
              : modeConfig[route.mode].color,
        },
      ];
    });
  }, [hubs, routes]);

  return (
    <View className="relative flex-1">
      <MapControlsCard compact={compact} />

      <Map viewport={{ center: [-98, 39], zoom: 4 }}>
        <MapControls />
        <MapArc
          data={arcs}
          curvature={0.3}
          paint={{
            "line-color": ["get", "color"],
            "line-width": 2,
            "line-opacity": 0.65,
          }}
          interactive={false}
        />

        {hubs.map((hub) => (
          <MapMarker
            key={hub.id}
            longitude={hub.lng}
            latitude={hub.lat}
          >
            <MarkerContent>
              <View className="size-3 rounded-full border-2 border-white bg-blue-500 shadow-md" />
            </MarkerContent>
            <MarkerTooltip className="bg-background border-border border px-2.5 py-1.5">
              <Text className="text-foreground font-medium">{hub.city}</Text>
              <Text className="text-muted-foreground mt-1">
                {hub.shipments.toLocaleString()} shipments
                <Text className="text-muted-foreground"> • </Text>
                {regionLabels[hub.region]}
              </Text>
            </MarkerTooltip>
          </MapMarker>
        ))}
      </Map>
    </View>
  );
}
