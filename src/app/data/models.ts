export type TripType = 'hills' | 'beach' | 'heritage' | 'wildlife' | 'pilgrimage';

/** Pickup cities. The displayed names live in the translation files under city.<key>. */
export type CityKey = 'bengaluru' | 'kochi' | 'chennai';

/** Kinds of bus. The displayed names live in the translation files under kind.<key>. */
export type BusKind = 'coach' | 'minicoach' | 'minibus';

/**
 * Only ids, numbers and brand names live here. The wording for each bus (type, features)
 * is in the translation files under bus.<id>.*, so every language stays in one place.
 */
export interface Bus {
  id: string;
  name: string;
  seats: number;
  kind: BusKind;
  color: string;
  /** Sample rate in rupees per km. */
  rate: number;
}

/**
 * The shown name and blurb are in the translation files under pkg.<id>.name and pkg.<id>.blurb.
 * `name` here is the English name, used in the WhatsApp message that reaches you.
 */
export interface TourPackage {
  id: string;
  name: string;
  type: TripType;
  days: number;
  nights: number;
  /** Rupees per person. */
  price: number;
  from: CityKey;
}
