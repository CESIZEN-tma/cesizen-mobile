import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'cesizen-mobile',
  slug: 'cesizen-mobile',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/adaptive-icon.png',
  scheme: 'cesizenmobile',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  splash: {
    image: './assets/images/splash-icon-light.png',
    dark: {
      image: './assets/images/splash-icon-dark.png',
      backgroundColor: '#000000',
    },
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: ['expo-router', 'expo-secure-store'],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:5027/api',
    apiKey: process.env.EXPO_PUBLIC_API_KEY || 'e93a27d4-e39a-44b3-9ad1-58a43d75864d',
  },
});
