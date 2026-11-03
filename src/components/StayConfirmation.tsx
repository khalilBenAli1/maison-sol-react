import { Link } from 'react-router';
import { useEffect, useRef } from 'react';
import type { BookingDraft, Room } from '../domain/types';
import { formatDate } from '../domain/dates';
import { formatMoney, type StayTotals } from '../domain/money';
import { Arrow, Sun } from './Icons';
export interface ConfirmedStay {
  reference: string;
  firstName: string;
  room: Room;
  draft: BookingDraft;
  totals: StayTotals;
}
export default function StayConfirmation({
  stay,
  onRestart,
}: {
  stay: ConfirmedStay;
  onRestart: () => void;
}) {
  const { reference, firstName, room, draft, totals } = stay;
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
  }, []);
  return (
    <section className="shell confirmation">
      <Sun />
      <p className="eyebrow">A little time, just for you</p>
      <h1 ref={heading} tabIndex={-1}>
        That slower stay?
        <br />
        <em>Imagine it’s yours.</em>
      </h1>
      <p>
        Thank you, {firstName}. You’ve completed your Maison Sol experience.
      </p>
      <div className="confirmation-ticket">
        <span className="eyebrow">Demo reference · {reference}</span>
        <h2>{room.name}</h2>
        <div>
          <p>
            {formatDate(draft.arrival)} —{' '}
            {formatDate(draft.departure, { year: 'numeric' })}
          </p>
          <p>
            {totals.nights} nights · {draft.guests}{' '}
            {draft.guests === 1 ? 'guest' : 'guests'} ·{' '}
            {formatMoney(totals.total)}
          </p>
        </div>
        <p className="sample-note">
          This was a simulated stay. No room was reserved, no payment was taken,
          and no email was sent. Your contact details are not saved.
        </p>
      </div>
      <div className="confirmation-actions">
        <button className="button" onClick={onRestart}>
          Imagine another stay <Arrow />
        </button>
        <Link className="text-link" to="/">
          Back to the house <Arrow />
        </Link>
      </div>
    </section>
  );
}
