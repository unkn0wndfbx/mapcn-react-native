import { Link, type Href } from "expo-router";
import { Pressable } from "react-native";

import { Text } from "@/atoms/Text";
import { openExternalUrl } from "@/lib/Platform/Link";

interface DocsLinkProps {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}

export function DocsLink({ href, children, external }: DocsLinkProps) {
  const isExternal =
    external ?? (href.startsWith("http://") || href.startsWith("https://"));

  if (isExternal) {
    return (
      <Text
        accessibilityRole="link"
        className="text-foreground font-medium underline underline-offset-4"
        onPress={() => {
          openExternalUrl(href);
        }}
      >
        {children}
      </Text>
    );
  }

  return (
    <Link
      href={href as Href}
      asChild
    >
      <Pressable>
        <Text className="text-foreground font-medium underline underline-offset-4">
          {children}
        </Text>
      </Pressable>
    </Link>
  );
}
