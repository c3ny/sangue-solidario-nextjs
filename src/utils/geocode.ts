import { logger } from "@/utils/logger";

export interface IGeocodeResult {
  latitude: number;
  longitude: number;
  city?: string;
  uf?: string;
  zipcode?: string;
  neighborhood?: string;
  address?: string;
}

interface MapboxContextEntry {
  name?: string;
  region_code?: string;
}

interface MapboxFeatureProperties {
  context?: {
    country?: MapboxContextEntry;
    region?: MapboxContextEntry;
    postcode?: MapboxContextEntry;
    place?: MapboxContextEntry;
    neighborhood?: MapboxContextEntry;
    street?: MapboxContextEntry;
    address?: MapboxContextEntry & { address_number?: string };
  };
}

/**
 * Geocodes a full address via Mapbox Geocoding API v6.
 * Returns lat/lng plus structured context (city, UF, etc). Client-side only.
 */
export async function geocodeAddress(fullAddress: string): Promise<IGeocodeResult | null> {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  if (!token) {
    logger.error("NEXT_PUBLIC_MAPBOX_TOKEN is not configured");
    return null;
  }

  try {
    const params = new URLSearchParams({ access_token: token, q: fullAddress, country: "br" });
    const res = await fetch(
      `https://api.mapbox.com/search/geocode/v6/forward?${params.toString()}`
    );
    if (!res.ok) throw new Error(`Mapbox geocode error: ${res.status}`);

    const data = await res.json();
    const feature = data.features?.[0];
    if (!feature) return null;

    const [longitude, latitude] = feature.geometry.coordinates as [number, number];
    const ctx = (feature.properties as MapboxFeatureProperties)?.context ?? {};

    const street = ctx.street?.name ?? ctx.address?.name;
    const number = ctx.address?.address_number;
    const composedAddress = street
      ? number
        ? `${street}, ${number}`
        : street
      : undefined;

    return {
      latitude,
      longitude,
      city: ctx.place?.name,
      uf: ctx.region?.region_code,
      zipcode: ctx.postcode?.name,
      neighborhood: ctx.neighborhood?.name,
      address: composedAddress,
    };
  } catch (err) {
    logger.error("Failed to geocode address:", err);
    return null;
  }
}
