import { useLocation, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { COMPTES_INITIAUX } from '../data/donnees-initiales';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Page demandée avant la redirection (bonus "retour à la destination")
  const from: unknown = location.state?.from;
  const destination =
    typeof from === 'string' && from.startsWith('/') && from !== '/login' ? from : '/catalogue';

  function seConnecter(compteId: number) {
    login(compteId);
    navigate(destination, { replace: true });
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