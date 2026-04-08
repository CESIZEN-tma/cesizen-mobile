# CesiZen — Mobile

Application mobile de CesiZen, construite avec **React Native**, **Expo** et **TypeScript**.

## Prérequis

- Node.js 20+
- [Expo CLI](https://docs.expo.dev/get-started/installation/) : `npm install -g expo-cli`
- L'API `cesizen-api` en cours d'exécution
- Pour iOS : simulateur Xcode (macOS uniquement)
- Pour Android : Android Studio avec un émulateur configuré, ou un appareil physique

## Installation

```bash
git clone <repo-url>
cd cesizen-mobile
npm install
```

### Configuration

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `EXPO_PUBLIC_API_BASE_URL` | URL de base de l'API (ex: `http://192.168.x.x:5027/api`) |
| `EXPO_PUBLIC_API_KEY` | Clé d'API (`x-api-key`) |

> Sur un appareil physique ou un émulateur Android, utilisez l'IP locale de votre machine plutôt que `localhost`.

### Lancement

```bash
# Menu Expo (scan QR avec Expo Go)
npm start

# Directement sur Android
npm run android

# Directement sur iOS
npm run ios
```

## Structure

```
cesizen-mobile/
├── app/              # Routes Expo Router (file-based routing)
│   ├── (auth)/       # Écrans d'authentification
│   └── (tabs)/       # Écrans principaux
├── components/       # Composants réutilisables
├── hooks/            # Hooks custom (useAuth, useTheme…)
├── constants/        # Couleurs, config
└── services/         # Appels API
```
