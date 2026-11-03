export interface Room {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  capacity: number;
  sizeM2: number;
  /** Integer euro cents, illustrative rather than a live quote. */
  nightlyRate: number;
  amenities: string[];
  image: string;
  gallery: string[];
  category: string;
  highlight: string;
}

export interface BookingDraft {
  arrival: string;
  departure: string;
  guests: number;
  roomId: string;
}

export interface StayErrors {
  arrival?: string;
  departure?: string;
  guests?: string;
  availability?: string;
}

export interface RoomFilters {
  capacity: number;
  /** Maximum nightly rate in euro cents. */
  maxPrice: number;
  amenity: string;
  sort: 'recommended' | 'price-asc' | 'price-desc';
  saved: boolean;
}
