import { type NextRequest, NextResponse } from "next/server";

import { welcomeCookieName, welcomeCookieValue } from "@/config/welcome";
import { hasPublicSupabaseConfig } from "@/lib/env/public";
import { securityHeaders } from "@/lib/security";
import { updateSupabaseSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { response, user } = await updateSupabaseSession(request);

  for (const [name, value] of Object.entries(securityHeaders)) {
    response.headers.set(name, value);
  }

  const { pathname } = request.nextUrl;
  const welcomeSeen =
    request.cookies.get(welcomeCookieName)?.value === welcomeCookieValue;

  if (pathname === "/" && !user) {
    if (!welcomeSeen) {
      return copyCookies(
        response,
        NextResponse.redirect(new URL("/welcome", request.url)),
      );
    }

    if (hasPublicSupabaseConfig()) {
      return copyCookies(
        response,
        NextResponse.redirect(new URL("/login?next=/", request.url)),
      );
    }
  }

  return response;
}

function copyCookies(from: NextResponse, to: NextResponse) {
  for (const cookie of from.cookies.getAll()) {
    to.cookies.set(cookie);
  }

  for (const [name, value] of Object.entries(securityHeaders)) {
    to.headers.set(name, value);
  }

  return to;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon).*)"],
};
