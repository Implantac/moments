import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE, verifyAdminCookie } from "@/lib/admin-auth";

/**
 * Protege a área administrativa antes de qualquer renderização.
 * A verificação se repete na página (defesa em profundidade); o middleware
 * apenas evita o custo de invocar o server component para quem não tem cookie.
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const cookie = req.cookies.get(ADMIN_COOKIE)?.value;
    const ok = await verifyAdminCookie(cookie);
    if (!ok) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
