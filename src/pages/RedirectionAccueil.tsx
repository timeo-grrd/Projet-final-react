import { Navigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

export function RedirectionAccueil() {
  const { user } = useAuth();
  return <Navigate to={user ? '/catalogue' : '/login'} replace />;
}