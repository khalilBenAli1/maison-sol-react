import { Calendar } from '../../components/DateRange';
import { Arrow } from '../../components/Icons';
import { addDays, isDateOnly } from '../../domain/dates';
import type { BookingDraft, StayErrors } from '../../domain/types';
interface Props {
  draft: BookingDraft;
  earliest: string;
  errors: StayErrors;
  onDatesChange: (patch: Partial<BookingDraft>) => void;
  onGuestsChange: (guests: number) => void;
  onNext: () => void;
}
export default function StayDatesStep({
  draft,
  earliest,
  errors,
  onDatesChange,
  onGuestsChange,
  onNext,
}: Props) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onNext();
      }}
      noValidate
    >
      <p className="panel-description">
        Choose your dates, and leave a little room for doing nothing.
      </p>
      <div className="date-inputs">
        <label>
          Arrival
          <input
            type="date"
            value={draft.arrival}
            min={earliest}
            aria-invalid={!!errors.arrival}
            aria-describedby={errors.arrival ? 'arrival-error' : undefined}
            onChange={(event) => {
              onDatesChange({ arrival: event.target.value });
            }}
          />
          {errors.arrival && (
            <span className="field-error" id="arrival-error">
              {errors.arrival}
            </span>
          )}
        </label>
        <label>
          Departure
          <input
            type="date"
            value={draft.departure}
            min={
              isDateOnly(draft.arrival)
                ? addDays(draft.arrival, 1)
                : addDays(earliest, 1)
            }
            aria-invalid={!!errors.departure}
            aria-describedby={errors.departure ? 'departure-error' : undefined}
            onChange={(event) => {
              onDatesChange({ departure: event.target.value });
            }}
          />
          {errors.departure && (
            <span className="field-error" id="departure-error">
              {errors.departure}
            </span>
          )}
        </label>
        <label>
          Guests
          <select
            value={draft.guests}
            onChange={(event) => onGuestsChange(Number(event.target.value))}
          >
            {[1, 2, 3, 4].map((count) => (
              <option key={count} value={count}>
                {count} {count === 1 ? 'guest' : 'guests'}
              </option>
            ))}
          </select>
        </label>
      </div>
      <Calendar draft={draft} onChange={onDatesChange} roomId={draft.roomId} />
      <div className="step-actions">
        <button type="submit" className="button">
          Find my room <Arrow />
        </button>
        <span>Up to 30 nights. All availability is illustrative.</span>
      </div>
      {Object.keys(errors).length > 0 && (
        <p className="field-error" role="alert">
          Please check the dates above.
        </p>
      )}
    </form>
  );
}
