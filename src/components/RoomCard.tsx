import { Link } from 'react-router';
import { usePreferences } from '../app/PreferencesContext';
import { formatMoney } from '../domain/money';
import type { Room } from '../domain/types';
import { Arrow, Heart } from './Icons';
import Photo from './Photo';

export default function RoomCard({
  room,
  compact = false,
}: {
  room: Room;
  compact?: boolean;
}) {
  const { preferences, toggleSaved } = usePreferences();
  const saved = preferences.savedRoomIds.includes(room.id);
  return (
    <article className={`room-card ${compact ? 'compact' : ''}`}>
      <div className="room-picture">
        <Link to={`/rooms/${room.slug}`} tabIndex={-1} aria-hidden="true">
          <Photo
            src={room.image}
            alt={`${room.name}, a warm Mediterranean interior`}
          />
        </Link>
        <span className="picture-label">{room.category}</span>
        <button
          className={`save-button ${saved ? 'is-saved' : ''}`}
          onClick={() => toggleSaved(room.id)}
          aria-label={`${saved ? 'Unsave' : 'Save'} ${room.name}`}
          aria-pressed={saved}
        >
          <Heart filled={saved} />
        </button>
      </div>
      <div className="room-meta">
        <span>
          {room.sizeM2} m² <span className="meta-dot">·</span> Up to{' '}
          {room.capacity} guests
        </span>
        <span>
          From {formatMoney(room.nightlyRate)} <small>/ night</small>
        </span>
      </div>
      <Link className="room-title" to={`/rooms/${room.slug}`}>
        <h3>{room.name}</h3>
        <Arrow />
      </Link>
      <p>{room.tagline}</p>
    </article>
  );
}
