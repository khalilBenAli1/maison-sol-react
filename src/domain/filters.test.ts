import { describe, expect, it } from 'vitest';
import { rooms } from '../data/rooms';
import { defaultFilters, filterRooms, parseRoomFilters } from './filters';

describe('URL-driven room discovery', () => {
  it('combines capacity, price and amenity requirements', () => {
    const filters = parseRoomFilters(
      new URLSearchParams('capacity=3&maxPrice=50000&amenity=Sea+view'),
    );
    expect(filterRooms(rooms, filters).map((room) => room.id)).toEqual([
      'sol-residence',
    ]);
  });

  it('produces a deliberate empty result for an impossible combination', () => {
    expect(
      filterRooms(rooms, { ...defaultFilters, capacity: 4, maxPrice: 25000 }),
    ).toEqual([]);
  });

  it('preserves source order while sorting a filtered copy', () => {
    const before = rooms.map((room) => room.id);
    expect(
      filterRooms(rooms, { ...defaultFilters, sort: 'price-asc' }).map(
        (room) => room.id,
      ),
    ).toEqual([
      'olive-room',
      'garden-studio',
      'terrace-suite',
      'sol-residence',
    ]);
    expect(
      filterRooms(rooms, { ...defaultFilters, sort: 'price-desc' })[0]?.id,
    ).toBe('sol-residence');
    expect(rooms.map((room) => room.id)).toEqual(before);
  });

  it('filters saved rooms without assuming every saved identifier still exists', () => {
    const filters = parseRoomFilters(new URLSearchParams('saved=true'));
    expect(
      filterRooms(rooms, filters, ['unknown', 'garden-studio']).map(
        (room) => room.id,
      ),
    ).toEqual(['garden-studio']);
    expect(filterRooms(rooms, filters)).toEqual([]);
  });

  it('recovers malformed query parameters and accepts a zero-price empty filter', () => {
    expect(
      parseRoomFilters(
        new URLSearchParams('capacity=99&maxPrice=-1&sort=unsafe&saved=yes'),
      ),
    ).toEqual(defaultFilters);
    expect(
      parseRoomFilters(new URLSearchParams('capacity=2.5&maxPrice=Infinity'))
        .capacity,
    ).toBe(1);
    expect(parseRoomFilters(new URLSearchParams('maxPrice=0')).maxPrice).toBe(
      0,
    );
    expect(
      filterRooms(rooms, parseRoomFilters(new URLSearchParams('maxPrice=0'))),
    ).toEqual([]);
  });
});
