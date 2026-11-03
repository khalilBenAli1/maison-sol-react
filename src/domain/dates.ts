import type { BookingDraft, Room, StayErrors } from './types';

const DAY_MS = 86_400_000;

function timestamp(value: string): number {
  if (!isDateOnly(value))
    throw new RangeError('Expected a valid YYYY-MM-DD calendar date.');
  return Date.parse(`${value}T00:00:00.000Z`);
}

export function isDateOnly(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return (
    Number.isFinite(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === value
  );
}

/** The clock determines the visitor's local calendar date, never a UTC-shifted date. */
export function today(clock: () => Date = () => new Date()): string {
  const date = clock();
  if (!Number.isFinite(date.getTime()))
    throw new RangeError('The clock returned an invalid date.');
  return `${String(date.getFullYear()).padStart(4, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function addDays(value: string, days: number): string {
  if (!Number.isInteger(days))
    throw new RangeError('Day offsets must be integers.');
  const result = new Date(timestamp(value) + days * DAY_MS)
    .toISOString()
    .slice(0, 10);
  if (!isDateOnly(result))
    throw new RangeError('The resulting date is outside the supported range.');
  return result;
}

/** Whole calendar nights; unaffected by daylight-saving changes. */
export function nightsBetween(arrival: string, departure: string): number {
  return (timestamp(departure) - timestamp(arrival)) / DAY_MS;
}

export function formatDate(
  value: string,
  options: Intl.DateTimeFormatOptions = {},
): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    ...options,
    timeZone: 'UTC',
  }).format(new Date(timestamp(value)));
}

export function startOfMonth(value: string): string {
  timestamp(value);
  return `${value.slice(0, 7)}-01`;
}

/** Preserves the day where possible and clamps month-end dates. */
export function addMonths(value: string, months: number): string {
  if (!Number.isInteger(months))
    throw new RangeError('Month offsets must be integers.');
  const date = new Date(timestamp(value));
  const day = date.getUTCDate();
  date.setUTCDate(1);
  date.setUTCMonth(date.getUTCMonth() + months);
  const last = new Date(date.getTime());
  last.setUTCMonth(last.getUTCMonth() + 1);
  last.setUTCDate(0);
  date.setUTCDate(Math.min(day, last.getUTCDate()));
  const result = date.toISOString().slice(0, 10);
  if (!isDateOnly(result))
    throw new RangeError('The resulting date is outside the supported range.');
  return result;
}

/** Six complete Monday-first calendar weeks, including adjacent-month dates. */
export function monthDays(value: string): string[] {
  const first = startOfMonth(value);
  const offset = (new Date(timestamp(first)).getUTCDay() + 6) % 7;
  const gridStart = addDays(first, -offset);
  return Array.from({ length: 42 }, (_, index) => addDays(gridStart, index));
}

const blockedNights: Record<string, readonly number[]> = {
  'olive-room': [10, 11],
  'terrace-suite': [12, 13],
  'garden-studio': [14, 15],
  'sol-residence': [16, 17],
};

/** Deterministic sample availability, not a live hotel calendar. */
export function isUnavailableDate(value: string, roomId: string): boolean {
  if (!isDateOnly(value)) return true;
  if (!Object.hasOwn(blockedNights, roomId)) return false;
  return blockedNights[roomId]?.includes(Number(value.slice(8, 10))) ?? false;
}

export function validateStay(
  arrival: string,
  departure: string,
  guests: number,
  options: { today?: string; roomId?: string } = {},
): StayErrors {
  const errors: StayErrors = {};
  const earliest = options.today ?? today();
  if (!isDateOnly(earliest))
    throw new RangeError('Expected a valid earliest date.');
  if (!isDateOnly(arrival)) errors.arrival = 'Choose an arrival date.';
  else if (arrival < earliest)
    errors.arrival = 'Arrival must be today or later.';
  if (!isDateOnly(departure)) errors.departure = 'Choose a departure date.';
  if (!Number.isInteger(guests) || guests < 1 || guests > 4) {
    errors.guests = 'Choose between 1 and 4 guests.';
  }
  if (isDateOnly(arrival) && isDateOnly(departure)) {
    const nights = nightsBetween(arrival, departure);
    if (nights <= 0) errors.departure = 'Departure must be after arrival.';
    else if (nights > 30)
      errors.departure = 'Choose a stay of up to 30 nights.';
    else if (options.roomId) {
      for (let index = 0; index < nights; index += 1) {
        if (isUnavailableDate(addDays(arrival, index), options.roomId)) {
          errors.availability =
            'This room is unavailable for part of your stay. Try another room or change your dates.';
          break;
        }
      }
    }
  }
  return errors;
}

export function isRoomAvailable(
  room: Room,
  draft: BookingDraft,
  options: { today?: string } = {},
): boolean {
  return (
    draft.guests <= room.capacity &&
    Object.keys(
      validateStay(draft.arrival, draft.departure, draft.guests, {
        ...options,
        roomId: room.id,
      }),
    ).length === 0
  );
}
