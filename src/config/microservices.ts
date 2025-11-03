/**
 * Microservices URL Configuration
 * Handles different URL patterns for server actions vs client components
 */

export interface IMicroserviceConfig {
  donation: { server: string; client: string };
  users: { server: string; client: string };
  bloodStock: { server: string; client: string };
}

/**
 * Get microservice URLs based on context (server vs client)
 */
export function getMicroserviceUrls(): IMicroserviceConfig {
  // Server-side URLs (for server actions)
  const serverUrls = {
    donation: process.env.DONATION_SERVICE_URL || "localhost:3001",
    users: process.env.USERS_SERVICE_URL || "localhost:3002",
    bloodStock: process.env.BLOOD_STOCK_SERVICE_URL || "localhost:8081",
  };

  // Client-side URLs (for browser components)
  const clientUrls = {
    donation:
      process.env.NEXT_PUBLIC_DONATION_SERVICE_URL || "http://localhost:3001",
    users:
      process.env.NEXT_PUBLIC_USERS_SERVICE_URL || "http://localhost:3002",
    bloodStock:
      process.env.NEXT_PUBLIC_BLOOD_STOCK_SERVICE_URL || "http://localhost:8081",
  };

  // Normalize URLs (remove duplications, ensure http:// prefix)
  const normalize = (url: string) => {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return `http://${url}`;
    }
    return url;
  };

  return {
    donation: {
      server: normalize(serverUrls.donation),
      client: normalize(clientUrls.donation),
    },
    users: {
      server: normalize(serverUrls.users),
      client: normalize(clientUrls.users),
    },
    bloodStock: {
      server: normalize(serverUrls.bloodStock),
      client: normalize(clientUrls.bloodStock),
    },
  };
}

/**
 * Get URL for a specific microservice in server context
 */
export function getServerUrl(
  service: keyof IMicroserviceConfig,
  path: string = ""
): string {
  const urls = getMicroserviceUrls();
  const baseUrl = urls[service].server;
  return path ? `${baseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}` : baseUrl;
}

/**
 * Get URL for a specific microservice in client context
 */
console.log("🌐 Client ENV Donation URL:", process.env.NEXT_PUBLIC_DONATION_SERVICE_URL);

export function getClientUrl(
  
  service: keyof IMicroserviceConfig,
  path: string = ""
): string {
  const urls = getMicroserviceUrls();
  const baseUrl = urls[service].client;

  if (!baseUrl) {
    console.warn(`⚠️ getClientUrl: undefined base URL for service "${service}".`);
    return "";
  }

  return path ? `${baseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}` : baseUrl;
}

/**
 * Universal helper (context-aware)
 */
export function getServiceUrl(
  service: keyof IMicroserviceConfig,
  path: string = "",
  context: "server" | "client" = "client"
): string {
  return context === "server"
    ? getServerUrl(service, path)
    : getClientUrl(service, path);
}
