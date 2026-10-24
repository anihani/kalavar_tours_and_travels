export interface IconDef {
  /** SVG path data on a 24 x 24 grid. */
  paths: string[];
  /** Defaults to 0 0 24 24. */
  viewBox?: string;
  /** Solid icons are filled with the text colour. The rest are drawn as outlines. */
  fill?: boolean;
}

/** A circle as path data, so every icon can be a plain list of paths. */
const circle = (cx: number, cy: number, r: number): string =>
  `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;

export const ICONS = {
  bus: {
    paths: ['M6 3h12a2 2 0 0 1 2 2v11H4V5a2 2 0 0 1 2-2Z', 'M4 10h16', circle(8, 19, 1.6), circle(16, 19, 1.6), 'M7 13.5h.01', 'M17 13.5h.01', 'M6 16v1.5', 'M18 16v1.5'],
  },
  phone: {
    paths: ['M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z'],
  },
  mail: {
    paths: ['M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z', 'm3 7 9 6 9-6'],
  },
  'map-pin': {
    paths: ['M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11Z', circle(12, 10, 2.5)],
  },
  clock: {
    paths: [circle(12, 12, 9), 'M12 7v5l3 2'],
  },
  calendar: {
    paths: ['M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z', 'M3 10h18', 'M8 3v4', 'M16 3v4'],
  },
  users: {
    paths: [circle(10, 8, 3.5), 'M16 20v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 18.5V20', 'M16.5 4.4a3.5 3.5 0 0 1 0 6.6', 'M21 20v-1.5a3.5 3.5 0 0 0-2.5-3.3'],
  },
  'shield-check': {
    paths: ['M12 3l8 3v6c0 4.5-3.3 8-8 9-4.7-1-8-4.5-8-9V6l8-3Z', 'm9 12 2 2 4-4'],
  },
  headset: {
    paths: ['M4 14v-2a8 8 0 0 1 16 0v2', 'M4 14h3v5H5a1 1 0 0 1-1-1v-4Z', 'M20 14h-3v5h2a1 1 0 0 0 1-1v-4Z', 'M17 19.5a3 3 0 0 1-3 1.5h-2'],
  },
  tag: {
    paths: ['M3 12V4h8l10 10-8 8L3 12Z', 'M7.5 8.5h.01'],
  },
  compass: {
    paths: [circle(12, 12, 9), 'M15.5 8.5l-2 5-5 2 2-5 5-2Z'],
  },
  briefcase: {
    paths: ['M4 8h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z', 'M9 8V6a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2', 'M3 13h18'],
  },
  bed: {
    paths: ['M3 6v12', 'M3 15h18', 'M21 18v-5a3 3 0 0 0-3-3h-8v5', circle(6.5, 12, 1.7)],
  },
  mountain: {
    paths: ['M3 20l6-11 4 6 2-3 6 8H3Z'],
  },
  'sun-wave': {
    paths: [circle(12, 8, 3), 'M3 17c2 0 2-1.5 4.5-1.5S10 17 12 17s2.5-1.5 4.5-1.5S19 17 21 17', 'M3 21c2 0 2-1.5 4.5-1.5S10 21 12 21s2.5-1.5 4.5-1.5S19 21 21 21'],
  },
  landmark: {
    paths: ['M3 10h18L12 4 3 10Z', 'M5 10v10', 'M9.5 10v10', 'M14.5 10v10', 'M19 10v10', 'M3 20h18'],
  },
  tree: {
    paths: ['M12 21v-5', 'M12 16c-4 0-6-2.5-6-5 0-2 1.5-3 3-3 0-2.5 1.5-4 3-4s3 1.5 3 4c1.5 0 3 1 3 3 0 2.5-2 5-6 5Z'],
  },
  temple: {
    paths: ['M12 2.5V5', 'M10 5h4l1 3H9l1-3Z', 'M8 8h8l1.5 4h-11L8 8Z', 'M5.5 12h13V21h-13Z', 'M10 21v-4.5a2 2 0 0 1 4 0V21'],
  },
  'check-circle': {
    paths: [circle(12, 12, 9), 'm8 12.5 2.7 2.7L16 9.5'],
  },
  'chevron-down': {
    paths: ['m6 9 6 6 6-6'],
  },
  check: {
    paths: ['m5 12.5 4.5 4.5L19 7.5'],
  },
  'arrow-left': {
    paths: ['m12 19-7-7 7-7', 'M19 12H5'],
  },
  route: {
    paths: [circle(6, 18, 2.5), 'M8.5 18H17a3.5 3.5 0 0 0 0-7H7a3.5 3.5 0 0 1 0-7h7.5', circle(18, 5.5, 2.5)],
  },
  globe: {
    paths: [circle(12, 12, 9), 'M3 12h18', 'M12 3a14 14 0 0 1 0 18', 'M12 3a14 14 0 0 0 0 18'],
  },
  menu: {
    paths: ['M4 7h16', 'M4 12h16', 'M4 17h16'],
  },
  close: {
    paths: ['M6 6l12 12', 'M18 6L6 18'],
  },
  whatsapp: {
    fill: true,
    viewBox: '0 0 32 32',
    paths: [
      'M16 3C9 3 3.3 8.6 3.3 15.6c0 2.3.6 4.4 1.7 6.3L3 29l7.3-1.9c1.8 1 3.8 1.5 5.7 1.5 7 0 12.7-5.6 12.7-12.6S23 3 16 3Zm0 23c-1.8 0-3.6-.5-5.1-1.4l-.4-.2-4.3 1.1 1.2-4.2-.3-.4a10.2 10.2 0 0 1-1.6-5.4C5.5 9.9 10.2 5.3 16 5.3s10.5 4.6 10.5 10.4S21.8 26 16 26Zm5.8-7.6c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.6-1.6-1-.9-1.6-1.9-1.8-2.2-.2-.3 0-.5.1-.7l.5-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-1-2.3c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.2 3.4 5.3 4.7.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.9-.8 2.1-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.2-.6-.4Z',
    ],
  },
} satisfies Record<string, IconDef>;

export type IconName = keyof typeof ICONS;
