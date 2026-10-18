import { SketchItem } from '../types';
import animeHeroImage from '../assets/images/sketch_anime_hero_1792307285646.jpg';
import wildTigerImage from '../assets/images/sketch_wild_tiger_1792307286239.jpg';
import mandalaImage from '../assets/images/sketch_mandala_art_1792307287082.jpg';
import cuteCatImage from '../assets/images/sketch_cute_cat_1792307287329.jpg';

// Embedded SVG line-arts for instant lightweight templates
const SVG_ROSE = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" fill="none" stroke="black" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
  <path d="M200 80 C180 50, 140 70, 160 100 C140 100, 120 130, 150 150 C130 160, 140 200, 180 190 C180 210, 220 220, 230 190 C260 200, 280 160, 250 140 C280 120, 260 80, 230 90 C240 60, 210 50, 200 80 Z" fill="none" />
  <path d="M200 110 C185 110, 180 130, 195 140 C210 150, 225 135, 215 120 C205 110, 200 110, 200 110 Z" />
  <path d="M200 200 Q200 280, 190 350" stroke-width="5" />
  <path d="M195 240 Q150 220, 130 240 Q150 270, 193 260" fill="none" />
  <path d="M194 280 Q240 260, 260 280 Q240 310, 192 300" fill="none" />
  <path d="M140 235 L175 250" stroke-width="2" />
  <path d="M250 275 L210 290" stroke-width="2" />
</svg>
`)}`;

const SVG_BUTTERFLY = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" fill="none" stroke="black" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
  <!-- Body -->
  <line x1="200" y1="120" x2="200" y2="280" stroke-width="8"/>
  <circle cx="200" cy="110" r="10" fill="black"/>
  <path d="M195 105 Q170 70, 150 75" stroke-width="3"/>
  <path d="M205 105 Q230 70, 250 75" stroke-width="3"/>
  <circle cx="150" cy="75" r="3" fill="black"/>
  <circle cx="250" cy="75" r="3" fill="black"/>
  <!-- Left Wing -->
  <path d="M195 140 C140 60, 50 80, 60 170 C70 230, 150 220, 195 210" fill="none"/>
  <path d="M195 215 C130 220, 80 270, 100 320 C120 350, 180 320, 195 260" fill="none"/>
  <path d="M100 150 Q140 150, 180 170" stroke-width="2"/>
  <path d="M110 180 Q150 180, 185 190" stroke-width="2"/>
  <circle cx="110" cy="130" r="12"/>
  <!-- Right Wing -->
  <path d="M205 140 C260 60, 350 80, 340 170 C330 230, 250 220, 205 210" fill="none"/>
  <path d="M205 215 C270 220, 320 270, 300 320 C280 350, 220 320, 205 260" fill="none"/>
  <path d="M300 150 Q260 150, 220 170" stroke-width="2"/>
  <path d="M290 180 Q250 180, 215 190" stroke-width="2"/>
  <circle cx="290" cy="130" r="12"/>
</svg>
`)}`;

const SVG_DRAGON = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" fill="none" stroke="black" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
  <path d="M120 200 C80 150, 110 80, 170 70 C220 60, 260 90, 240 140 C220 190, 160 180, 150 230 C140 280, 210 320, 260 300 C300 280, 310 230, 280 210" stroke-width="5" />
  <path d="M165 75 L180 40 L195 72" stroke-width="3" fill="none"/>
  <path d="M210 70 L240 45 L235 85" stroke-width="3" fill="none"/>
  <path d="M140 90 L100 80 L130 110" stroke-width="3" />
  <path d="M100 150 Q70 160, 60 180 Q90 185, 110 175" />
  <circle cx="145" cy="115" r="4" fill="black" />
  <path d="M170 170 Q240 170, 280 140 Q330 110, 350 140 Q320 180, 270 200" stroke-width="3" />
  <path d="M220 200 Q260 210, 290 240" stroke-width="2"/>
  <path d="M190 270 Q210 260, 230 275" stroke-width="2"/>
  <path d="M255 305 L290 330 L320 320" stroke-width="3"/>
</svg>
`)}`;

export const SAMPLE_SKETCHES: SketchItem[] = [
  {
    id: 'anime-boy',
    title: 'Anime Hero Shonen',
    category: 'Anime',
    imageUrl: animeHeroImage,
    difficulty: 'Medium',
    tags: ['Manga', 'Portrait', 'Hair', 'Eyes'],
  },
  {
    id: 'wild-tiger',
    title: 'Royal Bengal Tiger',
    category: 'Animals',
    imageUrl: wildTigerImage,
    difficulty: 'Detailed',
    tags: ['Wildlife', 'Predator', 'Tattoo', 'Stripes'],
  },
  {
    id: 'sacred-mandala',
    title: 'Sacred Floral Mandala',
    category: 'Mandala',
    imageUrl: mandalaImage,
    difficulty: 'Detailed',
    tags: ['Geometry', 'Zen', 'Meditation', 'Pattern'],
  },
  {
    id: 'cute-kitten',
    title: 'Playful Kitten',
    category: 'Cartoons',
    imageUrl: cuteCatImage,
    difficulty: 'Easy',
    tags: ['Cute', 'Cat', 'Beginner', 'Kids'],
  },
  {
    id: 'blooming-rose',
    title: 'Botanical English Rose',
    category: 'Nature',
    imageUrl: SVG_ROSE,
    difficulty: 'Easy',
    tags: ['Flower', 'Leaf', 'Flora', 'Tattoo'],
  },
  {
    id: 'monarch-butterfly',
    title: 'Monarch Butterfly',
    category: 'Animals',
    imageUrl: SVG_BUTTERFLY,
    difficulty: 'Easy',
    tags: ['Wings', 'Insect', 'Symmetry'],
  },
  {
    id: 'eastern-dragon',
    title: 'Mythic Sky Dragon',
    category: 'Tattoo',
    imageUrl: SVG_DRAGON,
    difficulty: 'Medium',
    tags: ['Fantasy', 'Tribal', 'Japanese'],
  },
];
