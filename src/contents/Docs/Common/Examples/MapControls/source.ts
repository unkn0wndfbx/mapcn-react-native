export const mapControlsExampleSource = `import { View } from "react-native";

import { Map, MapControls } from "@/atoms/Map";

export function MapControlsExample() {
  return (
    <View className="h-full w-full">
      <Map
        viewport={{
          center: [2.3522, 48.8566],
          zoom: 10,
        }}
        style={{ flex: 1 }}
      >
        <MapControls
          position="top-right"
          showZoom
          showCompass
          showLocate
          showFullscreen
        />
      </Map>
    </View>
  );
}
`;
