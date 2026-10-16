import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';

export function RequireAuth() {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) {
    // On mémorise la page demandée pour y revenir après connexion
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return <Outlet />;
}