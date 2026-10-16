import { createBrowserRouter, Navigate } from 'react-router';
import { AppLayout } from './layouts/AppLayout';
import { LoginPage } from './pages/LoginPage';
import { CataloguePage } from './pages/CataloguePage';
import { MaterielDetailPage } from './pages/MaterielDetailPage';
import { MesReservationsPage } from './pages/MesReservationsPage';
import { GestionPage } from './pages/GestionPage';
import { NouveauMaterielPage } from './pages/NouveauMaterielPage';
import { ModifierMaterielPage } from './pages/ModifierMaterielPage';
import { AccesRefusePage } from './pages/AccesRefusePage';
import { NotFoundPage } from './pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/catalogue" replace /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'catalogue', element: <CataloguePage /> },
      { path: 'materiels/:id', element: <MaterielDetailPage /> },
      { path: 'mes-reservations', element: <MesReservationsPage /> },
      { path: 'gestion', element: <GestionPage /> },
      { path: 'gestion/nouveau', element: <NouveauMaterielPage /> },
      { path: 'gestion/:id/modifier', element: <ModifierMaterielPage /> },
      { path: 'acces-refuse', element: <AccesRefusePage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);