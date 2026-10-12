import { NextRequest, NextResponse } from 'next/server';
import { autocompleteGoogle } from '@/lib/location/google-places';
import { searchLocalities as fallbackSearchLocalities } from '@/lib/location/geocoding';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || searchParams.get('query') || '';

  if (!query.trim() || query.trim().length < 2) {
    return NextResponse.json({ success: true, data: [] });
  }

  // 1. Try Google Places Autocomplete
  const googleResults = await autocompleteGoogle(query);
  if (googleResults.length > 0) {
    return NextResponse.json({ success: true, data: googleResults, source: 'google_places' });
  }

  // 2. Fallback to dictionary
  const fallback = await fallbackSearchLocalities(query);
  const formattedFallback = fallback.map((f) => ({
    placeId: `hub_${f.locality.toLowerCase().replace(/\s+/g, '_')}`,
    mainText: f.locality,
    secondaryText: `${f.city}, ${f.state}`,
    fullText: f.formattedAddress,
    geocoded: f,
  }));

  return NextResponse.json({ success: true, data: formattedFallback, source: 'fallback_dictionary' });
}
