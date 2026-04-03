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
import { useSimplifiedMode } from '@/hooks/useSimplifiedMode';
import { usePendingConfirmation } from '@/hooks/usePendingConfirmation';
import ConfigurationCard from '@/components/configurations/ConfigurationCard';
import Loader from '@/components/shared/Loader';
import PressButton from '@/components/shared/PressButton';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function DashboardScreen() {
  const { colors } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const { isSimplified, isLoaded: simplifiedLoaded } = useSimplifiedMode();
  const { hasPendingConfirmation } = usePendingConfirmation();
  const router = useRouter();
  const {
    adminConfigurations,
    myConfigurations,
    bookmarks,
    isLoading,
    addBookmark,
    removeBookmark,
    isBookmarked,
    refreshAdminConfigurations,
    refreshMyConfigurations,
  } = useConfiguration();

  useEffect(() => {
    if (isAuthenticated) {
      refreshAdminConfigurations();
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
    ...(!isAuthenticated ? [{
      icon: 'information-circle',
      label: "Voir l'onboarding",
      color: '#8b5cf6',
      onPress: () => router.push('/(auth)/firstOpenedPage' as any),
    }] : []),
  ];

  const recentAdminConfigurations = adminConfigurations.slice(0, 3);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  if (simplifiedLoaded && isAuthenticated && isSimplified) {
    return (
      <PageLayout header footer>
        <ScrollView
          style={[styles.container, { backgroundColor: colors.background }]}
          contentContainerStyle={styles.simplifiedContent}
          showsVerticalScrollIndicator={false}
        >
          {hasPendingConfirmation && (
            <TouchableOpacity
              style={[styles.pendingBanner, { backgroundColor: colors.primary + '20', borderColor: colors.primary }]}
              onPress={() => router.push('/(auth)/confirm-account' as any)}
              activeOpacity={0.8}
            >
              <Ionicons name="mail-outline" size={18} color={colors.primary} />
              <Text style={[styles.pendingBannerText, { color: colors.primary }]}>
                Il semblerait que vous ayez une inscription en attente de validation. Cliquez ici
              </Text>
            </TouchableOpacity>
          )}

          <View style={styles.simplifiedGreeting}>
            <Text style={[styles.simplifiedHello, { color: colors.textSecondary }]}>
              {getGreeting()},
            </Text>
            <Text style={[styles.simplifiedName, { color: colors.text }]}>
              {user?.firstName}
            </Text>
          </View>

          <View style={[styles.simplifiedCard, { backgroundColor: colors.surface }]}>
            <View style={[styles.simplifiedIconCircle, { backgroundColor: colors.primary + '20' }]}>
              <Ionicons name="fitness-outline" size={48} color={colors.primary} />
            </View>
            <Text style={[styles.simplifiedCardTitle, { color: colors.text }]}>
              Exercice de respiration
            </Text>
            <Text style={[styles.simplifiedCardSub, { color: colors.textSecondary }]}>
              Prenez un moment pour vous recentrer
            </Text>
            <TouchableOpacity
              style={[styles.simplifiedStartButton, { backgroundColor: colors.primary }]}
              onPress={() => router.push('/(tabs)/library' as any)}
              activeOpacity={0.8}
            >
              <Ionicons name="play" size={20} color="#ffffff" />
              <Text style={styles.simplifiedStartText}>Commencer</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.simplifiedActions}>
            <TouchableOpacity
              style={[styles.simplifiedAction, { backgroundColor: colors.surface }]}
              onPress={() => router.push('/(tabs)/quizzes' as any)}
              activeOpacity={0.7}
            >
              <Ionicons name="clipboard-outline" size={24} color={colors.primary} />
              <Text style={[styles.simplifiedActionLabel, { color: colors.text }]}>Quiz</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.simplifiedAction, { backgroundColor: colors.surface }]}
              onPress={() => router.push('/(tabs)/resources' as any)}
              activeOpacity={0.7}
            >
              <Ionicons name="newspaper-outline" size={24} color={colors.primary} />
              <Text style={[styles.simplifiedActionLabel, { color: colors.text }]}>Ressources</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.simplifiedAction, { backgroundColor: colors.surface }]}
              onPress={() => router.push('/(tabs)/library' as any)}
              activeOpacity={0.7}
            >
              <Ionicons name="library-outline" size={24} color={colors.primary} />
              <Text style={[styles.simplifiedActionLabel, { color: colors.text }]}>Configs</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </PageLayout>
    );
  }

  return (
    <PageLayout header footer>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {hasPendingConfirmation && (
          <TouchableOpacity
            style={[styles.pendingBanner, { backgroundColor: colors.primary + '20', borderColor: colors.primary }]}
            onPress={() => router.push('/(auth)/confirm-account' as any)}
            activeOpacity={0.8}
          >
            <Ionicons name="mail-outline" size={18} color={colors.primary} />
            <Text style={[styles.pendingBannerText, { color: colors.primary }]}>
              Il semblerait que vous ayez une inscription en attente de validation. Cliquez ici
            </Text>
          </TouchableOpacity>
        )}

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
            ) : recentAdminConfigurations.length > 0 ? (
              <View style={styles.recentSection}>
                <View style={styles.sectionHeader}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    Configurations populaires
                  </Text>
                  <TouchableOpacity
                    onPress={() => router.push('/(tabs)/library' as any)}
                  >
                    <Text style={[styles.seeAllText, { color: colors.primary }]}>
                      Voir tout
                    </Text>
                  </TouchableOpacity>
                </View>
                {recentAdminConfigurations.map((config) => (
                  <ConfigurationCard
                    key={config.id}
                    configuration={config}
                    onBookmark={handleBookmark}
                    isBookmarked={isBookmarked(config.id)}
                    showActions={true}
                    publicConfig={true}
                  />
                ))}
              </View>
            ) : myConfigurations.length === 0 ? (
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
            ) : null}
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
  pendingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 16,
    marginTop: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  pendingBannerText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
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
  simplifiedContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    gap: 28,
  },
  simplifiedGreeting: {
    alignItems: 'center',
  },
  simplifiedHello: {
    fontSize: 18,
  },
  simplifiedName: {
    fontSize: 32,
    fontWeight: '700',
    marginTop: 2,
  },
  simplifiedCard: {
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  simplifiedIconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  simplifiedCardTitle: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  simplifiedCardSub: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  simplifiedStartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 14,
  },
  simplifiedStartText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
  },
  simplifiedActions: {
    flexDirection: 'row',
    gap: 12,
  },
  simplifiedAction: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  simplifiedActionLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
});
