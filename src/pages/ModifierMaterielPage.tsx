import { Link, useNavigate, useParams } from "react-router";
import { useData } from "../context/DataContext";
import { EquipementForm } from "../components/EquipementForm";

export function ModifierMaterielPage() {
  const { id } = useParams();
  const { equipements, modifierEquipement } = useData();
  const navigate = useNavigate();
  const equipement = equipements.find((e) => e.id === Number(id));

  if (!equipement) {
    return (
      <>
        <h1>Équipement introuvable</h1>
        <p>
          Impossible de modifier : aucun équipement ne correspond à
          l’identifiant « {id} ».
        </p>
        <Link to="/gestion">Retour à la gestion</Link>
      </>
    );
  }

  return (
    <>
      <h1>Modifier : {equipement.nom}</h1>
      <EquipementForm
        initial={equipement}
        libelleBouton="Enregistrer les modifications"
        onSubmit={(donnees) => {
          modifierEquipement(equipement.id, donnees);
          navigate("/gestion");
        }}
      />
      <p>
        <Link to="/gestion">Annuler</Link>
      </p>
    </>
  );
}
