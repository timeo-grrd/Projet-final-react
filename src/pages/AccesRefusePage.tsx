import { Link } from 'react-router';

export function AccesRefusePage() {
  return (
    <>
      <h1>Accès refusé</h1>
      <p>Votre profil ne permet pas d’accéder à cette page.</p>
      <Link to="/">Retour à l’accueil</Link>
    </>
  );
}