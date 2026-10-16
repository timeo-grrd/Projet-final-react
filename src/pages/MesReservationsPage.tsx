import { Link } from 'react-router';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

export function MesReservationsPage() {
  const { equipements, reservations, annuler } = useData();
  const { user } = useAuth();
  if (!user) return null; // le guard l'empêche déjà, c'est une sécurité pour TS


  const mesReservations = reservations.filter(r => r.etudiantId === user.id);

  return (
    <>
      <h1>Mes réservations</h1>
      {mesReservations.length === 0 ? (
        <p role="status">Vous n’avez aucune réservation en cours.</p>
      ) : (
        <ul className="talons">
          {mesReservations.map(r => {
            const equipement = equipements.find(e => e.id === r.equipementId);
            return (
              <li key={r.id}>
                {equipement ? (
                  <>
                    <strong>{equipement.nom}</strong> ({equipement.categorie})
                    <Link to={`/materiels/${r.equipementId}`}>Voir les détails</Link>
                    <button type="button" onClick={() => annuler(r.id, user.id)}>Annuler</button>
                  </>
                ) : (
                  <p>Équipement inconnu</p>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}