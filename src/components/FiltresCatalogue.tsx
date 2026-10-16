import { CATEGORIES } from '../data/donnees-initiales';

type Props = {
  recherche: string;
  categorie: string;
  onRechercheChange: (valeur: string) => void;
  onCategorieChange: (valeur: string) => void;
};

export function FiltresCatalogue({ recherche, categorie, onRechercheChange, onCategorieChange }: Props) {
  return (
    <div className="filtres">
      <label htmlFor="recherche">Rechercher par nom</label>
      <input id="recherche" type="search" value={recherche}
        onChange={e => onRechercheChange(e.target.value)} />

        <label htmlFor="categorie">Filtrer par catégorie</label>
        <select id="categorie" value={categorie} onChange={e => onCategorieChange(e.target.value)}>
          <option value="">Toutes les catégories</option>
          {CATEGORIES.map(c => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
    </div>
  );
}