import { SearchIcon } from "lucide-react-native";
import * as React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  useWindowDimensions,
  View,
  type ViewProps,
} from "react-native";

import { Icon } from "@/atoms/Icon";
import { Input } from "@/atoms/Input";
import { Text } from "@/atoms/Text";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/molecules/Dialog";

function Command({ className, ...props }: ViewProps) {
  return (
    <View
      className={cn(
        "bg-popover text-popover-foreground flex w-full flex-col overflow-hidden rounded-md",
        className,
      )}
      {...props}
    />
  );
}

const COMMAND_DIALOG_WIDTH = 510;

function CommandDialog({
  title = "Command Palette",
  description = "Search for a command to run...",
  children,
  className,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof Dialog> & {
  title?: string;
  description?: string;
  className?: string;
  showCloseButton?: boolean;
}) {
  const { width: windowWidth } = useWindowDimensions();
  const width = Math.min(COMMAND_DIALOG_WIDTH, Math.max(0, windowWidth - 32));

  return (
    <Dialog {...props}>
      <DialogContent
        className={cn(
          "w-auto max-w-none self-center overflow-hidden p-0 sm:max-w-none",
          className,
        )}
        overlayClassName={Platform.select({
          web: "flex-col justify-start pt-[min(22vh,10rem)]",
        })}
        style={{ width }}
        showCloseButton={showCloseButton}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Command>{children}</Command>
      </DialogContent>
    </Dialog>
  );
}

function CommandInput({
  className,
  ...props
}: React.ComponentProps<typeof Input>) {
  return (
    <View className="border-border flex h-12 flex-row items-center gap-2 border-b px-3">
      <Icon
        as={SearchIcon}
        className="text-muted-foreground size-4 shrink-0 opacity-50"
      />
      <Input
        className={cn(
          "h-10 flex-1 border-0 bg-transparent! px-0 py-3 text-sm shadow-none",
          Platform.select({
            web: "focus-visible:ring-0",
          }),
          className,
        )}
        {...props}
      />
    </View>
  );
}

function CommandList({
  className,
  ...props
}: React.ComponentProps<typeof ScrollView>) {
  return (
    <ScrollView
      className={cn("max-h-[300px]", className)}
      keyboardShouldPersistTaps="handled"
      nestedScrollEnabled
      {...props}
    />
  );
}

function CommandEmpty({ className, ...props }: ViewProps) {
  return (
    <View
      className={cn("items-center justify-center py-6", className)}
      {...props}
    />
  );
}

function CommandGroup({
  className,
  heading,
  children,
  ...props
}: ViewProps & {
  heading?: string;
}) {
  return (
    <View
      className={cn("overflow-hidden p-1", className)}
      {...props}
    >
      {heading ? (
        <Text className="text-muted-foreground px-2 py-1.5 text-xs font-medium">
          {heading}
        </Text>
      ) : null}
      <View>{children}</View>
    </View>
  );
}

function CommandSeparator({ className, ...props }: ViewProps) {
  return (
    <View
      className={cn("bg-border -mx-1 h-px", className)}
      {...props}
    />
  );
}

function CommandItem({
  className,
  children,
  onSelect,
  disabled = false,
  ...props
}: Omit<React.ComponentProps<typeof Pressable>, "children"> & {
  children?: React.ReactNode;
  onSelect?: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onSelect}
      className={cn(
        "flex flex-row items-center gap-2 rounded-sm px-2 py-2.5",
        disabled ? "opacity-50" : "active:bg-accent",
        Platform.select({
          web: "outline-none select-none hover:bg-accent",
        }),
        className,
      )}
      {...props}
    >
      {children}
    </Pressable>
  );
}

function CommandShortcut({
  className,
  ...props
}: React.ComponentProps<typeof Text>) {
  return (
    <Text
      className={cn(
        "text-muted-foreground ml-auto text-xs tracking-widest",
        className,
      )}
      {...props}
    />
  );
}

export {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
};
