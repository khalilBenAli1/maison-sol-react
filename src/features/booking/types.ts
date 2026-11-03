import type { BookingDraft, Room } from '../../domain/types';
import type { StayTotals } from '../../domain/money';
export type BookingStep = 0 | 1 | 2 | 3;
export interface ConfirmedStay {
  reference: string;
  firstName: string;
  room: Room;
  draft: BookingDraft;
  totals: StayTotals;
}
