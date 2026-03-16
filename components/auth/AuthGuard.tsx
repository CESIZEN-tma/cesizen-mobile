import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/themeHooks';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Loader from '@/components/shared/Loader';
import PressButton from '@/components/shared/PressButton';
import { Ionicons } from '@expo/vector-icons';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export default function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Loader size={60} />
      </View>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.backButtonContainer, { top: insets.top + 16 }]}>
          <PressButton
            label=""
            onPress={() => router.back()}
            width={44}
            height={44}
            icon="arrow-back"
          />
        </View>
        <View style={styles.centerContent}>
          <Ionicons name="lock-closed" size={80} color={colors.textSecondary} />
          <Text style={[styles.title, { color: colors.text }]}>
            Connexion requise
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Vous devez être connecté pour accéder à cette fonctionnalité
          </Text>
          <View style={styles.buttonsContainer}>
            <PressButton
              label="Se connecter"
              onPress={() => router.replace('/(auth)/login' as any)}
              width={280}
              height={56}
            />
            <PressButton
              label="Créer un compte"
              onPress={() => router.replace('/(auth)/register' as any)}
              width={280}
              height={56}
              secondary
            />
          </View>
        </View>
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButtonContainer: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  buttonsContainer: {
    gap: 12,
    alignItems: 'center',
  },
});
