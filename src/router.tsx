import { createBrowserRouter } from 'react-router';
import { AppLayout } from './layouts/AppLayout';
import { RequireAuth } from './guards/RequireAuth';
import { RequireRole } from './guards/RequireRole';
import { RedirectionAccueil } from './pages/RedirectionAccueil';
import { LoginPage } from './pages/LoginPage';
import { CataloguePage } from './pages/CataloguePage';
import { MaterielDetailPage } from './pages/MaterielDetailPage';
import { MesReservationsPage } from './pages/MesReservationsPage';
import { AccesRefusePage } from './pages/AccesRefusePage';
import { NotFoundPage } from './pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      // --- Pages publiques ---
      { index: true, element: <RedirectionAccueil /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'acces-refuse', element: <AccesRefusePage /> },

      // --- Pages réservées aux utilisateurs connectés ---
      {
        element: <RequireAuth />,
        children: [
          { path: 'catalogue', element: <CataloguePage /> },
          { path: 'materiels/:id', element: <MaterielDetailPage /> },

          // --- Étudiant uniquement ---
          {
            element: <RequireRole role="student" />,
            children: [
              { path: 'mes-reservations', element: <MesReservationsPage /> },
            ],
          },

          // --- Responsable uniquement, chargé à la demande (lazy) ---
          {
            element: <RequireRole role="manager" />,
            children: [
              {
                path: 'gestion',
                lazy: async () => {
                  const m = await import('./pages/GestionPage');
                  return { Component: m.GestionPage };
                },
              },
              {
                path: 'gestion/nouveau',
                lazy: async () => {
                  const m = await import('./pages/NouveauMaterielPage');
                  return { Component: m.NouveauMaterielPage };
                },
              },
              {
                path: 'gestion/:id/modifier',
                lazy: async () => {
                  const m = await import('./pages/ModifierMaterielPage');
                  return { Component: m.ModifierMaterielPage };
                },
              },
            ],
          },
        ],
      },

      // --- Toute autre URL ---
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);