/**
 * Microservices URL Configuration
 * Handles different URL patterns for server actions vs client components
 */

export interface IMicroserviceConfig {
  donation: {
    server: string;
    client: string;
  };
  users: {
    server: string;
    client: string;
  };
  bloodStock: {
    server: string;
    client: string;
  };
}

/**
 * Get microservice URLs based on context (server vs client)
 */
export function getMicroserviceUrls(): IMicroserviceConfig {
  // Server-side URLs (for server actions)
  const serverUrls = {
    donation: process.env.DONATION_SERVICE_URL || "localhost:8080",
    users: process.env.USERS_SERVICE_URL || "localhost:3002",
    bloodStock: process.env.BLOOD_STOCK_SERVICE_URL || "localhost:8081",
  };

  // Client-side URLs (for client components)
  const clientUrls = {
    donation:
      process.env.NEXT_PUBLIC_DONATION_SERVICE_URL || "http://localhost:8080",
    users: process.env.NEXT_PUBLIC_USERS_SERVICE_URL || "http://localhost:3002",
    bloodStock:
      process.env.NEXT_PUBLIC_BLOOD_STOCK_SERVICE_URL ||
      "http://localhost:8081",
  };

  return {
    donation: {
      server: `http://${serverUrls.donation}`,
      client: clientUrls.donation,
    },
    users: {
      server: `http://${serverUrls.users}`,
      client: clientUrls.users,
    },
    bloodStock: {
      server: `http://${serverUrls.bloodStock}`,
      client: clientUrls.bloodStock,
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
  return path ? `${baseUrl}/${path}` : baseUrl;
}

/**
 * Get URL for a specific microservice in client context
 */
export function getClientUrl(
  service: keyof IMicroserviceConfig,
  path: string = ""
): string {
  const urls = getMicroserviceUrls();
  const baseUrl = urls[service].client;
  return path ? `${baseUrl}/${path}` : baseUrl;
}

/**
 * Environment-specific URL helper
 */
export function getServiceUrl(
  service: keyof IMicroserviceConfig,
  path: string = "",
  context: "server" | "client" = "client"
): string {
  if (context === "server") {
    return getServerUrl(service, path);
  }
  return getClientUrl(service, path);
}
