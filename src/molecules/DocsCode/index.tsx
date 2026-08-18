import { Platform } from "react-native";

import { Text } from "@/atoms/Text";
import { cn } from "@/lib/Utils/Cn";

export function DocsCode({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Text
      {...(Platform.OS === "web"
        ? ({ dataSet: { slot: "docs-code" } } as object)
        : {})}
      className={cn(
        "bg-muted relative rounded-md px-1.5 py-0.5 font-mono text-sm",
        className,
      )}
    >
      {children}
    </Text>
  );
}
