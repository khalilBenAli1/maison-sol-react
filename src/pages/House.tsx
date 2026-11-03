import { Link } from 'react-router';
import Photo from '../components/Photo';
import { Arrow, Sun } from '../components/Icons';
export default function House() {
  return (
    <>
      <section className="shell editorial-opening">
        <p className="eyebrow">The house · A rhythm of its own</p>
        <h1>
          Nothing to rush.
          <br />
          <em>Everything to feel.</em>
        </h1>
        <div className="editorial-photo">
          <Photo
            src="/images/hotel-hero.webp"
            alt="The limestone house, shaded terrace and pool above the sea"
            priority
            sizes="100vw"
          />
          <span className="picture-label">
            Maison Sol <Sun />
          </span>
        </div>
      </section>
      <section className="section shell house-story">
        <p className="eyebrow">A day, gently unfolding</p>
        <div>
          <h2>
            Come for the view.
            <br />
            <em>Stay for the feeling.</em>
          </h2>
          <p>
            A small, imagined hideaway above a Mediterranean cove. Built around
            warm stone, open doors and the simple pleasure of doing very little.
          </p>
          <p>
            There is no itinerary to keep up with. Just a shaded table for
            breakfast, water bright enough to tempt you in, and a favourite
            corner that becomes yours.
          </p>
        </div>
      </section>
      <section className="rituals-section shell">
        {[
          {
            time: '08:30',
            title: 'Morning, your way.',
            text: 'Fresh bread, seasonal fruit and coffee on the terrace. Stay for another cup.',
            image: '/images/garden-studio.webp',
          },
          {
            time: '14:00',
            title: 'Follow the light.',
            text: 'A few quiet lengths. An afternoon in the shade. The sea can wait until you’re ready.',
            image: '/images/hotel-hero.webp',
          },
          {
            time: '19:30',
            title: 'Let the evening linger.',
            text: 'The doors are open, the light is soft, and there’s nowhere else you need to be.',
            image: '/images/terrace-suite.webp',
          },
        ].map((ritual, index) => (
          <article
            key={ritual.time}
            className={`ritual ${index % 2 ? 'reverse' : ''}`}
          >
            <Photo src={ritual.image} alt={ritual.title} />
            <div>
              <p className="eyebrow">{ritual.time} · At your own pace</p>
              <h2>{ritual.title}</h2>
              <p>{ritual.text}</p>
            </div>
          </article>
        ))}
      </section>
      <section className="setting-invitation shell">
        <Sun />
        <p className="eyebrow">Make room for a slower day</p>
        <h2>
          Your corner
          <br />
          <em>of the house.</em>
        </h2>
        <Link className="text-link" to="/rooms">
          Find your room <Arrow />
        </Link>
      </section>
    </>
  );
}
