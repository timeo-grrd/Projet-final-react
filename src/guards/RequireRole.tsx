import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../context/AuthContext';
import type { Role } from '../data/donnees-initiales';

export function RequireRole({ role }: { role: Role }) {
  const { user } = useAuth();
  return user?.role === role ? <Outlet /> : <Navigate to="/acces-refuse" replace />;
}