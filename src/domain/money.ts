export interface StayTotals {
  nightlyRate: number;
  nights: number;
  guests: number;
  roomSubtotal: number;
  serviceFee: number;
  localTax: number;
  total: number;
}

/** All values are integer euro cents. Fees are illustrative, never charged. */
export function stayTotals(
  nightlyRate: number,
  nights: number,
  guests: number,
): StayTotals {
  if (
    !Number.isSafeInteger(nightlyRate) ||
    nightlyRate < 0 ||
    nightlyRate > 10_000_000
  ) {
    throw new RangeError(
      'Nightly rate must be a supported non-negative integer amount in cents.',
    );
  }
  if (!Number.isInteger(nights) || nights < 1 || nights > 30) {
    throw new RangeError('A stay must be between 1 and 30 nights.');
  }
  if (!Number.isInteger(guests) || guests < 1 || guests > 4) {
    throw new RangeError('A stay must have between 1 and 4 guests.');
  }
  const roomSubtotal = nightlyRate * nights;
  const serviceFee = Math.round(roomSubtotal / 10);
  const localTax = 300 * guests * nights;
  return {
    nightlyRate,
    nights,
    guests,
    roomSubtotal,
    serviceFee,
    localTax,
    total: roomSubtotal + serviceFee + localTax,
  };
}

export function formatMoney(cents: number): string {
  if (!Number.isSafeInteger(cents))
    throw new RangeError('Currency must be an integer amount in cents.');
  return new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}
