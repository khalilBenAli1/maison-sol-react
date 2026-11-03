import { Arrow, Sun } from '../../components/Icons';
import { formatDate, isDateOnly } from '../../domain/dates';
import type { BookingDraft, Room } from '../../domain/types';
import type { ContactDetails } from '../../domain/contact';
import type { BookingStep } from './types';
interface Props {
  room: Room | undefined;
  draft: BookingDraft;
  contact: ContactDetails;
  onEdit: (step: BookingStep) => void;
  onFinish: () => void;
}
export default function ReviewStayStep({
  room,
  draft,
  contact,
  onEdit,
  onFinish,
}: Props) {
  return (
    <>
      <p className="panel-description">
        Nothing left to do but picture yourself here.
      </p>
      <dl className="review-details">
        <div>
          <dt>Your room</dt>
          <dd>
            {room?.name ?? 'Choose a room'}
            <button className="plain-button" onClick={() => onEdit(1)}>
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
            <button className="plain-button" onClick={() => onEdit(0)}>
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
            <button className="plain-button" onClick={() => onEdit(2)}>
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
            This is a demonstration. Your details stay in this tab and disappear
            when you leave. No booking or payment is made.
          </p>
        </div>
      </div>
      <button className="button finish-button" onClick={onFinish}>
        Complete demo stay <Arrow />
      </button>
    </>
  );
}
