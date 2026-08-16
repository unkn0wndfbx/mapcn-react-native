import { createLlmIndexMarkdown } from "@/lib/llm-content";
import { LlmMarkdownView } from "@/molecules/LlmMarkdownView";

export default function LlmIndexScreen() {
  const markdown = createLlmIndexMarkdown();

  return <LlmMarkdownView markdown={markdown} />;
}
