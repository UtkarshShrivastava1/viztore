import { NextRequest, NextResponse } from 'next/server';
import { getPlaceDetailsGoogle } from '@/lib/location/google-places';
import { forwardGeocode as fallbackForwardGeocode } from '@/lib/location/geocoding';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const placeId = searchParams.get('placeId') || searchParams.get('id');

  if (!placeId) {
    return NextResponse.json({ success: false, error: 'placeId is required' }, { status: 400 });
  }

  // Check if it's a hub fallback
  if (placeId.startsWith('hub_')) {
    const rawName = placeId.replace('hub_', '').replace(/_/g, ' ');
    const fallback = await fallbackForwardGeocode(rawName);
    if (fallback) {
      return NextResponse.json({ success: true, data: fallback, source: 'fallback_dictionary' });
    }
  }

  // 1. Try Google Place Details
  const googleResult = await getPlaceDetailsGoogle(placeId);
  if (googleResult) {
    return NextResponse.json({ success: true, data: googleResult, source: 'google_places' });
  }

  return NextResponse.json({ success: false, error: 'Place details not found' }, { status: 404 });
}
