import Photo from '../../components/Photo';
import { formatDate, isDateOnly } from '../../domain/dates';
import { formatMoney, type StayTotals } from '../../domain/money';
import type { BookingDraft, Room } from '../../domain/types';
interface Props {
  room: Room | undefined;
  draft: BookingDraft;
  totals: StayTotals | null;
}
export default function StaySummary({ room, draft, totals }: Props) {
  return (
    <aside className="stay-summary">
      {room ? (
        <Photo src={room.image} alt={room.name} sizes="400px" />
      ) : (
        <Photo
          src="/images/hotel-hero.webp"
          alt="Your Mediterranean hideaway"
          sizes="400px"
        />
      )}
      <div className="summary-body">
        <p className="eyebrow">A little preview</p>
        <h3>{room?.name ?? 'Your Maison Sol stay'}</h3>
        <p className="summary-tagline">
          {room?.tagline ?? 'Warm stone. Sea air. Time for yourself.'}
        </p>
        <dl className="summary-dates">
          <div>
            <dt>Arrival</dt>
            <dd>
              {isDateOnly(draft.arrival)
                ? formatDate(draft.arrival)
                : 'Take your time'}
            </dd>
          </div>
          <div>
            <dt>Departure</dt>
            <dd>
              {isDateOnly(draft.departure)
                ? formatDate(draft.departure)
                : 'Take your time'}
            </dd>
          </div>
          <div>
            <dt>Guests</dt>
            <dd>
              {draft.guests} {draft.guests === 1 ? 'guest' : 'guests'}
            </dd>
          </div>
        </dl>
        {totals ? (
          <dl className="summary-prices">
            <div>
              <dt>
                {formatMoney(totals.nightlyRate)} × {totals.nights} nights
              </dt>
              <dd>{formatMoney(totals.roomSubtotal)}</dd>
            </div>
            <div>
              <dt>Service fee · 10%</dt>
              <dd>{formatMoney(totals.serviceFee)}</dd>
            </div>
            <div>
              <dt>Local tax · €3 / guest / night</dt>
              <dd>{formatMoney(totals.localTax)}</dd>
            </div>
            <div className="summary-total">
              <dt>Sample total</dt>
              <dd>{formatMoney(totals.total)}</dd>
            </div>
          </dl>
        ) : (
          <p className="summary-placeholder">
            Your stay summary will unfold as you choose your dates and room.
          </p>
        )}
        <p className="sample-note">
          Illustrative rates & fees. Nothing will be charged.
        </p>
      </div>
    </aside>
  );
}
