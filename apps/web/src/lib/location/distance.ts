/**
 * Geodesic Distance and Delivery Radius Utilities
 * Provides high-precision Haversine calculations between customer GPS and merchant store locations.
 */

/**
 * Calculates great-circle distance between two GPS coordinates using the Haversine formula.
 * @param lat1 Latitude of first point
 * @param lon1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lon2 Longitude of second point
 * @returns Distance in kilometers rounded to 1 decimal place (or 2 decimal places if < 1km)
 */
export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  if (lat1 === lat2 && lon1 === lon2) return 0;

  const R = 6371; // Earth radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  if (distance < 1) {
    return Math.round(distance * 100) / 100;
  }
  return Math.round(distance * 10) / 10;
}

/**
 * Formats a distance in kilometers to user-friendly display text.
 * e.g., 0.35 -> "350 m away", 1.4 -> "1.4 km away", 1025 -> "1,025 km away"
 */
export function formatDistance(distanceKm?: number | null): string {
  if (distanceKm === undefined || distanceKm === null || isNaN(distanceKm)) {
    return 'Distance unavailable';
  }
  if (distanceKm < 0.05) {
    return 'Nearby (< 50 m)';
  }
  if (distanceKm < 1) {
    const meters = Math.round(distanceKm * 1000);
    return `${meters} m away`;
  }
  if (distanceKm >= 100) {
    return `${Math.round(distanceKm).toLocaleString()} km away`;
  }
  return `${distanceKm.toFixed(1)} km away`;
}

/**
 * Determines whether a distance falls within the store's delivery boundary.
 */
export function isWithinDeliveryZone(
  distanceKm?: number | null,
  deliveryRadiusKm = 4
): boolean {
  if (distanceKm === undefined || distanceKm === null || isNaN(distanceKm)) {
    return true; // Neutral when distance cannot be computed
  }
  return distanceKm <= deliveryRadiusKm;
}
