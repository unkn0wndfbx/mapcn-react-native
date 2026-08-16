import { Platform, View, type ViewProps } from "react-native";

import { Text } from "@/atoms/Text";
import { cn } from "@/lib/Utils/Cn";

function Kbd({ className, children, ...props }: ViewProps) {
  return (
    <View
      role={Platform.select({ web: "presentation" })}
      className={cn(
        "bg-muted h-5 min-w-5 flex-row items-center justify-center rounded-sm px-1",
        Platform.select({
          web: "inline-flex w-fit select-none gap-1",
        }),
        "in-data-[slot=tooltip-content]:bg-background/20 dark:in-data-[slot=tooltip-content]:bg-background/10",
        className,
      )}
      {...props}
    >
      {typeof children === "string" || typeof children === "number" ? (
        <Text className="text-muted-foreground font-sans text-xs font-medium">
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  );
}

function KbdGroup({ className, ...props }: ViewProps) {
  return (
    <View
      className={cn("flex-row items-center gap-1", className)}
      {...props}
    />
  );
}

export { Kbd, KbdGroup };
