import { Clock, MapPin, Phone } from "lucide-react-native";
import { useEffect, useMemo } from "react";
import { View } from "react-native";

import type { Store } from "../data";

import { Icon } from "@/atoms/Icon";
import { Text } from "@/atoms/Text";
import { cn } from "@/lib/Utils/Cn";
import {
  Map,
  MapControls,
  MapMarker,
  MarkerContent,
  MarkerPopup,
  MarkerTooltip,
  useMap,
} from "@/registry/map";

interface LocatorMapProps {
  stores: Store[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onClearSelection: () => void;
  center: [number, number];
}

function FlyToSelected({ store }: { store?: Store }) {
  const { camera } = useMap();

  useEffect(() => {
    if (!camera || !store) return;
    camera.flyTo({
      center: [store.lng, store.lat],
      zoom: 14,
      duration: 800,
    });
  }, [camera, store]);

  return null;
}

function StorePin({ active }: { active: boolean }) {
  return (
    <View
      className={cn(
        "items-center justify-center rounded-full shadow-md",
        active ? "bg-foreground/80 size-9" : "bg-foreground size-7",
      )}
    >
      <Icon
        as={MapPin}
        size={active ? 18 : 14}
        className="text-background"
      />
    </View>
  );
}

function StorePopupContent({ store }: { store: Store }) {
  return (
    <>
      <Text className="text-popover-foreground pr-5 font-medium">
        {store.name}
      </Text>
      <View className="mt-1 flex-row items-center gap-1.5">
        <View
          className={cn(
            "size-1.5 rounded-full",
            store.openNow ? "bg-emerald-500" : "bg-neutral-500",
          )}
        />
        <Text
          className={cn(
            "text-xs font-medium",
            store.openNow ? "text-foreground" : "text-muted-foreground",
          )}
        >
          {store.openNow ? "Open now" : "Closed"}
        </Text>
      </View>

      <View className="mt-2.5 gap-1.5">
        <View className="flex-row items-center gap-1.5">
          <Icon
            as={MapPin}
            size={14}
            className="text-muted-foreground shrink-0"
          />
          <Text className="text-muted-foreground text-xs tabular-nums">
            {store.address}, {store.neighborhood}
          </Text>
        </View>
        <View className="flex-row items-center gap-1.5">
          <Icon
            as={Clock}
            size={14}
            className="text-muted-foreground shrink-0"
          />
          <Text className="text-muted-foreground text-xs tabular-nums">
            {store.hours}
          </Text>
        </View>
        <View className="flex-row items-center gap-1.5">
          <Icon
            as={Phone}
            size={14}
            className="text-muted-foreground shrink-0"
          />
          <Text className="text-muted-foreground text-xs tabular-nums">
            {store.phone}
          </Text>
        </View>
      </View>
    </>
  );
}

export function LocatorMap({
  stores,
  selectedId,
  onSelect,
  onClearSelection,
  center,
}: LocatorMapProps) {
  const selected = stores.find((store) => store.id === selectedId);
  const orderedStores = useMemo(() => {
    if (!selected) return stores;
    return [...stores.filter((store) => store.id !== selected.id), selected];
  }, [selected, stores]);

  return (
    <View className="relative flex-1">
      <Map
        viewport={{ center, zoom: 12 }}
        minZoom={10}
        maxZoom={17}
      >
        <MapControls showCompass />
        <FlyToSelected store={selected} />

        {orderedStores.map((store) => {
          const active = store.id === selectedId;
          return (
            <MapMarker
              key={store.id}
              longitude={store.lng}
              latitude={store.lat}
              onClick={() => {
                onSelect(store.id);
              }}
            >
              <MarkerContent>
                <StorePin active={active} />
                {active ? (
                  <MarkerPopup
                    closeButton
                    closeOnClick={false}
                    onClose={onClearSelection}
                    className="min-w-56"
                  >
                    <StorePopupContent store={store} />
                  </MarkerPopup>
                ) : null}
              </MarkerContent>
              {active ? null : (
                <MarkerTooltip className="bg-foreground">
                  <Text className="text-background">{store.name}</Text>
                </MarkerTooltip>
              )}
            </MapMarker>
          );
        })}
      </Map>
    </View>
  );
}
