import { Link } from 'react-router';
import { rooms } from '../data/rooms';
import Photo from '../components/Photo';
import RoomCard from '../components/RoomCard';
import { Arrow, Sun } from '../components/Icons';
import { AvailabilityBar } from '../components/DateRange';
export default function Home() {
  return (
    <>
      <section className="home-opening shell">
        <div className="hero-copy">
          <p className="eyebrow">Somewhere to slow down</p>
          <h1>
            A slower
            <br />
            kind of <em>stay.</em>
          </h1>
          <p className="hero-description">
            Thoughtful rooms. Easy mornings.
            <br className="desktop-break" /> A place to feel away.
          </p>
          <Link to="/rooms" className="text-link">
            Explore the rooms <Arrow />
          </Link>
          <p className="hero-footnote">
            <span className="tiny-sun">✳</span> Made for unhurried days
          </p>
        </div>
        <div className="hero-image">
          <Photo
            priority
            src="/images/hotel-hero.webp"
            alt="A sunlit limestone house and infinity pool overlooking the Mediterranean"
            sizes="(max-width: 700px) 100vw, 64vw"
          />
          <Link className="picture-label" to="/house">
            The house <Arrow />
          </Link>
          <Sun className="hero-sun" />
          <span className="image-caption">
            WHERE THE DAY FINDS ITS OWN RHYTHM
          </span>
        </div>
        <div className="hero-availability">
          <AvailabilityBar />
        </div>
      </section>
      <section className="section shell">
        <div className="section-heading">
          <div>
            <p className="eyebrow">A room for your kind of day</p>
            <h2>
              Settle in.
              <br />
              <em>Stay a little.</em>
            </h2>
          </div>
          <div className="section-intro">
            <p>
              Natural textures, quiet corners, and all the space you need to do
              a little less. Find the room that feels like you.
            </p>
            <Link to="/rooms" className="text-link">
              Discover all four stays <Arrow />
            </Link>
          </div>
        </div>
        <div className="room-preview-grid">
          {[rooms[0], rooms[1]].map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </section>
      <section className="house-feature">
        <div className="house-feature-image">
          <Photo
            src="/images/garden-studio.webp"
            alt="Open garden doors, warm stone and a quiet place to read"
            sizes="(max-width: 700px) 100vw, 55vw"
          />
        </div>
        <div className="house-feature-copy">
          <p className="eyebrow">Life at Maison Sol</p>
          <h2>
            Less on the agenda.
            <br />
            <em>More in the moment.</em>
          </h2>
          <p>
            Breakfast that becomes lunch. A book left open by the pool. The kind
            of place where the best plan is no plan at all.
          </p>
          <div className="house-rituals">
            <span>
              01 <span>Slow mornings</span>
            </span>
            <span>
              02 <span>Saltwater afternoons</span>
            </span>
            <span>
              03 <span>Long golden evenings</span>
            </span>
          </div>
          <Link to="/house" className="text-link light">
            A day at the house <Arrow />
          </Link>
        </div>
      </section>
      <section className="setting-invitation shell">
        <Sun />
        <p className="eyebrow">Olive groves. Sea air. Room to breathe.</p>
        <h2>
          Some places ask you
          <br />
          to do more.
          <br />
          <em>This one lets you be.</em>
        </h2>
        <Link to="/find-us" className="text-link">
          Find your way here <Arrow />
        </Link>
      </section>
    </>
  );
}
