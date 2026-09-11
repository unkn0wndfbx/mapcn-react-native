import { z } from "zod";

type AllowedPropertyValues = string | number | boolean | null;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const analyticsEnvSchema = z.object({
  EXPO_PUBLIC_GA_MEASUREMENT_ID: z.string().regex(/^G-[A-Z0-9]+$/),
});

let initialized = false;
let measurementId: string | null = null;

function toGtagParams(
  properties: Record<string, AllowedPropertyValues>,
): Record<string, string | number> {
  const params: Record<string, string | number> = {};

  for (const [key, value] of Object.entries(properties)) {
    if (value === null) {
      continue;
    }

    if (typeof value === "boolean") {
      params[key] = value ? "true" : "false";
      continue;
    }

    params[key] = value;
  }

  return params;
}

function gtag(...args: unknown[]): void {
  const dataLayer = window.dataLayer;
  if (dataLayer === undefined) {
    return;
  }

  dataLayer.push(args);
}

export function initAnalytics(): boolean {
  if (initialized) {
    return true;
  }

  if (typeof window === "undefined") {
    return false;
  }

  const parsed = analyticsEnvSchema.safeParse({
    EXPO_PUBLIC_GA_MEASUREMENT_ID: process.env.EXPO_PUBLIC_GA_MEASUREMENT_ID,
  });

  if (!parsed.success) {
    return false;
  }

  measurementId = parsed.data.EXPO_PUBLIC_GA_MEASUREMENT_ID;
  window.dataLayer = window.dataLayer ?? [];
  window.gtag = gtag;

  gtag("js", new Date());
  gtag("config", measurementId, {
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  initialized = true;
  return true;
}

export function capturePageView(pathname: string): void {
  if (!initAnalytics() || measurementId === null) {
    return;
  }

  gtag("event", "page_view", {
    page_path: pathname,
    page_location:
      typeof window === "undefined" ? pathname : window.location.href,
    page_title: typeof document === "undefined" ? pathname : document.title,
    send_to: measurementId,
  });
}

export function captureEvent(
  name: string,
  properties?: Record<string, AllowedPropertyValues>,
): void {
  if (!initAnalytics() || measurementId === null) {
    return;
  }

  if (properties === undefined) {
    gtag("event", name, { send_to: measurementId });
    return;
  }

  gtag("event", name, {
    ...toGtagParams(properties),
    send_to: measurementId,
  });
}
