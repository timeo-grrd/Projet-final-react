import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Compte } from '../data/donnees-initiales';
import { COMPTES_INITIAUX } from '../data/donnees-initiales';

const CLE_SESSION = 'cm-session';

type AuthContextValue = {
  user: Compte | null;
  login: (compteId: number) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

// Lit l'id stocké et retrouve le compte correspondant (ou null)
function lireSession(): Compte | null {
  try {
    const brut = localStorage.getItem(CLE_SESSION);
    if (brut === null) return null;
    return COMPTES_INITIAUX.find(c => c.id === Number(brut)) ?? null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Compte | null>(lireSession);

  function login(compteId: number) {
    const compte = COMPTES_INITIAUX.find(c => c.id === compteId) ?? null;
    setUser(compte);
    try {
      if (compte) localStorage.setItem(CLE_SESSION, String(compte.id));
    } catch {
      // stockage indisponible : la session reste en mémoire seulement
    }
  }

  function logout() {
    setUser(null);
    try {
      localStorage.removeItem(CLE_SESSION);
    } catch {
      // rien à faire
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit être utilisé dans AuthProvider');
  return ctx;
}