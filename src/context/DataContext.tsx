import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Equipement, Reservation } from '../data/donnees-initiales';
import { EQUIPEMENTS_INITIAUX, RESERVATIONS_INITIALES } from '../data/donnees-initiales';
import { lireTableau, ecrireTableau } from '../data/stockage';

// Les champs du formulaire = un équipement sans id
export type DonneesEquipement = Omit<Equipement, 'id'>;

type DataContextValue = {
  equipements: Equipement[];
  reservations: Reservation[];
  erreurStockage: string | null;
  estDisponible: (equipementId: number) => boolean;
  reserver: (equipementId: number, etudiantId: number) => string | null;
  annuler: (reservationId: string, etudiantId: number) => void;
  ajouterEquipement: (donnees: DonneesEquipement) => Equipement;
  modifierEquipement: (id: number, donnees: DonneesEquipement) => void;
  supprimerEquipement: (id: number) => string | null;
};

const DataContext = createContext<DataContextValue | null>(null);


export function DataProvider({ children }: { children: ReactNode }) {
  // 1. Lecture du localStorage, UNE seule fois au démarrage
  const [lectureInitiale] = useState(() => ({
    equipements: lireTableau('cm-equipements', EQUIPEMENTS_INITIAUX),
    reservations: lireTableau('cm-reservations', RESERVATIONS_INITIALES),
  }));

  // 2. L'état partagé (la "mémoire" de l'appli)
  const [equipements, setEquipements] = useState(lectureInitiale.equipements.valeur);
  const [reservations, setReservations] = useState(lectureInitiale.reservations.valeur);
  const [erreurStockage, setErreurStockage] = useState<string | null>(
    lectureInitiale.equipements.erreur || lectureInitiale.reservations.erreur
      ? 'Les données enregistrées étaient illisibles : les données initiales ont été rechargées.'
      : null
  );

  // 3. Sauvegarde automatique à chaque changement
  useEffect(() => {
    if (!ecrireTableau('cm-equipements', equipements)) {
      // Signaler l'échec d'écriture (système externe) : setState volontaire dans l'effet
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setErreurStockage("Impossible d'enregistrer le catalogue.");
    }
  }, [equipements]);

  useEffect(() => {
    if (!ecrireTableau('cm-reservations', reservations)) {
      // Signaler l'échec d'écriture (système externe) : setState volontaire dans l'effet
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setErreurStockage("Impossible d'enregistrer les réservations.");
    }
  }, [reservations]);

  // 4. Les règles métier
  function estDisponible(equipementId: number): boolean {
    return !reservations.some(r => r.equipementId === equipementId);
  }

  function reserver(equipementId: number, etudiantId: number): string | null {
    if (!equipements.some(e => e.id === equipementId)) return 'Équipement introuvable.';
    if (!estDisponible(equipementId)) return 'Cet équipement est déjà réservé.';
    const nouvelle: Reservation = { id: crypto.randomUUID(), equipementId, etudiantId };
    setReservations(liste => [...liste, nouvelle]);
    return null; // null = tout s'est bien passé
  }

  function annuler(reservationId: string, etudiantId: number) {
    setReservations(liste => liste.filter(r => !(r.id === reservationId && r.etudiantId === etudiantId)));
  }

  function ajouterEquipement(donnees: DonneesEquipement): Equipement {
    const nouveau: Equipement = { id: Date.now(), ...donnees };
    setEquipements(liste => [...liste, nouveau]);
    return nouveau;
  }

  function modifierEquipement(id: number, donnees: DonneesEquipement) {
    setEquipements(liste => liste.map(e => e.id === id ? { id, ...donnees } : e));
  }

  function supprimerEquipement(id: number): string | null {
    if (!estDisponible(id)) {
      return 'Cet équipement est réservé : il ne peut pas être supprimé tant que la réservation n’est pas annulée.';
    }
    setEquipements(liste => liste.filter(e => e.id !== id));
    return null;
  }

  return (
    <DataContext.Provider value={{
      equipements, reservations, erreurStockage, estDisponible, reserver,
      annuler, ajouterEquipement, modifierEquipement, supprimerEquipement,
    }}>
      {children}
    </DataContext.Provider>
  );
}

// Le hook est exporté avec son Provider (même modèle que les slides J4 p.35)
// eslint-disable-next-line react-refresh/only-export-components
export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData doit être utilisé dans DataProvider');
  return ctx;
}