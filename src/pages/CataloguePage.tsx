import { useState } from 'react';
import { useData } from '../context/DataContext';
import { EquipementCard } from '../components/EquipementCard';
import { FiltresCatalogue } from '../components/FiltresCatalogue';

export function CataloguePage() {
  const { equipements, estDisponible } = useData();
  const [recherche, setRecherche] = useState('');
  const [categorie, setCategorie] = useState('');

  const texte = recherche.trim().toLowerCase();
  const resultats = equipements.filter(e =>
    e.nom.toLowerCase().includes(texte) && (categorie === '' || e.categorie === categorie)
  );

  return (
    <>
      <h1>Catalogue</h1>
      <FiltresCatalogue
        recherche={recherche}
        categorie={categorie}
        onRechercheChange={setRecherche}
        onCategorieChange={setCategorie}
      />
      {resultats.length === 0 ? (
        <p role="status">Aucun équipement ne correspond à vos critères.</p>
      ) : (
        <div className="grille">
          {resultats.map(e => <EquipementCard key={e.id} equipement={e} disponible={estDisponible(e.id)} />)}
        </div>
      )}
    </>
  );
}