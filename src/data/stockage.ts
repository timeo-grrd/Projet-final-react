// Résultat d'une lecture : la valeur + un indicateur d'erreur
export type Lecture<T> = { valeur: T[]; erreur: boolean };

export function lireTableau<T>(cle: string, initial: T[]): Lecture<T> {
  try {
    const brut = localStorage.getItem(cle);
    // null = la clé n'existe pas → premier lancement → données initiales
    if (brut === null) {
      return { valeur: structuredClone(initial), erreur: false };
    }
    // "[]" est une vraie valeur (ex : toutes les réservations annulées)
    const valeur: unknown = JSON.parse(brut);
    if (!Array.isArray(valeur)) throw new Error('Format invalide');
    return { valeur: valeur as T[], erreur: false };
  } catch {
    // JSON cassé ou stockage inaccessible → repli sur les données initiales
    return { valeur: structuredClone(initial), erreur: true };
  }
}

export function ecrireTableau<T>(cle: string, valeur: T[]): boolean {
  try {
    localStorage.setItem(cle, JSON.stringify(valeur));
    return true;
  } catch {
    return false;
  }
}