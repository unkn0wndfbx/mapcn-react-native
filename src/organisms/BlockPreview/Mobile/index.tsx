import { Link } from "expo-router";
import { MapPinned, Maximize2 } from "lucide-react-native";
import { Platform, View } from "react-native";

import { Button } from "@/atoms/Button";
import { Icon } from "@/atoms/Icon";
import { Text } from "@/atoms/Text";
import { WebMapPreviewPlaceholder } from "@/molecules/WebMapPreviewPlaceholder";

type MobileBlockPreviewProps = {
  name: string;
  title: string;
  previewImage?: string;
  previewImageDark?: string;
};

function NativeBlockPreview({ name, title }: { name: string; title: string }) {
  return (
    <View className="bg-muted/40 flex-1 items-center justify-center gap-5 px-6">
      <View className="bg-background size-14 items-center justify-center rounded-2xl border border-border">
        <Icon
          as={MapPinned}
          className="text-muted-foreground"
          size={26}
        />
      </View>
      <View className="items-center gap-1.5">
        <Text className="text-center text-lg font-semibold">{title}</Text>
        <Text className="text-muted-foreground max-w-72 text-center text-sm">
          Open the interactive preview to load this map.
        </Text>
      </View>
      <Link
        href={`/view/${name}`}
        asChild
      >
        <Button accessibilityLabel={`Open ${title} interactive preview`}>
          <Icon
            as={Maximize2}
            size={16}
          />
          <Text>Open interactive preview</Text>
        </Button>
      </Link>
    </View>
  );
}

export function MobileBlockPreview({
  name,
  title,
  previewImage,
  previewImageDark,
}: MobileBlockPreviewProps) {
  if (Platform.OS === "web") {
    return (
      <View className="h-full w-full overflow-hidden p-2">
        <WebMapPreviewPlaceholder
          title={title}
          previewImage={previewImage}
          previewImageDark={previewImageDark}
          layout="aside"
          previewShape="portrait"
        />
      </View>
    );
  }

  return (
    <View className="h-full w-full overflow-hidden rounded-xl border border-border">
      <NativeBlockPreview
        name={name}
        title={title}
      />
    </View>
  );
}
