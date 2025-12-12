import createMiddleware from "next-intl/middleware";
import { routing } from "./lib/i18n";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  // Skip i18n for admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/",
    "/(hi|en|mr|bn|ta|te|gu)/:path*",
    "/((?!api|admin|_next/static|_next/image|favicon.ico|images).*)",
  ],
};
