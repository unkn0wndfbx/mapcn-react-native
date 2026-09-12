import { PropsWithChildren } from "react";
import { useColorScheme, useWindowDimensions, View } from "react-native";

import {
  getStatusBarIslandClassName,
  type PhoneContentTheme,
} from "@/lib/Platform/PhoneStatusBar";
import { cn } from "@/lib/Utils/Cn";

type PhoneFrameProps = {
  className?: string;
  width?: number;
  height?: number;
  contentTheme?: PhoneContentTheme;
};

export function PhoneFrame({
  children,
  className,
  width = 390,
  height = 844,
  contentTheme,
}: PropsWithChildren<PhoneFrameProps>) {
  const systemTheme = useColorScheme() === "dark" ? "dark" : "light";
  const resolvedContentTheme = contentTheme ?? systemTheme;
  const { width: windowWidth } = useWindowDimensions();

  const horizontalPadding = 32;
  const maxWidth = Math.max(windowWidth - horizontalPadding, 0);
  const baseWidth = width;
  const baseHeight = height;
  const scale =
    maxWidth > 0 && baseWidth > 0 ? Math.min(1, maxWidth / baseWidth) : 1;
  const frameWidth = baseWidth * scale;
  const frameHeight = baseHeight * scale;

  return (
    <View className={cn("items-center justify-center", className)}>
      <View
        className="overflow-hidden rounded-[2.5rem] border-10 border-neutral-800 bg-neutral-950 shadow-xl"
        style={{ width: frameWidth, height: frameHeight }}
      >
        <View className="bg-background relative h-full w-full overflow-hidden rounded-[1.75rem]">
          <View
            pointerEvents="none"
            className="absolute top-2 right-0 left-0 z-20 items-center"
          >
            <View
              className={cn(
                getStatusBarIslandClassName(resolvedContentTheme),
                "h-6 w-28",
              )}
            />
          </View>
          {children}
        </View>
      </View>
    </View>
  );
}
