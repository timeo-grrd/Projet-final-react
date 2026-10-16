import { Link } from 'react-router';
import type { Equipement } from '../data/donnees-initiales';

type Props = { equipement: Equipement; disponible: boolean };

export function EquipementCard({ equipement, disponible }: Props) {
  return (
    <article className="carte">
        <h2>{equipement.nom}</h2>
        <p>{equipement.categorie}</p>
        <p>{equipement.localisation}</p>
        <span className={disponible ? 'badge disponible' : 'badge reserve'}>
          {disponible ? 'Disponible' : 'Réservé'}
        </span>
        <Link to={`/materiels/${equipement.id}`}>Voir la fiche</Link>
    </article>
  );
}