export type FilterMode = 
  | 'normal'
  | 'outline'     // edge detection / stencil
  | 'monochrome'  // black & white
  | 'invert'      // inverted colors (white lines on black or vice versa)
  | 'tint-red'    // ruby red lines (stands out sharply against graphite pencil)
  | 'tint-cyan'   // bright cyan lines
  | 'high-contrast'; // thresholded high contrast

export interface OverlayTransform {
  x: number;          // horizontal offset in px
  y: number;          // vertical offset in px
  scale: number;      // 0.2 to 3.0
  rotation: number;   // 0 to 360 degrees
  flipH: boolean;     // horizontal mirror
  flipV: boolean;     // vertical flip
  opacity: number;    // 0.05 to 1.0 (transparency)
}

export type TraceMode = 'camera' | 'screen';

export interface SketchItem {
  id: string;
  title: string;
  category: 'Anime' | 'Animals' | 'Mandala' | 'Cartoons' | 'Tattoo' | 'Nature' | 'Custom';
  imageUrl: string;
  difficulty: 'Easy' | 'Medium' | 'Detailed';
  tags: string[];
  isCustom?: boolean;
}

export interface CapturedPhoto {
  id: string;
  dataUrl: string;
  timestamp: number;
  sketchTitle: string;
}
