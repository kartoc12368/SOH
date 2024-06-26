import { NextResponse } from "next/server";

export function middleware(request) {
  const accessToken = request.cookies.get("token");

  const pathname = request.nextUrl.pathname;

  if (
    !accessToken &&
    (pathname.startsWith("/admin") || pathname.startsWith("/fundraiserAdmin"))
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (!accessToken && pathname === "/") {
    return NextResponse.redirect(
      new URL("https://supportourheroes.in/", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    // "/fundraiserAdmin",
    "/fundraiserAdmin/:path*",
    "/admin/:path*",
    // "/admin",
  ],
};
