import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

async function verifyToken(token: string): Promise<boolean> {
  try {
    const SECRET = new TextEncoder().encode(
      process.env.JWT_SECRET || "digital-crm-secret-key-2025"
    );
    await jwtVerify(token, SECRET);
    return true;
  } catch (err) {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const token = req.cookies.get("crm-token")?.value;
  
  let isLoggedIn = false;
  if (token) {
    isLoggedIn = await verifyToken(token);
  }

  const isAuthRoute = nextUrl.pathname.startsWith("/login");
  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
  const isPublicRoute = ["/", "/login"].includes(nextUrl.pathname) || isApiAuthRoute;

  if (isApiAuthRoute) return NextResponse.next();

  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
