   <EquipementForm
     initial={equipement}
     libelleBouton="Enregistrer les modifications"
     onSubmit={donnees => {
       modifierEquipement(equipement.id, donnees);
       navigate('/gestion');
     }}
   />