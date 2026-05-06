# Plan de déploiement — cesizen-mobile

## 1. Architecture

cesizen-mobile est une application **React Native 0.81 / Expo 54** ciblant iOS et Android. Elle consomme l'API REST `cesizen-api`.

```
Développeur → GitHub (push) → GitHub Actions (CI) → EAS Build (artefacts) → App Store / APK
```

> En contexte scolaire, la distribution se fait via APK Android généré localement ou via Expo Go pour les démonstrations.

## 2. Environnements

| Environnement | Branche source | Mode Expo | API cible |
|---|---|---|---|
| Développement local | `dev` | `expo start` (dev client) | `http://localhost:3000` |
| Préprod | merge sur `dev` | Build EAS profil `preview` | API préprod |
| Production | merge sur `main` | Build EAS profil `production` | API prod |

### Flux de branches

```
feature/* ──► dev ──► main
                │         │
             preprod     prod
```

## 3. Pipeline CI/CD

### 3.1 CI — Non-régression (`.github/workflows/ci.yml`)

**Déclencheur :** push sur toute branche, pull request vers `dev` ou `main`.

| Étape | Commande | Rôle |
|---|---|---|
| Installation | `npm ci` | Dépendances reproductibles (lockfile) |
| Vérification TypeScript | `npx tsc --noEmit` | Typage statique |
| Tests | `npm test` | Jest + jest-expo — tests unitaires et hooks |

La pipeline bloque le merge si l'une des étapes échoue.

### 3.2 Versioning et release (`.github/workflows/release.yml`)

**Déclencheur :** push sur `main`.

Création automatique d'un tag sémantique `vX.Y.Z` via `anothrNick/github-tag-action`.

### 3.3 Build de distribution (manuel ou via EAS CLI)

Pour générer un APK Android :

```bash
# Installer EAS CLI
npm install -g eas-cli

# Connexion au compte Expo
eas login

# Build APK (préprod)
eas build --platform android --profile preview

# Build APK (production)
eas build --platform android --profile production
```

## 4. Versioning sémantique

| Mention dans le message de commit | Effet |
|---|---|
| `#major` | Bump majeur : `1.0.0 → 2.0.0` |
| `#minor` | Bump mineur : `1.0.0 → 1.1.0` |
| *(aucune mention)* | Bump patch : `1.0.0 → 1.0.1` |

La version dans `app.json` doit être synchronisée manuellement avec le tag Git avant chaque release store.

## 5. Ressources nécessaires

### 5.1 Secrets GitHub

| Secret | Environnement | Description |
|---|---|---|
| *(aucun secret spécifique)* | — | Les URLs d'API sont configurées dans `app.config.ts` |

### 5.2 Configuration Expo (`app.config.ts`)

| Paramètre | Préprod | Prod |
|---|---|---|
| `extra.apiBaseUrl` | URL API préprod | URL API production |
| `extra.apiKey` | Clé API préprod | Clé API production |

### 5.3 Dépendances

| Dépendance | Version | Rôle |
|---|---|---|
| Node.js | 20 LTS | Runtime |
| Expo SDK | 54 | Framework mobile |
| React Native | 0.81 | UI natif |
| Jest + jest-expo | — | Tests |
| EAS CLI | latest | Build cloud Expo |

## 6. Procédure de rollback

Les tags Git permettent de retrouver n'importe quelle version :

```bash
# Revenir au code de la version vX.Y.Z
git checkout vX.Y.Z

# Rebuild l'APK
eas build --platform android --profile production
```

## 7. Cohérence avec le projet

| Contrainte | Solution retenue |
|---|---|
| Projet scolaire CESI | CI automatisée sur GitHub Actions, distribution via APK ou Expo Go |
| Pas de compte App Store | Build APK Android suffisant pour la démonstration |
| Équipe réduite | Pas de déploiement OTA (Over-The-Air) pour limiter la complexité |
| Multi-plateforme | Expo gère iOS et Android depuis un même code source |
