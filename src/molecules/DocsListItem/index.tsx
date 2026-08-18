import { View } from "react-native";

import { Text } from "@/atoms/Text";

export function DocsListItem({ children }: { children: React.ReactNode }) {
  return (
    <View className="flex-row items-start gap-2 pl-1">
      <Text className="leading-7">{"\u2022"}</Text>
      <View className="min-w-0 flex-1">
        <Text className="leading-7">{children}</Text>
      </View>
    </View>
  );
}
