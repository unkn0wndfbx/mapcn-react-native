import { Redirect, useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { Suspense, useEffect, useState } from "react";
import { ActivityIndicator, View, type LayoutChangeEvent } from "react-native";
import { z } from "zod";

import { Button } from "@/atoms/Button";
import { Icon } from "@/atoms/Icon";
import { Text } from "@/atoms/Text";
import { blockComponents } from "@/registry/blocks/__index__";

const blockNameSchema = z.enum([
  "analytics-map",
  "choropleth",
  "analytics-card",
  "delivery-tracker",
  "heatmap",
  "logistics-network",
  "store-locator",
  "uptime-monitor",
]);

function BlockFallback() {
  return (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator />
    </View>
  );
}

export default function BlockViewPage() {
  const router = useRouter();
  const { name } = useLocalSearchParams<{
    name?: string | string[];
  }>();
  const parsedName = blockNameSchema.safeParse(name);
  const [screenSettled, setScreenSettled] = useState(false);
  const [hasLayout, setHasLayout] = useState(false);

  useEffect(() => {
    let settled = false;
    setScreenSettled(false);

    function markSettled() {
      if (settled) return;
      settled = true;
      setScreenSettled(true);
    }

    const idleId = requestIdleCallback(markSettled);

    return () => {
      settled = true;
      cancelIdleCallback(idleId);
    };
  }, [name]);

  function handleLayout(event: LayoutChangeEvent) {
    const { width, height } = event.nativeEvent.layout;
    if (width <= 0 || height <= 0) return;
    setHasLayout((prev) => (prev ? prev : true));
  }

  if (!parsedName.success) {
    return <Redirect href="/+not-found" />;
  }

  const Component = blockComponents[parsedName.data];
  const ready = screenSettled && hasLayout;

  function goBack() {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/blocks");
  }

  return (
    <View
      style={{
        flex: 1,
      }}
      className="bg-background"
      onLayout={handleLayout}
    >
      <View
        pointerEvents="box-none"
        className="absolute inset-0 z-50"
      >
        <Button
          variant="outline"
          size="sm"
          accessibilityLabel="Go back"
          onPress={goBack}
          className="bg-background absolute top-4 right-4"
        >
          <Icon
            as={ArrowLeft}
            size={16}
          />
          <Text>Back</Text>
        </Button>
      </View>
      {ready ? (
        <Suspense fallback={<BlockFallback />}>
          <Component />
        </Suspense>
      ) : (
        <BlockFallback />
      )}
    </View>
  );
}
