import { PortalHost } from "@rn-primitives/portal";
import { PropsWithChildren } from "react";
import { View } from "react-native";

import { Header } from "@/organisms/Header";

export { ErrorBoundary } from "@/organisms/ErrorBoundary";

export function AppShell({ children }: PropsWithChildren) {
  return (
    <>
      <Header />
      <View className="flex-1">{children}</View>
      <PortalHost />
    </>
  );
}
