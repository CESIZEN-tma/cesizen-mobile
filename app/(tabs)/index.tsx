import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import PageLayout from '@/components/PageLayout';
import { useTheme } from '@/hooks/themeHooks';
import { useAuth } from '@/hooks/useAuth';
import { useConfiguration } from '@/hooks/useConfiguration';
import ConfigurationCard from '@/components/configurations/ConfigurationCard';
import Loader from '@/components/shared/Loader';
import PressButton from '@/components/shared/PressButton';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function DashboardScreen() {
  const { colors } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const {
    myConfigurations,
    bookmarks,
    isLoading,
    addBookmark,
    removeBookmark,
    isBookmarked,
    refreshMyConfigurations,
  } = useConfiguration();

  useEffect(() => {
    if (isAuthenticated) {
      refreshMyConfigurations();
    }
  }, [isAuthenticated]);

  const handleBookmark = async (configId: string) => {
    if (!isAuthenticated) {
      Alert.alert(
        'Connexion requise',
        'Vous devez être connecté pour gérer vos favoris',
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Se connecter', onPress: () => router.push('/(auth)/login' as any) },
        ]
      );
      return;
    }

    try {
      if (isBookmarked(configId)) {
        await removeBookmark(configId);
      } else {
        await addBookmark(configId);
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  const quickActions = [
    {
      icon: 'play-circle',
      label: 'Démarrer un exercice',
      color: colors.primary,
      onPress: () => {
        if (isAuthenticated) {
          router.push('/(tabs)/library' as any);
        } else {
          router.push('/(auth)/login' as any);
        }
      },
    },
    {
      icon: 'clipboard',
      label: 'Passer un quiz',
      color: '#1cb0f6',
      onPress: () => router.push('/(tabs)/quizzes' as any),
    },
    {
      icon: 'add-circle',
      label: 'Créer une config',
      color: '#ff4b4b',
      onPress: () => {
        if (isAuthenticated) {
          router.push('/(tabs)/configurations/create' as any);
        } else {
          router.push('/(auth)/login' as any);
        }
      },
    },
  ];

  const recentConfigurations = myConfigurations.slice(0, 3);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  return (
    <PageLayout header footer>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.welcomeSection}>
          <Text style={[styles.greeting, { color: colors.textSecondary }]}>
            {getGreeting()}
          </Text>
          {isAuthenticated ? (
            <Text style={[styles.userName, { color: colors.text }]}>
              {user?.firstName} {user?.lastName}
            </Text>
          ) : (
            <>
              <Text style={[styles.userName, { color: colors.text }]}>
                Bienvenue sur CesiZen
              </Text>
              <View style={styles.authButtonsContainer}>
                <PressButton
                  label="Se connecter"
                  onPress={() => router.push('/(auth)/login' as any)}
                  width={150}
                  height={44}
                />
                <PressButton
                  label="Créer un compte"
                  onPress={() => router.push('/(auth)/register' as any)}
                  width={150}
                  height={44}
                  secondary
                />
              </View>
            </>
          )}
        </View>

        <View style={styles.quickActionsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Démarrage rapide
          </Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.quickActionCard,
                  { backgroundColor: colors.surface },
                ]}
                onPress={action.onPress}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.quickActionIcon,
                    { backgroundColor: action.color },
                  ]}
                >
                  <Ionicons name={action.icon as any} size={28} color="#ffffff" />
                </View>
                <Text style={[styles.quickActionLabel, { color: colors.text }]}>
                  {action.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {isAuthenticated && (
          <>
            {isLoading ? (
              <View style={styles.loaderContainer}>
                <Loader size={40} />
              </View>
            ) : recentConfigurations.length > 0 ? (
              <View style={styles.recentSection}>
                <View style={styles.sectionHeader}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    Mes configurations récentes
                  </Text>
                  <TouchableOpacity
                    onPress={() => router.push('/(tabs)/library' as any)}
                  >
                    <Text style={[styles.seeAllText, { color: colors.primary }]}>
                      Voir tout
                    </Text>
                  </TouchableOpacity>
                </View>
                {recentConfigurations.map((config) => (
                  <ConfigurationCard
                    key={config.id}
                    configuration={config}
                    onBookmark={handleBookmark}
                    isBookmarked={isBookmarked(config.id)}
                    showActions={true}
                  />
                ))}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Ionicons
                  name="add-circle-outline"
                  size={80}
                  color={colors.textSecondary}
                />
                <Text style={[styles.emptyTitle, { color: colors.text }]}>
                  Aucune configuration
                </Text>
                <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                  Passez un quiz ou créez votre première configuration personnalisée
                </Text>
                <TouchableOpacity
                  style={[styles.emptyButton, { backgroundColor: colors.primary }]}
                  onPress={() => router.push('/(tabs)/quizzes' as any)}
                >
                  <Text style={styles.emptyButtonText}>Passer un quiz</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}

        <View style={styles.tipsSection}>
          <View
            style={[
              styles.tipCard,
              { backgroundColor: colors.surface, borderColor: colors.primary },
            ]}
          >
            <Ionicons name="bulb" size={24} color={colors.primary} />
            <View style={styles.tipContent}>
              <Text style={[styles.tipTitle, { color: colors.text }]}>
                Conseil du jour
              </Text>
              <Text style={[styles.tipText, { color: colors.textSecondary }]}>
                Pratiquez la respiration guidée 5 minutes par jour pour réduire
                le stress et améliorer votre bien-être.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  welcomeSection: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 16,
    marginBottom: 4,
  },
  userName: {
    fontSize: 32,
    fontWeight: '700',
  },
  authButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  quickActionsSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  quickActionLabel: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  loaderContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  recentSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    paddingHorizontal: 40,
    paddingVertical: 40,
    alignItems: 'center',
    gap: 12,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  tipsSection: {
    paddingHorizontal: 24,
  },
  tipCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
