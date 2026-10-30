/**
 * Hyperlocal Geocoding & Locality Resolution Utility for Merchant Hub
 * Provides reverse geocoding (GPS / Pin Drop -> Address Fields Auto-fill)
 * and forward geocoding / autocomplete for Indian local retail stores.
 */

export interface GeocodedLocation {
  lat: number;
  lng: number;
  shopOrBuilding?: string;
  roadOrArea: string;
  landmark?: string;
  city: string;
  state: string;
  pincode?: string;
  formattedAddress: string;
}

export interface LocationSearchResult {
  lat: number;
  lng: number;
  displayName: string;
  roadOrArea: string;
  city: string;
  state: string;
  pincode?: string;
}

const DEFAULT_HUB = {
  lat: 21.2050,
  lng: 81.3540,
  roadOrArea: 'Akashganga, Supela Market',
  landmark: 'Near GE Road',
  city: 'Bhilai',
  state: 'Chhattisgarh',
  pincode: '490023',
  formattedAddress: 'Akashganga, Supela Market, Near GE Road, Bhilai, Chhattisgarh - 490023',
};

// Pre-cached rich coordinates and full addresses for Chhattisgarh launch hubs & major metros
export const REGIONAL_HUBS: Record<string, {
  lat: number;
  lng: number;
  roadOrArea: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  formattedAddress: string;
}> = {
  // Bhilai
  'supela': DEFAULT_HUB,
  'sector 6': {
    lat: 21.1890,
    lng: 81.3650,
    roadOrArea: 'Sector 6, Central Avenue',
    landmark: 'Near Civic Centre',
    city: 'Bhilai',
    state: 'Chhattisgarh',
    pincode: '490006',
    formattedAddress: 'Sector 6, Central Avenue, Near Civic Centre, Bhilai, Chhattisgarh - 490006',
  },
  'civic centre': {
    lat: 21.1960,
    lng: 81.3780,
    roadOrArea: 'Civic Centre Commercial Complex',
    landmark: 'Opposite Nehru Art Gallery',
    city: 'Bhilai',
    state: 'Chhattisgarh',
    pincode: '490006',
    formattedAddress: 'Civic Centre Commercial Complex, Sector 5, Bhilai, Chhattisgarh - 490006',
  },
  'nehru nagar': {
    lat: 21.2180,
    lng: 81.3410,
    roadOrArea: 'Nehru Nagar East, Main Road',
    landmark: 'Near Commercial Complex',
    city: 'Bhilai',
    state: 'Chhattisgarh',
    pincode: '490020',
    formattedAddress: 'Nehru Nagar East, Near Commercial Complex, Bhilai, Chhattisgarh - 490020',
  },
  'smriti nagar': {
    lat: 21.2190,
    lng: 81.3280,
    roadOrArea: 'Smriti Nagar Residential Colony',
    landmark: 'Near Junwani Road',
    city: 'Bhilai',
    state: 'Chhattisgarh',
    pincode: '490020',
    formattedAddress: 'Smriti Nagar Colony, Junwani Road, Bhilai, Chhattisgarh - 490020',
  },
  'power house': {
    lat: 21.1990,
    lng: 81.3850,
    roadOrArea: 'Power House Market, Station Road',
    landmark: 'Near Power House Railway Station',
    city: 'Bhilai',
    state: 'Chhattisgarh',
    pincode: '490011',
    formattedAddress: 'Power House Market, Station Road, Bhilai, Chhattisgarh - 490011',
  },
  // Durg
  'durg': {
    lat: 21.1904,
    lng: 81.2849,
    roadOrArea: 'Station Road, City Centre',
    landmark: 'Near Durg Junction',
    city: 'Durg',
    state: 'Chhattisgarh',
    pincode: '491001',
    formattedAddress: 'Station Road, Near Durg Junction, Durg, Chhattisgarh - 491001',
  },
  'durg rural': {
    lat: 21.1594,
    lng: 81.3101,
    roadOrArea: 'Anda Road, Durg Tahsil',
    landmark: 'Cross Street 4',
    city: 'Durg',
    state: 'Chhattisgarh',
    pincode: '491002',
    formattedAddress: 'Cross Street 4, Anda Road, Durg Tahsil, Durg, Chhattisgarh - 491002',
  },
  'malviya nagar': {
    lat: 21.1950,
    lng: 81.2820,
    roadOrArea: 'Malviya Nagar Commercial Square',
    landmark: 'Near Indira Market',
    city: 'Durg',
    state: 'Chhattisgarh',
    pincode: '491001',
    formattedAddress: 'Malviya Nagar Commercial Square, Durg, Chhattisgarh - 491001',
  },
  'ganjpara': {
    lat: 21.1880,
    lng: 81.2790,
    roadOrArea: 'Ganjpara Main Bazaar',
    landmark: 'Old Grain Market',
    city: 'Durg',
    state: 'Chhattisgarh',
    pincode: '491001',
    formattedAddress: 'Ganjpara Main Bazaar, Durg, Chhattisgarh - 491001',
  },
  // Raipur
  'jaistambh chowk': {
    lat: 21.2514,
    lng: 81.6296,
    roadOrArea: 'Jaistambh Chowk, MG Road',
    landmark: 'City Centre',
    city: 'Raipur',
    state: 'Chhattisgarh',
    pincode: '492001',
    formattedAddress: 'Jaistambh Chowk, MG Road, Raipur, Chhattisgarh - 492001',
  },
  'pandri': {
    lat: 21.2590,
    lng: 81.6480,
    roadOrArea: 'Pandri Cloth Market',
    landmark: 'Devendra Nagar Road',
    city: 'Raipur',
    state: 'Chhattisgarh',
    pincode: '492004',
    formattedAddress: 'Pandri Cloth Market, Devendra Nagar Road, Raipur, Chhattisgarh - 492004',
  },
  'telibandha': {
    lat: 21.2360,
    lng: 81.6700,
    roadOrArea: 'Telibandha Marine Drive',
    landmark: 'Near VIP Road Square',
    city: 'Raipur',
    state: 'Chhattisgarh',
    pincode: '492006',
    formattedAddress: 'Marine Drive Road, Telibandha, Raipur, Chhattisgarh - 492006',
  },
};

/**
 * Normalizes Indian city names to known list if possible
 */
export function normalizeCityName(rawCity: string): string {
  const c = rawCity.trim().toLowerCase();
  if (c.includes('bhilai')) return 'Bhilai';
  if (c.includes('durg')) return 'Durg';
  if (c.includes('raipur')) return 'Raipur';
  if (c.includes('bilaspur')) return 'Bilaspur';
  if (c.includes('rajnandgaon')) return 'Rajnandgaon';
  if (c.includes('korba')) return 'Korba';
  if (c.includes('raigarh')) return 'Raigarh';
  if (c.includes('jagdalpur')) return 'Jagdalpur';
  if (c.includes('ambikapur')) return 'Ambikapur';
  if (c.includes('dhamtari')) return 'Dhamtari';
  if (c.includes('mahasamund')) return 'Mahasamund';
  return rawCity.trim();
}

/**
 * Reverse Geocodes a GPS coordinate pair (lat, lng) to a structured Indian street address.
 * Multi-tier strategy:
 * 1. OpenStreetMap Nominatim API (with timeout & fallback)
 * 2. BigDataCloud Reverse Geocoding Client API
 * 3. Proximity-matched nearest regional hub in Chhattisgarh
 */
export async function reverseGeocode(lat: number, lng: number): Promise<GeocodedLocation> {
  // 1. Try OpenStreetMap Nominatim
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=en`,
      {
        signal: controller.signal,
        headers: { 'Accept': 'application/json' },
      }
    );
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (data && data.address) {
        const addr = data.address;
        const road = addr.road || addr.street || addr.pedestrian || addr.footway || '';
        const suburb = addr.suburb || addr.neighbourhood || addr.residential || addr.subdivision || addr.county || '';
        const roadOrArea = [road, suburb].filter(Boolean).join(', ') || addr.city_district || addr.state_district || 'Main Road Area';

        const rawCity = addr.city || addr.town || addr.village || addr.county || 'Bhilai';
        const city = normalizeCityName(rawCity);
        const state = addr.state || 'Chhattisgarh';
        const pincode = addr.postcode ? addr.postcode.replace(/\D/g, '').slice(0, 6) : '';
        const shopOrBuilding = addr.building || addr.house_number || addr.shop || '';

        const fullParts = [
          shopOrBuilding,
          roadOrArea,
          city,
          state,
        ].filter(Boolean);

        const formattedAddress = pincode ? `${fullParts.join(', ')} - ${pincode}` : fullParts.join(', ');

        return {
          lat,
          lng,
          shopOrBuilding: shopOrBuilding || undefined,
          roadOrArea,
          landmark: suburb && road && suburb !== road ? `Near ${suburb}` : undefined,
          city,
          state,
          pincode: pincode || undefined,
          formattedAddress,
        };
      }
    }
  } catch {
    // Fallback to Tier 2
  }

  // 2. Try BigDataCloud Reverse Geocode
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`,
      { signal: controller.signal }
    );
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (data && (data.locality || data.city)) {
        const rawCity = data.city || data.locality || 'Bhilai';
        const city = normalizeCityName(rawCity);
        const state = data.principalSubdivision || 'Chhattisgarh';
        const pincode = data.postcode ? data.postcode.replace(/\D/g, '').slice(0, 6) : '';
        const roadOrArea = data.locality && data.locality !== city ? data.locality : `${city} Market Area`;

        const formattedAddress = `${roadOrArea}, ${city}, ${state}${pincode ? ' - ' + pincode : ''}`;

        return {
          lat,
          lng,
          roadOrArea,
          city,
          state,
          pincode: pincode || undefined,
          formattedAddress,
        };
      }
    }
  } catch {
    // Fallback to Tier 3
  }

  // 3. Fallback: Proximity distance matching to nearest launch hub
  let closestHub: (typeof REGIONAL_HUBS)[string] = DEFAULT_HUB;
  let minDistance = Infinity;

  for (const hub of Object.values(REGIONAL_HUBS)) {
    const d = Math.hypot(lat - hub.lat, lng - hub.lng);
    if (d < minDistance) {
      minDistance = d;
      closestHub = hub;
    }
  }

  return {
    lat,
    lng,
    roadOrArea: closestHub.roadOrArea,
    landmark: closestHub.landmark,
    city: closestHub.city,
    state: closestHub.state,
    pincode: closestHub.pincode,
    formattedAddress: closestHub.formattedAddress,
  };
}

/**
 * Forward Geocoding / Search Autocomplete for Indian locations
 */
export async function searchLocations(query: string): Promise<LocationSearchResult[]> {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed || trimmed.length < 2) return [];

  // Match against regional hubs first for instant response
  const localMatches: LocationSearchResult[] = [];
  for (const [key, hub] of Object.entries(REGIONAL_HUBS)) {
    if (key.includes(trimmed) || hub.roadOrArea.toLowerCase().includes(trimmed) || hub.city.toLowerCase().includes(trimmed)) {
      localMatches.push({
        lat: hub.lat,
        lng: hub.lng,
        displayName: hub.formattedAddress,
        roadOrArea: hub.roadOrArea,
        city: hub.city,
        state: hub.state,
        pincode: hub.pincode,
      });
    }
  }

  // Also query Nominatim for dynamic search results
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=in&limit=5&accept-language=en`,
      {
        signal: controller.signal,
        headers: { 'Accept': 'application/json' },
      }
    );
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        for (const item of data) {
          const lat = parseFloat(item.lat);
          const lng = parseFloat(item.lon);
          if (!isNaN(lat) && !isNaN(lng)) {
            // Deduplicate with local matches
            const isDuplicate = localMatches.some(m => Math.hypot(m.lat - lat, m.lng - lng) < 0.005);
            if (!isDuplicate) {
              const parts = (item.display_name || '').split(',').map((s: string) => s.trim());
              const roadOrArea = parts.slice(0, 2).join(', ');
              const city = parts.find((p: string) => Object.values(REGIONAL_HUBS).some(h => h.city.toLowerCase() === p.toLowerCase())) || parts[1] || 'Bhilai';
              const state = parts.find((p: string) => p.toLowerCase().includes('chhattisgarh') || p.toLowerCase().includes('pradesh')) || 'Chhattisgarh';
              const pincodeMatch = (item.display_name || '').match(/\b\d{6}\b/);

              localMatches.push({
                lat,
                lng,
                displayName: item.display_name,
                roadOrArea,
                city: normalizeCityName(city),
                state,
                pincode: pincodeMatch ? pincodeMatch[0] : undefined,
              });
            }
          }
        }
      }
    }
  } catch {
    // Return local matches if remote search fails
  }

  return localMatches.slice(0, 5);
}
