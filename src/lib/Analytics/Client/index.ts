type AllowedPropertyValues = string | number | boolean | null;

export function initAnalytics(): boolean {
  return false;
}

export function capturePageView(_pathname: string): void {
  return;
}

export function captureEvent(
  _name: string,
  _properties?: Record<string, AllowedPropertyValues>,
): void {
  return;
}
