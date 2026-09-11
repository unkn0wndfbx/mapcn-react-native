import { Redirect, useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { Suspense } from "react";
import { ActivityIndicator, View } from "react-native";
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

export default function BlockViewPage() {
  const router = useRouter();
  const { name } = useLocalSearchParams<{
    name?: string | string[];
  }>();
  const parsedName = blockNameSchema.safeParse(name);

  if (!parsedName.success) {
    return <Redirect href="/+not-found" />;
  }

  const Component = blockComponents[parsedName.data];

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
      <Suspense
        fallback={
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator />
          </View>
        }
      >
        <Component />
      </Suspense>
    </View>
  );
}
