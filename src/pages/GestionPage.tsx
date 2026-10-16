import { useState } from 'react';
import { Link } from 'react-router';
import { useData } from '../context/DataContext';

export function GestionPage() {
  const { equipements, estDisponible, supprimerEquipement } = useData();
  const [message, setMessage] = useState<string | null>(null);

  function handleSupprimer(id: number, nom: string) {
    if (!window.confirm(`Supprimer « ${nom} » ? Cette action est définitive.`)) return;
    const erreur = supprimerEquipement(id);
    setMessage(erreur ?? `« ${nom} » a été supprimé.`);
  }

  return (
    <>
      <h1>Gestion du catalogue</h1>
      <p><Link to="/gestion/nouveau">+ Nouveau matériel</Link></p>
      {message && <p role="status">{message}</p>}

      {equipements.length === 0 ? (
        <p>Le catalogue est vide.</p>
      ) : (
        <table>
          <thead>
            <tr><th>Nom</th><th>Catégorie</th><th>État</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {equipements.map(e => (
              <tr key={e.id}>
                <td>{e.nom}</td>
                <td>{e.categorie}</td>
                <td>{estDisponible(e.id) ? 'Disponible' : 'Réservé'}</td>
                <td>
                  <Link to={`/gestion/${e.id}/modifier`}>Modifier</Link>
                  <button type="button" onClick={() => handleSupprimer(e.id, e.nom)}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}