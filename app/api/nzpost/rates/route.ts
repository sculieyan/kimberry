import { NextRequest, NextResponse } from 'next/server';
import { fetchNzPostRates, isValidNzPostcode } from '@/lib/nzpost';

/**
 * GET /api/nzpost/rates?postcode=6011&weight=850&value=35.80
 *
 * Returns NZ Post delivery options for a parcel.
 * Uses the live NZ Post Domestic Rating API when NZPOST_API_KEY is set,
 * otherwise deterministic demo rates (demo: true in the response).
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const postcode = (searchParams.get('postcode') || '').trim();
  const weight = Number(searchParams.get('weight'));
  const value = Number(searchParams.get('value')) || 0;

  if (!isValidNzPostcode(postcode)) {
    return NextResponse.json(
      { success: false, options: [], error: 'A valid 4-digit NZ postcode is required.' },
      { status: 400 },
    );
  }
  if (!Number.isFinite(weight) || weight <= 0) {
    return NextResponse.json(
      { success: false, options: [], error: 'A positive parcel weight (grams) is required.' },
      { status: 400 },
    );
  }

  // Quote-level failures (e.g. overweight) come back as 200 + success:false
  // so the client can render the message inline.
  const result = await fetchNzPostRates(weight, postcode, value);
  return NextResponse.json(result);
}
