import * as DialogPrimitive from "@rn-primitives/dialog";
import { X } from "lucide-react-native";
import * as React from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  type GestureResponderEvent,
  type ViewProps,
} from "react-native";
import { FadeIn, FadeOut, ReduceMotion } from "react-native-reanimated";
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens";

import { Icon } from "@/atoms/Icon";
import { NativeOnlyAnimatedView } from "@/atoms/NativeOnlyAnimatedView";
import { cn } from "@/lib/Utils/Cn";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const FullWindowOverlay = Platform.OS === "ios" ? RNFullWindowOverlay : View;

const nativeOverlayFill = {
  alignItems: "center",
  backgroundColor: "rgba(0,0,0,0.5)",
  bottom: 0,
  justifyContent: "center",
  left: 0,
  padding: 8,
  position: "absolute",
  right: 0,
  top: 0,
} as const;

function DialogOverlay({
  className,
  children,
  onPress,
  ...props
}: Omit<React.ComponentProps<typeof DialogPrimitive.Overlay>, "asChild"> & {
  children?: React.ReactNode;
}) {
  const { onOpenChange } = DialogPrimitive.useRootContext();

  function onOverlayPress(event: GestureResponderEvent) {
    onPress?.(event);
    if (event.target === event.currentTarget && !event.isDefaultPrevented()) {
      onOpenChange(false);
    }
  }

  if (Platform.OS !== "web") {
    return (
      <FullWindowOverlay className="absolute inset-0">
        <NativeOnlyAnimatedView
          entering={FadeIn.duration(200).reduceMotion(ReduceMotion.System)}
          exiting={FadeOut.duration(150).reduceMotion(ReduceMotion.System)}
          style={nativeOverlayFill}
        >
          <Pressable
            accessibilityLabel="Close"
            onPress={() => {
              onOpenChange(false);
            }}
            style={StyleSheet.absoluteFill}
          />
          <NativeOnlyAnimatedView
            entering={FadeIn.delay(50).reduceMotion(ReduceMotion.System)}
            exiting={FadeOut.duration(150).reduceMotion(ReduceMotion.System)}
          >
            <>{children}</>
          </NativeOnlyAnimatedView>
        </NativeOnlyAnimatedView>
      </FullWindowOverlay>
    );
  }

  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 flex cursor-pointer items-center justify-center bg-black/50 p-2 *:cursor-auto",
        className,
      )}
      {...props}
      onPress={onOverlayPress}
    >
      {children}
    </DialogPrimitive.Overlay>
  );
}
function DialogContent({
  className,
  portalHost,
  children,
  showCloseButton = true,
  overlayClassName,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  portalHost?: string;
  showCloseButton?: boolean;
  overlayClassName?: string;
}) {
  return (
    <DialogPortal hostName={portalHost}>
      <DialogOverlay className={overlayClassName}>
        <DialogPrimitive.Content
          data-slot="dialog-content"
          className={cn(
            "bg-background border-border z-50 mx-auto flex w-full max-w-[calc(100%-2rem)] flex-col gap-4 rounded-lg border p-6 shadow-lg shadow-black/5 sm:max-w-lg",
            className,
          )}
          {...props}
        >
          <>{children}</>
          {showCloseButton ? (
            <DialogPrimitive.Close
              className={cn(
                "absolute right-4 top-4 rounded opacity-70 active:opacity-100",
                Platform.select({
                  web: "ring-offset-background focus:ring-ring data-[state=open]:bg-accent transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2",
                }),
              )}
              hitSlop={12}
            >
              <Icon
                as={X}
                className={cn(
                  "text-accent-foreground web:pointer-events-none size-4 shrink-0",
                )}
              />
              <Text className="sr-only">Close</Text>
            </DialogPrimitive.Close>
          ) : null}
        </DialogPrimitive.Content>
      </DialogOverlay>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }: ViewProps) {
  return (
    <View
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  );
}

function DialogFooter({ className, ...props }: ViewProps) {
  return (
    <View
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    />
  );
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn(
        "text-foreground text-lg font-semibold leading-none",
        className,
      )}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
