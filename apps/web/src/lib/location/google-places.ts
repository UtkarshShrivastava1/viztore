/**
 * Google Maps Platform (Places API New) Integration
 * Provides high-precision Indian address reverse geocoding and real-time autocomplete suggestions.
 * Follows Google Maps Platform solution tracking standard: gmp_git_agentskills_v1
 */

import { GeocodedLocation } from './geocoding';

const SOLUTION_ID = 'gmp_git_agentskills_v1';

export interface PlaceAutocompleteItem {
  placeId: string;
  mainText: string;
  secondaryText: string;
  fullText: string;
}

interface AddressComponent {
  longText: string;
  shortText: string;
  types: string[];
}

interface GooglePlaceRaw {
  id?: string;
  displayName?: { text: string };
  formattedAddress?: string;
  location?: { latitude: number; longitude: number };
  addressComponents?: AddressComponent[];
}

function getApiKey(): string | undefined {
  return process.env.GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
}

/**
 * Parses Google Place Raw response into our canonical GeocodedLocation schema.
 */
export function parseGooglePlace(place: GooglePlaceRaw, fallbackLat?: number, fallbackLng?: number): GeocodedLocation {
  const components = place.addressComponents || [];
  
  let sublocality1 = '';
  let sublocality2 = '';
  let locality = '';
  let adminArea3 = '';
  let adminArea2 = '';
  let adminArea1 = '';
  let postalCode = '';
  let route = '';

  for (const c of components) {
    if (c.types.includes('sublocality_level_1')) sublocality1 = c.longText;
    else if (c.types.includes('sublocality_level_2')) sublocality2 = c.longText;
    else if (c.types.includes('locality')) locality = c.longText;
    else if (c.types.includes('administrative_area_level_3')) adminArea3 = c.longText;
    else if (c.types.includes('administrative_area_level_2')) adminArea2 = c.longText;
    else if (c.types.includes('administrative_area_level_1')) adminArea1 = c.longText;
    else if (c.types.includes('postal_code')) postalCode = c.longText;
    else if (c.types.includes('route')) route = c.longText;
  }

  const displayName = place.displayName?.text || '';
  
  // Blinkit / Zomato primary locality tier
  const mainLocality =
    sublocality1 ||
    sublocality2 ||
    displayName ||
    locality ||
    route ||
    'Selected Location';

  const city = locality || adminArea3 || adminArea2 || 'Bhilai';
  const state = adminArea1 || 'Chhattisgarh';
  const formattedAddress = place.formattedAddress || `${mainLocality}, ${city}, ${state}${postalCode ? ' - ' + postalCode : ''}`;

  const lat = place.location?.latitude ?? fallbackLat ?? 21.1938;
  const lng = place.location?.longitude ?? fallbackLng ?? 81.3800;

  return {
    lat,
    lng,
    locality: mainLocality,
    city,
    state,
    pincode: postalCode || undefined,
    formattedAddress,
    address: formattedAddress,
  };
}

/**
 * Reverse-geocodes exact GPS coordinates to a rich Indian address using Google Places searchNearby.
 */
export async function reverseGeocodeGoogle(lat: number, lng: number): Promise<GeocodedLocation | null> {
  const key = getApiKey();
  if (!key) return null;

  try {
    const res = await fetch('https://places.googleapis.com/v1/places:searchNearby', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': key,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.addressComponents',
        'X-Goog-Maps-Solution-ID': SOLUTION_ID,
      },
      body: JSON.stringify({
        locationRestriction: {
          circle: {
            center: { latitude: lat, longitude: lng },
            radius: 500.0,
          },
        },
        maxResultCount: 2,
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    if (!data.places || data.places.length === 0) return null;

    return parseGooglePlace(data.places[0], lat, lng);
  } catch (err) {
    console.error('Google Places searchNearby failed:', err);
    return null;
  }
}

/**
 * Searches real-time autocomplete suggestions with Places API (New) biased to India.
 */
export async function autocompleteGoogle(query: string): Promise<PlaceAutocompleteItem[]> {
  const key = getApiKey();
  if (!key || !query.trim() || query.trim().length < 2) return [];

  try {
    const res = await fetch('https://places.googleapis.com/v1/places:autocomplete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': key,
        'X-Goog-Maps-Solution-ID': SOLUTION_ID,
      },
      body: JSON.stringify({
        input: query.trim(),
        includedRegionCodes: ['in'],
      }),
    });

    if (!res.ok) return [];
    const data = await res.json();
    if (!data.suggestions || !Array.isArray(data.suggestions)) return [];

    return data.suggestions
      .filter((s: any) => s.placePrediction)
      .map((s: any) => {
        const pred = s.placePrediction;
        return {
          placeId: pred.placeId,
          mainText: pred.structuredFormat?.mainText?.text || pred.text?.text || query,
          secondaryText: pred.structuredFormat?.secondaryText?.text || '',
          fullText: pred.text?.text || pred.structuredFormat?.mainText?.text || query,
        };
      });
  } catch (err) {
    console.error('Google Places autocomplete failed:', err);
    return [];
  }
}

/**
 * Fetches full Place details by Place ID.
 */
export async function getPlaceDetailsGoogle(placeId: string): Promise<GeocodedLocation | null> {
  const key = getApiKey();
  if (!key || !placeId) return null;

  try {
    const res = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`, {
      headers: {
        'X-Goog-Api-Key': key,
        'X-Goog-FieldMask': 'id,displayName,formattedAddress,location,addressComponents',
        'X-Goog-Maps-Solution-ID': SOLUTION_ID,
      },
    });

    if (!res.ok) return null;
    const data = await res.json();
    return parseGooglePlace(data);
  } catch (err) {
    console.error('Google Places getDetails failed:', err);
    return null;
  }
}
