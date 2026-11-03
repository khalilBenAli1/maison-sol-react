import { describe, expect, it } from 'vitest';
import { rooms } from '../data/rooms';
import {
  addDays,
  addMonths,
  formatDate,
  isDateOnly,
  isRoomAvailable,
  isUnavailableDate,
  monthDays,
  nightsBetween,
  startOfMonth,
  today,
  validateStay,
} from './dates';

describe('date-only arithmetic', () => {
  it('gets a local calendar date from an injected clock', () => {
    expect(today(() => new Date(2028, 1, 29, 23, 59))).toBe('2028-02-29');
  });

  it.each([
    '2027-02-29',
    '2028-02-30',
    '2028-13-01',
    '2028-2-01',
    '2028-01-01T00:00:00Z',
    '',
  ])('rejects malformed or impossible date %s', (value) =>
    expect(isDateOnly(value)).toBe(false),
  );

  it('handles leap days, year boundaries and negative offsets', () => {
    expect(isDateOnly('2028-02-29')).toBe(true);
    expect(addDays('2028-02-28', 2)).toBe('2028-03-01');
    expect(addDays('2027-12-31', 1)).toBe('2028-01-01');
    expect(addDays('2028-03-01', -1)).toBe('2028-02-29');
  });

  it('counts calendar nights across both daylight-saving boundaries', () => {
    expect(nightsBetween('2028-03-25', '2028-03-27')).toBe(2);
    expect(nightsBetween('2028-10-28', '2028-10-30')).toBe(2);
  });

  it('clamps month navigation without rolling into the following month', () => {
    expect(addMonths('2028-01-31', 1)).toBe('2028-02-29');
    expect(addMonths('2027-01-31', 1)).toBe('2027-02-28');
    expect(addMonths('2028-01-31', -1)).toBe('2027-12-31');
    expect(startOfMonth('2028-02-29')).toBe('2028-02-01');
  });

  it('returns six complete Monday-first calendar weeks', () => {
    const days = monthDays('2028-02-29');
    expect(days).toHaveLength(42);
    expect(new Set(days).size).toBe(42);
    expect(new Date(`${days[0]}T00:00:00Z`).getUTCDay()).toBe(1);
    expect(days).toContain('2028-02-29');
    expect(nightsBetween(days[0] ?? '', days.at(-1) ?? '')).toBe(41);
  });

  it('formats the date without a timezone day shift', () => {
    expect(formatDate('2028-01-01')).toBe('1 Jan');
    expect(formatDate('2028-01-01', { month: 'long', year: 'numeric' })).toBe(
      '1 January 2028',
    );
  });

  it('rejects invalid arithmetic inputs rather than normalizing them silently', () => {
    expect(() => addDays('2027-02-29', 1)).toThrow(RangeError);
    expect(() => addDays('2028-02-29', 0.5)).toThrow(RangeError);
    expect(() => addMonths('2028-02-29', 0.5)).toThrow(RangeError);
    expect(() => today(() => new Date('invalid'))).toThrow(RangeError);
  });
});

describe('stay validation and deterministic availability', () => {
  const clock = { today: '2028-02-01' };

  it('allows a valid range spanning months, up to thirty nights', () => {
    expect(validateStay('2028-02-28', '2028-03-03', 4, clock)).toEqual({});
    expect(validateStay('2028-02-01', '2028-03-02', 1, clock)).toEqual({});
  });

  it('reports missing, past, reversed and too-long dates on their fields', () => {
    expect(validateStay('', '', 0, clock)).toEqual({
      arrival: 'Choose an arrival date.',
      departure: 'Choose a departure date.',
      guests: 'Choose between 1 and 4 guests.',
    });
    expect(
      validateStay('2028-01-31', '2028-02-02', 2, clock).arrival,
    ).toBeDefined();
    expect(
      validateStay('2028-02-02', '2028-02-02', 2, clock).departure,
    ).toBeDefined();
    expect(
      validateStay('2028-02-03', '2028-02-02', 2, clock).departure,
    ).toBeDefined();
    expect(
      validateStay('2028-02-01', '2028-03-03', 2, clock).departure,
    ).toBeDefined();
  });

  it.each([0, 5, 1.5, Number.NaN])(
    'rejects invalid guest count %s',
    (guests) => {
      expect(
        validateStay('2028-02-02', '2028-02-04', guests, clock).guests,
      ).toBeDefined();
    },
  );

  it('checks every occupied night but permits checkout on a blocked night', () => {
    const options = { ...clock, roomId: 'olive-room' };
    expect(validateStay('2028-02-08', '2028-02-10', 2, options)).toEqual({});
    expect(
      validateStay('2028-02-09', '2028-02-12', 2, options).availability,
    ).toBeDefined();
    expect(isUnavailableDate('2028-02-10', 'olive-room')).toBe(true);
    expect(isUnavailableDate('2028-02-10', 'terrace-suite')).toBe(false);
    expect(isUnavailableDate('2028-02-10', '__proto__')).toBe(false);
  });

  it('combines capacity with room availability', () => {
    const olive = rooms[0];
    if (!olive) throw new Error('Missing fixture');
    const draft = {
      arrival: '2028-02-02',
      departure: '2028-02-04',
      guests: 2,
      roomId: olive.id,
    };
    expect(isRoomAvailable(olive, draft, clock)).toBe(true);
    expect(isRoomAvailable(olive, { ...draft, guests: 3 }, clock)).toBe(false);
    expect(
      isRoomAvailable(olive, { ...draft, departure: '2028-02-12' }, clock),
    ).toBe(false);
  });
});
