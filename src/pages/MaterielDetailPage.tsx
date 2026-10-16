import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

export function MaterielDetailPage() {
  const { id } = useParams();
  const { equipements, reservations, estDisponible, reserver } = useData();
  const { user } = useAuth();
  const [message, setMessage] = useState<string | null>(null);

  const equipement = equipements.find(e => e.id === Number(id));

  if (!equipement) {
    return (
      <>
        <h1>Équipement introuvable</h1>
        <p>Aucun équipement ne correspond à l’identifiant « {id} ».</p>
        <Link to="/catalogue">Retour au catalogue</Link>
      </>
    );
  }

  const disponible = estDisponible(equipement.id);
  const reservation = reservations.find(r => r.equipementId === equipement.id);
  const reserveParMoi = reservation !== undefined && reservation.etudiantId === user?.id;

  function handleReserver() {
    if (!user || !equipement) return;
    // Le contexte revérifie la disponibilité : renvoie null si OK, sinon un message
    const erreur = reserver(equipement.id, user.id);
    setMessage(erreur ?? 'Réservation enregistrée.');
  }

  return (
    <>
      <p><Link to="/catalogue">Retour au catalogue</Link></p>

      <article className="fiche">
        <p className="numero">N° {equipement.id}</p>
        <h1>{equipement.nom}</h1>
        <span className={disponible ? 'badge disponible' : 'badge reserve'}>
          {disponible ? 'Disponible' : 'Réservé'}
        </span>

        <dl>
          <dt>Catégorie</dt><dd>{equipement.categorie}</dd>
          <dt>Description</dt><dd>{equipement.description}</dd>
          <dt>Localisation</dt><dd>{equipement.localisation}</dd>
        </dl>

        {user?.role === 'student' && (
          <section aria-label="Réservation">
            {disponible && (
              <button type="button" onClick={handleReserver}>Réserver</button>
            )}
            {reserveParMoi && (
              <p>
                Vous avez réservé cet équipement.{' '}
                <Link to="/mes-reservations">Voir mes réservations</Link>
              </p>
            )}
            {!disponible && !reserveParMoi && (
              <>
                <button type="button" disabled>Réserver</button>
                <p>Cet équipement est déjà réservé par un autre étudiant.</p>
              </>
            )}
          </section>
        )}

        {user?.role === 'manager' && (
          <p>
            La réservation est réservée aux étudiants.{' '}
            <Link to={`/gestion/${equipement.id}/modifier`}>Modifier cette fiche</Link>
          </p>
        )}

        {message && <p role="status">{message}</p>}
      </article>
    </>
  );
}
