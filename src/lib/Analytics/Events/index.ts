import { captureEvent } from "@/lib/Analytics/Client";

type EventName =
  | "copy_install_command"
  | "copy_block_cli"
  | "copy_block_code"
  | "copy_agent_prompt";

type AllowedPropertyValues = string | number | boolean | null;

interface Event {
  name: EventName;
  properties?: Record<string, AllowedPropertyValues>;
}

export function trackEvent({ name, properties }: Event): void {
  captureEvent(name, properties);
}
