import { StyleOption } from '@/types';

export const STYLE_CATALOG: StyleOption[] = [
  // ── Hair Styles ────────────────────────────────────────
  {
    id: 'textured-crop',
    name: 'Textured Crop',
    description: 'A modern crop with textured, choppy layers on top and a skin fade on the sides. Effortlessly cool.',
    category: 'hair',
    emoji: '💇',
    tags: ['modern', 'trendy', 'textured', 'fade'],
    frontUrl: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=800&q=80',
    sideUrl: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=800&q=80',
    backUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'slick-back',
    name: 'Slick Back',
    description: 'Hair swept back smoothly with a high-shine finish. Sophisticated and polished for formal or edgy looks.',
    category: 'hair',
    emoji: '💈',
    tags: ['formal', 'sleek', 'polished', 'fade'],
    frontUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    sideUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    backUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'crew-cut',
    name: 'Crew Cut',
    description: 'A classic short style with tapered sides and slightly longer top. Clean, professional, and timeless.',
    category: 'hair',
    emoji: '✂️',
    tags: ['classic', 'professional', 'short', 'crew'],
    frontUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80',
    sideUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    backUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'curly-top-fade',
    name: 'Curly Top Fade',
    description: 'Defined curls on top with a sharp mid or high fade. Bold, stylish, and full of personality.',
    category: 'hair',
    emoji: '🌀',
    tags: ['bold', 'curly', 'fade', 'modern'],
    frontUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    sideUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
    backUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'buzz-cut',
    name: 'Buzz Cut',
    description: 'Ultra-short, uniform length all around. Minimalist, low maintenance, and confidently sharp.',
    category: 'hair',
    emoji: '⚡',
    tags: ['minimal', 'sharp', 'low-maintenance', 'short'],
    frontUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    sideUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    backUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80',
  },

  // ── Beard Styles ───────────────────────────────────────
  {
    id: 'full-beard',
    name: 'Full Beard',
    description: 'A well-groomed, thick full beard with clean cheek lines and a shaped neckline. Distinguished and masculine.',
    category: 'beard',
    emoji: '🧔',
    tags: ['full', 'masculine', 'groomed', 'beard'],
    frontUrl: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&w=800&q=80',
    sideUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    backUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'stubble',
    name: 'Designer Stubble',
    description: 'Precisely maintained 3-5 day stubble with clean edges. Rugged charm meets refined grooming.',
    category: 'beard',
    emoji: '😎',
    tags: ['casual', 'rugged', 'maintained', 'stubble'],
    frontUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    sideUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    backUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'goatee',
    name: 'Goatee',
    description: 'A clean goatee with connected mustache. Chin-focused style that adds definition to the jawline.',
    category: 'beard',
    emoji: '🎭',
    tags: ['defined', 'classic', 'chin', 'goatee'],
    frontUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    sideUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    backUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'van-dyke',
    name: 'Van Dyke',
    description: 'A disconnected mustache and goatee combination. A distinguished, artistic look with character.',
    category: 'beard',
    emoji: '🎨',
    tags: ['artistic', 'distinguished', 'pointed'],
    frontUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    sideUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    backUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'clean-shaven',
    name: 'Clean Shaven',
    description: 'Perfectly smooth, clean-shaven face. Fresh, youthful, and timelessly versatile.',
    category: 'beard',
    emoji: '✨',
    tags: ['clean', 'fresh', 'smooth', 'shaven'],
    frontUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80',
    sideUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    backUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
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
