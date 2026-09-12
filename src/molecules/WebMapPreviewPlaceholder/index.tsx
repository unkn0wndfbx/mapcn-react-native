import { Image } from "expo-image";
import { ImageIcon, Smartphone } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Linking,
  Platform,
  StyleSheet,
  useColorScheme,
  useWindowDimensions,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { AppStoreIcon } from "@/atoms/AppStoreIcon";
import { Badge } from "@/atoms/Badge";
import { Button } from "@/atoms/Button";
import { Icon } from "@/atoms/Icon";
import { PlayStoreIcon } from "@/atoms/PlayStoreIcon";
import { Text } from "@/atoms/Text";
import {
  SITE_APP_STORE_URL,
  SITE_PLAY_STORE_URL,
} from "@/lib/Config/SiteMetadata";
import { THEME } from "@/lib/Config/Theme";
import { cn } from "@/lib/Utils/Cn";

const DEFAULT_PHONE_ASPECT_RATIO = 9 / 19.5;
const PORTRAIT_ASPECT_RATIO = 9 / 16;
const DOCS_PREVIEW_IMAGE_SIZE = 360;
const COMPACT_BREAKPOINT = 640;

type WebMapPreviewPlaceholderProps = {
  className?: string;
  title?: string;
  previewImage?: string;
  previewImageDark?: string;
  layout?: "overlay" | "aside";
  previewShape?: "square" | "portrait";
};

function getPortraitPreviewSize(
  availableWidth: number,
  availableHeight: number,
  aspectRatio: number,
  isCompact: boolean,
): { width: number; height: number } {
  if (availableWidth <= 0 || availableHeight <= 0) {
    return { width: 0, height: 0 };
  }

  const gap = 24;
  const infoWidth = isCompact ? 0 : 288;
  const maxWidth = isCompact
    ? availableWidth
    : Math.max(availableWidth - infoWidth - gap, availableWidth * 0.7);
  const maxHeight = availableHeight;
  let height = maxHeight;
  let width = height * aspectRatio;

  if (width > maxWidth) {
    width = maxWidth;
    height = width / aspectRatio;
  }

  return { width, height };
}

function openStoreUrl(url: string) {
  if (Platform.OS === "web") {
    window.open(url, "_blank");
  } else {
    void Linking.openURL(url);
  }
}

function PreviewImage({
  className,
  contentFit = "cover",
  previewImage,
  failedImage,
  onImageError,
  onImageLoad,
  imageAspectRatio,
  style,
}: {
  className?: string;
  contentFit?: "cover" | "contain";
  previewImage?: string;
  failedImage: string | null;
  onImageError: (image: string) => void;
  onImageLoad?: (aspectRatio: number) => void;
  imageAspectRatio?: number | null;
  style?: StyleProp<ViewStyle>;
}) {
  const showImage = Boolean(previewImage) && failedImage !== previewImage;
  const usesIntrinsicWidth = contentFit === "contain" && style === undefined;

  return (
    <View
      className={cn("bg-muted relative overflow-hidden", className)}
      style={[
        usesIntrinsicWidth
          ? {
              aspectRatio: imageAspectRatio ?? DEFAULT_PHONE_ASPECT_RATIO,
            }
          : undefined,
        style,
      ]}
    >
      {showImage && previewImage ? (
        <Image
          source={previewImage}
          contentFit={contentFit}
          transition={200}
          onError={() => {
            onImageError(previewImage);
          }}
          onLoad={(event) => {
            const { width, height } = event.source;
            if (width > 0 && height > 0) {
              onImageLoad?.(width / height);
            }
          }}
          contentPosition="center"
          style={StyleSheet.absoluteFill}
          accessibilityLabel="Map preview screenshot"
        />
      ) : (
        <View className="h-full min-h-40 w-full items-center justify-center p-6">
          <Icon
            as={ImageIcon}
            size={40}
            className="text-muted-foreground opacity-75"
          />
        </View>
      )}
    </View>
  );
}

function StoreButtons({ variant }: { variant: "overlay" | "aside" }) {
  const colorScheme = useColorScheme();
  const colors = THEME[colorScheme === "dark" ? "dark" : "light"];
  const showAppStore = SITE_APP_STORE_URL.length > 0;
  const showPlayStore = SITE_PLAY_STORE_URL.length > 0;
  const iconColor =
    variant === "overlay" ? "#000000" : colors.primaryForeground;

  if (!showAppStore && !showPlayStore) {
    return null;
  }

  const buttonClassName =
    variant === "overlay" ? "bg-white/95 dark:bg-white/90" : undefined;
  const labelClassName = variant === "overlay" ? "text-black" : undefined;
  const buttonVariant = variant === "overlay" ? "secondary" : "default";
  const buttonSize = variant === "overlay" ? "sm" : "default";

  return (
    <View
      className={cn(
        "flex-row flex-wrap gap-2",
        variant === "overlay" ? "items-center justify-center" : "items-center",
      )}
    >
      {showAppStore ? (
        <Button
          variant={buttonVariant}
          size={buttonSize}
          className={buttonClassName}
          onPress={() => {
            openStoreUrl(SITE_APP_STORE_URL);
          }}
          accessibilityLabel="Download on the App Store"
        >
          <AppStoreIcon
            size={14}
            color={iconColor}
          />
          <Text className={labelClassName}>App Store</Text>
        </Button>
      ) : null}

      {showPlayStore ? (
        <Button
          variant={buttonVariant}
          size={buttonSize}
          className={buttonClassName}
          onPress={() => {
            openStoreUrl(SITE_PLAY_STORE_URL);
          }}
          accessibilityLabel="Get it on Google Play"
        >
          <PlayStoreIcon
            size={14}
            color={iconColor}
          />
          <Text className={labelClassName}>Google Play</Text>
        </Button>
      ) : null}
    </View>
  );
}

function PreviewInfo({
  title,
  layout,
  className,
}: {
  title: string;
  layout: "overlay" | "aside";
  className?: string;
}) {
  if (layout === "aside") {
    const showAppStore = SITE_APP_STORE_URL.length > 0;
    const showPlayStore = SITE_PLAY_STORE_URL.length > 0;

    return (
      <View
        className={cn(
          "border-border bg-surface min-w-0 flex-1 rounded-xl border p-5 flex-col justify-center",
          className,
        )}
      >
        <View className="gap-5">
          <View className="flex-row items-center gap-3">
            <View className="bg-primary/10 rounded-lg p-2.5">
              <Icon
                as={Smartphone}
                size={20}
                className="text-primary"
              />
            </View>
            <Badge variant="secondary">
              <Text>iOS & Android</Text>
            </Badge>
          </View>

          <View className="gap-2.5">
            <Text className="text-foreground text-lg font-semibold tracking-tight">
              {title}
            </Text>
            <Text className="text-muted-foreground text-[15px] leading-relaxed">
              Live map previews run on iOS and Android. Open the app to explore
              the interactive map.
            </Text>
          </View>

          {showAppStore || showPlayStore ? (
            <View className="gap-2.5">
              <Text className="text-foreground text-xs font-medium tracking-wide uppercase">
                Get the app
              </Text>
              <StoreButtons variant="aside" />
            </View>
          ) : null}
        </View>
      </View>
    );
  }

  return (
    <>
      <View
        pointerEvents="none"
        className="absolute inset-x-0 bottom-0 h-48 bg-linear-to-t from-black/70 via-black/35 to-transparent"
      />

      <View
        className={cn(
          "absolute inset-x-0 bottom-0 gap-3 px-4 py-8",
          Platform.select({
            web: "supports-backdrop-filter:bg-black/25 bg-black/40 backdrop-blur-md",
            default: "bg-black/50",
          }),
        )}
      >
        <View className="gap-1">
          <Text className="text-center text-sm font-medium text-white">
            {title}
          </Text>
          <Text className="text-center text-xs text-white/75">
            Live map previews run on iOS and Android. Open the app to explore
            the interactive map.
          </Text>
        </View>
        <StoreButtons variant="overlay" />
      </View>
    </>
  );
}

export function WebMapPreviewPlaceholder({
  className,
  title = "Map preview",
  previewImage,
  previewImageDark,
  layout = "overlay",
  previewShape = "square",
}: WebMapPreviewPlaceholderProps) {
  const colorScheme = useColorScheme() === "dark" ? "dark" : "light";
  const { width: windowWidth } = useWindowDimensions();
  const isCompact = windowWidth < COMPACT_BREAKPOINT;
  const isPortrait = previewShape === "portrait";
  const [failedImage, setFailedImage] = useState<string | null>(null);
  const [useLightFallback, setUseLightFallback] = useState(false);
  const [frameSize, setFrameSize] = useState({ width: 0, height: 0 });
  const portraitSize = getPortraitPreviewSize(
    frameSize.width,
    frameSize.height,
    PORTRAIT_ASPECT_RATIO,
    isCompact,
  );

  const activePreviewImage =
    colorScheme === "dark" && previewImageDark && !useLightFallback
      ? previewImageDark
      : previewImage;

  useEffect(() => {
    setFailedImage(null);
    setUseLightFallback(false);
  }, [previewImage, previewImageDark, colorScheme]);

  function handleImageError(image: string) {
    if (image === previewImageDark && previewImage) {
      setUseLightFallback(true);
      return;
    }

    setFailedImage(image);
  }

  function handleFrameLayout(event: LayoutChangeEvent) {
    const { width, height } = event.nativeEvent.layout;
    setFrameSize((current) => {
      if (current.width === width && current.height === height) {
        return current;
      }

      return { width, height };
    });
  }

  if (layout === "aside") {
    if (isPortrait) {
      return (
        <View className="relative h-full w-full">
          <View
            pointerEvents="none"
            onLayout={handleFrameLayout}
            style={StyleSheet.absoluteFill}
          />
          <View
            className={cn(
              "h-full w-full gap-6",
              isCompact
                ? "flex-col items-center"
                : "flex-row items-stretch justify-center",
            )}
          >
            <PreviewImage
              className="border-border h-full shrink-0 rounded-3xl border shadow-md cursor-not-allowed select-none"
              contentFit="cover"
              previewImage={activePreviewImage}
              failedImage={failedImage}
              onImageError={handleImageError}
              imageAspectRatio={PORTRAIT_ASPECT_RATIO}
              style={
                portraitSize.width > 0
                  ? {
                      width: portraitSize.width,
                      height: portraitSize.height,
                      aspectRatio: PORTRAIT_ASPECT_RATIO,
                      borderCurve: "continuous",
                    }
                  : {
                      aspectRatio: PORTRAIT_ASPECT_RATIO,
                      height: "100%",
                      borderCurve: "continuous",
                    }
              }
            />
            <View
              className={
                isCompact ? "w-full" : "h-full w-72 max-w-full shrink-0"
              }
            >
              <PreviewInfo
                title={title}
                layout="aside"
                className={isCompact ? undefined : "h-full"}
              />
            </View>
          </View>
        </View>
      );
    }

    return (
      <View
        className={cn(
          "w-full gap-6",
          isCompact ? "flex-col items-center" : "flex-row items-stretch",
        )}
      >
        <PreviewImage
          className="border-border max-w-full shrink-0 rounded-lg border cursor-not-allowed select-none"
          contentFit="cover"
          previewImage={activePreviewImage}
          failedImage={failedImage}
          onImageError={handleImageError}
          style={{
            width: DOCS_PREVIEW_IMAGE_SIZE,
            maxWidth: "100%",
            aspectRatio: 1,
            borderCurve: "continuous",
          }}
        />
        <PreviewInfo
          title={title}
          layout="aside"
        />
      </View>
    );
  }

  return (
    <View className={cn("bg-muted relative flex-1 overflow-hidden", className)}>
      <PreviewImage
        className="absolute inset-0 cursor-not-allowed select-none"
        previewImage={activePreviewImage}
        failedImage={failedImage}
        onImageError={handleImageError}
      />
      <PreviewInfo
        title={title}
        layout="overlay"
      />
    </View>
  );
}
