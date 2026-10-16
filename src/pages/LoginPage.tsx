import { useLocation, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { COMPTES_INITIAUX, type Role } from '../data/donnees-initiales';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Page demandée avant la redirection (bonus "retour à la destination")
  const from: unknown = location.state?.from;

  // Le retour ne donne aucun droit : si la page demandée n'est pas
  // accessible avec ce rôle (ex. /gestion pour un étudiant), on va au catalogue.
  function destinationPour(role: Role): string {
    if (typeof from !== 'string' || !from.startsWith('/') || from === '/login') return '/catalogue';
    if (from.startsWith('/gestion') && role !== 'manager') return '/catalogue';
    if (from.startsWith('/mes-reservations') && role !== 'student') return '/catalogue';
    return from;
  }

  function seConnecter(compteId: number) {
    const compte = COMPTES_INITIAUX.find(c => c.id === compteId);
    if (!compte) return;
    login(compte.id);
    navigate(destinationPour(compte.role), { replace: true });
  }

  return (
    <>
      <h1>Connexion</h1>
      <p>Choisissez un compte de démonstration (connexion simulée, sans mot de passe).</p>
      <div className="badges">
        {COMPTES_INITIAUX.map(c => (
          <button
            key={c.id}
            type="button"
            className={`carte-acces ${c.role}`}
            onClick={() => seConnecter(c.id)}
            aria-label={`Se connecter en tant que ${c.nom}`}
          >
            <span className="initiales" aria-hidden="true">
              {c.nom.split(' ').map(mot => mot[0]).join('')}
            </span>
            <span className="nom">{c.nom}</span>
            <span className="role">{c.role === 'student' ? 'Étudiant' : 'Responsable'}</span>
          </button>
        ))}
      </div>
    </>
  );
}