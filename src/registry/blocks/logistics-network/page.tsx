import { View } from "react-native";

import { hubs, routes } from "./data";
import { FilterSidebar } from "./ui/filter-sidebar";
import { NetworkMap } from "./ui/network-map";

export default function Page() {
  return (
    <View className="h-screen flex-1 flex-row">
      <FilterSidebar
        hubs={hubs}
        routes={routes}
      />
      <View className="min-w-0 flex-1">
        <NetworkMap
          hubs={hubs}
          routes={routes}
        />
      </View>
    </View>
  );
}
