import { auth } from "@/auth";
import { NextResponse } from "next/server";


export default auth((req) => {
  if (
    req.auth &&
    (req.nextUrl.pathname.startsWith("/") ||
      req.nextUrl.pathname.startsWith("/verify") ||
      req.nextUrl.pathname.startsWith("/sign-in") ||
      req.nextUrl.pathname.startsWith("/sign-up"))
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (!req.auth && req.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  return NextResponse.next();
});


export const config = {
  matcher: [
    "/",
    "/sign-in",
    "/sign-up",
    "/dashboard/:path*",
    "/verify/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
