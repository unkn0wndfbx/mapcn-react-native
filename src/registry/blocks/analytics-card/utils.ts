export function getBubbleSize(visitors: number): number {
  return Math.round(10 + Math.sqrt(visitors) * 2.2);
}
