import { Bus } from './models';

// Sample fleet: replace the names, seats and rates with your four real buses.
// The features shown on each card are in the translation files, under bus.<id>.f1 to f3.
export const BUSES: Bus[] = [
  { id: 'royal', name: 'Kalavar Royal', seats: 49, kind: 'coach', color: '#F2A93B', rate: 58 },
  { id: 'premier', name: 'Kalavar Premier', seats: 35, kind: 'coach', color: '#2B8C8C', rate: 48 },
  { id: 'classic', name: 'Kalavar Classic', seats: 26, kind: 'minicoach', color: '#E2573D', rate: 38 },
  { id: 'mini', name: 'Kalavar Mini', seats: 18, kind: 'minibus', color: '#8FC9C4', rate: 30 },
];
