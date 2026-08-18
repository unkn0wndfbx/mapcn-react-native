import { Stack } from "expo-router";
import { Platform, View } from "react-native";

import { useIsMobile } from "@/hooks/Mobile";
import { DocsSidebar } from "@/organisms/DocsSidebar";
import { SidebarInset, SidebarProvider } from "@/organisms/Sidebar";

function DocsStack() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "transparent" },
      }}
    />
  );
}

export function DocsSectionLayout() {
  const isMobileNative = useIsMobile();
  const isMobile = Platform.OS !== "web" || isMobileNative;

  if (isMobile) {
    return (
      <View className="flex flex-1 bg-background">
        <DocsStack />
      </View>
    );
  }

  return (
    <View className="flex flex-1 bg-background">
      <SidebarProvider className="container min-h-min px-0">
        <DocsSidebar />
        <SidebarInset className="size-full">
          <DocsStack />
        </SidebarInset>
      </SidebarProvider>
    </View>
  );
}
