import type { Room } from '../domain/types';

export const rooms: Room[] = [
  {
    id: 'olive-room',
    slug: 'olive-room',
    name: 'The Olive Room',
    tagline: 'Soft light. Linen sheets. Nowhere to hurry.',
    description:
      'A quiet room in the heart of the house, with warm limestone, a generous king bed and windows opening toward the olive grove. Leave them ajar and let the garden set the pace.',
    capacity: 2,
    sizeM2: 28,
    nightlyRate: 24000,
    amenities: ['Garden view', 'King bed', 'Breakfast', 'Wi-Fi'],
    image: '/images/olive-room.webp',
    gallery: ['/images/olive-room.webp', '/images/hotel-hero.webp'],
    category: 'Room',
    highlight: 'A little closer to the garden',
  },
  {
    id: 'terrace-suite',
    slug: 'terrace-suite',
    name: 'The Terrace Suite',
    tagline: 'Your own corner of the coast.',
    description:
      'Slide open the doors to a private terrace and an uninterrupted horizon. A separate sitting area, natural textures and a deep soaking bath make staying in as inviting as going out.',
    capacity: 2,
    sizeM2: 46,
    nightlyRate: 34000,
    amenities: [
      'Sea view',
      'Private terrace',
      'King bed',
      'Breakfast',
      'Wi-Fi',
    ],
    image: '/images/terrace-suite.webp',
    gallery: ['/images/terrace-suite.webp', '/images/hotel-hero.webp'],
    category: 'Suite',
    highlight: 'Mornings with a sea view',
  },
  {
    id: 'garden-studio',
    slug: 'garden-studio',
    name: 'The Garden Studio',
    tagline: 'A courtyard, a good book, a slower afternoon.',
    description:
      'Tucked into the garden, this open-plan studio has a king bed, a daybed and a small kitchenette for easy mornings. The private courtyard is made for long breakfasts in the shade.',
    capacity: 3,
    sizeM2: 39,
    nightlyRate: 29000,
    amenities: [
      'Garden view',
      'Private terrace',
      'Kitchenette',
      'Breakfast',
      'Wi-Fi',
    ],
    image: '/images/garden-studio.webp',
    gallery: ['/images/garden-studio.webp', '/images/hotel-hero.webp'],
    category: 'Studio',
    highlight: 'A courtyard all to yourself',
  },
  {
    id: 'sol-residence',
    slug: 'sol-residence',
    name: 'The Sol Residence',
    tagline: 'Space to gather. Room to disappear.',
    description:
      'Our most spacious stay brings two bedrooms, a living room and a kitchen together under one roof. Open the terrace doors for sea air, a shared table and evenings that run a little longer.',
    capacity: 4,
    sizeM2: 82,
    nightlyRate: 48000,
    amenities: [
      'Sea view',
      'Private terrace',
      'Kitchenette',
      'Two bedrooms',
      'Breakfast',
      'Wi-Fi',
    ],
    image: '/images/sol-residence.webp',
    gallery: ['/images/sol-residence.webp', '/images/hotel-hero.webp'],
    category: 'Residence',
    highlight: 'A house within the house',
  },
];

export function findRoom(idOrSlug: string): Room | undefined {
  return rooms.find((room) => room.id === idOrSlug || room.slug === idOrSlug);
}
