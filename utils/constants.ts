// utils/constants.ts
export const SYSTEMS: Record<number, { name: string; positions: string[] }[]> = {
  11: [
    { name: '4-4-2', positions: ['GK', 'DF1', 'DF2', 'DF3', 'DF4', 'MF1', 'MF2', 'MF3', 'MF4', 'FW1', 'FW2'] },
    { name: '4-3-3', positions: ['GK', 'DF1', 'DF2', 'DF3', 'DF4', 'MF1', 'MF2', 'MF3', 'FW1', 'FW2', 'FW3'] },
    { name: '3-5-2', positions: ['GK', 'DF1', 'DF2', 'DF3', 'MF1', 'MF2', 'MF3', 'MF4', 'MF5', 'FW1', 'FW2'] }
  ],
  8: [
    { name: '3-3-1', positions: ['GK', 'DF1', 'DF2', 'DF3', 'MF1', 'MF2', 'MF3', 'FW1'] },
    { name: '2-3-2', positions: ['GK', 'DF1', 'DF2', 'MF1', 'MF2', 'MF3', 'FW2', 'FW2'] }
  ],
  7: [
    { name: '3-2-1', positions: ['GK', 'DF1', 'DF2', 'DF3', 'MF1', 'MF2', 'FW1'] },
    { name: '2-3-1', positions: ['GK', 'DF1', 'DF2', 'MF1', 'MF2', 'MF3', 'FW1'] }
  ],
  5: [
    { name: '1-2-1', positions: ['GK', 'FP1', 'FP2', 'FP3', 'FP4'] }
  ]
};

export const PLAYER_COUNTS = [
  { value: 11, label: '11人制' },
  { value: 8, label: '8人制' },
  { value: 7, label: '7人制' },
  { value: 5, label: '5人制' }
];

export const COLOR_THEMES = [
  { id: 'red', name: '赤', primary: '#dc2626', secondary: '#2563eb' },
  { id: 'blue', name: '青', primary: '#2563eb', secondary: '#dc2626' },
  { id: 'green', name: '緑', primary: '#16a34a', secondary: '#0891b2' },
  { id: 'purple', name: '紫', primary: '#9333ea', secondary: '#ec4899' },
  { id: 'orange', name: 'オレンジ', primary: '#ea580c', secondary: '#0891b2' },
  { id: 'black', name: '黒', primary: '#1f2937', secondary: '#6b7280' }
];

export const DEFAULT_COLOR_THEME = 'red';
