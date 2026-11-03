import type { Room, RoomFilters } from './types';

export const defaultFilters: RoomFilters = {
  capacity: 1,
  maxPrice: 60000,
  amenity: '',
  sort: 'recommended',
  saved: false,
};

function boundedInteger(
  raw: string | null,
  fallback: number,
  min: number,
  max: number,
): number {
  if (raw === null || !/^\d+$/.test(raw)) return fallback;
  const value = Number(raw);
  return Number.isInteger(value) && value >= min && value <= max
    ? value
    : fallback;
}

export function parseRoomFilters(search: URLSearchParams): RoomFilters {
  const sort = search.get('sort');
  return {
    capacity: boundedInteger(
      search.get('capacity'),
      defaultFilters.capacity,
      1,
      4,
    ),
    maxPrice: boundedInteger(
      search.get('maxPrice'),
      defaultFilters.maxPrice,
      0,
      60000,
    ),
    amenity: search.get('amenity')?.slice(0, 80) ?? '',
    sort: sort === 'price-asc' || sort === 'price-desc' ? sort : 'recommended',
    saved: search.get('saved') === 'true',
  };
}

export function filterRooms(
  collection: readonly Room[],
  filters: RoomFilters,
  savedIds: readonly string[] = [],
): Room[] {
  const matching = collection.filter(
    (room) =>
      room.capacity >= filters.capacity &&
      room.nightlyRate <= filters.maxPrice &&
      (!filters.amenity || room.amenities.includes(filters.amenity)) &&
      (!filters.saved || savedIds.includes(room.id)),
  );
  if (filters.sort === 'price-asc')
    matching.sort((a, b) => a.nightlyRate - b.nightlyRate);
  if (filters.sort === 'price-desc')
    matching.sort((a, b) => b.nightlyRate - a.nightlyRate);
  return matching;
}
