import { NavLink, Outlet } from 'react-router';
import { useData } from '../context/DataContext';

export function AppLayout() {
  const { erreurStockage } = useData();

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
        {erreurStockage && <p role="alert">{erreurStockage}</p>}
        <Outlet />
      </main>
    </>
  );
}