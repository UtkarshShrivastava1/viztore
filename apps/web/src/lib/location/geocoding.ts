/**
 * Real-Time Geocoding & Locality Resolution Utility
 * Provides reverse geocoding (GPS -> Address) and forward geocoding (Pincode/Area -> Coords).
 * Tailored for hyperlocal Indian commerce with pre-cached coordinates for launch hubs (Durg, Bhilai, Raipur).
 */

export interface GeocodedLocation {
  lng: number;
  lat: number;
  address: string;
  city: string;
  locality?: string;
  pincode?: string;
}

// Pre-cached coordinates for launch region and major hubs (Zero latency & offline fallback)
const KNOWN_HUBS: Record<string, { lng: number; lat: number; city: string; state: string; pincode?: string }> = {
  // Primary Launch Markets: Durg, Bhilai, Raipur (Chhattisgarh)
  'bhilai': { lng: 81.3800, lat: 21.1938, city: 'Bhilai', state: 'Chhattisgarh', pincode: '490006' },
  'sector 6': { lng: 81.3650, lat: 21.1890, city: 'Bhilai', state: 'Chhattisgarh', pincode: '490006' },
  'supela': { lng: 81.3540, lat: 21.2050, city: 'Bhilai', state: 'Chhattisgarh', pincode: '490023' },
  'nehru nagar': { lng: 81.3410, lat: 21.2180, city: 'Bhilai', state: 'Chhattisgarh', pincode: '490020' },
  'civic centre': { lng: 81.3780, lat: 21.1960, city: 'Bhilai', state: 'Chhattisgarh', pincode: '490006' },
  'durg': { lng: 81.2849, lat: 21.1904, city: 'Durg', state: 'Chhattisgarh', pincode: '491001' },
  'malviya nagar': { lng: 81.2820, lat: 21.1950, city: 'Durg', state: 'Chhattisgarh', pincode: '491001' },
  'ganj para': { lng: 81.2790, lat: 21.1880, city: 'Durg', state: 'Chhattisgarh', pincode: '491001' },
  'raipur': { lng: 81.6296, lat: 21.2514, city: 'Raipur', state: 'Chhattisgarh', pincode: '492001' },
  'pandri': { lng: 81.6480, lat: 21.2590, city: 'Raipur', state: 'Chhattisgarh', pincode: '492004' },
  'telibandha': { lng: 81.6700, lat: 21.2360, city: 'Raipur', state: 'Chhattisgarh', pincode: '492006' },
  'jaistambh': { lng: 81.6320, lat: 21.2420, city: 'Raipur', state: 'Chhattisgarh', pincode: '492001' },
  // Common Pincodes in Launch Zone
  '490006': { lng: 81.3800, lat: 21.1938, city: 'Bhilai', state: 'Chhattisgarh', pincode: '490006' },
  '490020': { lng: 81.3410, lat: 21.2180, city: 'Bhilai', state: 'Chhattisgarh', pincode: '490020' },
  '490023': { lng: 81.3540, lat: 21.2050, city: 'Bhilai', state: 'Chhattisgarh', pincode: '490023' },
  '491001': { lng: 81.2849, lat: 21.1904, city: 'Durg', state: 'Chhattisgarh', pincode: '491001' },
  '492001': { lng: 81.6296, lat: 21.2514, city: 'Raipur', state: 'Chhattisgarh', pincode: '492001' },
  '492004': { lng: 81.6480, lat: 21.2590, city: 'Raipur', state: 'Chhattisgarh', pincode: '492004' },

  // Tier 1 Reference Metros
  'mumbai': { lng: 72.8777, lat: 19.0760, city: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
  'bandra': { lng: 72.8303, lat: 19.0583, city: 'Mumbai', state: 'Maharashtra', pincode: '400050' },
  'bandra west': { lng: 72.8303, lat: 19.0583, city: 'Mumbai', state: 'Maharashtra', pincode: '400050' },
  '400050': { lng: 72.8298, lat: 19.0575, city: 'Mumbai', state: 'Maharashtra', pincode: '400050' },
  'new delhi': { lng: 77.2090, lat: 28.6139, city: 'New Delhi', state: 'Delhi', pincode: '110001' },
  'bengaluru': { lng: 77.5946, lat: 12.9716, city: 'Bengaluru', state: 'Karnataka', pincode: '560001' },
  'indore': { lng: 75.8577, lat: 22.7196, city: 'Indore', state: 'Madhya Pradesh', pincode: '452001' },
};

/**
 * Reverse Geocodes a GPS coordinate pair (lat, lng) to a clean human-readable address.
 */
export async function reverseGeocode(lat: number, lng: number): Promise<GeocodedLocation> {
  // 1. Check if it matches very closely to any known launch hub (within ~2km)
  for (const [key, hub] of Object.entries(KNOWN_HUBS)) {
    const dLat = Math.abs(lat - hub.lat);
    const dLng = Math.abs(lng - hub.lng);
    if (dLat < 0.02 && dLng < 0.02) {
      const localityName = key.charAt(0).toUpperCase() + key.slice(1);
      return {
        lat,
        lng,
        city: hub.city,
        locality: localityName,
        pincode: hub.pincode,
        address: `${localityName}, ${hub.city}${hub.pincode ? ` - ${hub.pincode}` : ''}`,
      };
    }
  }

  // 2. Fetch from OpenStreetMap Nominatim with timeout
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      {
        headers: { 'User-Agent': 'LocalStorefront-Hyperlocal/1.0' },
        signal: controller.signal,
      }
    );
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const locality = addr.suburb || addr.neighbourhood || addr.residential || addr.road || addr.village || 'Local Area';
      const city = addr.city || addr.town || addr.county || addr.state_district || 'Local City';
      const pincode = addr.postcode || '';

      const formatted = `${locality}, ${city}${pincode ? ` - ${pincode}` : ''}`;
      return {
        lat,
        lng,
        city,
        locality,
        pincode,
        address: formatted,
      };
    }
  } catch {
    // Network or timeout failure — fallback gracefully
  }

  // 3. Fallback coordinates string
  return {
    lat,
    lng,
    city: 'Local Area',
    address: `Near ${lat.toFixed(3)}°N, ${lng.toFixed(3)}°E`,
  };
}

/**
 * Forward Geocodes a user-entered locality, street, or pincode to coordinates and formatted address.
 */
export async function forwardGeocode(query: string): Promise<GeocodedLocation | null> {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return null;

  // 1. Check instant dictionary matches
  if (KNOWN_HUBS[normalized]) {
    const hub = KNOWN_HUBS[normalized];
    const localityName = normalized.charAt(0).toUpperCase() + normalized.slice(1);
    return {
      lat: hub.lat,
      lng: hub.lng,
      city: hub.city,
      locality: localityName,
      pincode: hub.pincode,
      address: `${localityName}, ${hub.city}${hub.pincode ? ` - ${hub.pincode}` : ''}`,
    };
  }

  // 2. Online search via Nominatim
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=in&limit=1&addressdetails=1`,
      {
        headers: { 'User-Agent': 'LocalStorefront-Hyperlocal/1.0' },
        signal: controller.signal,
      }
    );
    clearTimeout(timeoutId);

    if (res.ok) {
      const results = await res.json();
      if (Array.isArray(results) && results.length > 0) {
        const item = results[0];
        const addr = item.address || {};
        const locality = addr.suburb || addr.neighbourhood || addr.road || query.split(',')[0].trim();
        const city = addr.city || addr.town || addr.county || addr.state_district || 'City';
        const pincode = addr.postcode || '';

        return {
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
          city,
          locality,
          pincode,
          address: `${locality}, ${city}${pincode ? ` - ${pincode}` : ''}`,
        };
      }
    }
  } catch {
    // Graceful fallback
  }

  // 3. Fallback: if it looks like a pincode in Chhattisgarh or elsewhere, check prefix
  if (/^49[0-9]{4}$/.test(normalized)) {
    return {
      lat: 21.1938,
      lng: 81.3800,
      city: 'Bhilai',
      pincode: normalized,
      address: `Pincode ${normalized}, Bhilai - Durg Region`,
    };
  }

  return null;
}
