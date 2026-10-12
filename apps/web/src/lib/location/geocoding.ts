/**
 * Real-Time Geocoding & Locality Resolution Utility
 * Provides reverse geocoding (GPS -> Address), forward geocoding, and multi-result autocomplete search.
 * Engineered for hyperlocal Indian commerce with rich full addresses, landmarks, sectors, and pincodes.
 */

export interface GeocodedLocation {
  lng: number;
  lat: number;
  locality: string;          // Main area name, e.g. "Sector 6", "Nehru Nagar East"
  city: string;              // e.g. "Bhilai"
  state: string;             // e.g. "Chhattisgarh"
  pincode?: string;          // e.g. "490006"
  formattedAddress: string;  // Detailed full address: "Sector 6, Central Avenue, Near Civic Centre, Bhilai, Chhattisgarh - 490006"
  address: string;           // Canonical address string
}

// Pre-cached rich coordinates and full addresses for launch regions and major hubs
export const KNOWN_HUBS: Record<string, {
  lng: number;
  lat: number;
  locality: string;
  city: string;
  state: string;
  pincode?: string;
  formattedAddress: string;
}> = {
  // Primary Launch Markets: Durg, Bhilai, Raipur (Chhattisgarh)
  'sector 6': {
    lng: 81.3650,
    lat: 21.1890,
    locality: 'Sector 6',
    city: 'Bhilai',
    state: 'Chhattisgarh',
    pincode: '490006',
    formattedAddress: 'Sector 6, Central Avenue, Near Civic Centre, Bhilai, Chhattisgarh - 490006',
  },
  'bhilai': {
    lng: 81.3800,
    lat: 21.1938,
    locality: 'Sector 6',
    city: 'Bhilai',
    state: 'Chhattisgarh',
    pincode: '490006',
    formattedAddress: 'Sector 6, Central Avenue, Near Civic Centre, Bhilai, Chhattisgarh - 490006',
  },
  'supela': {
    lng: 81.3540,
    lat: 21.2050,
    locality: 'Supela Market',
    city: 'Bhilai',
    state: 'Chhattisgarh',
    pincode: '490023',
    formattedAddress: 'Supela Market, Near GE Road, Bhilai, Chhattisgarh - 490023',
  },
  'nehru nagar': {
    lng: 81.3410,
    lat: 21.2180,
    locality: 'Nehru Nagar East',
    city: 'Bhilai',
    state: 'Chhattisgarh',
    pincode: '490020',
    formattedAddress: 'Nehru Nagar East, Near Commercial Complex, Bhilai, Chhattisgarh - 490020',
  },
  'civic centre': {
    lng: 81.3780,
    lat: 21.1960,
    locality: 'Civic Centre',
    city: 'Bhilai',
    state: 'Chhattisgarh',
    pincode: '490006',
    formattedAddress: 'Civic Centre Commercial Complex, Sector 5, Bhilai, Chhattisgarh - 490006',
  },
  'smriti nagar': {
    lng: 81.3280,
    lat: 21.2190,
    locality: 'Smriti Nagar',
    city: 'Bhilai',
    state: 'Chhattisgarh',
    pincode: '490020',
    formattedAddress: 'Smriti Nagar Residential Colony, Bhilai, Chhattisgarh - 490020',
  },
  'durg': {
    lng: 81.2849,
    lat: 21.1904,
    locality: 'Station Road',
    city: 'Durg',
    state: 'Chhattisgarh',
    pincode: '491001',
    formattedAddress: 'Station Road, Near Durg Railway Junction, Durg, Chhattisgarh - 491001',
  },
  'malviya nagar': {
    lng: 81.2820,
    lat: 21.1950,
    locality: 'Malviya Nagar',
    city: 'Durg',
    state: 'Chhattisgarh',
    pincode: '491001',
    formattedAddress: 'Malviya Nagar Commercial Square, Durg, Chhattisgarh - 491001',
  },
  'ganj para': {
    lng: 81.2790,
    lat: 21.1880,
    locality: 'Ganjpara',
    city: 'Durg',
    state: 'Chhattisgarh',
    pincode: '491001',
    formattedAddress: 'Ganjpara Main Market, Durg, Chhattisgarh - 491001',
  },
  'raipur': {
    lng: 81.6296,
    lat: 21.2514,
    locality: 'Jaistambh Chowk',
    city: 'Raipur',
    state: 'Chhattisgarh',
    pincode: '492001',
    formattedAddress: 'Jaistambh Chowk, City Centre, Raipur, Chhattisgarh - 492001',
  },
  'pandri': {
    lng: 81.6480,
    lat: 21.2590,
    locality: 'Pandri',
    city: 'Raipur',
    state: 'Chhattisgarh',
    pincode: '492004',
    formattedAddress: 'Pandri Cloth Market, Devendra Nagar Road, Raipur, Chhattisgarh - 492004',
  },
  'telibandha': {
    lng: 81.6700,
    lat: 21.2360,
    locality: 'Telibandha',
    city: 'Raipur',
    state: 'Chhattisgarh',
    pincode: '492006',
    formattedAddress: 'Telibandha Main Road, Marine Drive, Raipur, Chhattisgarh - 492006',
  },

  // Metro Reference Hubs
  'mumbai': {
    lng: 72.8777,
    lat: 19.0760,
    locality: 'Bandra West',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050',
    formattedAddress: 'Hill Road, Bandra West, Mumbai, Maharashtra - 400050',
  },
  'new delhi': {
    lng: 77.2090,
    lat: 28.6139,
    locality: 'Connaught Place',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110001',
    formattedAddress: 'Inner Circle, Connaught Place, New Delhi, Delhi - 110001',
  },
  'bengaluru': {
    lng: 77.5946,
    lat: 12.9716,
    locality: 'Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560038',
    formattedAddress: '100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka - 560038',
  },
};

/**
 * Clean and format address components into Blinkit/Zomato style.
 */
function buildFormattedAddress(
  locality: string,
  city: string,
  state: string,
  pincode?: string,
  road?: string,
  building?: string
): string {
  const parts: string[] = [];
  if (building && building !== locality) parts.push(building);
  if (road && road !== locality) parts.push(road);
  if (locality) parts.push(locality);
  if (city && city !== locality) parts.push(city);
  if (state && state !== city) parts.push(state);

  const base = parts.join(', ');
  return pincode ? `${base} - ${pincode}` : base;
}

/**
 * Reverse Geocodes a GPS coordinate pair (lat, lng) to a complete, informative Indian street address.
 */
export async function reverseGeocode(lat: number, lng: number): Promise<GeocodedLocation> {
  // 1. Live reverse geocoding via OpenStreetMap Nominatim with high accuracy
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);

    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      {
        headers: { 'User-Agent': 'HyperlocalPlatform-Storefront/2.0' },
        signal: controller.signal,
      }
    );
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};

      const road = addr.road || addr.street;
      const building = addr.building || addr.house_name || addr.house_number;
      const locality =
        addr.suburb ||
        addr.neighbourhood ||
        addr.residential ||
        addr.commercial ||
        addr.road ||
        addr.city_district ||
        addr.village ||
        addr.hamlet ||
        'Local Area';

      const city =
        addr.city ||
        addr.town ||
        addr.county ||
        addr.state_district ||
        'Local Hub';

      const state = addr.state || 'Chhattisgarh';
      const pincode = addr.postcode || '';

      const formatted = buildFormattedAddress(locality, city, state, pincode, road, building);

      return {
        lat,
        lng,
        locality,
        city,
        state,
        pincode: pincode || undefined,
        formattedAddress: formatted,
        address: formatted,
      };
    }
  } catch {
    // Network or timeout failure — proceed to fallback
  }

  // 2. Fallback to nearest pre-cached high-fidelity hub
  let closestHub: typeof KNOWN_HUBS[string] | null = null;
  let minDistance = Infinity;

  for (const hub of Object.values(KNOWN_HUBS)) {
    const d = Math.hypot(lat - hub.lat, lng - hub.lng);
    if (d < minDistance) {
      minDistance = d;
      closestHub = hub;
    }
  }

  if (closestHub && minDistance < 0.05) {
    return {
      lat,
      lng,
      locality: closestHub.locality,
      city: closestHub.city,
      state: closestHub.state,
      pincode: closestHub.pincode,
      formattedAddress: closestHub.formattedAddress,
      address: closestHub.formattedAddress,
    };
  }

  // 3. Fallback coordinates representation
  const coordAddr = `Near ${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E, Bhilai Region - 490006`;
  return {
    lat,
    lng,
    locality: 'Current Location',
    city: 'Bhilai',
    state: 'Chhattisgarh',
    pincode: '490006',
    formattedAddress: coordAddr,
    address: coordAddr,
  };
}

/**
 * Searches localities and landmarks in real-time (Autocomplete for address picker).
 */
export async function searchLocalities(query: string): Promise<GeocodedLocation[]> {
  const normalized = query.trim().toLowerCase();
  if (!normalized || normalized.length < 2) return [];

  const results: GeocodedLocation[] = [];
  const seenAddresses = new Set<string>();

  // 1. Instant match from known hubs for ultra-fast response
  for (const [key, hub] of Object.entries(KNOWN_HUBS)) {
    if (
      key.includes(normalized) ||
      hub.locality.toLowerCase().includes(normalized) ||
      hub.city.toLowerCase().includes(normalized) ||
      (hub.pincode && hub.pincode.includes(normalized))
    ) {
      if (!seenAddresses.has(hub.formattedAddress)) {
        seenAddresses.add(hub.formattedAddress);
        results.push({
          lat: hub.lat,
          lng: hub.lng,
          locality: hub.locality,
          city: hub.city,
          state: hub.state,
          pincode: hub.pincode,
          formattedAddress: hub.formattedAddress,
          address: hub.formattedAddress,
        });
      }
    }
  }

  // 2. Fetch live suggestions from OpenStreetMap Nominatim for full Indian locality coverage
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=in&limit=6&addressdetails=1`,
      {
        headers: { 'User-Agent': 'HyperlocalPlatform-Storefront/2.0' },
        signal: controller.signal,
      }
    );
    clearTimeout(timeoutId);

    if (res.ok) {
      const apiResults = await res.json();
      if (Array.isArray(apiResults)) {
        for (const item of apiResults) {
          const addr = item.address || {};
          const locality =
            item.name ||
            addr.suburb ||
            addr.neighbourhood ||
            addr.residential ||
            addr.road ||
            query;

          const city =
            addr.city ||
            addr.town ||
            addr.county ||
            addr.state_district ||
            'City';

          const state = addr.state || 'India';
          const pincode = addr.postcode || '';

          const road = addr.road || '';
          const building = addr.building || '';

          const formatted = buildFormattedAddress(locality, city, state, pincode, road, building);

          if (!seenAddresses.has(formatted)) {
            seenAddresses.add(formatted);
            results.push({
              lat: parseFloat(item.lat),
              lng: parseFloat(item.lon),
              locality,
              city,
              state,
              pincode: pincode || undefined,
              formattedAddress: formatted,
              address: formatted,
            });
          }
        }
      }
    }
  } catch {
    // Network or timeout failure — return local dictionary results
  }

  return results.slice(0, 6);
}

/**
 * Forward Geocodes a single query to coordinates (backward compatibility).
 */
export async function forwardGeocode(query: string): Promise<GeocodedLocation | null> {
  const matches = await searchLocalities(query);
  return matches.length > 0 ? matches[0] : null;
}
