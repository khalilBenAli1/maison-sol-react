import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { findRoom, rooms } from '../data/rooms';
import { usePreferences } from '../app/PreferencesContext';
import { formatMoney } from '../domain/money';
import { Arrow, Heart } from '../components/Icons';
import Photo from '../components/Photo';
import Modal from '../components/Modal';
import RoomCard from '../components/RoomCard';
export default function RoomDetail() {
  const { slug = '' } = useParams();
  const room = findRoom(slug);
  const { preferences, toggleSaved, updateDraft } = usePreferences();
  const [gallery, setGallery] = useState<number | null>(null);
  if (!room)
    return (
      <div className="shell not-found">
        <h1>
          A room
          <br />
          yet to be found.
        </h1>
        <Link className="button" to="/rooms">
          Explore the rooms
        </Link>
      </div>
    );
  const saved = preferences.savedRoomIds.includes(room.id);
  const captions = [room.name, 'The house & pool · shared outdoor spaces'];
  return (
    <>
      <section className="shell room-detail">
        <Link to="/rooms" className="back-link">
          ← The rooms
        </Link>
        <div className="detail-heading">
          <div>
            <p className="eyebrow">
              {room.category} · {room.highlight}
            </p>
            <h1>{room.name}</h1>
          </div>
          <button
            className="text-link save-detail"
            aria-pressed={saved}
            onClick={() => toggleSaved(room.id)}
          >
            <Heart filled={saved} />{' '}
            {saved ? 'Saved to your favourites' : 'Save this room'}
          </button>
        </div>
        <button
          className="detail-hero"
          aria-label={`Open ${room.name} gallery`}
          onClick={() => setGallery(0)}
        >
          <Photo
            src={room.image}
            alt={`${room.name}: natural textures and warm Mediterranean light`}
            priority
            sizes="100vw"
          />
          <span className="picture-label">
            Take a closer look <Arrow />
          </span>
        </button>
        <div className="detail-body">
          <div>
            <p className="room-specs">
              {room.sizeM2} m² <span>·</span> Up to {room.capacity} guests{' '}
              <span>·</span> Breakfast included
            </p>
            <h2>{room.tagline}</h2>
            <p className="detail-description">{room.description}</p>
            <h3 className="small-serif">The little things, considered.</h3>
            <ul className="amenities">
              {room.amenities.map((item) => (
                <li key={item}>
                  <span>✳</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="stay-details">
              <h3>Good to know</h3>
              <p>Arrive from 15:00 · Leave by 11:00</p>
              <p>All ages welcome. Maximum stay: 30 nights.</p>
              <p>
                Room photos are original illustrations of this fictional
                property.
              </p>
            </div>
          </div>
          <aside className="room-booking-card">
            <p className="eyebrow">Make yourself at home</p>
            <p className="detail-price">
              {formatMoney(room.nightlyRate)} <span>/ night, from</span>
            </p>
            <p>A quiet corner, ready when you are.</p>
            <Link
              to="/booking"
              className="button"
              onClick={() =>
                updateDraft({
                  roomId: room.id,
                  guests: Math.min(preferences.draft.guests, room.capacity),
                })
              }
            >
              Choose your dates <Arrow />
            </Link>
            <span className="sample-note">
              Explore a simulated stay. No payment needed.
            </span>
          </aside>
        </div>
      </section>
      <section className="shell section related-rooms">
        <div className="section-heading">
          <div>
            <p className="eyebrow">A little more to discover</p>
            <h2>
              Another way
              <br />
              <em>to stay.</em>
            </h2>
          </div>
        </div>
        <div className="room-preview-grid">
          {rooms
            .filter((other) => other.id !== room.id)
            .slice(0, 2)
            .map((other) => (
              <RoomCard key={other.id} room={other} />
            ))}
        </div>
      </section>
      <Modal
        open={gallery !== null}
        onClose={() => setGallery(null)}
        title="A closer look"
        className="gallery-modal"
      >
        <div
          onKeyDown={(event) => {
            if (event.key === 'ArrowRight' || event.key === 'ArrowLeft')
              setGallery(
                (previous) => ((previous ?? 0) + 1) % room.gallery.length,
              );
          }}
        >
          <Photo
            src={room.gallery[gallery ?? 0]}
            alt={captions[gallery ?? 0]}
            priority
            sizes="90vw"
          />
          <div className="gallery-controls">
            <button
              className="icon-button"
              aria-label="Previous photograph"
              onClick={() =>
                setGallery(
                  (previous) =>
                    ((previous ?? 0) + room.gallery.length - 1) %
                    room.gallery.length,
                )
              }
            >
              <Arrow style={{ transform: 'rotate(180deg)' }} />
            </button>
            <p aria-live="polite">
              {(gallery ?? 0) + 1} / {room.gallery.length} ·{' '}
              {captions[gallery ?? 0]}
            </p>
            <button
              className="icon-button"
              aria-label="Next photograph"
              onClick={() =>
                setGallery(
                  (previous) => ((previous ?? 0) + 1) % room.gallery.length,
                )
              }
            >
              <Arrow />
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
