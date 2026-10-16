import { useNavigate } from 'react-router';
import { useData } from '../context/DataContext';
import { EquipementForm } from '../components/EquipementForm';

export function NouveauMaterielPage() {
  const { ajouterEquipement } = useData();
  const navigate = useNavigate();

  return (
    <>
      <h1>Nouveau matériel</h1>
      <EquipementForm
        libelleBouton="Créer la fiche"
        onSubmit={donnees => {
          const cree = ajouterEquipement(donnees);
          navigate(`/materiels/${cree.id}`);
        }}
      />
    </>
  );
}