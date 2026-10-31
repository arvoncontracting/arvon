export type ImageId =
  | 'amman-skyline'
  | 'hot-asphalt'
  | 'bitumen-membranes'
  | 'asphalt-paving'
  | 'slope-screed'
  | 'power-trowel'
  | 'polyurethane'
  | 'foundation'
  | 'thermal-insulation'
  | 'underfloor';

export interface ImageAsset {
  id: ImageId;
  width: number;
  height: number;
  srcWidths: number[];
  /** object-position for wide and narrow crops. */
  focus: { wide: string; narrow: string };
  /** Purpose-cut portrait source for phones, so they never fetch the wide file. */
  portrait?: { width: number; height: number; srcWidths: number[] };
}

export const images: Record<ImageId, ImageAsset> = {
  'amman-skyline': {
    id: 'amman-skyline',
    width: 1564,
    height: 1006,
    srcWidths: [480, 800, 1200, 1564],
    focus: { wide: '50% 62%', narrow: '50% 50%' },
    portrait: { width: 660, height: 1006, srcWidths: [480, 660] },
  },
  'hot-asphalt': {
    id: 'hot-asphalt',
    width: 1600,
    height: 900,
    srcWidths: [480, 800, 1200, 1600],
    focus: { wide: '84% 50%', narrow: '80% 50%' },
  },
  'bitumen-membranes': {
    id: 'bitumen-membranes',
    width: 1024,
    height: 768,
    srcWidths: [480, 800, 1024],
    focus: { wide: '50% 50%', narrow: '40% 50%' },
  },
  'asphalt-paving': {
    id: 'asphalt-paving',
    width: 1448,
    height: 958,
    srcWidths: [480, 800, 1200, 1448],
    focus: { wide: '50% 58%', narrow: '40% 55%' },
  },
  'slope-screed': {
    id: 'slope-screed',
    width: 1600,
    height: 960,
    srcWidths: [480, 800, 1200, 1600],
    focus: { wide: '50% 60%', narrow: '55% 60%' },
  },
  'power-trowel': {
    id: 'power-trowel',
    width: 1600,
    height: 900,
    srcWidths: [480, 800, 1200, 1600],
    focus: { wide: '50% 60%', narrow: '42% 60%' },
  },
  polyurethane: {
    id: 'polyurethane',
    width: 1600,
    height: 1066,
    srcWidths: [480, 800, 1200, 1600],
    focus: { wide: '55% 40%', narrow: '56% 35%' },
  },
  foundation: {
    id: 'foundation',
    width: 1177,
    height: 1336,
    srcWidths: [480, 800, 1177],
    focus: { wide: '50% 45%', narrow: '45% 42%' },
  },
  'thermal-insulation': {
    id: 'thermal-insulation',
    width: 1588,
    height: 990,
    srcWidths: [480, 800, 1200, 1588],
    focus: { wide: '60% 60%', narrow: '68% 60%' },
  },
  underfloor: {
    id: 'underfloor',
    width: 1205,
    height: 1305,
    srcWidths: [480, 800, 1205],
    focus: { wide: '50% 60%', narrow: '50% 65%' },
  },
};
