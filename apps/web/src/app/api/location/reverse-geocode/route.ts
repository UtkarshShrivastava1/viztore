import { NextRequest, NextResponse } from 'next/server';
import { reverseGeocodeGoogle } from '@/lib/location/google-places';
import { reverseGeocode as fallbackReverseGeocode } from '@/lib/location/geocoding';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const latStr = searchParams.get('lat');
  const lngStr = searchParams.get('lng');

  if (!latStr || !lngStr) {
    return NextResponse.json({ success: false, error: 'lat and lng parameters are required' }, { status: 400 });
  }

  const lat = parseFloat(latStr);
  const lng = parseFloat(lngStr);

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json({ success: false, error: 'Invalid coordinates' }, { status: 400 });
  }

  // 1. Try Google Places Reverse Geocode
  const googleResult = await reverseGeocodeGoogle(lat, lng);
  if (googleResult) {
    return NextResponse.json({ success: true, data: googleResult, source: 'google_places' });
  }

  // 2. Resilient fallback
  const fallback = await fallbackReverseGeocode(lat, lng);
  return NextResponse.json({ success: true, data: fallback, source: 'fallback_dictionary' });
}
