import { useState, type FormEvent } from 'react';
import { CATEGORIES, type Categorie } from '../data/donnees-initiales';
import type { DonneesEquipement } from '../context/DataContext';

// Dans le formulaire, la catégorie peut être vide ('') tant que rien n'est choisi
type Valeurs = { nom: string; categorie: string; description: string; localisation: string };
type Erreurs = Partial<Record<keyof Valeurs, string>>;

type Props = {
  initial?: DonneesEquipement;
  libelleBouton: string;
  onSubmit: (donnees: DonneesEquipement) => void;
};

const VIDE: Valeurs = { nom: '', categorie: '', description: '', localisation: '' };

function valider(v: Valeurs): Erreurs {
  const erreurs: Erreurs = {};
  if (v.nom.trim().length < 3) erreurs.nom = 'Le nom doit contenir au moins 3 caractères.';
  if (!v.categorie) erreurs.categorie = 'Choisissez une catégorie.';
    if (v.description.trim().length < 10) erreurs.description = 'La description doit contenir au moins 10 caractères.';
    if (v.localisation.trim().length === 0) erreurs.localisation = 'La localisation est obligatoire.';
  return erreurs;
}

export function EquipementForm({ initial, libelleBouton, onSubmit }: Props) {
  const [valeurs, setValeurs] = useState<Valeurs>(initial ?? VIDE);
  const [erreurs, setErreurs] = useState<Erreurs>({});

  // Met à jour un champ et efface son erreur
  function changer(champ: keyof Valeurs, valeur: string) {
    setValeurs(v => ({ ...v, [champ]: valeur }));
    setErreurs(e => ({ ...e, [champ]: undefined }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const nouvellesErreurs = valider(valeurs);
    if (Object.keys(nouvellesErreurs).length > 0) {
      setErreurs(nouvellesErreurs); // les valeurs saisies restent dans les champs
      return;
    }
    onSubmit({
      nom: valeurs.nom.trim(),
      categorie: valeurs.categorie as Categorie,
      description: valeurs.description.trim(),
      localisation: valeurs.localisation.trim(),
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div>
        <label htmlFor="nom">Nom</label>
        <input id="nom" value={valeurs.nom}
          onChange={e => changer('nom', e.target.value)}
          aria-invalid={!!erreurs.nom} aria-describedby="nom-erreur" />
        {erreurs.nom && <p id="nom-erreur" className="erreur">{erreurs.nom}</p>}
      </div>

      <div>
        <label htmlFor="categorie-form">Catégorie</label>
        <select id="categorie-form" value={valeurs.categorie}
          onChange={e => changer('categorie', e.target.value)}
          aria-invalid={!!erreurs.categorie} aria-describedby="categorie-erreur">
          <option value="">-- Choisir --</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        {erreurs.categorie && <p id="categorie-erreur" className="erreur">{erreurs.categorie}</p>}
      </div>

      <div>
        <label htmlFor="description">Description</label>
        <textarea id="description" value={valeurs.description}
          onChange={e => changer('description', e.target.value)}
          aria-invalid={!!erreurs.description} aria-describedby="description-erreur" />
        {erreurs.description && <p id="description-erreur" className="erreur">{erreurs.description}</p>}
      </div>

        {}

      <button type="submit">{libelleBouton}</button>
    </form>
  );
}