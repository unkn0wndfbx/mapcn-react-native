import { View } from "react-native";

import { Text } from "@/atoms/Text";

interface DocsNoteProps {
  children: React.ReactNode;
}

export function DocsNote({ children }: DocsNoteProps) {
  return (
    <View className="bg-surface rounded-lg px-5 py-4">
      <Text className="text-foreground/80 text-[15px] leading-relaxed">
        {children}
      </Text>
    </View>
  );
}
