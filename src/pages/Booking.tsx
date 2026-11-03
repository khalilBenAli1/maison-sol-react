import { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import useBookingFlow from '../features/booking/useBookingFlow';
import StayDatesStep from '../features/booking/StayDatesStep';
import RoomSelectionStep from '../features/booking/RoomSelectionStep';
import GuestDetailsStep from '../features/booking/GuestDetailsStep';
import ReviewStayStep from '../features/booking/ReviewStayStep';
import StaySummary from '../features/booking/StaySummary';
import StayConfirmation from '../features/booking/StayConfirmation';
const steps = [
  { label: 'Your dates', index: 0 },
  { label: 'Your room', index: 1 },
  { label: 'Your details', index: 2 },
  { label: 'Review your stay', index: 3 },
] as const;
export default function Booking() {
  const flow = useBookingFlow();
  const {
    draft,
    earliest,
    step,
    stayErrors,
    roomError,
    contact,
    contactErrors,
    confirmed,
    room,
    availableRooms,
    totals,
  } = flow;
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
  }, [step]);
  if (confirmed)
    return <StayConfirmation stay={confirmed} onRestart={flow.restart} />;
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
        {steps.map(({ label, index }) => (
          <li key={label}>
            <button
              disabled={index > step}
              aria-current={step === index ? 'step' : undefined}
              onClick={() => flow.editStep(index)}
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
            <StayDatesStep
              draft={draft}
              earliest={earliest}
              errors={stayErrors}
              onDatesChange={flow.changeDates}
              onGuestsChange={flow.changeGuests}
              onNext={flow.nextDates}
            />
          )}
          {step === 1 && (
            <RoomSelectionStep
              availableRooms={availableRooms}
              selectedRoomId={draft.roomId}
              error={roomError}
              onChoose={flow.chooseRoom}
              onNext={flow.nextRoom}
              onBack={() => flow.editStep(0)}
            />
          )}
          {step === 2 && (
            <GuestDetailsStep
              contact={contact}
              errors={contactErrors}
              onChange={flow.changeContact}
              onSample={flow.fillSampleContact}
              onNext={flow.nextContact}
              onBack={() => flow.editStep(1)}
            />
          )}
          {step === 3 && (
            <ReviewStayStep
              room={room}
              draft={draft}
              contact={contact}
              onEdit={flow.editStep}
              onFinish={flow.finish}
            />
          )}
        </section>
        <StaySummary room={room} draft={draft} totals={totals} />
      </div>
    </div>
  );
}
