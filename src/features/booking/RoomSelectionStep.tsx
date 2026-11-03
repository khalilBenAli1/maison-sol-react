import { Arrow } from '../../components/Icons';
import Photo from '../../components/Photo';
import { formatMoney } from '../../domain/money';
import type { Room } from '../../domain/types';
interface Props {
  availableRooms: Room[];
  selectedRoomId: string;
  error: string;
  onChoose: (id: string) => void;
  onNext: () => void;
  onBack: () => void;
}
export default function RoomSelectionStep({
  availableRooms,
  selectedRoomId,
  error,
  onChoose,
  onNext,
  onBack,
}: Props) {
  return (
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
            className={`booking-room-option ${selectedRoomId === candidate.id ? 'selected' : ''}`}
            key={candidate.id}
          >
            <Photo src={candidate.image} alt={candidate.name} sizes="160px" />
            <div>
              <span className="eyebrow">
                {candidate.sizeM2} m² · Up to {candidate.capacity} guests
              </span>
              <strong>{candidate.name}</strong>
              <span>
                {formatMoney(candidate.nightlyRate)} <small>/ night</small>
              </span>
            </div>
            <input
              type="radio"
              name="room"
              value={candidate.id}
              checked={selectedRoomId === candidate.id}
              onChange={() => onChoose(candidate.id)}
            />
          </label>
        ))}
      </fieldset>
      {!availableRooms.length && (
        <button className="button secondary" onClick={onBack}>
          Try different dates <Arrow />
        </button>
      )}
      {error && (
        <p className="field-error" role="alert">
          {error}
        </p>
      )}
      {availableRooms.length > 0 && (
        <div className="step-actions">
          <button className="button" onClick={onNext}>
            A few details <Arrow />
          </button>
          <button className="plain-button" onClick={onBack}>
            Change dates
          </button>
        </div>
      )}
    </>
  );
}
