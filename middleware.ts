import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // If user already has a locale cookie, skip detection
  if (request.cookies.get("locale")) {
    return NextResponse.next();
  }

  const acceptLanguage = request.headers.get("accept-language") || "";
  // Check if Vietnamese is anywhere in the Accept-Language header
  const isVietnamese = /\bvi\b/i.test(acceptLanguage);

  const locale = isVietnamese ? "vi" : "en";

  const response = NextResponse.next();
  response.cookies.set("locale", locale, {
    path: "/",
    maxAge: 365 * 24 * 60 * 60,
    sameSite: "lax",
  });

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|icon.svg|og-image.png).*)",
  ],
};
