import { site } from "@/data/site";

/** Local-time greeting — subtle, not gimmicky. Call client-side only. */
export function getGreeting(date: Date = new Date()): string {
  const hour = date.getHours();
  if (hour >= 0 && hour < 5) return site.greetings.lateNight;
  if (hour < 12) return site.greetings.morning;
  if (hour < 17) return site.greetings.afternoon;
  if (hour < 23) return site.greetings.evening;
  return site.greetings.lateNight;
}
