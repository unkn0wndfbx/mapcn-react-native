import { Link } from "expo-router";
import { Check, Maximize, Terminal } from "lucide-react-native";
import { useState } from "react";
import { Platform, useWindowDimensions, View } from "react-native";

import { Button } from "@/atoms/Button";
import { Icon } from "@/atoms/Icon";
import { Separator } from "@/atoms/Separator";
import { Text } from "@/atoms/Text";
import { trackEvent } from "@/lib/Analytics/Events";
import { copyText } from "@/lib/Platform/Clipboard";
import { type FileTree, type RegistryBlockItem } from "@/lib/Registry/Blocks";
import { getRegistryItemUrl } from "@/lib/Registry/Config";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/molecules/Tabs";
import {
  BlockViewerCode,
  type HighlightedFile,
} from "@/organisms/BlockViewerCode";

interface BlockPreviewProps {
  block: RegistryBlockItem;
  children: React.ReactNode;
  tree: FileTree[];
  highlightedFiles: HighlightedFile[];
}

function parsePreviewHeight(iframeHeight?: string): number {
  const parsed = Number.parseInt(iframeHeight ?? "930", 10);
  const height = Number.isFinite(parsed) && parsed > 0 ? parsed : 930;
  return Math.max(height, 900);
}

export function BlockPreview({
  block,
  children,
  tree,
  highlightedFiles,
}: BlockPreviewProps) {
  const { name, title, description, meta } = block;
  const [copiedType, setCopiedType] = useState<"code" | "cli" | null>(null);
  const [tab, setTab] = useState("preview");
  const { width } = useWindowDimensions();
  const compact = width < 640;
  const isWeb = Platform.OS === "web";
  const previewHeight = isWeb ? parsePreviewHeight(meta?.iframeHeight) : 320;
  const installCommand = `npx shadcn@latest add ${getRegistryItemUrl(name)}`;

  async function copyCli() {
    await copyText(installCommand);
    setCopiedType("cli");
    setTimeout(() => {
      setCopiedType(null);
    }, 2000);
    trackEvent({ name: "copy_block_cli", properties: { block: name } });
  }

  return (
    <View className="gap-4">
      <View>
        <Text className="text-lg font-semibold tracking-tight">{title}</Text>
        {description ? (
          <Text className="text-muted-foreground mt-0.5 text-sm">
            {description}
          </Text>
        ) : null}
      </View>

      <Tabs
        value={tab}
        onValueChange={setTab}
        className="w-full"
      >
        <View
          className={
            compact
              ? "items-start gap-3"
              : "flex-row items-center justify-between gap-2"
          }
        >
          <TabsList className="h-8 shrink-0">
            <TabsTrigger value="preview">
              <Text className="text-xs">Preview</Text>
            </TabsTrigger>
            <TabsTrigger value="code">
              <Text className="text-xs">Code</Text>
            </TabsTrigger>
          </TabsList>

          {compact || !isWeb ? (
            <View className="flex-row items-center gap-2.5">
              {compact ? (
                <Button
                  onPress={() => {
                    void copyCli();
                  }}
                  variant="outline"
                  accessibilityLabel={`Copy install command: ${installCommand}`}
                  size="sm"
                  className="gap-1.5"
                >
                  <Icon
                    as={copiedType === "cli" ? Check : Terminal}
                    size={14}
                  />
                  <Text className="font-mono text-xs">
                    Copy install command
                  </Text>
                </Button>
              ) : null}
              {compact && !isWeb ? (
                <View className="h-4 justify-center">
                  <Separator orientation="vertical" />
                </View>
              ) : null}
              {isWeb ? null : (
                <Link
                  href={`/view/${name}`}
                  asChild
                >
                  <Button
                    variant="outline"
                    size="icon"
                    accessibilityLabel="Open block"
                  >
                    <Icon
                      as={Maximize}
                      size={16}
                    />
                  </Button>
                </Link>
              )}
            </View>
          ) : null}
        </View>

        {compact ? null : (
          <Button
            onPress={() => {
              void copyCli();
            }}
            variant="outline"
            accessibilityLabel={`Copy install command: ${installCommand}`}
            size="sm"
            className="mt-2 h-auto min-h-8 w-full min-w-0 shrink justify-start gap-1.5 py-5 whitespace-normal"
          >
            <Icon
              as={copiedType === "cli" ? Check : Terminal}
              size={14}
              className="shrink-0"
            />

            <Text className="min-w-0 flex-1 font-mono text-xs leading-5 break-all">
              {installCommand}
            </Text>
          </Button>
        )}

        <TabsContent
          value="preview"
          className="mt-3"
          style={{ height: previewHeight }}
        >
          {children}
        </TabsContent>

        <TabsContent
          value="code"
          className="mt-3"
          style={{ height: previewHeight }}
        >
          <BlockViewerCode
            tree={tree}
            highlightedFiles={highlightedFiles}
            height={previewHeight}
          />
        </TabsContent>
      </Tabs>
    </View>
  );
}
