import { Check, Copy } from "lucide-react-native";
import { useState } from "react";

import { Button } from "@/atoms/Button";
import { Icon } from "@/atoms/Icon";
import { copyText } from "@/lib/Platform/Clipboard";
import { cn } from "@/lib/Utils/Cn";

interface CodeCopyButtonProps {
  text: string;
  onCopy?: () => void;
  className?: string;
}

export function CodeCopyButton({
  text,
  onCopy,
  className,
}: CodeCopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await copyText(text);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
    onCopy?.();
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onPress={() => {
        void copy();
      }}
      accessibilityLabel={copied ? "Copied" : "Copy code"}
      className={cn(
        "text-muted-foreground bg-code size-8 rounded-md",
        className,
      )}
    >
      <Icon
        as={copied ? Check : Copy}
        size={15}
        className="text-muted-foreground"
      />
    </Button>
  );
}
