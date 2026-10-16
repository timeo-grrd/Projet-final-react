import { Link, useParams } from 'react-router';
import { useData } from '../context/DataContext';

export function MaterielDetailPage() {
  const { id } = useParams();
  const { equipements, estDisponible } = useData();
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

  return (
    <>
      <h1>{equipement.nom}</h1>
      <p><strong>Catégorie :</strong> {equipement.categorie}</p>
      <p><strong>Description :</strong> {equipement.description}</p>
      <p><strong>Localisation :</strong> {equipement.localisation}</p>
      <p>
        <strong>État :</strong>{' '}
        <span className={disponible ? 'badge disponible' : 'badge reserve'}>
          {disponible ? 'Disponible' : 'Réservé'}
        </span>
      </p>
      {/* Le bouton Réserver viendra à l'étape 5 */}
      <Link to="/catalogue">Retour au catalogue</Link>
    </>
  );
}