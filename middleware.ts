import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { unsignCookieEdge } from "./src/utils/cookie-signature.edge";

const protectedRoutes = [
  "/perfil",
  "/completar-cadastro",
  "/criar-solicitacao",
  "/visualizar-solicitacao",
  "/hemocentros",
];

// Routes that require a complete profile (blocked for OAuth users who haven't filled in their data yet)
const requiresCompleteProfile = [
  "/perfil",
  "/criar-solicitacao",
  "/hemocentros",
  "/campanhas",
];

function decodeJwtToken(token: string): { exp?: number } | null {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      Buffer.from(base64, "base64")
        .toString()
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding JWT token:", error);
    return null;
  }
}

function isTokenExpired(token: string): boolean {
  const payload = decodeJwtToken(token);
  if (!payload || !payload.exp) return true;

  const currentTime = Math.floor(Date.now() / 1000);
  return currentTime >= payload.exp;
}

async function validateJwtToken(signedToken: string | undefined): Promise<boolean> {
  if (!signedToken) return false;

  const token = await unsignCookieEdge(signedToken);
  if (!token) return false;

  if (isTokenExpired(token)) return false;

  return true;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const signedToken = request.cookies.get("token")?.value;
  const user = request.cookies.get("user")?.value;

  const isTokenValid = await validateJwtToken(signedToken);
  const isAuthenticated = !!(isTokenValid && user);

  if (isProtectedRoute && !isAuthenticated) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("redirect", pathname);

    if (signedToken && !isTokenValid) {
      redirectUrl.searchParams.set("reason", "session_expired");
    }

    return NextResponse.redirect(redirectUrl);
  }

  // Block routes that require a complete profile for OAuth users
  if (isAuthenticated && user) {
    const isRouteRequiresComplete = requiresCompleteProfile.some((route) =>
      pathname.startsWith(route)
    );

    if (isRouteRequiresComplete) {
      try {
        const userData = JSON.parse(decodeURIComponent(user));
        if (userData.isProfileComplete === false) {
          return NextResponse.redirect(new URL("/completar-cadastro", request.url));
        }
      } catch {
        // If parsing fails, allow the request to proceed
      }
    }
  }

  if ((pathname === "/login" || pathname === "/register") && isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
