import { useState } from "react";
import { ScrollView } from "react-native";

import { Footer } from "@/organisms/Footer";
import { ParentScrollLockProvider } from "@/providers/ParentScrollLock";

type ScrollPageLayoutProps = {
  children: React.ReactNode;
  header?: React.ReactNode;
  withFooter?: boolean;
  lockParentScroll?: boolean;
};

export function ScrollPageLayout({
  children,
  header,
  withFooter = true,
  lockParentScroll = false,
}: ScrollPageLayoutProps) {
  const [scrollEnabled, setScrollEnabled] = useState(true);

  const content = (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="flex-grow"
      showsVerticalScrollIndicator={false}
      scrollEnabled={scrollEnabled}
    >
      {header}
      {children}
      {withFooter ? <Footer /> : null}
    </ScrollView>
  );

  if (!lockParentScroll) {
    return content;
  }

  return (
    <ParentScrollLockProvider setScrollEnabled={setScrollEnabled}>
      {content}
    </ParentScrollLockProvider>
  );
}
