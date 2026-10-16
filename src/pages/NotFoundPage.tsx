import { Link } from 'react-router';

export function NotFoundPage() {
  return (
    <>
      <h1>Page introuvable</h1>
      <p>Cette page n’existe pas.</p>
      <Link to="/">Retour à l’accueil</Link>
    </>
  );
}