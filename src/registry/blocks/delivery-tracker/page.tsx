import {
  Clock3,
  House,
  Store,
  Truck,
  UserRound,
  Utensils,
} from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import {
  ScrollView,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  buildRouteUrl,
  deliveryMeals,
  dropoff,
  mapView,
  parseOsrmRoute,
  pickup,
  progressFraction,
  routeStyle,
  type OsrmRouteData,
} from "./data";
import { formatDistance, formatDuration } from "./utils";

import { Badge } from "@/atoms/Badge";
import { Button } from "@/atoms/Button";
import { Icon } from "@/atoms/Icon";
import { Text } from "@/atoms/Text";
import { Card, CardContent, CardHeader, CardTitle } from "@/molecules/Card";
import {
  Map,
  MapMarker,
  MapRoute,
  MarkerContent,
  MarkerLabel,
  useMap,
} from "@/registry/map";

function RemainingRoute({
  coordinates,
}: {
  coordinates: [number, number][];
}) {
  const { resolvedTheme } = useMap();
  const color =
    resolvedTheme === "dark"
      ? routeStyle.remaining.color.dark
      : routeStyle.remaining.color.light;

  return (
    <MapRoute
      id="delivery-full-route"
      coordinates={coordinates}
      color={color}
      width={routeStyle.remaining.width}
      opacity={routeStyle.remaining.opacity}
      interactive={false}
    />
  );
}

export default function Page() {
  const [routeData, setRouteData] = useState<OsrmRouteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isCompact = width < 768;
  const pagePadding = isCompact ? 12 : 32;

  useEffect(() => {
    async function fetchRoute() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(buildRouteUrl(pickup, dropoff));
        const json = (await response.json()) as unknown;
        const parsed = parseOsrmRoute(json);
        if (!parsed) {
          setError("Unable to load route data right now.");
          return;
        }
        setRouteData(parsed);
      } catch {
        setError("Unable to load route data right now.");
      } finally {
        setLoading(false);
      }
    }

    void fetchRoute();
  }, []);

  const progressCoordinates = useMemo(() => {
    const total = routeData?.coordinates?.length ?? 0;
    const progressCount = Math.max(2, Math.floor(total * progressFraction));
    return routeData?.coordinates?.slice(0, progressCount) ?? [];
  }, [routeData]);

  const courierPosition = progressCoordinates[progressCoordinates.length - 1];

  return (
    <View
      className="flex-1 items-center justify-center p-3 md:p-8"
      style={{ paddingBottom: pagePadding + insets.bottom }}
    >
      <View
        className={
          isCompact
            ? "bg-sidebar h-full w-full flex-col overflow-hidden rounded-xl border border-border"
            : "bg-sidebar max-h-[720px] w-full max-w-5xl flex-row overflow-hidden rounded-xl border border-border"
        }
      >
        <ScrollView
          className={isCompact ? "min-h-0 flex-1" : "min-w-0 flex-1"}
          contentContainerClassName="p-5 pb-8 md:p-6"
          showsVerticalScrollIndicator={false}
        >
          <View className="gap-1">
            <Text className="text-2xl font-semibold tracking-tight">
              Track Delivery
            </Text>
            <Text className="text-muted-foreground text-sm">
              Mon Feb 10 - 2-3 PM
            </Text>
          </View>

          <Card className="mt-5">
            <CardHeader>
              <CardTitle className="font-medium">
                Order items ({deliveryMeals.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="gap-5">
              {deliveryMeals.map((meal) => (
                <View
                  key={meal.name}
                  className="flex-row items-center gap-3"
                >
                  <View className="bg-muted size-8 items-center justify-center rounded-full">
                    <Icon
                      as={Utensils}
                      size={16}
                      className="text-muted-foreground"
                    />
                  </View>
                  <View className="min-w-0 flex-1">
                    <Text
                      className="pb-1 text-sm font-medium"
                      numberOfLines={1}
                    >
                      {meal.name}
                    </Text>
                    <Text className="text-muted-foreground text-xs">
                      {meal.price}
                    </Text>
                  </View>
                  <Badge
                    variant="secondary"
                    className="h-6 rounded-full px-2.5"
                  >
                    <Text className="text-xs">x{meal.quantity}</Text>
                  </Badge>
                </View>
              ))}
              <View className="border-border/60 flex-row items-center justify-between border-t pt-3">
                <Text className="text-muted-foreground text-sm">
                  Bundle total
                </Text>
                <Text className="text-sm font-medium">$189.00</Text>
              </View>
            </CardContent>
          </Card>

          <View className="mt-4 flex-row gap-3">
            <Card className="flex-1">
              <CardContent className="gap-2">
                <Text className="text-muted-foreground text-sm">
                  Pickup confirmed
                </Text>
                <Text className="text-sm font-medium">
                  Mon, Feb 10 at 1:48 PM
                </Text>
              </CardContent>
            </Card>
            <Card className="flex-1">
              <CardContent className="gap-2">
                <Text className="text-muted-foreground text-sm">
                  Remaining travel
                </Text>
                <Text className="text-sm font-medium">
                  {formatDuration(routeData?.duration)}
                  <Text className="text-muted-foreground font-normal">
                    {" · "}
                    {formatDistance(routeData?.distance)}
                  </Text>
                </Text>
              </CardContent>
            </Card>
          </View>

          {error ? (
            <View className="mt-3">
              <Text className="text-destructive text-xs">{error}</Text>
            </View>
          ) : null}

          <View className="mt-6 flex-row flex-wrap items-center gap-2">
            <Button size="sm">
              <Icon
                as={Clock3}
                size={16}
              />
              <Text>View timeline</Text>
            </Button>
            <Button
              variant="outline"
              size="sm"
            >
              <Icon
                as={UserRound}
                size={16}
              />
              <Text>Contact courier</Text>
            </Button>
          </View>
        </ScrollView>

        <View
          className={
            isCompact
              ? "relative h-[42%] min-h-72 w-full shrink-0 overflow-hidden border-t border-border"
              : "relative min-h-[520px] min-w-0 flex-1 overflow-hidden"
          }
        >
          <Map
            loading={loading}
            viewport={{
              center: mapView.center,
              zoom: mapView.zoom,
            }}
            minZoom={mapView.minZoom}
            maxZoom={mapView.maxZoom}
          >
            <RemainingRoute coordinates={routeData?.coordinates ?? []} />
            <MapRoute
              id="delivery-progress-route"
              coordinates={progressCoordinates}
              color={routeStyle.progress.color}
              width={routeStyle.progress.width}
              opacity={routeStyle.progress.opacity}
              interactive={false}
            />

            {courierPosition ? (
              <MapMarker
                longitude={courierPosition[0]}
                latitude={courierPosition[1]}
                offset={[0, 10]}
              >
                <MarkerContent>
                  <View
                    className="size-9 items-center justify-center rounded-full shadow-md"
                    style={{ backgroundColor: routeStyle.progress.color }}
                  >
                    <Icon
                      as={Truck}
                      size={16}
                      className="text-white"
                    />
                  </View>
                  <MarkerLabel className="bg-popover border-border mb-1.5 rounded-md border px-2 py-1 shadow-md">
                    <Text
                      className="text-popover-foreground text-xs font-medium"
                      numberOfLines={1}
                    >
                      {formatDuration(routeData?.duration)} away
                    </Text>
                  </MarkerLabel>
                </MarkerContent>
              </MapMarker>
            ) : null}

            <MapMarker
              longitude={pickup.lng}
              latitude={pickup.lat}
            >
              <MarkerContent>
                <View className="size-7 items-center justify-center rounded-full bg-emerald-500 shadow-md">
                  <Icon
                    as={Store}
                    size={14}
                    className="text-white"
                  />
                </View>
              </MarkerContent>
            </MapMarker>

            <MapMarker
              longitude={dropoff.lng}
              latitude={dropoff.lat}
            >
              <MarkerContent>
                <View className="size-7 items-center justify-center rounded-full bg-rose-500 shadow-md">
                  <Icon
                    as={House}
                    size={14}
                    className="text-white"
                  />
                </View>
              </MarkerContent>
            </MapMarker>
          </Map>
        </View>
      </View>
    </View>
  );
}
