/* ------------------------------------------------------------------ */
/*  NZ Post shipping rate integration                                  */
/*                                                                     */
/*  - When `NZPOST_API_KEY` is configured, rates are fetched from the  */
/*    real NZ Post Domestic Rating API v2                              */
/*    (https://api.nzpost.co.nz/ratefinder/domestic/rating/v2).        */
/*  - Otherwise a deterministic demo engine mirrors NZ Post domestic   */
/*    products (ParcelPost Tracked / Courier) with weight tiers and    */
/*    postcode-distance zones, so checkout works end-to-end without    */
/*    a licence key.                                                   */
/* ------------------------------------------------------------------ */

/** Dispatch origin — Kimberry warehouse postcode (Auckland CBD, demo). */
export const NZPOST_DISPATCH_POSTCODE = '1010';

export type NzPostZone = 'across_town' | 'within_island' | 'nationwide';

export interface NzPostRateOption {
  /** Stable option id, e.g. "standard-tracked" */
  id: string;
  /** Human readable carrier product name */
  product: string;
  /** Short description shown under the product name */
  description: string;
  /** NZ Post delivery speed estimate, e.g. "2–5 working days" */
  speed: string;
  /** Price in NZD, already rounded to 2dp */
  price: number;
  /** NZ Post-style product code, e.g. "PCB5C5" (demo codes in demo mode) */
  code: string;
}

export interface NzPostRateResult {
  success: boolean;
  /** true when produced by the built-in demo engine (no API key) */
  demo: boolean;
  zone?: NzPostZone;
  weightGrams?: number;
  destPostcode?: string;
  options: NzPostRateOption[];
  error?: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

export const isValidNzPostcode = (postcode: string): boolean =>
  /^\d{4}$/.test(postcode.trim());

/** North Island postcodes start below 7000 (Wellington 50xx-69xx included). */
const isNorthIsland = (postcode: string): boolean =>
  parseInt(postcode, 10) < 7000;

/**
 * Rough distance classification between dispatch and destination postcodes.
 * Mirrors the RateFinder `distance_code` concept.
 */
export const classifyZone = (sourcePostcode: string, destPostcode: string): NzPostZone => {
  const src = sourcePostcode.trim();
  const dest = destPostcode.trim();
  if (src.slice(0, 2) === dest.slice(0, 2)) return 'across_town';
  if (isNorthIsland(src) === isNorthIsland(dest)) return 'within_island';
  return 'nationwide';
};

const round2 = (n: number) => Math.round(n * 100) / 100;

/* ------------------------------------------------------------------ */
/*  Demo rate engine                                                   */
/*                                                                     */
/*  Weight tiers and prices are demo figures shaped on NZ Post's       */
/*  published domestic tracked-parcel pricing. Deterministic so the    */
/*  same basket + postcode always yields the same quote.               */
/* ------------------------------------------------------------------ */

interface Tier {
  maxGrams: number;
  /** [across_town, within_island, nationwide] */
  standard: [number, number, number];
  courier: [number, number, number];
  standardCode: string;
  courierCode: string;
}

const DEMO_TIERS: Tier[] = [
  { maxGrams: 1500,  standard: [4.90, 6.50, 8.90],   courier: [7.50, 9.90, 12.90],  standardCode: 'PCB5C5', courierCode: 'CPDLE' },
  { maxGrams: 3000,  standard: [5.90, 7.90, 10.50],  courier: [8.90, 11.50, 14.90], standardCode: 'PCB5C4', courierCode: 'CPC5' },
  { maxGrams: 5000,  standard: [6.90, 9.90, 13.50],  courier: [10.50, 14.50, 18.50], standardCode: 'PCB5C3', courierCode: 'CPC4' },
  { maxGrams: 10000, standard: [8.90, 12.90, 16.90], courier: [13.90, 18.90, 23.90], standardCode: 'PCBXT',  courierCode: 'CPC3' },
  { maxGrams: 25000, standard: [12.90, 16.90, 21.90], courier: [18.90, 24.90, 30.90], standardCode: 'PCBXL', courierCode: 'CPXL' },
];

const ZONE_INDEX: Record<NzPostZone, number> = {
  across_town: 0,
  within_island: 1,
  nationwide: 2,
};

export const demoRates = (weightGrams: number, destPostcode: string): NzPostRateResult => {
  const dest = destPostcode.trim();
  if (!isValidNzPostcode(dest)) {
    return { success: false, demo: true, options: [], error: 'Invalid NZ postcode — expecting 4 digits.' };
  }
  if (weightGrams <= 0) {
    return { success: false, demo: true, options: [], error: 'Nothing to ship.' };
  }

  const zone = classifyZone(NZPOST_DISPATCH_POSTCODE, dest);
  const tier = DEMO_TIERS.find(t => weightGrams <= t.maxGrams);
  if (!tier) {
    return {
      success: false,
      demo: true,
      zone,
      weightGrams,
      destPostcode: dest,
      options: [],
      error: 'Parcel exceeds the 25kg NZ Post limit — please split your order.',
    };
  }

  const zi = ZONE_INDEX[zone];
  const options: NzPostRateOption[] = [
    {
      id: 'standard-tracked',
      product: 'NZ Post Standard · Tracked',
      description: 'Signature on delivery, full tracking included.',
      speed: zone === 'across_town' ? '1–3 working days' : zone === 'within_island' ? '2–4 working days' : '3–5 working days',
      price: round2(tier.standard[zi]),
      code: tier.standardCode,
    },
    {
      id: 'courier-tracked',
      product: 'NZ Post Courier · Tracked',
      description: 'Fastest CourierPost service, tracked door-to-door.',
      speed: zone === 'nationwide' ? '1–2 working days' : 'Next working day',
      price: round2(tier.courier[zi]),
      code: tier.courierCode,
    },
  ];

  return { success: true, demo: true, zone, weightGrams, destPostcode: dest, options };
};

/* ------------------------------------------------------------------ */
/*  Real NZ Post Domestic Rating API v2                                */
/* ------------------------------------------------------------------ */

const NZPOST_API_URL = 'https://api.nzpost.co.nz/ratefinder/domestic/rating/v2';

interface NzPostApiProduct {
  code?: string;
  description?: string;
  cost?: number | string;
  price?: number | string;
  speed_of_delivery?: string;
  service_group_description?: string;
}

/**
 * Estimate parcel dimensions from total weight. Kimberry orders ship in
 * a standard carton; size grows with weight. Good enough for quoting.
 */
export const estimateParcel = (weightGrams: number) => {
  if (weightGrams <= 1500) return { length: 260, width: 190, height: 90 };
  if (weightGrams <= 5000) return { length: 330, width: 240, height: 150 };
  return { length: 420, width: 300, height: 220 };
};

export const fetchNzPostRates = async (
  weightGrams: number,
  destPostcode: string,
  valueNzd: number,
): Promise<NzPostRateResult> => {
  const apiKey = process.env.NZPOST_API_KEY;

  if (!apiKey) {
    return demoRates(weightGrams, destPostcode);
  }

  const dest = destPostcode.trim();
  if (!isValidNzPostcode(dest)) {
    return { success: false, demo: false, options: [], error: 'Invalid NZ postcode — expecting 4 digits.' };
  }

  try {
    const parcel = estimateParcel(weightGrams);
    const params = new URLSearchParams({
      api_key: apiKey,
      length_in_millimetres: String(parcel.length),
      width_in_millimetres: String(parcel.width),
      height_in_millimetres: String(parcel.height),
      weight_in_grams: String(Math.round(weightGrams)),
      value: valueNzd.toFixed(2),
      source_postcode: NZPOST_DISPATCH_POSTCODE,
      dest_postcode: dest,
      format: 'json',
    });

    const res = await fetch(`${NZPOST_API_URL}?${params.toString()}`, {
      // Rates change rarely; cache identical quotes for an hour.
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      throw new Error(`NZ Post API responded ${res.status}`);
    }

    const data = await res.json();
    if (data?.success === false) {
      throw new Error(data?.error?.message || 'NZ Post API returned failure');
    }

    const products: NzPostApiProduct[] = Array.isArray(data?.products) ? data.products : [];
    const options: NzPostRateOption[] = products
      .map((p, i): NzPostRateOption | null => {
        const cost = Number(p.cost ?? p.price);
        if (!Number.isFinite(cost)) return null;
        return {
          id: p.code ? `nzp-${p.code}` : `nzp-${i}`,
          product: p.service_group_description || p.description || 'NZ Post delivery',
          description: p.description || 'Tracked NZ Post service.',
          speed: p.speed_of_delivery || 'Standard delivery',
          price: round2(cost),
          code: p.code || `NZP${i}`,
        };
      })
      .filter((o): o is NzPostRateOption => o !== null)
      .sort((a, b) => a.price - b.price)
      .slice(0, 4);

    if (options.length === 0) {
      throw new Error('No NZ Post products available for this parcel');
    }

    return {
      success: true,
      demo: false,
      zone: classifyZone(NZPOST_DISPATCH_POSTCODE, dest),
      weightGrams,
      destPostcode: dest,
      options,
    };
  } catch (err) {
    // Fall back to demo rates so checkout never blocks on API issues.
    const fallback = demoRates(weightGrams, destPostcode);
    return {
      ...fallback,
      demo: true,
      error: `Live NZ Post quote unavailable (${err instanceof Error ? err.message : 'unknown error'}) — showing demo rates.`,
    };
  }
};
