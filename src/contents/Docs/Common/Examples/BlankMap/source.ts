export const blankMapExampleSource = `import { View } from "react-native";

import { WORLD_GEOJSON } from "@/lib/Data/WorldGeoJson";
import { Map, MapGeoJSON } from "@/atoms/Map";

export function BlankMapExample() {
  return (
    <View className="h-full w-full">
      <Map
        blank
        viewport={{
          center: [10, 25],
          zoom: 1,
        }}
        style={{ flex: 1 }}
      >
        <MapGeoJSON data={WORLD_GEOJSON} />
      </Map>
    </View>
  );
}
`;
