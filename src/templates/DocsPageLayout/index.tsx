import { Link, type Href } from "expo-router";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import * as React from "react";
import {
  ScrollView,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";

import { DocsScrollProvider } from "./docs-scroll-context";
import { DocsToc } from "./DocsToc";

import { Button } from "@/atoms/Button";
import { Icon } from "@/atoms/Icon";
import { Text } from "@/atoms/Text";
import { PageHead } from "@/molecules/PageHead";
import { PrivacyPolicyLink } from "@/molecules/PrivacyPolicyLink";
import { ParentScrollLockProvider } from "@/providers/ParentScrollLock";

interface TocItem {
  title: string;
  slug: string;
}

interface DocsTitleProps {
  title: string;
  description: string;
}

function DocsTitle({ title, description }: DocsTitleProps) {
  return (
    <View className="gap-3">
      <Text className="text-foreground text-3xl font-semibold tracking-tight">
        {title}
      </Text>
      <Text className="text-muted-foreground text-base leading-relaxed">
        {description}
      </Text>
    </View>
  );
}

type DocsPageLayoutProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  prev?: { title: string; href: Href };
  next?: { title: string; href: Href };
  toc?: TocItem[];
};

const SCROLL_OFFSET = 56;

export function DocsPageLayout({
  title,
  description,
  children,
  prev,
  next,
  toc = [],
}: DocsPageLayoutProps) {
  const scrollRef = React.useRef<ScrollView>(null);
  const [sectionsBaseY, setSectionsBaseY] = React.useState(0);
  const sectionOffsets = React.useRef<Record<string, number>>({});
  const [activeSection, setActiveSection] = React.useState<string | null>(null);
  const [scrollEnabled, setScrollEnabled] = React.useState(true);

  const registerSection = React.useCallback((slug: string, y: number) => {
    sectionOffsets.current[slug] = y;
  }, []);

  const scrollToSection = React.useCallback((slug: string) => {
    const y = sectionOffsets.current[slug];
    if (y === undefined) {
      return;
    }

    scrollRef.current?.scrollTo({
      y: Math.max(y - SCROLL_OFFSET, 0),
      animated: true,
    });
    setActiveSection(slug);
  }, []);

  const updateActiveSection = React.useCallback(
    (scrollY: number) => {
      if (!toc.length) {
        return;
      }

      const adjustedScrollY = scrollY + SCROLL_OFFSET;
      let nextActive: string | null = toc[0]?.slug ?? null;

      for (const item of toc) {
        const offset = sectionOffsets.current[item.slug];
        if (offset !== undefined && adjustedScrollY >= offset) {
          nextActive = item.slug;
        }
      }

      setActiveSection((current) =>
        current === nextActive ? current : nextActive,
      );
    },
    [toc],
  );

  const handleScroll = React.useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      updateActiveSection(event.nativeEvent.contentOffset.y);
    },
    [updateActiveSection],
  );

  const scrollContextValue = React.useMemo(
    () => ({
      scrollRef,
      sectionsBaseY,
      registerSection,
      scrollToSection,
      activeSection,
      setActiveSection,
      sectionOffsets,
    }),
    [
      registerSection,
      scrollToSection,
      activeSection,
      setActiveSection,
      sectionOffsets,
    ],
  );

  return (
    <DocsScrollProvider value={scrollContextValue}>
      <ParentScrollLockProvider setScrollEnabled={setScrollEnabled}>
        <PageHead
          title={title}
          description={description}
        />
        <View className="flex-1 flex-row bg-background">
          <ScrollView
            ref={scrollRef}
            className="min-w-0 flex-1 bg-background"
            contentContainerClassName="flex-grow pb-20"
            showsVerticalScrollIndicator={false}
            scrollEnabled={scrollEnabled}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            <View className="mx-auto w-full max-w-200 flex-1 px-4 pt-10 lg:px-4">
              <DocsTitle
                title={title}
                description={description}
              />
              <View
                className="mt-12 mb-12 gap-12"
                onLayout={(event) => {
                  setSectionsBaseY(event.nativeEvent.layout.y);
                }}
              >
                {children}
              </View>
              <View className="mt-8 border-t border-border pt-6">
                <PrivacyPolicyLink />
              </View>
              {(prev ?? next) && (
                <View className="mt-6 flex-row items-center justify-between gap-4">
                  {prev ? (
                    <Link
                      href={prev.href as Href}
                      asChild
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="-ml-2 h-auto py-2"
                      >
                        <Icon
                          as={ChevronLeft}
                          size={16}
                        />
                        <Text>{prev.title}</Text>
                      </Button>
                    </Link>
                  ) : (
                    <View />
                  )}
                  {next ? (
                    <Link
                      href={next.href as Href}
                      asChild
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="-mr-2 h-auto py-2"
                      >
                        <Text>{next.title}</Text>
                        <Icon
                          as={ChevronRight}
                          size={16}
                        />
                      </Button>
                    </Link>
                  ) : null}
                </View>
              )}
            </View>
          </ScrollView>

          {toc.length > 0 && (
            <View className="hidden w-48 shrink-0 xl:flex">
              <View className="pt-10 pb-10">
                <DocsToc items={toc} />
              </View>
            </View>
          )}
        </View>
      </ParentScrollLockProvider>
    </DocsScrollProvider>
  );
}

export { useDocsScroll } from "./docs-scroll-context";
