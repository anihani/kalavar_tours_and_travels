import { TourPackage, TripType } from './models';

/** The filter chip labels are in the translation files under type.<key>. */
export const TRIP_TYPES: TripType[] = ['hills', 'beach', 'heritage', 'wildlife', 'pilgrimage'];

// Sample data. Edit prices and durations here. The names and descriptions are in the translation files.
export const PACKAGES: TourPackage[] = [
  { id: 'coorg', name: 'Coorg coffee trails', type: 'hills', days: 3, nights: 2, price: 8500, from: 'bengaluru' },
  { id: 'ooty', name: 'Ooty and Coonoor', type: 'hills', days: 4, nights: 3, price: 11200, from: 'bengaluru' },
  { id: 'munnar', name: 'Munnar and Thekkady', type: 'hills', days: 5, nights: 4, price: 16500, from: 'kochi' },
  { id: 'gokarna', name: 'Gokarna and Udupi coast', type: 'beach', days: 3, nights: 2, price: 9400, from: 'bengaluru' },
  { id: 'goa', name: 'Goa beach break', type: 'beach', days: 4, nights: 3, price: 12300, from: 'bengaluru' },
  { id: 'hampi', name: 'Hampi heritage ride', type: 'heritage', days: 2, nights: 1, price: 6800, from: 'bengaluru' },
  { id: 'mysuru', name: 'Mysuru palace weekend', type: 'heritage', days: 2, nights: 1, price: 5900, from: 'bengaluru' },
  { id: 'kabini', name: 'Kabini safari weekend', type: 'wildlife', days: 2, nights: 1, price: 10900, from: 'bengaluru' },
  { id: 'south-temples', name: 'Tirupati, Kanchipuram, Rameswaram', type: 'pilgrimage', days: 6, nights: 5, price: 14800, from: 'chennai' },
];
