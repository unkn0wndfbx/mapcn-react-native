import { Image } from "expo-image";
import { ArrowUpRight } from "lucide-react-native";
import { useCallback, useState } from "react";
import { Platform, Pressable, View } from "react-native";

import { Icon } from "@/atoms/Icon";
import { Text } from "@/atoms/Text";
import { trackEvent } from "@/lib/Analytics/Events";
import { SITE_AUTHOR } from "@/lib/Config/SiteMetadata";
import { openExternalUrl } from "@/lib/Platform/Link";
import { cn } from "@/lib/Utils/Cn";

type ShoutOutVariant = "pill" | "card";
type ShoutOutPlacement = "hero" | "footer" | "docs_sidebar" | "mobile_nav";

const AVATAR_SIZE: Record<ShoutOutVariant, number> = {
  pill: 28,
  card: 40,
};

type PortfolioShoutOutProps = {
  variant?: ShoutOutVariant;
  placement: ShoutOutPlacement;
  className?: string;
};

function getPressableClassName(
  variant: ShoutOutVariant,
  className?: string,
): string {
  const sharedClassName = cn(
    "group/author flex-row items-center border border-border bg-background active:bg-accent",
    Platform.select({
      web: "cursor-pointer outline-none transition-[transform,background-color,border-color,box-shadow] duration-200 ease-out hover:border-foreground/15 hover:bg-accent focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] motion-reduce:transform-none motion-reduce:transition-none",
    }),
  );

  switch (variant) {
    case "pill":
      return cn(
        sharedClassName,
        "h-11 gap-2 self-center rounded-full pr-3 pl-1.5 shadow-sm shadow-black/5",
        Platform.select({
          web: "hover:-translate-y-px",
        }),
        className,
      );
    case "card":
      return cn(
        sharedClassName,
        "w-full max-w-xs gap-3 self-start rounded-2xl p-2.5 pr-3 shadow-sm shadow-black/5",
        Platform.select({
          web: "hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/5",
        }),
        className,
      );
    default: {
      const exhaustive: never = variant;
      throw new Error(`Unhandled shout-out variant: ${String(exhaustive)}`);
    }
  }
}

function AuthorAvatar({ size }: { size: number }) {
  const [failed, setFailed] = useState(false);

  return (
    <View
      accessible={false}
      className="border-border shrink-0 overflow-hidden rounded-full border"
      style={{ width: size, height: size }}
    >
      {failed ? (
        <View className="bg-primary h-full w-full items-center justify-center">
          <Text className="text-primary-foreground text-xs font-semibold">
            {SITE_AUTHOR.initials}
          </Text>
        </View>
      ) : (
        <Image
          accessible={false}
          source={SITE_AUTHOR.avatarUrl}
          contentFit="cover"
          style={{ width: size, height: size }}
          onError={() => {
            setFailed(true);
          }}
        />
      )}
    </View>
  );
}

function PillContent() {
  return (
    <>
      <AuthorAvatar size={AVATAR_SIZE.pill} />
      <Text className="text-muted-foreground text-sm leading-none">
        Crafted by{" "}
        <Text className="text-foreground text-sm font-medium leading-none">
          {SITE_AUTHOR.name}
        </Text>
      </Text>
      <Icon
        as={ArrowUpRight}
        size={14}
        className={cn(
          "text-muted-foreground shrink-0",
          Platform.select({
            web: "transition-transform duration-200 ease-out group-hover/author:text-foreground group-hover/author:translate-x-0.5 group-hover/author:-translate-y-0.5 motion-reduce:transition-none",
          }),
        )}
      />
    </>
  );
}

function CardContent() {
  return (
    <>
      <AuthorAvatar size={AVATAR_SIZE.card} />
      <View className="min-w-0 flex-1 gap-0.5">
        <Text className="text-foreground text-sm font-semibold leading-tight">
          {SITE_AUTHOR.name}
        </Text>
        <Text className="text-muted-foreground text-xs leading-snug">
          {SITE_AUTHOR.role}
        </Text>
      </View>
      <Icon
        as={ArrowUpRight}
        size={16}
        className={cn(
          "text-muted-foreground shrink-0",
          Platform.select({
            web: "transition-transform duration-200 ease-out group-hover/author:text-foreground group-hover/author:translate-x-0.5 group-hover/author:-translate-y-0.5 motion-reduce:transition-none",
          }),
        )}
      />
    </>
  );
}

function getShoutOutContent(variant: ShoutOutVariant) {
  switch (variant) {
    case "pill":
      return <PillContent />;
    case "card":
      return <CardContent />;
    default: {
      const exhaustive: never = variant;
      throw new Error(`Unhandled shout-out variant: ${String(exhaustive)}`);
    }
  }
}

export function PortfolioShoutOut({
  variant = "pill",
  placement,
  className,
}: PortfolioShoutOutProps) {
  const openPortfolio = useCallback(() => {
    trackEvent({
      name: "open_author_portfolio",
      properties: { placement },
    });
    openExternalUrl(SITE_AUTHOR.url);
  }, [placement]);

  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={`Open ${SITE_AUTHOR.name}'s portfolio`}
      accessibilityHint="Opens the freelance Next.js and React Native portfolio"
      onPress={openPortfolio}
      className={getPressableClassName(variant, className)}
    >
      {getShoutOutContent(variant)}
    </Pressable>
  );
}
