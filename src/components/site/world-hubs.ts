// Cities where remote team members live and work, as [longitude, latitude] (illustrative: we hire everywhere).
// Lit on the hero globe (Globe.tsx).
export const HUBS = {
  phx: [-112.1, 33.4],
  tor: [-79.4, 43.7],
  mex: [-99.1, 19.4],
  bog: [-74.1, 4.7],
  lim: [-77, -12],
  sao: [-46.6, -23.5],
  bue: [-58.4, -34.6],
  lis: [-9.1, 38.7],
  lon: [-0.1, 51.5],
  war: [21, 52.2],
  kyi: [30.5, 50.5],
  cai: [31.2, 30],
  los: [3.4, 6.5],
  acc: [-0.2, 5.6],
  nbo: [36.8, -1.3],
  cpt: [18.4, -33.9],
  khi: [67, 24.9],
  blr: [77.6, 13],
  dac: [90.4, 23.8],
  sgn: [106.7, 10.8],
  mnl: [121, 14.6],
  cgk: [106.8, -6.2],
  syd: [151.2, -33.9],
} as const;
export type Hub = keyof typeof HUBS;
export const HUB_KEYS = Object.keys(HUBS) as Hub[];

// One major city in each of the world's main time zones, west to east, as [longitude, latitude].
// Lit on the flat world map (NetworkMap.tsx) behind "One team, every time zone".
export const ZONE_CITIES: readonly (readonly [number, number])[] = [
  [-118.2, 34.1], // Los Angeles, UTC−8
  [-99.1, 19.4], // Mexico City, UTC−6
  [-74, 40.7], // New York, UTC−5
  [-46.6, -23.5], // São Paulo, UTC−3
  [-0.1, 51.5], // London, UTC+0
  [3.4, 6.5], // Lagos, UTC+1
  [31.2, 30], // Cairo, UTC+2
  [36.8, -1.3], // Nairobi, UTC+3
  [55.3, 25.2], // Dubai, UTC+4
  [67, 24.9], // Karachi, UTC+5
  [90.4, 23.8], // Dhaka, UTC+6
  [106.8, -6.2], // Jakarta, UTC+7
  [121, 14.6], // Manila, UTC+8
  [139.7, 35.7], // Tokyo, UTC+9
  [151.2, -33.9], // Sydney, UTC+10
];
