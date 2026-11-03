import { rooms } from '../data/rooms';
import { isDateOnly, nightsBetween } from '../domain/dates';
import type { BookingDraft } from '../domain/types';

export const STORAGE_KEY = 'maison-sol:preferences:v1';

export interface StorageAdapter {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export interface Preferences {
  version: 1;
  savedRoomIds: string[];
  draft: BookingDraft;
}

export function defaultPreferences(): Preferences {
  return {
    version: 1,
    savedRoomIds: [],
    draft: { arrival: '', departure: '', guests: 2, roomId: '' },
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function knownRoom(value: unknown): value is string {
  return typeof value === 'string' && rooms.some((room) => room.id === value);
}

/** Explicit allowlist prevents contact details or arbitrary fields entering local storage. */
function normalize(value: unknown): Preferences {
  const defaults = defaultPreferences();
  if (!isRecord(value) || value.version !== 1) return defaults;
  const savedRoomIds = Array.isArray(value.savedRoomIds)
    ? [...new Set(value.savedRoomIds.filter(knownRoom))]
    : [];
  if (!isRecord(value.draft)) return { ...defaults, savedRoomIds };
  const raw = value.draft;
  let arrival =
    typeof raw.arrival === 'string' && isDateOnly(raw.arrival)
      ? raw.arrival
      : '';
  let departure =
    typeof raw.departure === 'string' && isDateOnly(raw.departure)
      ? raw.departure
      : '';
  if (arrival && departure) {
    const nights = nightsBetween(arrival, departure);
    if (nights <= 0 || nights > 30) {
      arrival = '';
      departure = '';
    }
  }
  const guests =
    typeof raw.guests === 'number' &&
    Number.isInteger(raw.guests) &&
    raw.guests >= 1 &&
    raw.guests <= 4
      ? raw.guests
      : defaults.draft.guests;
  const roomId = knownRoom(raw.roomId) ? raw.roomId : '';
  return {
    version: 1,
    savedRoomIds,
    draft: { arrival, departure, guests, roomId },
  };
}

export function getBrowserStorage(): StorageAdapter | null {
  try {
    return typeof window === 'undefined' ? null : window.localStorage;
  } catch {
    return null;
  }
}

export function readPreferences(storage: StorageAdapter | null): Preferences {
  if (!storage) return defaultPreferences();
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw || raw.length > 8192) return defaultPreferences();
    return normalize(JSON.parse(raw));
  } catch {
    return defaultPreferences();
  }
}

export function writePreferences(
  storage: StorageAdapter | null,
  preferences: Preferences,
): boolean {
  if (!storage) return false;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(normalize(preferences)));
    return true;
  } catch {
    return false;
  }
}

export function resetPreferences(storage: StorageAdapter | null): boolean {
  if (!storage) return false;
  try {
    storage.removeItem(STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}
