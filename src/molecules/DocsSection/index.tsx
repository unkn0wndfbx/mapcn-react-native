import * as React from "react";
import { View, type LayoutChangeEvent } from "react-native";

import { Text } from "@/atoms/Text";
import { useDocsScroll } from "@/templates/DocsPageLayout";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

interface DocsSectionProps {
  title?: string;
  children: React.ReactNode;
}

export function DocsSection({ title, children }: DocsSectionProps) {
  const id = title ? slugify(title) : undefined;
  const { sectionsBaseY, registerSection } = useDocsScroll();
  const localY = React.useRef(0);

  const handleLayout = React.useCallback(
    (event: LayoutChangeEvent) => {
      localY.current = event.nativeEvent.layout.y;

      if (id) {
        registerSection(id, sectionsBaseY + localY.current);
      }
    },
    [id, registerSection, sectionsBaseY],
  );

  React.useEffect(() => {
    if (!id) {
      return;
    }

    registerSection(id, sectionsBaseY + localY.current);
  }, [id, registerSection, sectionsBaseY]);

  return (
    <View
      className="gap-5"
      onLayout={handleLayout}
      nativeID={id}
    >
      {title ? (
        <Text className="text-foreground text-xl font-semibold tracking-tight">
          {title}
        </Text>
      ) : null}
      <View className="gap-4">{children}</View>
    </View>
  );
}
