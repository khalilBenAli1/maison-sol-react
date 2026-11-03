import { describe, expect, it } from 'vitest';
import { formatMoney, stayTotals } from './money';

describe('illustrative stay totals', () => {
  it('combines nightly rate, ten-percent service fee and per-guest nightly tax', () => {
    expect(stayTotals(24000, 3, 2)).toEqual({
      nightlyRate: 24000,
      nights: 3,
      guests: 2,
      roomSubtotal: 72000,
      serviceFee: 7200,
      localTax: 1800,
      total: 81000,
    });
  });

  it('rounds only the service fee to the nearest integer cent', () => {
    expect(stayTotals(10005, 1, 1).total).toBe(11306);
    expect(stayTotals(10005, 1, 1).serviceFee).toBe(1001);
  });

  it.each([
    [-1, 2, 2],
    [24000.5, 2, 2],
    [24000, 0, 2],
    [24000, 31, 2],
    [24000, 2, 5],
    [24000, 2, 1.5],
    [Number.MAX_SAFE_INTEGER, 30, 4],
  ])(
    'rejects invalid or unsafe calculation inputs %s / %s / %s',
    (rate, nights, guests) => {
      expect(() => stayTotals(rate, nights, guests)).toThrow(RangeError);
    },
  );

  it('shows fractional cents accurately without adding decimals to whole euros', () => {
    expect(formatMoney(24000)).toBe('€240');
    expect(formatMoney(10005)).toBe('€100.05');
    expect(() => formatMoney(12.5)).toThrow(RangeError);
  });
});
