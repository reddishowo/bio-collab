import { NextResponse, type NextRequest } from "next/server";
import { isLkpdDemoHost } from "@/lib/lkpdDemo";

export function proxy(request: NextRequest) {
  const isDemoMode =
    process.env.NEXT_PUBLIC_LKPD_DEMO_MODE === "true" ||
    isLkpdDemoHost(request.headers.get("host"));

  if (isDemoMode) {
    const url = request.nextUrl.clone();
    url.pathname = "/lkpd";
    url.searchParams.set("meeting", "p1");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/",
};
