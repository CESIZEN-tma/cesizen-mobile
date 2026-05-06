# Guide de contribution — cesizen-mobile

## 1. Stratégie de branches

```
main          ← production (protégée, merge via PR uniquement)
  └── dev     ← intégration / préprod (protégée, merge via PR uniquement)
        └── feature/<nom>   ← développement d'une fonctionnalité
        └── fix/<nom>        ← correction de bug
        └── chore/<nom>      ← maintenance, dépendances, config
```

**Règles :**
- On ne pousse jamais directement sur `main` ou `dev`.
- Toute modification passe par une Pull Request.
- Une PR doit être approuvée avant d'être mergée.
- La CI doit passer (tsc + tests) avant tout merge.

## 2. Conventions de commits

Format : `type: description courte`

| Type | Usage |
|---|---|
| `feat` | Nouvelle fonctionnalité |
| `fix` | Correction de bug |
| `chore` | Maintenance (dépendances, config, CI) |
| `docs` | Documentation uniquement |
| `refactor` | Refactoring sans changement de comportement |
| `test` | Ajout ou modification de tests |
| `style` | Formatage, espaces (pas de changement logique) |

**Exemples :**
```
feat: add haptic feedback to breathing exercise
fix: resolve token refresh loop on 401
chore: upgrade expo sdk to 54
```

**Versioning sémantique :** pour contrôler le bump de version lors du merge sur `main` :
- `#major` dans le message → v1.0.0 → v2.0.0
- `#minor` dans le message → v1.0.0 → v1.1.0
- *(défaut)* → bump patch automatique

## 3. Gestion des tickets (GitHub Issues)

### Créer un ticket

Tout bug, évolution ou tâche est tracé dans **GitHub Issues** du repo `cesizen-mobile`.

**Labels disponibles :**

| Label | Couleur | Usage |
|---|---|---|
| `bug` | Rouge | Comportement incorrect |
| `enhancement` | Bleu | Nouvelle fonctionnalité ou amélioration |
| `chore` | Gris | Maintenance technique |
| `documentation` | Jaune | Documentation manquante ou incorrecte |
| `critical` | Rouge foncé | Bloquant, à traiter en priorité |
| `platform: android` | Vert | Bug spécifique Android |
| `platform: ios` | Gris clair | Bug spécifique iOS |

**Structure d'un ticket :**
```
Titre : [BUG] L'animation de respiration se bloque sur Android

Description :
- Plateforme : Android / iOS / les deux
- Version de l'app : vX.Y.Z
- Étapes pour reproduire :
  1. ...
  2. ...
- Comportement attendu : ...
- Comportement observé : ...
- Capture d'écran (si applicable)
```

### Workflow d'un ticket

```
Open → In Progress → In Review → Done
```

| Statut | Signification |
|---|---|
| `Open` | Ticket créé, non assigné ou en attente |
| `In Progress` | Assigné à un développeur, branche créée |
| `In Review` | Pull Request ouverte, en attente de relecture |
| `Done` | PR mergée, ticket fermé |

### Lier un ticket à une PR

Dans le corps de la Pull Request :
```
Closes #42
```
GitHub fermera automatiquement le ticket au merge.

## 4. Processus de Pull Request

1. Créer une branche depuis `dev` : `git checkout -b feature/mon-feature`
2. Développer et committer selon les conventions
3. Pousser la branche : `git push origin feature/mon-feature`
4. Ouvrir une PR vers `dev` sur GitHub
5. Remplir le template de PR (description, tickets liés, checklist)
6. Attendre la validation CI + revue de code
7. Merger

## 5. Commandes utiles

```bash
# Lancer les tests
npm test

# Vérifier les types TypeScript
npx tsc --noEmit

# Lancer l'application en développement
npx expo start

# Lancer sur Android
npx expo start --android

# Lancer sur iOS
npx expo start --ios

# Build APK (préprod)
eas build --platform android --profile preview

# Build APK (production)
eas build --platform android --profile production
```
