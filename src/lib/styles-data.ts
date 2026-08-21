import { StyleOption } from '@/types';

export const STYLE_CATALOG: StyleOption[] = [
  // ── Hair Styles ────────────────────────────────────────
  {
    id: 'crew-cut',
    name: 'Crew Cut',
    description: 'A classic short style with tapered sides and slightly longer top. Clean, professional, and timeless.',
    category: 'hair',
    promptTemplate: 'Apply a classic crew cut hairstyle with tapered sides and a slightly longer top, blending naturally into the existing hairline',
    emoji: '✂️',
    tags: ['classic', 'professional', 'short'],
  },
  {
    id: 'textured-crop',
    name: 'Textured Crop',
    description: 'A modern crop with textured, choppy layers on top and a skin fade on the sides. Effortlessly cool.',
    category: 'hair',
    promptTemplate: 'Apply a modern textured crop hairstyle with choppy layered top and a clean skin fade on the sides, with a natural messy texture',
    emoji: '💇',
    tags: ['modern', 'trendy', 'textured'],
  },
  {
    id: 'slick-back',
    name: 'Slick Back',
    description: 'Hair swept back smoothly with a high-shine finish. Sophisticated and polished for formal or edgy looks.',
    category: 'hair',
    promptTemplate: 'Apply a slick back hairstyle with hair swept backwards smoothly, high shine finish, with clean tapered sides',
    emoji: '💈',
    tags: ['formal', 'sleek', 'polished'],
  },
  {
    id: 'curly-top-fade',
    name: 'Curly Top Fade',
    description: 'Defined curls on top with a sharp mid or high fade. Bold, stylish, and full of personality.',
    category: 'hair',
    promptTemplate: 'Apply a curly top fade hairstyle with well-defined natural curls on top and a sharp mid fade on the sides, clean edges',
    emoji: '🌀',
    tags: ['bold', 'curly', 'fade'],
  },
  {
    id: 'buzz-cut',
    name: 'Buzz Cut',
    description: 'Ultra-short, uniform length all around. Minimalist, low maintenance, and confidently sharp.',
    category: 'hair',
    promptTemplate: 'Apply a clean buzz cut hairstyle with very short uniform length all around, sharp clean edges and hairline',
    emoji: '⚡',
    tags: ['minimal', 'sharp', 'low-maintenance'],
  },

  // ── Beard Styles ───────────────────────────────────────
  {
    id: 'full-beard',
    name: 'Full Beard',
    description: 'A well-groomed, thick full beard with clean cheek lines and a shaped neckline. Distinguished and masculine.',
    category: 'beard',
    promptTemplate: 'Apply a full thick well-groomed beard with clean sharp cheek lines and a defined shaped neckline, natural dense look',
    emoji: '🧔',
    tags: ['full', 'masculine', 'groomed'],
  },
  {
    id: 'stubble',
    name: 'Designer Stubble',
    description: 'Precisely maintained 3-5 day stubble with clean edges. Rugged charm meets refined grooming.',
    category: 'beard',
    promptTemplate: 'Apply designer stubble facial hair, precisely maintained 3-5 day growth with very clean sharp edges along jawline and cheeks',
    emoji: '😎',
    tags: ['casual', 'rugged', 'maintained'],
  },
  {
    id: 'goatee',
    name: 'Goatee',
    description: 'A clean goatee with connected mustache. Chin-focused style that adds definition to the jawline.',
    category: 'beard',
    promptTemplate: 'Apply a clean goatee with connected mustache, well-trimmed and shaped, clean-shaven cheeks with defined chin beard',
    emoji: '🎭',
    tags: ['defined', 'classic', 'chin'],
  },
  {
    id: 'van-dyke',
    name: 'Van Dyke',
    description: 'A disconnected mustache and goatee combination. A distinguished, artistic look with character.',
    category: 'beard',
    promptTemplate: 'Apply a Van Dyke beard style with a disconnected pointed goatee and styled mustache, clean shaven cheeks, artistic and distinguished look',
    emoji: '🎨',
    tags: ['artistic', 'distinguished', 'pointed'],
  },
  {
    id: 'clean-shaven',
    name: 'Clean Shaven',
    description: 'Perfectly smooth, clean-shaven face. Fresh, youthful, and timelessly versatile.',
    category: 'beard',
    promptTemplate: 'Apply a perfectly clean shaven face with smooth skin, no facial hair, fresh and clean appearance',
    emoji: '✨',
    tags: ['clean', 'fresh', 'smooth'],
  },
];

export function getStyleById(id: string): StyleOption | undefined {
  return STYLE_CATALOG.find((style) => style.id === id);
}

export function getStylesByCategory(category: StyleOption['category']): StyleOption[] {
  return STYLE_CATALOG.filter((style) => style.category === category);
}

export function getRecommendedStyles(recommendations: string[]): StyleOption[] {
  const lowerRecs = recommendations.map((r) => r.toLowerCase());
  return STYLE_CATALOG.filter((style) =>
    style.tags.some((tag) => lowerRecs.some((rec) => rec.includes(tag))) ||
    lowerRecs.some((rec) => rec.includes(style.name.toLowerCase()))
  );
}
