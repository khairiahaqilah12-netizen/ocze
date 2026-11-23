export type ShippingRegion = 'peninsular' | 'east';

export const SHIPPING_RATES: Record<ShippingRegion, number> = {
  peninsular: 8.0,
  east: 10.0,
};

export const PENINSULAR_STATES = [
  'Johor',
  'Kedah',
  'Kelantan',
  'Melaka',
  'Negeri Sembilan',
  'Pahang',
  'Perak',
  'Perlis',
  'Pulau Pinang',
  'Selangor',
  'Terengganu',
  'WP Kuala Lumpur',
  'WP Putrajaya',
] as const;

export const EAST_MALAYSIA_STATES = [
  'Sabah',
  'Sarawak',
  'WP Labuan',
] as const;

export function getShippingRegionByState(state: string): ShippingRegion {
  const normalized = state.trim().toLowerCase();
  if (
    normalized.includes('sabah') ||
    normalized.includes('sarawak') ||
    normalized.includes('labuan')
  ) {
    return 'east';
  }
  return 'peninsular';
}

export function getShippingRateByRegion(region: ShippingRegion): number {
  return SHIPPING_RATES[region];
}

export function getShippingRateByState(state: string): number {
  return getShippingRateByRegion(getShippingRegionByState(state));
}
