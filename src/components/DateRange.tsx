import { useState } from 'react';
import {
  addDays,
  addMonths,
  formatDate,
  isDateOnly,
  isUnavailableDate,
  monthDays,
  startOfMonth,
  today,
  validateStay,
} from '../domain/dates';
import type { BookingDraft } from '../domain/types';
import { usePreferences } from '../app/PreferencesContext';
import Modal from './Modal';
import { Arrow, Chevron } from './Icons';

export function Calendar({
  draft,
  onChange,
  onComplete,
  roomId = '',
  initialSelection,
}: {
  draft: BookingDraft;
  onChange: (patch: Partial<BookingDraft>) => void;
  onComplete?: () => void;
  roomId?: string;
  initialSelection?: 'arrival' | 'departure';
}) {
  const earliest = today();
  const [month, setMonth] = useState(() =>
    startOfMonth(
      isDateOnly(draft.arrival) && draft.arrival >= earliest
        ? draft.arrival
        : earliest,
    ),
  );
  const [selection, setSelection] = useState<'arrival' | 'departure'>(
    initialSelection === 'departure' && draft.arrival
      ? 'departure'
      : (initialSelection ??
          (draft.arrival && !draft.departure ? 'departure' : 'arrival')),
  );
  const choose = (date: string) => {
    if (selection === 'arrival') {
      onChange({ arrival: date, departure: '' });
      setSelection('departure');
    } else {
      onChange({ departure: date });
      setSelection('arrival');
      onComplete?.();
    }
  };
  return (
    <div className="calendar">
      <div className="calendar-selection">
        <button
          type="button"
          className={selection === 'arrival' ? 'selected' : ''}
          onClick={() => setSelection('arrival')}
        >
          <span>Arrival</span>
          {isDateOnly(draft.arrival)
            ? formatDate(draft.arrival)
            : 'Choose a date'}
        </button>
        <Arrow />
        <button
          type="button"
          className={selection === 'departure' ? 'selected' : ''}
          onClick={() => setSelection(draft.arrival ? 'departure' : 'arrival')}
        >
          <span>Departure</span>
          {isDateOnly(draft.departure)
            ? formatDate(draft.departure)
            : 'Choose a date'}
        </button>
      </div>
      <div className="calendar-navigation">
        <button
          type="button"
          className="icon-button"
          aria-label="Previous month"
          disabled={month <= startOfMonth(earliest)}
          onClick={() => setMonth(addMonths(month, -1))}
        >
          <Arrow style={{ transform: 'rotate(180deg)' }} />
        </button>
        <p aria-live="polite">
          {formatDate(month, {
            month: 'long',
            year: 'numeric',
            day: undefined,
          })}
        </p>
        <button
          type="button"
          className="icon-button"
          aria-label="Next month"
          onClick={() => setMonth(addMonths(month, 1))}
        >
          <Arrow />
        </button>
      </div>
      <div className="calendar-weekdays" aria-hidden="true">
        {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
      <div className="calendar-days">
        {monthDays(month).map((date) => {
          const outside = date.slice(0, 7) !== month.slice(0, 7);
          const occupied = !!roomId && isUnavailableDate(date, roomId);
          const departureInvalid =
            selection === 'departure' &&
            !!draft.arrival &&
            Object.keys(
              validateStay(draft.arrival, date, draft.guests, {
                today: earliest,
                roomId,
              }),
            ).length > 0;
          const disabled =
            outside ||
            date < earliest ||
            (selection === 'arrival' && occupied) ||
            departureInvalid;
          const endpoint = date === draft.arrival || date === draft.departure;
          const inside =
            !!draft.arrival &&
            !!draft.departure &&
            date > draft.arrival &&
            date < draft.departure;
          return (
            <button
              type="button"
              key={date}
              className={`${outside ? 'outside' : ''} ${endpoint ? 'endpoint' : ''} ${inside ? 'in-range' : ''} ${occupied ? 'occupied' : ''}`}
              disabled={disabled}
              aria-label={`${formatDate(date, { weekday: 'long', year: 'numeric', month: 'long' })}${endpoint ? ', selected' : ''}${occupied ? ', occupied night' : ''}`}
              aria-pressed={endpoint}
              onClick={() => choose(date)}
            >
              {Number(date.slice(-2))}
            </button>
          );
        })}
      </div>
      <p className="calendar-hint">
        {selection === 'arrival'
          ? 'Choose your arrival.'
          : 'Now choose your departure. Up to 30 nights.'}
        {roomId ? ' Crossed dates have occupied nights.' : ''}
      </p>
    </div>
  );
}

export function AvailabilityBar() {
  const { preferences, updateDraft } = usePreferences();
  const [picker, setPicker] = useState<'arrival' | 'departure' | null>(null);
  const { draft } = preferences;
  return (
    <>
      <div className="availability-bar">
        <button
          type="button"
          className="stay-field"
          onClick={() => setPicker('arrival')}
        >
          <span>Arrival</span>
          <strong>
            {isDateOnly(draft.arrival)
              ? formatDate(draft.arrival)
              : 'Select date'}
          </strong>
          <Chevron />
        </button>
        <button
          type="button"
          className="stay-field"
          onClick={() => setPicker('departure')}
        >
          <span>Departure</span>
          <strong>
            {isDateOnly(draft.departure)
              ? formatDate(draft.departure)
              : 'Select date'}
          </strong>
          <Chevron />
        </button>
        <label className="stay-field guests-field">
          <span>Guests</span>
          <select
            aria-label="Guests"
            value={draft.guests}
            onChange={(event) =>
              updateDraft({ guests: Number(event.target.value) })
            }
          >
            {[1, 2, 3, 4].map((count) => (
              <option key={count} value={count}>
                {count} {count === 1 ? 'guest' : 'guests'}
              </option>
            ))}
          </select>
        </label>
        <a className="button availability-action" href="#/booking">
          Check availability <Arrow />
        </a>
      </div>
      <Modal
        open={picker !== null}
        onClose={() => setPicker(null)}
        title="Make time for yourself"
        className="calendar-modal"
      >
        <Calendar
          key={picker ?? 'closed'}
          initialSelection={picker ?? 'arrival'}
          draft={draft}
          onChange={updateDraft}
          onComplete={() => setPicker(null)}
        />
        <button
          type="button"
          className="text-link"
          onClick={() =>
            updateDraft({
              arrival: addDays(today(), 1),
              departure: addDays(today(), 4),
            })
          }
        >
          Try a three-night stay <Arrow />
        </button>
      </Modal>
    </>
  );
}
