import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { unsignCookieEdge } from "./src/utils/cookie-signature.edge";

const isDev = process.env.NODE_ENV !== "production";

function safeRedirectPath(target: string | null | undefined): string {
  if (!target) return "/";
  if (!target.startsWith("/")) return "/";
  if (target.startsWith("//") || target.startsWith("/\\")) return "/";
  if (target.includes("\0")) return "/";
  return target;
}

function buildCsp(nonce: string): string {
  // `'strict-dynamic'` + nonce: browsers CSP3+ ignoram host allow-lists e
  // `'unsafe-inline'`, confiando apenas em scripts com o nonce ou carregados
  // transitivamente. Browsers antigos fazem fallback para `'unsafe-inline'`.
  // `'unsafe-eval'` é mantido em dev (Turbopack/HMR) e em prod (VLibras Unity
  // WebAssembly — o widget de acessibilidade precisa de eval para compilar wasm).
  const scriptSrc = [
    "'self'",
    `'nonce-${nonce}'`,
    "'strict-dynamic'",
    "'unsafe-inline'",
    "'unsafe-eval'",
    "https:",
  ].join(" ");

  const connectSrc = [
    "'self'",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:3004",
    "http://localhost:3005",
    "http://localhost:3006",
    "https://api.mapbox.com",
    "https://events.mapbox.com",
    "https://*.tiles.mapbox.com",
    "https://maps.googleapis.com",
    "https://*.googleusercontent.com",
    "https://vlibras.gov.br",
    "https://*.vlibras.gov.br",
    "https://cdn.jsdelivr.net",
  ].join(" ");

  const imgSrc = [
    "'self'",
    "data:",
    "blob:",
    "https://res.cloudinary.com",
    "https://lh3.googleusercontent.com",
    "https://images.unsplash.com",
    "https://*.mapbox.com",
    "https://*.tile.openstreetmap.org",
    "https://maps.gstatic.com",
    "https://vlibras.gov.br",
    "https://*.vlibras.gov.br",
    "https://cdn.jsdelivr.net",
    "http://localhost:*",
  ].join(" ");

  const scriptSrcFull = `${scriptSrc} https://vlibras.gov.br https://*.vlibras.gov.br https://cdn.jsdelivr.net`;

  const directives = [
    "default-src 'self'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "form-action 'self'",
    `script-src ${scriptSrcFull}`,
    // style-src sem nonce: libs externas (Mapbox, VLibras Unity) e React style={{}}
    // injetam inline styles que não têm como receber nonce. CSP3 ignoraria o
    // 'unsafe-inline' se houvesse nonce. Trade-off aceito e documentado.
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' data: https://fonts.gstatic.com https://vlibras.gov.br https://*.vlibras.gov.br https://cdn.jsdelivr.net",
    `img-src ${imgSrc}`,
    `connect-src ${connectSrc}`,
    "worker-src 'self' blob:",
    "frame-src 'self' https://vlibras.gov.br https://*.vlibras.gov.br",
  ];
  if (!isDev) directives.push("upgrade-insecure-requests");
  return directives.join("; ");
}

function generateNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  let str = "";
  for (const b of bytes) str += String.fromCharCode(b);
  return btoa(str);
}

const protectedRoutes = [
  "/perfil",
  "/completar-cadastro",
  "/criar-solicitacao",
  "/visualizar-solicitacao",
  "/hemocentros",
  "/campanhas/criar",
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

  const nonce = generateNonce();
  const csp = buildCsp(nonce);

  // Forward nonce to the app via request header so Server Components can
  // attach it to inline <script nonce={...}> tags.
  const forwardedHeaders = new Headers(request.headers);
  forwardedHeaders.set("x-nonce", nonce);
  forwardedHeaders.set("Content-Security-Policy", csp);

  const withSecurityHeaders = (res: NextResponse): NextResponse => {
    res.headers.set("Content-Security-Policy", csp);
    return res;
  };

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const signedToken = request.cookies.get("token")?.value;
  const user = request.cookies.get("user")?.value;

  const isTokenValid = await validateJwtToken(signedToken);
  const isAuthenticated = !!(isTokenValid && user);

  if (isProtectedRoute && !isAuthenticated) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("redirect", safeRedirectPath(pathname));

    if (signedToken && !isTokenValid) {
      redirectUrl.searchParams.set("reason", "session_expired");
    }

    return withSecurityHeaders(NextResponse.redirect(redirectUrl));
  }

  // Users with incomplete profile can only access /completar-cadastro.
  // Any other route redirects them back to /completar-cadastro.
  if (isAuthenticated && user && !pathname.startsWith("/completar-cadastro")) {
    try {
      const userStr = decodeURIComponent(user);
      const userData = JSON.parse(userStr);
      if (userData.isProfileComplete === false) {
        return withSecurityHeaders(
          NextResponse.redirect(new URL("/completar-cadastro", request.url))
        );
      }
    } catch {
      // Fallback: if cookie cannot be parsed, treat as incomplete to be safe
      return withSecurityHeaders(
        NextResponse.redirect(new URL("/completar-cadastro", request.url))
      );
    }
  }

  if ((pathname === "/login" || pathname === "/register") && isAuthenticated) {
    return withSecurityHeaders(
      NextResponse.redirect(new URL("/", request.url))
    );
  }

  return withSecurityHeaders(
    NextResponse.next({
      request: {
        headers: forwardedHeaders,
      },
    })
  );
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
