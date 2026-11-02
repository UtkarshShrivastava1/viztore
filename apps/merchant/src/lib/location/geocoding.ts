/**
 * Hyperlocal Geocoding & Locality Resolution Utility for Merchant Hub
 * Provides reverse geocoding (GPS / Pin Drop -> Address Fields Auto-fill)
 * and forward geocoding / autocomplete for Indian local retail stores.
 * Precision-tuned for Chhattisgarh launch markets (Bhilai, Durg, Raipur).
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

interface PrecisionZone {
  name: string;
  roadOrArea: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

// Bounding box zones for micro-neighborhoods to fix inaccurate OSM boundary tags
export const PRECISION_ZONES: PrecisionZone[] = [
  // Borsi & Borsi Extension (Durg - 491001) - west of canal
  {
    name: 'Borsi',
    roadOrArea: 'Borsi Colony, Borsi Extension',
    landmark: 'Near Kadam Plaza / Bhole Kirana',
    city: 'Durg',
    state: 'Chhattisgarh',
    pincode: '491001',
    minLat: 21.1450,
    maxLat: 21.1730,
    minLng: 81.2950,
    maxLng: 81.3180,
  },
  // Risali, Maitri Kunj & Ashish Nagar (Bhilai - 490006) - east of canal
  {
    name: 'Risali',
    roadOrArea: 'Maitri Kunj, Risali',
    landmark: 'Near BSP Market / Ashish Nagar',
    city: 'Bhilai',
    state: 'Chhattisgarh',
    pincode: '490006',
    minLat: 21.1500,
    maxLat: 21.1780,
    minLng: 81.3180,
    maxLng: 81.3550,
  },
  // Padmanabhpur (Durg - 491001)
  {
    name: 'Padmanabhpur',
    roadOrArea: 'Padmanabhpur Colony',
    landmark: 'Near Padmanabhpur Square',
    city: 'Durg',
    state: 'Chhattisgarh',
    pincode: '491001',
    minLat: 21.1730,
    maxLat: 21.1860,
    minLng: 81.2850,
    maxLng: 81.3150,
  },
  // Potia Kala (Durg - 491001)
  {
    name: 'Potia Kala',
    roadOrArea: 'Potia Kala Main Road',
    landmark: 'Near Potia Square',
    city: 'Durg',
    state: 'Chhattisgarh',
    pincode: '491001',
    minLat: 21.1600,
    maxLat: 21.1850,
    minLng: 81.2650,
    maxLng: 81.2880,
  },
  // Malviya Nagar & Station Road (Durg - 491001)
  {
    name: 'Malviya Nagar',
    roadOrArea: 'Malviya Nagar Commercial Square',
    landmark: 'Near Indira Market / Railway Station',
    city: 'Durg',
    state: 'Chhattisgarh',
    pincode: '491001',
    minLat: 21.1860,
    maxLat: 21.2050,
    minLng: 81.2700,
    maxLng: 81.2950,
  },
  // Ganjpara (Durg - 491001)
  {
    name: 'Ganjpara',
    roadOrArea: 'Ganjpara Main Bazaar',
    landmark: 'Old Grain Market',
    city: 'Durg',
    state: 'Chhattisgarh',
    pincode: '491001',
    minLat: 21.1800,
    maxLat: 21.1920,
    minLng: 81.2650,
    maxLng: 81.2820,
  },
  // Supela Market & Akashganga (Bhilai - 490023)
  {
    name: 'Supela',
    roadOrArea: 'Akashganga, Supela Market',
    landmark: 'Near GE Road',
    city: 'Bhilai',
    state: 'Chhattisgarh',
    pincode: '490023',
    minLat: 21.1980,
    maxLat: 21.2150,
    minLng: 81.3400,
    maxLng: 81.3650,
  },
  // Civic Centre & Sector 6 (Bhilai - 490006)
  {
    name: 'Civic Centre',
    roadOrArea: 'Civic Centre Commercial Complex',
    landmark: 'Near Central Avenue',
    city: 'Bhilai',
    state: 'Chhattisgarh',
    pincode: '490006',
    minLat: 21.1780,
    maxLat: 21.2050,
    minLng: 81.3500,
    maxLng: 81.3950,
  },
  // Nehru Nagar (Bhilai - 490020)
  {
    name: 'Nehru Nagar',
    roadOrArea: 'Nehru Nagar East / West',
    landmark: 'Near Commercial Complex',
    city: 'Bhilai',
    state: 'Chhattisgarh',
    pincode: '490020',
    minLat: 21.2100,
    maxLat: 21.2280,
    minLng: 81.3300,
    maxLng: 81.3550,
  },
  // Smriti Nagar (Bhilai - 490020)
  {
    name: 'Smriti Nagar',
    roadOrArea: 'Smriti Nagar Residential Colony',
    landmark: 'Near Junwani Road',
    city: 'Bhilai',
    state: 'Chhattisgarh',
    pincode: '490020',
    minLat: 21.2120,
    maxLat: 21.2280,
    minLng: 81.3150,
    maxLng: 81.3350,
  },
];

const DEFAULT_HUB = {
  lat: 21.1595,
  lng: 81.3090,
  roadOrArea: 'Borsi Colony, Borsi Extension',
  landmark: 'Near Kadam Plaza / Bhole Kirana',
  city: 'Durg',
  state: 'Chhattisgarh',
  pincode: '491001',
  formattedAddress: 'Borsi Colony, Borsi Extension, Durg, Chhattisgarh - 491001',
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
  // Durg - Borsi & Padmanabhpur (491001)
  'borsi': DEFAULT_HUB,
  'borsi colony': DEFAULT_HUB,
  'borsi market': {
    lat: 21.1655,
    lng: 81.3097,
    roadOrArea: 'Borsi Main Market',
    landmark: 'Utai Road',
    city: 'Durg',
    state: 'Chhattisgarh',
    pincode: '491001',
    formattedAddress: 'Borsi Main Market, Utai Road, Durg, Chhattisgarh - 491001',
  },
  'risali': {
    lat: 21.1626,
    lng: 81.3255,
    roadOrArea: 'Maitri Kunj, Risali',
    landmark: 'Near BSP Market / Ashish Nagar',
    city: 'Bhilai',
    state: 'Chhattisgarh',
    pincode: '490006',
    formattedAddress: 'Maitri Kunj, Risali, Bhilai, Chhattisgarh - 490006',
  },
  'maitri kunj': {
    lat: 21.1626,
    lng: 81.3255,
    roadOrArea: 'Maitri Kunj, Risali',
    landmark: 'Near BSP Market',
    city: 'Bhilai',
    state: 'Chhattisgarh',
    pincode: '490006',
    formattedAddress: 'Maitri Kunj, Risali, Bhilai, Chhattisgarh - 490006',
  },
  'padmanabhpur': {
    lat: 21.1780,
    lng: 81.2950,
    roadOrArea: 'Padmanabhpur Commercial Area',
    landmark: 'Near Police Line',
    city: 'Durg',
    state: 'Chhattisgarh',
    pincode: '491001',
    formattedAddress: 'Padmanabhpur Commercial Area, Durg, Chhattisgarh - 491001',
  },
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

  // Bhilai
  'supela': {
    lat: 21.2050,
    lng: 81.3540,
    roadOrArea: 'Akashganga, Supela Market',
    landmark: 'Near GE Road',
    city: 'Bhilai',
    state: 'Chhattisgarh',
    pincode: '490023',
    formattedAddress: 'Akashganga, Supela Market, Near GE Road, Bhilai, Chhattisgarh - 490023',
  },
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
 * Finds precision zone for given coordinates
 */
export function getZoneForCoordinates(lat: number, lng: number): PrecisionZone | null {
  for (const zone of PRECISION_ZONES) {
    if (
      lat >= zone.minLat &&
      lat <= zone.maxLat &&
      lng >= zone.minLng &&
      lng <= zone.maxLng
    ) {
      return zone;
    }
  }
  return null;
}

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
 * 1. Precision Zone Matching (fixes known inaccurate boundary tags like Durg Tahsil -> Borsi 491001, Risali -> Bhilai 490006)
 * 2. OpenStreetMap Nominatim API (with sanitation of administrative terms like "Durg Tahsil")
 * 3. BigDataCloud Reverse Geocoding Client API
 * 4. Proximity-matched nearest regional hub in Chhattisgarh
 */
export async function reverseGeocode(lat: number, lng: number): Promise<GeocodedLocation> {
  const matchedZone = getZoneForCoordinates(lat, lng);

  // 1. Try OpenStreetMap Nominatim for street/building level granularity
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
        let suburb = addr.suburb || addr.neighbourhood || addr.residential || addr.subdivision || '';
        
        // Cleanse administrative county term "Durg Tahsil"
        if (suburb.toLowerCase().includes('tahsil') || suburb.toLowerCase().includes('tehsil')) {
          suburb = matchedZone ? matchedZone.name : '';
        }

        let roadOrArea = [road, suburb].filter(Boolean).join(', ');
        
        // If roadOrArea is empty or generic, use precision zone if available
        if (!roadOrArea || roadOrArea.toLowerCase().includes('tahsil')) {
          roadOrArea = matchedZone ? matchedZone.roadOrArea : 'Main Road Area';
        } else if (matchedZone && !roadOrArea.toLowerCase().includes(matchedZone.name.toLowerCase())) {
          roadOrArea = `${roadOrArea}, ${matchedZone.name}`;
        }

        const rawCity = addr.city || addr.town || addr.village || 'Durg';
        let city = matchedZone ? matchedZone.city : normalizeCityName(rawCity);
        
        // If road/suburb/display_name mentions Bhilai, enforce Bhilai
        if (
          roadOrArea.toLowerCase().includes('bhilai') ||
          (data.display_name && data.display_name.toLowerCase().includes('bhilai'))
        ) {
          city = 'Bhilai';
        }

        const state = addr.state || 'Chhattisgarh';
        
        // Pincode resolution: ensure Durg urban / Borsi uses 491001, and Bhilai uses 490006/490020/490023
        let pincode = matchedZone ? matchedZone.pincode : (addr.postcode ? addr.postcode.replace(/\D/g, '').slice(0, 6) : '');
        if (city === 'Bhilai') {
          if (!pincode || pincode.startsWith('491')) {
            pincode = '490006';
          }
        } else if (city === 'Durg') {
          if (!pincode || pincode === '491002') {
            pincode = '491001';
          }
        }

        const shopOrBuilding = addr.building || addr.house_number || addr.shop || '';
        
        // Dynamic landmark: derived from zone or nearby street/colony
        let landmark = matchedZone?.landmark;
        if (!landmark) {
          if (suburb && road && suburb !== road) {
            landmark = `Near ${suburb}`;
          } else if (roadOrArea) {
            landmark = `Near ${roadOrArea}`;
          } else {
            landmark = `Near ${city} Market`;
          }
        }

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
          landmark,
          city,
          state,
          pincode: pincode || undefined,
          formattedAddress,
        };
      }
    }
  } catch {
    // Fallback to zone / tier 2
  }

  // If precision zone matched, return rich zone address directly
  if (matchedZone) {
    return {
      lat,
      lng,
      roadOrArea: matchedZone.roadOrArea,
      landmark: matchedZone.landmark,
      city: matchedZone.city,
      state: matchedZone.state,
      pincode: matchedZone.pincode,
      formattedAddress: matchedZone.roadOrArea + ', ' + matchedZone.city + ', ' + matchedZone.state + ' - ' + matchedZone.pincode,
    };
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
        const rawCity = data.city || data.locality || 'Durg';
        let city = normalizeCityName(rawCity);
        const state = data.principalSubdivision || 'Chhattisgarh';
        let roadOrArea = data.locality && data.locality !== city ? data.locality : `${city} Area`;
        if (roadOrArea.toLowerCase().includes('tahsil') || roadOrArea.toLowerCase().includes('tehsil')) {
          roadOrArea = `${city} Area`;
        }
        if (roadOrArea.toLowerCase().includes('bhilai')) {
          city = 'Bhilai';
        }

        let pincode = data.postcode ? data.postcode.replace(/\D/g, '').slice(0, 6) : (city === 'Bhilai' ? '490006' : '491001');
        if (city === 'Durg' && pincode === '491002') {
          pincode = '491001';
        } else if (city === 'Bhilai' && pincode.startsWith('491')) {
          pincode = '490006';
        }

        const landmark = `Near ${roadOrArea}`;
        const formattedAddress = `${roadOrArea}, ${city}, ${state}${pincode ? ' - ' + pincode : ''}`;

        return {
          lat,
          lng,
          roadOrArea,
          landmark,
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
              const roadOrArea = parts.slice(0, 2).filter((p: string) => !p.toLowerCase().includes('tahsil')).join(', ') || 'Borsi Area';
              let city = parts.find((p: string) => Object.values(REGIONAL_HUBS).some(h => h.city.toLowerCase() === p.toLowerCase())) || parts[1] || 'Durg';
              if (roadOrArea.toLowerCase().includes('bhilai') || item.display_name.toLowerCase().includes('bhilai')) {
                city = 'Bhilai';
              }
              const state = parts.find((p: string) => p.toLowerCase().includes('chhattisgarh') || p.toLowerCase().includes('pradesh')) || 'Chhattisgarh';
              let pincode = (item.display_name || '').match(/\b\d{6}\b/)?.[0] || (city === 'Bhilai' ? '490006' : '491001');
              if (city === 'Durg' && pincode === '491002') {
                pincode = '491001';
              } else if (city === 'Bhilai' && pincode.startsWith('491')) {
                pincode = '490006';
              }

              localMatches.push({
                lat,
                lng,
                displayName: `${roadOrArea}, ${city}, ${state} - ${pincode}`,
                roadOrArea,
                city: normalizeCityName(city),
                state,
                pincode,
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
