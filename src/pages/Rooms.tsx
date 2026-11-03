import { rooms } from '../data/rooms';
import { defaultFilters, filterRooms } from '../domain/filters';
import { formatMoney } from '../domain/money';
import { usePreferences } from '../app/PreferencesContext';
import RoomCard from '../components/RoomCard';
import useRoomFilters from '../features/catalog/useRoomFilters';
import { Arrow, Heart } from '../components/Icons';
export default function Rooms() {
  const { filters, change, resetFilters } = useRoomFilters();
  const { preferences } = usePreferences();
  const matching = filterRooms(rooms, filters, preferences.savedRoomIds);
  return (
    <div className="shell collection-page">
      <div className="collection-heading">
        <div>
          <p className="eyebrow">The rooms · Four ways to feel away</p>
          <h1>
            Find your
            <br />
            <em>kind of quiet.</em>
          </h1>
        </div>
        <p>
          For the early riser, the late breakfast, the just-one-more-night.
          Thoughtfully different, comfortably yours.
        </p>
      </div>
      <div className="collection-toolbar">
        <label>
          Guests
          <select
            value={filters.capacity}
            onChange={(event) => change('capacity', event.target.value)}
          >
            <option value="1">Any number</option>
            <option value="2">2 guests</option>
            <option value="3">3 guests</option>
            <option value="4">4 guests</option>
          </select>
        </label>
        <label>
          A little extra
          <select
            value={filters.amenity}
            onChange={(event) => change('amenity', event.target.value)}
          >
            <option value="">All amenities</option>
            {['Sea view', 'Garden view', 'Private terrace', 'Kitchenette'].map(
              (amenity) => (
                <option key={amenity}>{amenity}</option>
              ),
            )}
          </select>
        </label>
        <label className="price-filter">
          Up to {formatMoney(filters.maxPrice)} / night
          <input
            aria-label="Maximum nightly price"
            type="range"
            min="20000"
            max="60000"
            step="1000"
            value={filters.maxPrice}
            onChange={(event) => change('maxPrice', event.target.value)}
          />
        </label>
        <button
          className={`saved-filter ${filters.saved ? 'active' : ''}`}
          aria-pressed={filters.saved}
          onClick={() => change('saved', filters.saved ? '' : 'true')}
        >
          <Heart filled={filters.saved} /> Saved (
          {preferences.savedRoomIds.length})
        </button>
      </div>
      <div className="collection-results">
        <p role="status">
          {matching.length} {matching.length === 1 ? 'stay' : 'stays'} to settle
          into
        </p>
        <div>
          <button className="plain-button" onClick={resetFilters}>
            Reset filters
          </button>
          <label className="sort-filter">
            Sort by
            <select
              aria-label="Sort rooms"
              value={filters.sort}
              onChange={(event) =>
                change(
                  'sort',
                  event.target.value === defaultFilters.sort
                    ? ''
                    : event.target.value,
                )
              }
            >
              <option value="recommended">Our favourites</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
            </select>
          </label>
        </div>
      </div>
      {matching.length ? (
        <div className="room-collection-grid">
          {matching.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p className="eyebrow">A little room to change your mind</p>
          <h2>
            {filters.saved
              ? 'Your favourites are waiting to be found.'
              : 'A different view might be just right.'}
          </h2>
          <p>
            {filters.saved
              ? 'Tap a heart on a room you love, and find it here.'
              : 'Try another amenity, a higher budget, or fewer guests.'}
          </p>
          <button className="button" onClick={resetFilters}>
            Explore all rooms <Arrow />
          </button>
        </div>
      )}
      <p className="sample-note">
        Nightly prices and availability are illustrative. Breakfast is included;
        sample fees appear in your stay summary.
      </p>
    </div>
  );
}
