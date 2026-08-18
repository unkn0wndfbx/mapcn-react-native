import { createLlmIndexMarkdown } from "@/lib/Registry/LlmContent";
import { LlmMarkdownView } from "@/molecules/LlmMarkdownView";

export default function LlmIndexScreen() {
  const markdown = createLlmIndexMarkdown();

  return <LlmMarkdownView markdown={markdown} />;
}
