import { NavLink, Outlet, useNavigate } from 'react-router';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

export function AppLayout() {
  const { erreurStockage } = useData();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function seDeconnecter() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <>
      <header>
        <nav aria-label="Menu principal">
          <strong className="enseigne">Campus Matériel</strong>
          {user ? (
            <>
              <NavLink to="/catalogue">Catalogue</NavLink>
              {user.role === 'student' && <NavLink to="/mes-reservations">Mes réservations</NavLink>}
              {user.role === 'manager' && <NavLink to="/gestion">Gestion</NavLink>}
              <span>Connecté : {user.nom}</span>
              <button type="button" onClick={seDeconnecter}>Se déconnecter</button>
            </>
          ) : (
            <NavLink to="/login">Connexion</NavLink>
          )}
        </nav>
      </header>
      <main>
        {erreurStockage && <p role="alert">{erreurStockage}</p>}
        <Outlet />
      </main>
    </>
  );
}