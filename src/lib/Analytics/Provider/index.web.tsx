import { usePathname } from "expo-router";
import { PropsWithChildren, useEffect } from "react";

import { capturePageView, initAnalytics } from "@/lib/Analytics/Client";

export function AnalyticsProvider({ children }: PropsWithChildren) {
  const pathname = usePathname();

  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    capturePageView(pathname);
  }, [pathname]);

  return children;
}
