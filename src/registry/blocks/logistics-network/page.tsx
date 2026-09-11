import { useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { hubs, routes } from "./data";
import { FilterSidebar } from "./ui/filter-sidebar";
import { NetworkMap } from "./ui/network-map";

export default function Page() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isCompact = width < 768;

  return (
    <View
      className={isCompact ? "flex-1 flex-col" : "flex-1 flex-row"}
      style={{ paddingBottom: insets.bottom }}
    >
      <View className={isCompact ? "h-[52%] min-h-72" : "min-w-0 flex-1"}>
        <NetworkMap
          hubs={hubs}
          routes={routes}
          compact={isCompact}
        />
      </View>
      <FilterSidebar
        hubs={hubs}
        routes={routes}
        compact={isCompact}
      />
    </View>
  );
}
