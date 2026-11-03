import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link } from 'react-router';
import { usePreferences } from '../app/PreferencesContext';
import {
  validateContact,
  type ContactDetails,
  type ContactErrors,
} from '../app/contact';
import { findRoom, rooms } from '../data/rooms';
import {
  addDays,
  formatDate,
  isDateOnly,
  isRoomAvailable,
  nightsBetween,
  today,
  validateStay,
} from '../domain/dates';
import { formatMoney, stayTotals } from '../domain/money';
import type { StayErrors } from '../domain/types';
import { Calendar } from '../components/DateRange';
import { Arrow, Sun } from '../components/Icons';
import Photo from '../components/Photo';
import StayConfirmation, {
  type ConfirmedStay,
} from '../components/StayConfirmation';
const steps = ['Your dates', 'Your room', 'Your details', 'Review your stay'];
export default function Booking() {
  const { preferences, updateDraft, clearDraft } = usePreferences();
  const { draft } = preferences;
  const [step, setStep] = useState(0);
  const [stayErrors, setStayErrors] = useState<StayErrors>({});
  const [roomError, setRoomError] = useState('');
  const [contact, setContact] = useState<ContactDetails>({
    name: '',
    email: '',
    consent: false,
  });
  const [contactErrors, setContactErrors] = useState<ContactErrors>({});
  const [confirmed, setConfirmed] = useState<ConfirmedStay | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const room = findRoom(draft.roomId);
  const earliest = today();
  const datesValid =
    Object.keys(
      validateStay(draft.arrival, draft.departure, draft.guests, {
        today: earliest,
      }),
    ).length === 0;
  const availableRooms = datesValid
    ? rooms.filter((candidate) =>
        isRoomAvailable(candidate, draft, { today: earliest }),
      )
    : [];
  const totals =
    room && datesValid
      ? stayTotals(
          room.nightlyRate,
          nightsBetween(draft.arrival, draft.departure),
          draft.guests,
        )
      : null;
  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
  }, [step, confirmed]);
  const nextDates = (event: FormEvent) => {
    event.preventDefault();
    const errors = validateStay(draft.arrival, draft.departure, draft.guests, {
      today: earliest,
    });
    setStayErrors(errors);
    if (!Object.keys(errors).length) setStep(1);
  };
  const nextRoom = () => {
    if (!datesValid) {
      setStep(0);
      return;
    }
    if (!room || !isRoomAvailable(room, draft, { today: earliest })) {
      setRoomError('Choose an available room for your stay.');
      return;
    }
    setRoomError('');
    setStep(2);
  };
  const nextContact = (event: FormEvent) => {
    event.preventDefault();
    const errors = validateContact(contact);
    setContactErrors(errors);
    if (!Object.keys(errors).length) setStep(3);
    else
      requestAnimationFrame(() =>
        form.current
          ?.querySelector<HTMLInputElement>('[aria-invalid="true"]')
          ?.focus(),
      );
  };
  const finish = () => {
    if (!datesValid) {
      setStep(0);
      return;
    }
    if (!room || !isRoomAvailable(room, draft, { today: earliest })) {
      setStep(1);
      setRoomError('Choose an available room for your stay.');
      return;
    }
    if (Object.keys(validateContact(contact)).length) {
      setStep(2);
      return;
    }
    if (!totals) {
      setStep(0);
      return;
    }
    setConfirmed({
      reference: `SOL-${crypto.randomUUID().slice(0, 6).toUpperCase()}`,
      firstName: contact.name.trim().split(' ')[0],
      room,
      draft: { ...draft },
      totals: { ...totals },
    });
  };
  if (confirmed)
    return (
      <StayConfirmation
        stay={confirmed}
        onRestart={() => {
          clearDraft();
          setContact({ name: '', email: '', consent: false });
          setConfirmed(null);
          setStep(0);
        }}
      />
    );
  return (
    <div className="shell booking-page">
      <Link to="/rooms" className="back-link">
        ← Back to the rooms
      </Link>
      <div className="booking-heading">
        <div>
          <p className="eyebrow">A little time, just for you</p>
          <h1>
            Your slower stay
            <br />
            <em>starts here.</em>
          </h1>
        </div>
        <p>
          A few simple choices.
          <br />
          We’ll take it slowly.
        </p>
      </div>
      <ol className="booking-steps">
        {steps.map((label, index) => (
          <li key={label}>
            <button
              disabled={index > step}
              aria-current={step === index ? 'step' : undefined}
              onClick={() => setStep(index)}
            >
              <span>{index < step ? '✓' : `0${index + 1}`}</span>
              {label}
            </button>
          </li>
        ))}
      </ol>
      <div className="booking-grid">
        <section className="booking-panel">
          <p className="eyebrow">Step 0{step + 1} / 04</p>
          <h2 ref={heading} tabIndex={-1}>
            {
              [
                'When shall we welcome you?',
                'A room that feels like you.',
                'A few little details.',
                'Take one last look.',
              ][step]
            }
          </h2>
          {step === 0 && (
            <form onSubmit={nextDates} noValidate>
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
                    aria-invalid={!!stayErrors.arrival}
                    aria-describedby={
                      stayErrors.arrival ? 'arrival-error' : undefined
                    }
                    onChange={(event) => {
                      updateDraft({ arrival: event.target.value });
                      setStayErrors({});
                    }}
                  />
                  {stayErrors.arrival && (
                    <span className="field-error" id="arrival-error">
                      {stayErrors.arrival}
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
                    aria-invalid={!!stayErrors.departure}
                    aria-describedby={
                      stayErrors.departure ? 'departure-error' : undefined
                    }
                    onChange={(event) => {
                      updateDraft({ departure: event.target.value });
                      setStayErrors({});
                    }}
                  />
                  {stayErrors.departure && (
                    <span className="field-error" id="departure-error">
                      {stayErrors.departure}
                    </span>
                  )}
                </label>
                <label>
                  Guests
                  <select
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
              </div>
              <Calendar
                draft={draft}
                onChange={(patch) => {
                  updateDraft(patch);
                  setStayErrors({});
                }}
                roomId={draft.roomId}
              />
              <div className="step-actions">
                <button type="submit" className="button">
                  Find my room <Arrow />
                </button>
                <span>Up to 30 nights. All availability is illustrative.</span>
              </div>
              {Object.keys(stayErrors).length > 0 && (
                <p className="field-error" role="alert">
                  Please check the dates above.
                </p>
              )}
            </form>
          )}
          {step === 1 && (
            <>
              <p className="panel-description">
                {availableRooms.length
                  ? `${availableRooms.length} ${availableRooms.length === 1 ? 'lovely stay is' : 'lovely stays are'} available for your dates.`
                  : 'These dates are a little busy. A small change could open up something lovely.'}
              </p>
              <fieldset className="booking-room-options">
                <legend className="sr-only">Choose your room</legend>
                {availableRooms.map((candidate) => (
                  <label
                    className={`booking-room-option ${draft.roomId === candidate.id ? 'selected' : ''}`}
                    key={candidate.id}
                  >
                    <Photo
                      src={candidate.image}
                      alt={candidate.name}
                      sizes="160px"
                    />
                    <div>
                      <span className="eyebrow">
                        {candidate.sizeM2} m² · Up to {candidate.capacity}{' '}
                        guests
                      </span>
                      <strong>{candidate.name}</strong>
                      <span>
                        {formatMoney(candidate.nightlyRate)}{' '}
                        <small>/ night</small>
                      </span>
                    </div>
                    <input
                      type="radio"
                      name="room"
                      value={candidate.id}
                      checked={draft.roomId === candidate.id}
                      onChange={() => {
                        updateDraft({ roomId: candidate.id });
                        setRoomError('');
                      }}
                    />
                  </label>
                ))}
              </fieldset>
              {!availableRooms.length && (
                <button className="button secondary" onClick={() => setStep(0)}>
                  Try different dates <Arrow />
                </button>
              )}
              {roomError && (
                <p className="field-error" role="alert">
                  {roomError}
                </p>
              )}
              {availableRooms.length > 0 && (
                <div className="step-actions">
                  <button className="button" onClick={nextRoom}>
                    A few details <Arrow />
                  </button>
                  <button className="plain-button" onClick={() => setStep(0)}>
                    Change dates
                  </button>
                </div>
              )}
            </>
          )}
          {step === 2 && (
            <form ref={form} onSubmit={nextContact} noValidate>
              <p className="panel-description">
                This is a simulated stay. Use sample details; nothing is sent or
                saved.
              </p>
              <button
                type="button"
                className="text-link sample-details"
                onClick={() => {
                  setContact({
                    name: 'Alex Morgan',
                    email: 'alex@example.com',
                    consent: false,
                  });
                  setContactErrors({});
                }}
              >
                Use sample details <Arrow />
              </button>
              <div className="contact-fields">
                <label>
                  Your name
                  <input
                    autoComplete="off"
                    maxLength={100}
                    value={contact.name}
                    aria-invalid={!!contactErrors.name}
                    aria-describedby={
                      contactErrors.name ? 'name-error' : undefined
                    }
                    onChange={(event) =>
                      setContact({ ...contact, name: event.target.value })
                    }
                  />
                  {contactErrors.name && (
                    <span className="field-error" id="name-error">
                      {contactErrors.name}
                    </span>
                  )}
                </label>
                <label>
                  Email address
                  <input
                    type="email"
                    autoComplete="off"
                    maxLength={254}
                    value={contact.email}
                    aria-invalid={!!contactErrors.email}
                    aria-describedby={
                      contactErrors.email ? 'email-error' : undefined
                    }
                    onChange={(event) =>
                      setContact({ ...contact, email: event.target.value })
                    }
                  />
                  {contactErrors.email && (
                    <span className="field-error" id="email-error">
                      {contactErrors.email}
                    </span>
                  )}
                </label>
              </div>
              <label className="consent-field">
                <input
                  type="checkbox"
                  checked={contact.consent}
                  aria-invalid={!!contactErrors.consent}
                  aria-describedby={
                    contactErrors.consent ? 'consent-error' : undefined
                  }
                  onChange={(event) =>
                    setContact({ ...contact, consent: event.target.checked })
                  }
                />
                <span>
                  I understand this is a simulated stay. No reservation or
                  payment will be made.
                </span>
              </label>
              {contactErrors.consent && (
                <p id="consent-error" className="field-error">
                  {contactErrors.consent}
                </p>
              )}
              <div className="step-actions">
                <button className="button" type="submit">
                  Review my stay <Arrow />
                </button>
                <button
                  type="button"
                  className="plain-button"
                  onClick={() => setStep(1)}
                >
                  Change room
                </button>
              </div>
            </form>
          )}
          {step === 3 && (
            <>
              <p className="panel-description">
                Nothing left to do but picture yourself here.
              </p>
              <dl className="review-details">
                <div>
                  <dt>Your room</dt>
                  <dd>
                    {room?.name ?? 'Choose a room'}
                    <button className="plain-button" onClick={() => setStep(1)}>
                      Edit
                    </button>
                  </dd>
                </div>
                <div>
                  <dt>Your dates</dt>
                  <dd>
                    {isDateOnly(draft.arrival) && isDateOnly(draft.departure)
                      ? `${formatDate(draft.arrival)} — ${formatDate(draft.departure, { year: 'numeric' })}`
                      : 'Choose dates'}
                    <button className="plain-button" onClick={() => setStep(0)}>
                      Edit
                    </button>
                  </dd>
                </div>
                <div>
                  <dt>Your guests</dt>
                  <dd>
                    {draft.guests} {draft.guests === 1 ? 'guest' : 'guests'}
                  </dd>
                </div>
                <div>
                  <dt>Your details</dt>
                  <dd>
                    {contact.name}
                    <br />
                    {contact.email}
                    <button className="plain-button" onClick={() => setStep(2)}>
                      Edit
                    </button>
                  </dd>
                </div>
              </dl>
              <div className="simulation-note">
                <Sun />
                <div>
                  <strong>A stay to imagine.</strong>
                  <p>
                    This is a demonstration. Your details stay in this tab and
                    disappear when you leave. No booking or payment is made.
                  </p>
                </div>
              </div>
              <button className="button finish-button" onClick={finish}>
                Complete demo stay <Arrow />
              </button>
            </>
          )}
        </section>
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
      </div>
    </div>
  );
}
