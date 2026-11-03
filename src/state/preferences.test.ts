import { describe, expect, it } from 'vitest';
import {
  STORAGE_KEY,
  defaultPreferences,
  readPreferences,
  resetPreferences,
  writePreferences,
  type StorageAdapter,
} from './preferences';

function memoryStorage(initial: string | null = null): StorageAdapter {
  const values = new Map<string, string>();
  if (initial !== null) values.set(STORAGE_KEY, initial);
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => {
      values.set(key, value);
    },
    removeItem: (key) => {
      values.delete(key);
    },
  };
}

describe('versioned local preferences', () => {
  it('round-trips saved rooms and a valid non-sensitive draft', () => {
    const storage = memoryStorage();
    const preferences = {
      ...defaultPreferences(),
      savedRoomIds: ['terrace-suite', 'olive-room'],
      draft: {
        arrival: '2028-02-28',
        departure: '2028-03-02',
        guests: 2,
        roomId: 'olive-room',
      },
    };
    expect(writePreferences(storage, preferences)).toBe(true);
    expect(readPreferences(storage)).toEqual(preferences);
  });

  it('does not serialize contact fields or arbitrary extra properties', () => {
    const storage = memoryStorage();
    const preferences = {
      ...defaultPreferences(),
      email: 'not-for-storage@example.test',
      draft: {
        ...defaultPreferences().draft,
        name: 'Sample Guest',
        email: 'not-for-storage@example.test',
      },
    };
    writePreferences(storage, preferences);
    expect(storage.getItem(STORAGE_KEY)).not.toContain('email');
    expect(storage.getItem(STORAGE_KEY)).not.toContain('Sample Guest');
    expect(readPreferences(storage)).toEqual(defaultPreferences());
  });

  it.each(['{broken', 'null', '[]', '{"version":2}', 'x'.repeat(8193)])(
    'recovers corrupted, unsupported or oversized data',
    (stored) =>
      expect(readPreferences(memoryStorage(stored))).toEqual(
        defaultPreferences(),
      ),
  );

  it('deduplicates saved IDs and discards unknown rooms and invalid dates/guest counts', () => {
    const storage = memoryStorage(
      JSON.stringify({
        version: 1,
        savedRoomIds: ['olive-room', 'olive-room', 'unknown', 12],
        draft: {
          arrival: '2027-02-29',
          departure: '',
          guests: 8,
          roomId: 'unknown',
        },
      }),
    );
    expect(readPreferences(storage)).toEqual({
      ...defaultPreferences(),
      savedRoomIds: ['olive-room'],
    });
  });

  it('clears a reversed or excessively long persisted date range', () => {
    const draft = {
      arrival: '2028-03-05',
      departure: '2028-03-01',
      guests: 1,
      roomId: 'olive-room',
    };
    const storage = memoryStorage(
      JSON.stringify({ version: 1, savedRoomIds: [], draft }),
    );
    expect(readPreferences(storage).draft).toEqual({
      ...draft,
      arrival: '',
      departure: '',
    });
    draft.departure = '2028-05-01';
    storage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: 1, savedRoomIds: [], draft }),
    );
    expect(readPreferences(storage).draft.arrival).toBe('');
  });

  it('remains usable when storage is absent or access/quota is denied', () => {
    const denied: StorageAdapter = {
      getItem() {
        throw new Error('Storage denied');
      },
      setItem() {
        throw new Error('Quota exceeded');
      },
      removeItem() {
        throw new Error('Storage denied');
      },
    };
    expect(readPreferences(null)).toEqual(defaultPreferences());
    expect(readPreferences(denied)).toEqual(defaultPreferences());
    expect(writePreferences(null, defaultPreferences())).toBe(false);
    expect(writePreferences(denied, defaultPreferences())).toBe(false);
    expect(resetPreferences(null)).toBe(false);
    expect(resetPreferences(denied)).toBe(false);
  });

  it('resets only this app key and produces independent default objects', () => {
    const storage = memoryStorage();
    storage.setItem('unrelated', 'preserve');
    writePreferences(storage, {
      ...defaultPreferences(),
      savedRoomIds: ['olive-room'],
    });
    expect(resetPreferences(storage)).toBe(true);
    expect(storage.getItem(STORAGE_KEY)).toBeNull();
    expect(storage.getItem('unrelated')).toBe('preserve');
    const a = defaultPreferences();
    a.savedRoomIds.push('olive-room');
    expect(defaultPreferences().savedRoomIds).toEqual([]);
  });
});
