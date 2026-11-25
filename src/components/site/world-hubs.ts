// Cities where remote team members live and work, as [longitude, latitude] (illustrative: we hire everywhere).
// Shared by the flat world map (NetworkMap.tsx) and the hero globe (Globe.tsx).
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

// Who works with whom: one team across every time zone
export const LINKS: [Hub, Hub][] = [
  ["phx", "tor"], ["phx", "mex"], ["mex", "bog"], ["bog", "lim"], ["lim", "sao"], ["sao", "bue"], ["bog", "sao"],
  ["tor", "lon"], ["bog", "lis"], ["sao", "los"], ["lis", "lon"], ["lon", "war"], ["war", "kyi"], ["lis", "acc"],
  ["acc", "los"], ["los", "nbo"], ["nbo", "cpt"], ["cai", "nbo"], ["kyi", "cai"], ["cai", "khi"], ["khi", "blr"],
  ["blr", "dac"], ["dac", "sgn"], ["sgn", "mnl"], ["sgn", "cgk"], ["mnl", "syd"], ["cgk", "syd"], ["mnl", "phx"],
];
