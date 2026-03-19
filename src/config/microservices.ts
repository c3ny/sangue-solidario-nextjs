/**
 * Microservices URL Configuration
 * Handles different URL patterns for server actions vs client components
 */

export interface IMicroserviceConfig {
  donation: { server: string; client: string };
  users: { server: string; client: string };
  bloodStock: { server: string; client: string };
  appointments: { server: string; client: string };
  cdn: { server: string; client: string };
}

/**
 * Get microservice URLs based on context (server vs client)
 */
export function getMicroserviceUrls(): IMicroserviceConfig {
  // Server-side URLs (for server actions)
  const serverUrls = {
    donation: process.env.DONATION_SERVICE_URL || "",
    users: process.env.USERS_SERVICE_URL || "",
    bloodStock: process.env.BLOOD_STOCK_SERVICE_URL || "",
    appointments: process.env.APPOINTMENTS_SERVICE_URL || "",
    cdn: process.env.CDN_SERVICE_URL || "",
  };

  // Client-side URLs (for browser components)
  const clientUrls = {
    donation: process.env.NEXT_PUBLIC_DONATION_SERVICE_URL || "",
    users: process.env.NEXT_PUBLIC_USERS_SERVICE_URL || "",
    bloodStock: process.env.NEXT_PUBLIC_BLOOD_STOCK_SERVICE_URL || "",
    appointments: process.env.NEXT_PUBLIC_APPOINTMENTS_SERVICE_URL || "",
    cdn: process.env.NEXT_PUBLIC_CDN_SERVICE_URL || "",
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
    appointments: {
      server: normalize(serverUrls.appointments),
      client: normalize(clientUrls.appointments),
    },
    cdn: {
      server: normalize(serverUrls.cdn),
      client: normalize(clientUrls.cdn),
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
  return path
    ? `${baseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`
    : baseUrl;
}

export function getClientUrl(
  service: keyof IMicroserviceConfig,
  path: string = ""
): string {
  const urls = getMicroserviceUrls();
  const baseUrl = urls[service].client;

  if (!baseUrl) {
    console.warn(
      `⚠️ getClientUrl: undefined base URL for service "${service}".`
    );
    return "";
  }

  return path
    ? `${baseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`
    : baseUrl;
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
