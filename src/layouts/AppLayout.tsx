import { NavLink, Outlet } from 'react-router';

export function AppLayout() {
  return (
    <>
      <header>
        <nav aria-label="Menu principal">
          <NavLink to="/catalogue">Catalogue</NavLink>
          <NavLink to="/mes-reservations">Mes réservations</NavLink>
          <NavLink to="/gestion">Gestion</NavLink>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}