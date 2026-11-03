import { lazy, Suspense, useEffect } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router';
import { PreferencesProvider } from './app/PreferencesProvider';
import { Header, Footer } from './components/Layout';
import Home from './pages/Home';
const Rooms = lazy(() => import('./pages/Rooms'));
const RoomDetail = lazy(() => import('./pages/RoomDetail'));
const Booking = lazy(() => import('./pages/Booking'));
const House = lazy(() => import('./pages/House'));
const FindUs = lazy(() => import('./pages/FindUs'));
function RouteEffects() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.getElementById('main-content')?.focus({ preventScroll: true });
    const title = pathname.startsWith('/rooms/')
      ? 'Your room'
      : ({
          '/': 'A slower kind of stay',
          '/rooms': 'The rooms',
          '/house': 'The house',
          '/booking': 'Book your stay',
          '/find-us': 'The setting',
        }[pathname] ?? 'A little off the path');
    document.title = `Maison Sol — ${title}`;
  }, [pathname]);
  return null;
}
export default function App() {
  const { pathname } = useLocation();
  return (
    <PreferencesProvider>
      <RouteEffects />
      <Header key={pathname} />
      <main id="main-content" tabIndex={-1}>
        <Suspense
          fallback={
            <div className="shell loading" role="status">
              <span className="loading-sun" />A moment of calm…
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/rooms/:slug" element={<RoomDetail />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/house" element={<House />} />
            <Route path="/find-us" element={<FindUs />} />
            <Route
              path="*"
              element={
                <div className="shell not-found">
                  <p className="eyebrow">A little off the path</p>
                  <h1>
                    Let’s find you
                    <br />
                    somewhere lovely.
                  </h1>
                  <p>This page isn’t part of the house.</p>
                  <Link to="/" className="button">
                    Back to Maison Sol
                  </Link>
                </div>
              }
            />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </PreferencesProvider>
  );
}
