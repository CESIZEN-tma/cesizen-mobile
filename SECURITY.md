# Plan de sécurisation — cesizen-mobile

> Plan de sécurité global disponible dans [cesizen-infra/SECURITY.md](https://github.com/CESIZEN-tma/cesizen-infra/blob/main/SECURITY.md).
> Ce document couvre les vulnérabilités spécifiques à l'application mobile React Native / Expo.

---

## 1. Contexte

cesizen-mobile est une application mobile React Native / Expo ciblant Android et iOS. Elle stocke des tokens d'authentification localement et communique avec `cesizen-api` via HTTPS.

---

## 2. Vulnérabilités spécifiques — Mobile

| ID  | Vulnérabilité                              | P | I | Criticité | Statut          |
|-----|--------------------------------------------|---|---|-----------|-----------------|
| M01 | Clé API extractible par reverse engineering| 2 | 2 | **4**     | ⚠️ Partiel       |
| M02 | Token JWT dans le stockage local           | 1 | 3 | **3**     | ✅ Mitigé (SecureStore) |
| M03 | Absence de certificate pinning             | 1 | 3 | **3**     | ⚠️ Risque résiduel |
| M04 | Logs en clair sur appareil de dev          | 2 | 1 | **2**     | ⚠️ À désactiver en prod |
| M05 | Dépendances npm vulnérables                | 2 | 2 | **4**     | ⚠️ Monitoring (Dependabot + npm audit) |

---

## 3. Mesures en place

### Stockage sécurisé des tokens
- Les tokens JWT sont stockés via **`expo-secure-store`**, qui utilise :
  - **Keychain** sur iOS (chiffrement matériel)
  - **Keystore** sur Android (chiffré et protégé par le sandbox applicatif)
- Les tokens ne sont jamais stockés en `AsyncStorage` (non chiffré)

### Authentification
- Clé API envoyée en header (`x-api-key`) — jamais dans l'URL
- Refresh token automatique avec rotation côté API

### CI / Supply chain
- `npm audit` à chaque push
- Dependabot configuré pour alertes hebdomadaires sur les dépendances

---

## 4. Actions correctives prioritaires

### Clé API (M01) — ÉLEVÉ
La clé API est actuellement injectée via `app.config.ts` et incluse dans le bundle. Pour réduire le risque :
1. À court terme : utiliser des clés différentes par environnement avec permissions minimales
2. À long terme : implémenter un endpoint d'authentification anonyme qui délivre un token temporaire, évitant d'exposer la clé directement

### Certificate pinning (M03) — MODÉRÉ
Implémenter le pinning du certificat TLS de l'API pour empêcher les attaques MITM même sur des réseaux compromis.

### Logs de production (M04)
Désactiver les `console.log` en production via une configuration Babel/Metro :
```js
// babel.config.js
plugins: [
  ['transform-remove-console', { exclude: ['error', 'warn'] }]
]
```

---

## 5. Procédure de gestion de crise

En cas d'incident (ex. : token compromis en masse), se référer à la procédure complète dans [cesizen-infra/SECURITY.md](https://github.com/CESIZEN-tma/cesizen-infra/blob/main/SECURITY.md).

**Action immédiate spécifique :**
- Révoquer tous les refresh tokens en base de données (déconnexion forcée de tous les utilisateurs)
- Renouveler la clé API et pousser une mise à jour de l'application
