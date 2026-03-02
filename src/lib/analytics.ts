export function track(eventName: string, params?: Record<string, any>) {
  if (typeof window === "undefined") return;

  const gtag = (window as any).gtag;
  if (typeof gtag !== "function") return;

  gtag("event", eventName, params || {});
}