import { useState } from 'react';
import { Link, NavLink } from 'react-router';
import { usePreferences } from '../app/PreferencesContext';
import { Arrow, Heart, Sun } from './Icons';
import Modal from './Modal';

export function Header() {
  const [menu, setMenu] = useState(false);
  const { preferences } = usePreferences();
  const links = (
    <>
      <NavLink to="/rooms">The rooms</NavLink>
      <NavLink to="/house">The house</NavLink>
      <NavLink to="/find-us">Find us</NavLink>
    </>
  );
  return (
    <>
      <a
        className="skip-link"
        href="#main-content"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById('main-content')?.focus();
        }}
      >
        Skip to content
      </a>
      <header className="site-header shell">
        <Link to="/" className="wordmark" aria-label="Maison Sol home">
          Maison Sol<span>THE MEDITERRANEAN, AT YOUR PACE</span>
        </Link>
        <nav className="desktop-nav" aria-label="Main">
          {links}
        </nav>
        <div className="header-actions">
          <Link
            to="/rooms?saved=true"
            className="saved-link"
            aria-label={`Saved rooms, ${preferences.savedRoomIds.length}`}
          >
            <Heart filled={preferences.savedRoomIds.length > 0} />
            <span>{preferences.savedRoomIds.length || ''}</span>
          </Link>
          <Link to="/booking" className="button header-book">
            Book your stay <Arrow />
          </Link>
          <button
            className="menu-button icon-button"
            aria-label="Open menu"
            onClick={() => setMenu(true)}
          >
            <span />
            <span />
          </button>
        </div>
      </header>
      <Modal
        open={menu}
        onClose={() => setMenu(false)}
        title="Take your time"
        className="menu-modal"
      >
        <nav aria-label="Mobile" onClick={() => setMenu(false)}>
          {links}
          <Link to="/rooms?saved=true">
            Saved rooms ({preferences.savedRoomIds.length})
          </Link>
          <Link to="/booking" className="button">
            Book your stay <Arrow />
          </Link>
        </nav>
        <Sun />
      </Modal>
    </>
  );
}

export function Footer() {
  const { reset } = usePreferences();
  const [resetOpen, setResetOpen] = useState(false);
  const [notice, setNotice] = useState('');
  return (
    <>
      <footer className="site-footer">
        <div className="shell">
          <div className="footer-top">
            <div>
              <p className="eyebrow">A little further from the everyday</p>
              <Link to="/booking" className="footer-invitation">
                See you under
                <br />
                <em>the sun.</em>
                <Arrow />
              </Link>
            </div>
            <Sun className="footer-sun" />
            <div className="footer-links">
              <Link to="/rooms">Find your room</Link>
              <Link to="/house">Life at the house</Link>
              <Link to="/find-us">The setting</Link>
              <button onClick={() => setResetOpen(true)}>
                Reset my stay & saved rooms
              </button>
              <span role="status">{notice}</span>
            </div>
          </div>
          <div className="footer-bottom">
            <Link to="/" className="wordmark">
              Maison Sol
            </Link>
            <p>An original hotel demo. All stays are simulated.</p>
            <span>Slow days. Lasting impressions.</span>
          </div>
        </div>
      </footer>
      <Modal
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        title="A fresh start?"
      >
        <p>This clears your stay dates and saved rooms on this device.</p>
        <div className="modal-actions">
          <button
            className="button secondary"
            onClick={() => setResetOpen(false)}
          >
            Keep my choices
          </button>
          <button
            className="button"
            onClick={() => {
              reset();
              setResetOpen(false);
              setNotice('Your choices have been reset.');
            }}
          >
            Reset my choices
          </button>
        </div>
      </Modal>
    </>
  );
}
