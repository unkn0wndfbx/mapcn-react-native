import {
  ChevronRight,
  File,
  Folder,
  FolderOpen,
  PanelLeft,
  PanelLeftClose,
  X,
} from "lucide-react-native";
import * as React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { Button } from "@/atoms/Button";
import { Icon } from "@/atoms/Icon";
import { Text } from "@/atoms/Text";
import { trackEvent } from "@/lib/Analytics/Events";
import { type FileTree } from "@/lib/Registry/Blocks";
import { cn } from "@/lib/Utils/Cn";
import { CodeBlock } from "@/molecules/CodeBlock";
import { CodeCopyButton } from "@/molecules/CodeCopyButton";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/molecules/Collapsible";

export interface HighlightedFile {
  path: string;
  target: string;
  content: string;
  highlightedContent: string;
}

interface BlockViewerCodeContext {
  activeFile: string;
  setActiveFile: (file: string) => void;
  highlightedFiles: HighlightedFile[];
  tree: FileTree[];
  isCompact: boolean;
  setTreeOpen: (open: boolean) => void;
}

const BlockViewerCodeCtx = React.createContext<BlockViewerCodeContext | null>(
  null,
);

function useBlockViewerCode() {
  const ctx = React.useContext(BlockViewerCodeCtx);
  if (!ctx) {
    throw new Error("useBlockViewerCode must be used within BlockViewerCode");
  }
  return ctx;
}

interface BlockViewerCodeProps {
  tree: FileTree[];
  highlightedFiles: HighlightedFile[];
  height?: number;
}

export function BlockViewerCode({
  tree,
  highlightedFiles,
  height = 930,
}: BlockViewerCodeProps) {
  const { width } = useWindowDimensions();
  const isCompact = width < 640;
  const [treeOpen, setTreeOpen] = React.useState(!isCompact);
  const [activeFile, setActiveFile] = React.useState<string>(
    highlightedFiles[0]?.target ?? "",
  );

  const file = React.useMemo(
    () => highlightedFiles.find((f) => f.target === activeFile),
    [highlightedFiles, activeFile],
  );

  React.useEffect(() => {
    setTreeOpen(!isCompact);
  }, [isCompact]);

  const selectFile = React.useCallback(
    (nextFile: string) => {
      setActiveFile(nextFile);
      if (isCompact) {
        setTreeOpen(false);
      }
    },
    [isCompact],
  );

  if (!file) return null;

  return (
    <BlockViewerCodeCtx.Provider
      value={{
        activeFile,
        setActiveFile: selectFile,
        highlightedFiles,
        tree,
        isCompact,
        setTreeOpen,
      }}
    >
      <View
        className="relative overflow-hidden rounded-xl border border-border"
        style={{ height }}
      >
        <View className="min-h-0 flex-1 flex-row">
          {isCompact ? null : (
            <FileTreePanel
              open={treeOpen}
              compact={false}
            >
              <FileTreeSidebar />
            </FileTreePanel>
          )}
          <View className="min-h-0 min-w-0 flex-1 flex-col">
            <View className="bg-surface border-border h-12 flex-row items-center gap-2 border-b px-4">
              <Button
                variant="ghost"
                size="icon"
                accessibilityLabel={treeOpen ? "Hide files" : "Show files"}
                onPress={() => {
                  setTreeOpen(!treeOpen);
                }}
                className="text-muted-foreground size-8 rounded-md"
              >
                <Icon
                  as={treeOpen ? PanelLeftClose : PanelLeft}
                  size={15}
                  className="text-muted-foreground"
                />
              </Button>
              <Text
                className="text-muted-foreground min-w-0 flex-1 text-sm"
                numberOfLines={1}
              >
                {file.target}
              </Text>
              <CodeCopyButton
                text={file.content}
                onCopy={() => {
                  trackEvent({
                    name: "copy_block_code",
                    properties: { file: file.target },
                  });
                }}
              />
            </View>
            <CodeBlock
              key={file.target}
              code={file.content}
              language={getCodeLanguage(file.target)}
              showHeader={false}
              showCopyButton={false}
              fill
              className="rounded-none border-0"
            />
          </View>
        </View>
        {isCompact ? (
          <FileTreePanel
            open={treeOpen}
            compact
            onClose={() => {
              setTreeOpen(false);
            }}
          >
            <FileTreeSidebar />
          </FileTreePanel>
        ) : null}
      </View>
    </BlockViewerCodeCtx.Provider>
  );
}

const TREE_WIDTH = 224;
const TREE_ANIMATION = {
  duration: 220,
  easing: Easing.out(Easing.cubic),
  reduceMotion: ReduceMotion.System,
};

function FileTreePanel({
  open,
  compact,
  onClose,
  children,
}: {
  open: boolean;
  compact: boolean;
  onClose?: () => void;
  children: React.ReactNode;
}) {
  const progress = useSharedValue(open ? 1 : 0);

  React.useEffect(() => {
    progress.value = withTiming(open ? 1 : 0, TREE_ANIMATION);
  }, [open, progress]);

  const widthStyle = useAnimatedStyle(() => ({
    width: progress.value * TREE_WIDTH,
  }));

  const drawerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: (1 - progress.value) * -TREE_WIDTH }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
  }));

  const panel = (
    <View
      className="border-border h-full border-r"
      style={styles.treeInner}
    >
      {children}
    </View>
  );

  if (compact) {
    return (
      <>
        <Animated.View
          pointerEvents={open ? "auto" : "none"}
          className={cn(
            "absolute inset-0 z-10 bg-black/40",
            Platform.OS === "web" && "duration-200 ease-out transition-opacity",
          )}
          style={
            Platform.OS === "web" ? { opacity: open ? 1 : 0 } : backdropStyle
          }
        >
          <Pressable
            accessibilityLabel="Hide files"
            onPress={onClose}
            className="flex-1"
          />
        </Animated.View>
        <Animated.View
          pointerEvents={open ? "auto" : "none"}
          className={cn(
            "bg-background absolute inset-y-0 left-0 z-20 overflow-hidden",
            Platform.OS === "web" &&
              "duration-200 ease-out transition-transform",
          )}
          style={
            Platform.OS === "web"
              ? {
                  width: TREE_WIDTH,
                  transform: [{ translateX: open ? 0 : -TREE_WIDTH }],
                }
              : [styles.treeInner, drawerStyle]
          }
        >
          {panel}
        </Animated.View>
      </>
    );
  }

  return (
    <Animated.View
      className={cn(
        "h-full shrink-0 overflow-hidden",
        Platform.OS === "web" && "duration-200 ease-out transition-[width]",
      )}
      style={
        Platform.OS === "web" ? { width: open ? TREE_WIDTH : 0 } : widthStyle
      }
    >
      {panel}
    </Animated.View>
  );
}

function FileTreeSidebar() {
  const { tree, isCompact, setTreeOpen } = useBlockViewerCode();

  return (
    <View className="flex-1">
      <View className="border-border h-12 flex-row items-center justify-between gap-2 border-b px-4">
        <Text className="text-sm font-medium">Files</Text>
        {isCompact ? (
          <Button
            variant="ghost"
            size="icon"
            accessibilityLabel="Hide files"
            onPress={() => {
              setTreeOpen(false);
            }}
            className="text-muted-foreground size-8 rounded-md"
          >
            <Icon
              as={X}
              size={15}
              className="text-muted-foreground"
            />
          </Button>
        ) : null}
      </View>
      <ScrollView contentContainerClassName="py-1.5">
        {tree.map((file) => (
          <TreeNode
            key={file.path ?? file.name}
            item={file}
            depth={0}
          />
        ))}
      </ScrollView>
    </View>
  );
}

function TreeNode({ item, depth }: { item: FileTree; depth: number }) {
  const { activeFile, setActiveFile } = useBlockViewerCode();
  const [open, setOpen] = React.useState(true);
  const paddingLeft = 12 + depth * 12;

  if (!item.children) {
    const isActive = item.path === activeFile;

    return (
      <Pressable
        onPress={() => {
          if (item.path) setActiveFile(item.path);
        }}
        accessibilityLabel={item.name}
        className={cn(
          "flex-row items-center gap-2 py-1.5 pr-3",
          isActive ? "bg-muted-foreground/15" : "hover:bg-muted/50",
        )}
        style={{ paddingLeft }}
      >
        <View className="size-4" />
        <Icon
          as={File}
          size={14}
          className="text-muted-foreground"
        />
        <Text
          className="min-w-0 flex-1 text-sm"
          numberOfLines={1}
        >
          {item.name}
        </Text>
      </Pressable>
    );
  }

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
    >
      <CollapsibleTrigger
        accessibilityLabel={`${open ? "Collapse" : "Expand"} ${item.name}`}
        className="hover:bg-muted/50 flex-row items-center gap-2 py-1.5 pr-3"
        style={{ paddingLeft }}
      >
        <View
          className={cn(
            "size-4 items-center justify-center duration-200 ease-out",
            Platform.OS === "web" && "transition-transform",
            open && "rotate-90",
          )}
        >
          <Icon
            as={ChevronRight}
            size={14}
            className="text-muted-foreground"
          />
        </View>
        <Icon
          as={open ? FolderOpen : Folder}
          size={14}
          className="text-muted-foreground"
        />
        <Text
          className="min-w-0 flex-1 text-sm"
          numberOfLines={1}
        >
          {item.name}
        </Text>
      </CollapsibleTrigger>
      <CollapsibleContent>
        {item.children.map((subItem) => (
          <TreeNode
            key={subItem.path ?? `${item.name}/${subItem.name}`}
            item={subItem}
            depth={depth + 1}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}

function getCodeLanguage(path: string): string {
  const extension = path.split(".").pop()?.toLowerCase();

  switch (extension) {
    case "ts":
      return "ts";
    case "tsx":
      return "tsx";
    case "js":
      return "js";
    case "jsx":
      return "jsx";
    case "json":
      return "json";
    case "css":
      return "css";
    case "md":
      return "markdown";
    case undefined:
      return "tsx";
    default:
      return "tsx";
  }
}

const styles = StyleSheet.create({
  treeInner: {
    width: TREE_WIDTH,
  },
});
