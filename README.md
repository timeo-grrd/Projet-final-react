# Campus Matériel

Application monopage de réservation de matériel pour un campus, réalisée avec **React 19**, **TypeScript**, **Vite** et **React Router 7** (mode Data).

## Installation et lancement

Prérequis : Node.js 20 ou plus récent.

```bash
npm install      # installe les dépendances (à partir de package-lock.json)
npm run dev      # lance le serveur de développement → http://localhost:5173
npm run build    # vérifie les types et construit la version de production
npm run preview  # sert la version de production
```

## Comptes de démonstration

La connexion est **simulée** : on choisit un compte sur la page `/login`, sans mot de passe.

| Compte | Rôle | Correspondance avec le scénario du sujet |
|---|---|---|
| Adam Thomas (id 1) | Étudiant | « Alice » (premier étudiant) |
| Yannick Sicaud (id 2) | Étudiant | « Yanis » (second étudiant) |
| Timéo Girard (id 3) | Responsable | « Camille » (responsable) |

## Routes

| Route | Contenu | Accès |
|---|---|---|
| `/` | Redirection vers `/catalogue` (connecté) ou `/login` | Selon la session |
| `/login` | Choix du compte de démonstration | Public |
| `/catalogue` | Liste, recherche par nom, filtre par catégorie, disponibilité | Connecté |
| `/materiels/:id` | Fiche détaillée ; bouton de réservation pour les étudiants | Connecté |
| `/mes-reservations` | Réservations de l'étudiant connecté, avec annulation | Étudiant |
| `/gestion` | Liste du catalogue, modification, suppression | Responsable |
| `/gestion/nouveau` | Création d'un équipement | Responsable |
| `/gestion/:id/modifier` | Modification d'un équipement | Responsable |
| `/acces-refuse` | Explication d'un refus d'accès | Public |
| toute autre URL | Page 404 | Public |

Un visiteur non connecté qui demande une page privée est redirigé vers `/login`, puis renvoyé vers la page demandée après connexion. Un utilisateur connecté sans le bon rôle est redirigé vers `/acces-refuse`. Les contrôles s'appliquent aussi aux URL saisies directement.

## Organisation du code

```
src/
  data/
    donnees-initiales.ts   jeu de données fourni + types
    stockage.ts            lecture/écriture localStorage avec gestion d'erreur
  context/
    DataContext.tsx        état partagé : équipements, réservations, règles métier, persistance
    AuthContext.tsx        session simulée (id du compte stocké dans localStorage)
  guards/
    RequireAuth.tsx        redirige vers /login si personne n'est connecté
    RequireRole.tsx        redirige vers /acces-refuse si le rôle ne correspond pas
  layouts/
    AppLayout.tsx          menu (NavLink, liens actifs), déconnexion, erreurs de stockage
  components/
    EquipementCard.tsx     carte d'un équipement (reçoit l'équipement en props)
    FiltresCatalogue.tsx   recherche + filtre (remonte les saisies au parent)
    EquipementForm.tsx     formulaire contrôlé partagé création/modification
  pages/                   une page par route
  router.tsx               configuration des routes, guards et chargement différé
  main.tsx                 point d'entrée : AuthProvider > DataProvider > RouterProvider
```

## Trajet d'une réservation

1. **Clic** sur « Réserver » dans `MaterielDetailPage`.
2. **Contrôle** : `reserver()` du `DataContext` vérifie que l'équipement existe et qu'aucune réservation active ne porte son `equipementId`. En cas de refus, un message est renvoyé et affiché.
3. **Mise à jour de l'état** : une réservation `{ id: crypto.randomUUID(), equipementId, etudiantId }` est ajoutée avec `setReservations` (nouveau tableau, sans mutation).
4. **Sauvegarde** : un `useEffect` qui surveille `reservations` écrit le tableau dans `localStorage` (clé `cm-reservations`).
5. **Actualisation des vues** : le changement d'état provoque un nouveau rendu. Le badge passe à « Réservé » dans la fiche, le catalogue et la gestion, et la réservation apparaît dans « Mes réservations ».

La disponibilité n'est jamais stockée : elle est **calculée** à partir des réservations actives (`estDisponible`).

## Persistance

- Clés localStorage : `cm-equipements`, `cm-reservations`, `cm-session`.
- Les données initiales sont chargées (copiées avec `structuredClone`) **uniquement si la clé n'existe pas**. Un tableau vide enregistré est conservé tel quel.
- Une lecture invalide ou une écriture impossible affiche un message d'erreur en haut de page.
- Nouvel équipement : `id` généré avec `Date.now()` (jamais `length + 1`).

## Fonctionnalités réalisées

- [x] Catalogue : recherche par nom, filtre par catégorie, disponibilité, accès à la fiche, message si aucun résultat
- [x] Fiche détaillée, message si l'identifiant n'existe pas
- [x] Réservation réservée aux étudiants, une seule réservation active par équipement, contrôle au moment de l'action
- [x] « Mes réservations » : uniquement les réservations de l'étudiant connecté, lien vers la fiche, annulation
- [x] Gestion : création, modification (même composant de formulaire), suppression après confirmation
- [x] Suppression refusée et expliquée si l'équipement est réservé
- [x] Validation du formulaire avec messages compréhensibles ; les saisies sont conservées en cas d'erreur
- [x] Routes protégées (connexion et rôle), page d'accès refusé, page 404, liens actifs
- [x] Chargement différé (lazy) des trois pages de gestion
- [x] Persistance des données et de la session ; la déconnexion supprime la session
- [x] Communication entre composants : `FiltresCatalogue` → `CataloguePage`, `EquipementForm` → pages de création/modification
- [x] Bonus : retour à la page demandée après connexion

## Limites connues

- **Authentification simulée** : aucun mot de passe, aucun serveur. Les guards démontrent le fonctionnement du frontend mais ne sécurisent rien ; dans une vraie application, le serveur vérifierait chaque autorisation.
- Données **locales au navigateur** : pas de synchronisation entre ordinateurs ou navigateurs.
- Pas de dates de réservation : un équipement reste réservé jusqu'à l'annulation (conforme au sujet).
- La confirmation de suppression utilise la boîte de dialogue native `window.confirm`.
- La page 404 est rendue par l'application ; le serveur ne renvoie pas un vrai code HTTP 404.
- Interface volontairement sobre ; pas de tests automatisés.