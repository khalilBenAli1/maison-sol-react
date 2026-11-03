import { Link } from 'react-router';
import { Arrow, Sun } from '../components/Icons';
import Photo from '../components/Photo';
export default function FindUs() {
  return (
    <div className="shell find-page">
      <div className="collection-heading">
        <div>
          <p className="eyebrow">The setting · A little away from it all</p>
          <h1>
            Follow the coast.
            <br />
            <em>Find your quiet.</em>
          </h1>
        </div>
        <p>
          Above a sheltered cove, between olive groves and open water. A
          Mediterranean setting imagined for unhurried days.
        </p>
      </div>
      <div className="find-layout">
        <div className="setting-map">
          <svg
            viewBox="0 0 600 620"
            role="img"
            aria-label="An illustrative coastal setting with an olive grove, the house and a cove"
          >
            <rect width="600" height="620" fill="#dee5db" />
            <path
              d="M0 0h360c-60 85 10 110-40 190-40 65 45 115-20 180-80 80 40 130-50 250H0Z"
              fill="#ebe6d6"
            />
            <path
              d="M205-10c-12 75 66 120 8 193-45 56 60 129-10 197-50 48 24 126-20 631"
              stroke="#b5a887"
              strokeWidth="3"
              strokeDasharray="7 9"
              fill="none"
            />
            {[
              [80, 70],
              [110, 120],
              [60, 180],
              [160, 220],
              [85, 290],
              [150, 370],
              [60, 440],
              [140, 540],
            ].map(([x, y]) => (
              <g key={`${x},${y}`}>
                <ellipse cx={x} cy={y} rx="15" ry="10" fill="#b7bea4" />
                <path d={`M${x} ${y + 5}v15`} stroke="#9e9f7e" />
              </g>
            ))}
            <path d="M244 261h52v45h-52z" fill="#173e39" />
            <path
              d="m237 262 33-24 33 24"
              stroke="#173e39"
              strokeWidth="3"
              fill="none"
            />
            <circle
              cx="270"
              cy="283"
              r="52"
              stroke="#173e39"
              strokeOpacity=".35"
              fill="none"
            />
            <text
              x="330"
              y="287"
              fill="#173e39"
              fontSize="20"
              fontFamily="Georgia"
            >
              Maison Sol
            </text>
            <text
              x="350"
              y="460"
              fill="#627e79"
              fontSize="18"
              fontFamily="Georgia"
              fontStyle="italic"
            >
              The Mediterranean
            </text>
            <text
              x="35"
              y="575"
              fill="#72745d"
              fontSize="12"
              fontFamily="sans-serif"
              letterSpacing="2"
            >
              THE OLIVE GROVE
            </text>
            <path d="M535 52v45m-9-25 9-20 9 20" fill="none" stroke="#173e39" />
            <text x="530" y="42" fontSize="12" fill="#173e39">
              N
            </text>
          </svg>
          <p>Illustrative setting · Not a navigation map</p>
        </div>
        <div className="find-copy">
          <Sun />
          <h2>
            Close enough.
            <br />
            <em>Far enough away.</em>
          </h2>
          <p>
            Walk from the garden to the pool. Find a shaded place for lunch. Let
            the afternoon take you down to the water.
          </p>
          <dl>
            <div>
              <dt>The coast</dt>
              <dd>A sheltered cove and a wide horizon</dd>
            </div>
            <div>
              <dt>The house</dt>
              <dd>Four thoughtful stays, one easy rhythm</dd>
            </div>
            <div>
              <dt>Your arrival</dt>
              <dd>From 15:00. A slower day starts here.</dd>
            </div>
          </dl>
          <Link to="/booking" className="text-link">
            Imagine your stay <Arrow />
          </Link>
          <p className="sample-note">
            Maison Sol is a fictional property created for this experience. It
            has no physical address.
          </p>
        </div>
      </div>
      <div className="setting-photo">
        <Photo
          src="/images/hotel-hero.webp"
          alt="The last light of the day over the pool and Mediterranean coast"
          sizes="100vw"
        />
      </div>
    </div>
  );
}
