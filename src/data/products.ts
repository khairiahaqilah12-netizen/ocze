import { Product } from '../types';

export const OCZE_LOGO_URL = '/assets/aistudio/logo-ocze_238c5297.png';
export const HERO_BANNER_IMAGE = '/src/assets/images/ocze_hero_banner_1795414983750.jpg';
export const SGS_DERMATOLOGY_IMAGE = '/assets/aistudio/1336d310-100f-457b-add1-301d078512d0_6db6a2e8.jpeg';
export const CERTIFICATES_BANNER_IMAGE = '/assets/aistudio/image_e8777158.png';
export const BOTANICAL_DUO_BANNER_IMAGE = '/assets/products/hero-tubes.jpg';
export const LINEUP_TRIO_IMAGE = '/assets/products/lineup-trio.png';
export const LOGIN_HERO_IMAGE = '/assets/aistudio/image_d04452ac.png';

export const GIFT_POUCH_PROMO = {
  id: 'ocze-gift-pouch',
  name: 'OCZE+ Gift Pouch',
  subtitle: 'Complimentary lavender zip travel pouch with eligible orders of 2 or more items',
  note: 'Promotional free gift — not available for standalone purchase.',
  image: '/assets/products/gift-pouch.png',
  minItemsForFreeGift: 2,
};

export const PRODUCTS: Product[] = [
  {
    id: 'soothing-cream',
    name: 'OCZE+ Soothing Cream',
    shortName: 'Soothing Cream',
    size: '60ml',
    category: 'Soothing Care',
    tagline: 'Gentle Glow & Nourish · Deep Hydration For Lasting Comfort',
    originalPrice: 79.0,
    sellingPrice: 59.0,
    priceConfirmed: true,
    isFeatured: true,
    isBestSeller: true,
    images: [
      '/assets/products/soothing-cream.png',
      '/assets/products/soothing-cream-stone.jpg',
      '/assets/products/soothing-cream-open.png',
    ],
    description:
      'OCZE+ Soothing Cream is a research-based product formulated to relieve skin conditions, particularly eczema, psoriasis, and irritated skin. Made from natural herbal ingredients with Tulsi Extract (Holy Basil) and Cassia alata (Gelenggang) extract as its main components to help reduce skin irritation and alleviate eczema symptoms.',
    highlights: [
      'SGS Lab Tested',
      'Award-Winning',
      'Steroid-Free',
      'Paraben Free',
      'Fragrance Free',
      'Dermatologically Tested',
      'KKM Approved',
      'Halal Certified',
    ],
    benefits: [
      'Suitable for mild to chronic eczema',
      'Helps reduce the risk of scarring caused by eczema',
      'Helps reduce flaking and scaling skin',
      'Helps relieve itching and discomfort',
      'Helps soothe inflamed skin',
      'Helps support skin recovery from scratching',
      'Helps protect skin from external irritants',
      'Provides hydration for very dry skin',
      'Suitable for sensitive and allergy-prone skin',
    ],
    ingredients: [
      {
        name: 'Tulsi (Ocimum Sanctum)',
        subtitle: 'Holy Basil Extract',
        benefits: [
          'Soothes irritated skin and reduces redness',
          'Provides antioxidant protection against free radicals',
          'Supports skin healing from rashes or mild eczema',
        ],
      },
      {
        name: 'Cassia Alata Leaf Powder',
        subtitle: 'Gelenggang Extract',
        benefits: [
          'Reduces redness, itchiness, and irritation',
          'Supports healing of cuts, rashes, and eczema-prone skin',
          'Helps control skin infections and excess oil',
        ],
      },
      {
        name: 'Agastache Mexicana Extract',
        benefits: [
          'Anti-inflammatory care for sensitive and acne-prone skin',
          'Maintains skin hydration and strengthens the skin barrier',
        ],
      },
      {
        name: 'Anthemis Nobilis Flower Oil',
        subtitle: 'Roman Chamomile',
        benefits: [
          'Calms sensitive skin and relieves itchiness',
          'Moisturizes and softens delicate skin',
        ],
      },
      {
        name: 'Sunflower Seed Oil, Hydrogenated Olive Oil & Squalane',
        benefits: [
          'Moisturizes and absorbs quickly without greasiness',
          'Strengthens the natural skin barrier and improves elasticity',
        ],
      },
      {
        name: 'Silybum Marianum Fruit',
        benefits: [
          'Protects skin from free radicals and supports healing',
          'Maintains moisture and enhances natural radiance',
        ],
      },
    ],
    howToUse: [
      'Apply a thin layer onto clean, dry skin.',
      'Gently massage until fully absorbed.',
      'Use daily for best results.',
    ],
    promotionalGiftNote: 'Qualifies toward a complimentary OCZE+ Gift Pouch when paired with another item.',
  },
  {
    id: 'ultra-hydrating-moisturiser',
    name: 'OCZE+ Ultra Hydrating Moisturiser',
    shortName: 'Ultra Hydrating Moisturiser',
    size: '60ml',
    category: 'Hydration',
    tagline: 'Drench Your Skin in Hydration · Everyday Comfort for Delicate Skin',
    originalPrice: 79.0,
    sellingPrice: 59.0,
    priceConfirmed: true,
    isFeatured: true,
    isBestSeller: true,
    images: [
      '/assets/products/hydrating-moisturiser.png',
      '/assets/products/hydrating-moisturiser-stone.jpg',
      '/assets/products/hydrating-moisturiser-open.png',
    ],
    description:
      'OCZE+ Ultra Hydrating Moisturiser is a research-based skincare solution specially developed to provide intense hydration and restore dry, damaged skin. Enriched with Red Algae and Cordyceps Extract, this advanced formula delivers deep moisture, strengthens the skin barrier, and promotes a healthy, radiant complexion.',
    highlights: [
      'SGS Lab Tested',
      'Award-Winning',
      'Steroid-Free',
      'Paraben Free',
      'Fragrance Free',
      'Dermatologically Tested',
      'KKM Approved',
      'Fast-Absorbing',
    ],
    benefits: [
      'Provides deep and long-lasting hydration',
      'Repairs damaged skin barrier',
      'Reduces itchiness and discomfort',
      'Safe for sensitive and dehydrated skin',
      'Improves skin elasticity',
      'Suitable for daily skincare routine',
      'Speeds up the skin healing process',
      'Protects against daily environmental pollution',
    ],
    ingredients: [
      {
        name: 'Sargassum Fusiforme (Red Algae)',
        benefits: [
          'Deep hydration and moisture lock',
          'Strengthens the skin barrier with antioxidant protection',
          'Leaves skin soft and plump',
        ],
      },
      {
        name: 'Cordyceps Extract',
        benefits: [
          'Boosts hydration and skin repair',
          'Improves skin texture and enhances elasticity',
          'Protects from environmental stress',
        ],
      },
      {
        name: 'Anthemis Nobilis (Chamomile)',
        benefits: [
          'Soothes sensitive skin and reduces redness and itch',
          'Natural anti-inflammatory that supports skin recovery',
        ],
      },
      {
        name: 'Cassia Alata Leaf Powder',
        benefits: [
          'Treats dry and problem skin',
          'Antibacterial and antifungal support to relieve irritation',
        ],
      },
      {
        name: 'Ocimum Sanctum (Tulsi) & Agastache Mexicana',
        benefits: [
          'Calms redness and irritation on sensitive skin',
          'Maintains moisture and keeps skin soft and supple',
        ],
      },
      {
        name: 'D-Panthenol & Aqua',
        benefits: [
          'Attracts and retains moisture in the skin',
          'Delivers a non-greasy, cooling sensation ideal for daily use',
        ],
      },
    ],
    howToUse: [
      'Apply a thin layer onto clean, dry skin.',
      'Gently massage until fully absorbed.',
      'Use daily for best results.',
    ],
    promotionalGiftNote: 'Qualifies toward a complimentary OCZE+ Gift Pouch when paired with another item.',
  },
  {
    id: 'calmskin-shower-therapy',
    name: 'OCZE+ CalmSkin Shower Therapy',
    shortName: 'CalmSkin Shower Gel',
    size: '160ml',
    category: 'Shower Gel',
    tagline: 'Smooth, Soft, Feel Fresh · Hydrate, Soothe, Restore Comfort',
    originalPrice: 89.0,
    sellingPrice: 59.0,
    priceConfirmed: true,
    isFeatured: true,
    isBestSeller: false,
    images: [
      '/assets/products/calmskin-shower.png',
      '/assets/products/lineup-trio.png',
    ],
    description:
      'OCZE+ CalmSkin Shower Therapy is a gentle shower gel formulated with naturally derived active ingredients to cleanse while helping hydrate, soothe, and restore comfort to sensitive skin. Paraben-free and fragrance-free for everyday gentle cleansing.',
    highlights: [
      'SGS Lab Tested',
      'Award-Winning',
      'Naturally Derived Active Ingredients',
      'Paraben Free',
      'Fragrance Free',
      'Tulsi Extract Formula',
    ],
    benefits: [
      'Smooth, soft, and fresh feeling after cleansing',
      'Helps hydrate, soothe, and restore skin comfort',
      'Gentle paraben-free and fragrance-free daily shower gel formula',
      'Crafted with naturally derived active ingredients',
    ],
    ingredientsNote:
      'Formulated with naturally derived active ingredients and Tulsi Extract for calm, comfortable daily cleansing.',
    ingredients: [
      {
        name: 'Tulsi Extract',
        benefits: [
          'Supports calm, comfortable skin during daily cleansing',
        ],
      },
      {
        name: 'Naturally Derived Active Ingredients',
        benefits: [
          'Gentle cleansing base free from parabens and synthetic fragrances',
        ],
      },
    ],
    howToUse: [
      'Dispense a gentle amount of shower gel onto damp skin during shower.',
      'Lather softly and rinse thoroughly with clean water.',
      'Follow with OCZE+ Soothing Cream or Ultra Hydrating Moisturiser.',
    ],
    promotionalGiftNote: 'Qualifies toward a complimentary OCZE+ Gift Pouch when paired with another item.',
  },
  {
    id: 'twin-care',
    name: 'OCZE+ Twin Care',
    shortName: 'Twin Care Trial Set',
    size: '2 x 30ml',
    category: 'Bundles',
    tagline: 'Trial Set · Gentle Glow & Moist · Sensitive Skin Comfort',
    originalPrice: 109.0,
    sellingPrice: 69.0,
    priceConfirmed: true,
    isFeatured: true,
    isBestSeller: false,
    isBundle: true,
    includedProductIds: ['soothing-cream', 'ultra-hydrating-moisturiser'],
    images: [
      '/assets/products/twin-care.png',
      '/assets/products/hero-tubes.jpg',
      '/assets/products/gift-pouch.png',
    ],
    description:
      'The OCZE+ Twin Care Trial Set brings together Step 1 OCZE+ Soothing Cream (30ml) and Step 2 OCZE+ Ultra Hydrating Moisturiser (30ml) in one convenient box, powered by nature’s purest botanical extracts for complete sensitive skin comfort.',
    highlights: [
      'Trial Set (2 x 30ml)',
      'SGS Lab Tested',
      'Award-Winning',
      'Includes Soothing Cream 30ml',
      'Includes Ultra Hydrating Moisturiser 30ml',
      'Paraben Free & Fragrance Free',
    ],
    benefits: [
      'Combines calming eczema and irritation relief with intense daily hydration',
      'Step 1 Soothing Cream calms redness, flaking, and itching',
      'Step 2 Ultra Hydrating Moisturiser locks in long-lasting moisture',
      'Convenient two-step routine for delicate and sensitive skin',
    ],
    ingredientsNote:
      'Contains the full confirmed botanical formulas of both OCZE+ Soothing Cream (Tulsi, Cassia Alata, Agastache Mexicana, Roman Chamomile) and OCZE+ Ultra Hydrating Moisturiser (Red Algae, Cordyceps, D-Panthenol).',
    ingredients: [
      {
        name: 'Step 1 · Tulsi & Cassia Alata Complex',
        benefits: [
          'Soothes irritated skin and relieves redness and itching',
        ],
      },
      {
        name: 'Step 2 · Red Algae & Cordyceps Complex',
        benefits: [
          'Locks in deep moisture and strengthens the skin barrier',
        ],
      },
    ],
    howToUse: [
      'Step 1: Apply a thin layer of OCZE+ Soothing Cream onto targeted dry or irritated areas.',
      'Step 2: Follow with OCZE+ Ultra Hydrating Moisturiser to lock in lasting hydration.',
      'Use daily for complete sensitive skin care.',
    ],
    promotionalGiftNote:
      'Save RM40.00 off the RM109.00 original bundle price. Pair with any other item to unlock the complimentary OCZE+ Gift Pouch.',
  },
  {
    id: 'complete-set',
    name: 'OCZE+ Complete Set',
    shortName: 'Complete Set',
    size: '60ml + 60ml + 160ml',
    category: 'Bundles',
    tagline: 'Full 3-Step Routine · Cleanse, Soothe & Hydrate',
    originalPrice: 257.0,
    sellingPrice: 159.0,
    priceConfirmed: true,
    isFeatured: true,
    isBestSeller: false,
    isBundle: true,
    includedProductIds: [
      'calmskin-shower-therapy',
      'soothing-cream',
      'ultra-hydrating-moisturiser',
    ],
    images: [
      '/assets/products/complete-set.png',
      '/assets/products/lineup-trio.png',
      '/assets/products/gift-pouch.png',
    ],
    description:
      'The OCZE+ Complete Set includes all three full-sized essentials for a daily sensitive skin routine: OCZE+ CalmSkin Shower Therapy (160ml), OCZE+ Soothing Cream (60ml), and OCZE+ Ultra Hydrating Moisturiser (60ml). Formulated without parabens, steroids, or added fragrance.',
    highlights: [
      'Full 3-Step Routine',
      'SGS Lab Tested',
      'Award-Winning',
      'Includes Shower Therapy 160ml',
      'Includes Soothing Cream 60ml',
      'Includes Moisturiser 60ml',
      'Paraben Free & Fragrance Free',
    ],
    benefits: [
      'Complete cleanse, soothe, and deep hydration system in one bundle',
      'CalmSkin Shower Therapy (160ml) gently cleanses without stripping skin moisture',
      'Soothing Cream (60ml) helps calm redness, itching, and eczema-prone flare-ups',
      'Ultra Hydrating Moisturiser (60ml) locks in moisture and supports barrier repair',
      'Save RM98.00 compared to the RM257.00 original set value',
    ],
    ingredientsNote:
      'Combines the botanical actives of all three OCZE+ essentials: Tulsi (Ocimum Sanctum), Cassia Alata, Agastache Mexicana, Roman Chamomile, Red Algae, Cordyceps Extract, and D-Panthenol.',
    ingredients: [
      {
        name: 'Cleanse · CalmSkin Shower Therapy (160ml)',
        benefits: [
          'Naturally derived active ingredients and Tulsi Extract for gentle daily cleansing',
        ],
      },
      {
        name: 'Soothe · OCZE+ Soothing Cream (60ml)',
        benefits: [
          'Tulsi, Cassia Alata, Agastache Mexicana, and Roman Chamomile to calm irritated skin',
        ],
      },
      {
        name: 'Hydrate · OCZE+ Ultra Hydrating Moisturiser (60ml)',
        benefits: [
          'Red Algae, Cordyceps Extract, and D-Panthenol for deep, lasting barrier hydration',
        ],
      },
    ],
    howToUse: [
      'Step 1 (Cleanse): Lather OCZE+ CalmSkin Shower Therapy onto damp skin and rinse with clean water.',
      'Step 2 (Soothe): Apply a thin layer of OCZE+ Soothing Cream onto clean, dry areas needing relief.',
      'Step 3 (Hydrate): Follow with OCZE+ Ultra Hydrating Moisturiser to lock in lasting comfort.',
    ],
    promotionalGiftNote:
      'Save RM98.00 off the RM257.00 original price. Pair with another item to unlock the complimentary OCZE+ Gift Pouch.',
  },
];

export const getProductById = (id: string): Product | undefined =>
  PRODUCTS.find((p) => p.id === id);
