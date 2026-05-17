export const LKPD_DEMO_HOSTNAME = "bio-collab-admin.vercel.app";

export function isLkpdDemoHost(hostname?: string | null) {
  const normalizedHostname = (hostname ?? "").split(":")[0].toLowerCase();
  return normalizedHostname === LKPD_DEMO_HOSTNAME;
}

export function isLkpdDemoModeEnabled() {
  if (process.env.NEXT_PUBLIC_LKPD_DEMO_MODE === "true") return true;
  if (typeof window === "undefined") return false;

  return isLkpdDemoHost(window.location.hostname);
}
