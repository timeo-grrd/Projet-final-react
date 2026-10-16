# Campus Matériel

Projet final du module Framework JS. Application React qui permet aux étudiants de réserver du matériel du campus, et au responsable de gérer le catalogue.

Stack : React 19, TypeScript, Vite, React Router 7 (mode Data avec `createBrowserRouter`).

## Lancer le projet

Il faut Node.js 20 ou plus.

```bash
npm install
npm run dev
```

L'application tourne ensuite sur http://localhost:5173.

`npm run build` vérifie les types et génère la version de production, `npm run preview` permet de la tester.

## Comptes de démo

Pas de mot de passe : sur `/login` on clique sur un des trois badges.

| Compte | Rôle |
|---|---|
| Adam Thomas | étudiant |
| Yannick Sicaud | étudiant |
| Timéo Girard | responsable |

J'ai renommé les comptes du jeu de données. Pour suivre le scénario du sujet : Adam = Alice, Yannick = Yanis, Timéo = Camille. Les id (1, 2, 3) n'ont pas changé.

## Routes

| Route | Page | Qui peut y aller |
|---|---|---|
| `/` | redirige vers `/catalogue` ou `/login` | tout le monde |
| `/login` | choix du compte | tout le monde |
| `/catalogue` | liste, recherche, filtre par catégorie | connecté |
| `/materiels/:id` | fiche d'un équipement + bouton Réserver | connecté (réservation : étudiant) |
| `/mes-reservations` | mes réservations, avec annulation | étudiant |
| `/gestion` | tableau du catalogue, modifier / supprimer | responsable |
| `/gestion/nouveau` | ajout d'un équipement | responsable |
| `/gestion/:id/modifier` | modification d'un équipement | responsable |
| `/acces-refuse` | message quand le rôle ne suffit pas | tout le monde |
| autre | page 404 | tout le monde |

Les routes privées sont protégées par deux composants dans `src/guards/` : `RequireAuth` renvoie vers `/login` si personne n'est connecté (et on revient sur la page demandée après connexion), `RequireRole` renvoie vers `/acces-refuse` si le rôle ne correspond pas. Ça marche aussi quand on tape l'URL à la main, pas seulement via le menu.

Les trois pages de gestion sont chargées à la demande (`lazy` dans `router.tsx`) : on le voit dans l'onglet Network quand le responsable ouvre la gestion pour la première fois.

## Comment c'est organisé

- `src/context/DataContext.tsx` : l'état partagé (équipements + réservations), les règles métier (`reserver`, `annuler`, `supprimerEquipement`...) et la sauvegarde dans localStorage.
- `src/context/AuthContext.tsx` : la session simulée. Je stocke seulement l'id du compte, le compte complet est retrouvé dans les données au démarrage.
- `src/data/stockage.ts` : lecture / écriture localStorage avec gestion des erreurs.
- `src/components/` : la carte d'équipement, les filtres du catalogue et le formulaire (le même pour créer et modifier).
- `src/pages/` : une page par route.

Exemple de communication entre composants : `FiltresCatalogue` reçoit des fonctions en props et fait remonter la saisie à `CataloguePage`, et `EquipementForm` renvoie les données validées à sa page parente avec `onSubmit`.

### Ce qui se passe quand on réserve

1. L'étudiant clique sur Réserver dans la fiche.
2. `reserver()` vérifie que l'équipement existe et qu'il n'a pas déjà une réservation. Sinon il renvoie un message d'erreur qui s'affiche.
3. La réservation est ajoutée avec `setReservations` (nouveau tableau, `id` généré avec `crypto.randomUUID()`).
4. Un `useEffect` sur `reservations` enregistre la liste dans localStorage.
5. React refait le rendu : le tampon passe à « Réservé » partout et la réservation apparaît dans Mes réservations.

Il n'y a pas de champ `disponible` : la disponibilité est calculée à partir des réservations (`estDisponible`), pour qu'elle ne puisse jamais être en contradiction avec elles.

### Persistance

Trois clés : `cm-equipements`, `cm-reservations` et `cm-session`. Les données de départ ne sont chargées que si la clé n'existe pas (`getItem` renvoie `null`). Un tableau vide déjà enregistré est gardé tel quel. Si une lecture ou une écriture échoue, un message s'affiche en haut de la page. Les nouveaux équipements prennent `Date.now()` comme id.

## Ce qui est fait

- catalogue avec recherche, filtre, disponibilité et message quand rien ne correspond
- fiche détaillée, et message si l'id n'existe pas
- réservation (étudiants uniquement, une seule réservation active par équipement) et annulation
- Mes réservations : seulement celles de l'étudiant connecté
- gestion : création, modification avec le même formulaire, suppression avec confirmation
- suppression refusée avec une explication si l'équipement est réservé
- validation du formulaire avec un message sous chaque champ, la saisie est conservée
- routes protégées, page d'accès refusé, 404, liens actifs dans le menu
- données et session conservées au rechargement, session supprimée à la déconnexion
- bonus : retour à la page demandée après la connexion
- un thème « réserve de matériel » (panneau perforé, étiquettes, tampons, badges), avec focus clavier visible et animation coupée si le système demande moins d'animations

## Limites

- La connexion est simulée. N'importe qui peut modifier le localStorage, donc les guards montrent le fonctionnement côté front mais ne protègent rien pour de vrai. Dans une vraie appli, c'est le serveur qui vérifierait les droits.
- Tout est stocké dans le navigateur : rien n'est partagé entre deux ordinateurs ou deux navigateurs.
- Pas de dates de réservation, le matériel reste réservé jusqu'à l'annulation (c'est ce que demande le sujet).
- La confirmation de suppression utilise `window.confirm`.
- La police vient de Google Fonts : sans Internet, c'est la police système qui s'affiche.
- Pas de tests automatisés.
