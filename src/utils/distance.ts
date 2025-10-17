/**
 * Distance calculation utilities
 * Uses the Haversine formula to calculate distances between coordinates
 */

export interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * Calculate the distance between two coordinates using the Haversine formula
 * Returns distance in kilometers
 *
 * @param coord1 - First coordinate {latitude, longitude}
 * @param coord2 - Second coordinate {latitude, longitude}
 * @returns Distance in kilometers
 *
 * @example
 * ```ts
 * const distance = calculateDistance(
 *   { latitude: -23.5505, longitude: -46.6333 }, // São Paulo
 *   { latitude: -22.9068, longitude: -43.1729 }  // Rio de Janeiro
 * );
 * console.log(distance); // ~357 km
 * ```
 */
export function calculateDistance(
  coord1: Coordinates,
  coord2: Coordinates
): number {
  const R = 6371;

  const dLat = toRad(coord2.latitude - coord1.latitude);
  const dLon = toRad(coord2.longitude - coord1.longitude);

  const lat1 = toRad(coord1.latitude);
  const lat2 = toRad(coord2.latitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c;

  return distance;
}

/**
 * Convert degrees to radians
 *
 * @param degrees - Degrees to convert
 * @returns Radians
 *
 * @example
 * ```ts
 * const radians = toRad(90);
 * console.log(radians); // 1.5708
 */
function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Format distance for display
 * Shows in meters if less than 1km, otherwise in kilometers
 *
 * @param distanceInKm - Distance in kilometers
 * @returns Formatted distance string
 *
 * @example
 * ```ts
 * formatDistance(0.5);  // "500 m"
 * formatDistance(1.2);  // "1.2 km"
 * formatDistance(15.7); // "15.7 km"
 * ```
 */
export function formatDistance(distanceInKm: number): string {
  if (distanceInKm < 1) {
    return `${Math.round(distanceInKm * 1000)} m`;
  }
  return `${distanceInKm.toFixed(1)} km`;
}

/**
 * Sort items by distance from a reference point
 *
 * @param items - Array of items with location property
 * @param userLocation - User's current location
 * @returns Sorted array with distances added
 *
 * @example
 * ```ts
 * const sorted = sortByProximity(
 *   donations,
 *   { latitude: -23.5505, longitude: -46.6333 }
 * );
 * ```
 */
export function sortByProximity<T extends { location: Coordinates }>(
  items: T[],
  userLocation: Coordinates | null
): (T & { distance?: number })[] {
  if (!userLocation) {
    return items;
  }

  return items
    .map((item) => ({
      ...item,
      distance: calculateDistance(userLocation, item.location),
    }))
    .sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
}
