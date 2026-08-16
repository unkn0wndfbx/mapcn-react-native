import { router, useLocalSearchParams } from "expo-router";

import { ErrorBoundary } from "../_layout";

import { createLlmItemMarkdown, getRegistryItem } from "@/lib/Registry/LlmContent";
import { LlmMarkdownView } from "@/molecules/LlmMarkdownView";

export default function LlmItemScreen() {
  const { slug } = useLocalSearchParams<{
    slug?: string[];
  }>();

  const itemName = slug?.[0];

  // Equivalent to Next.js notFound()
  if (!itemName || slug.length > 1) {
    return <ErrorBoundary />;
  }

  const item = getRegistryItem(itemName);

  if (!item) {
    router.push("/+not-found");
    return;
  }

  const markdown = createLlmItemMarkdown(item);

  return <LlmMarkdownView markdown={markdown} />;
}
