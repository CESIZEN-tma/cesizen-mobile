import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import PageLayout from '@/components/PageLayout';
import AuthGuard from '@/components/auth/AuthGuard';
import { useTheme } from '@/hooks/themeHooks';
import Loader from '@/components/shared/Loader';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { userApi } from '@/app/services/api/userApi';
import { SessionDTO } from '@/app/services/api/types';

export default function SessionsScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  const [sessions, setSessions] = useState<SessionDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const sessionsList = await userApi.getSessions();
      setSessions(sessionsList);
    } catch (err: any) {
      console.error('Failed to load sessions:', err);
      setError('Impossible de charger les sessions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevokeSession = (sessionId: string) => {
    Alert.alert(
      'Révoquer la session',
      'Êtes-vous sûr de vouloir révoquer cette session ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Révoquer',
          style: 'destructive',
          onPress: async () => {
            try {
              await userApi.revokeSession(sessionId);
              await loadSessions();
              Alert.alert('Succès', 'Session révoquée avec succès');
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de révoquer la session');
            }
          },
        },
      ]
    );
  };

  const handleRevokeAllSessions = () => {
    Alert.alert(
      'Révoquer toutes les sessions',
      'Êtes-vous sûr de vouloir révoquer toutes les sessions ? Vous serez déconnecté sur tous les appareils.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Révoquer tout',
          style: 'destructive',
          onPress: async () => {
            try {
              await userApi.revokeAllSessions();
              Alert.alert(
                'Succès',
                'Toutes les sessions ont été révoquées. Vous allez être déconnecté.',
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      // User will be logged out by the API
                      router.replace('/(auth)/login' as any);
                    },
                  },
                ]
              );
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de révoquer les sessions');
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.centerContainer}>
          <Loader size={60} />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Ionicons
            name="alert-circle"
            size={60}
            color={colors.error || '#ef4444'}
          />
          <Text style={[styles.errorText, { color: colors.text }]}>
            {error}
          </Text>
          <TouchableOpacity onPress={loadSessions}>
            <Text style={[styles.retryText, { color: colors.primary }]}>
              Réessayer
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (sessions.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Ionicons
            name="phone-portrait-outline"
            size={80}
            color={colors.textSecondary}
          />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            Aucune session active
          </Text>
        </View>
      );
    }

    return (
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      >
        {sessions.map((session, index) => (
          <View
            key={session.id}
            style={[
              styles.sessionCard,
              { backgroundColor: colors.surface },
            ]}
          >
            <View style={styles.sessionInfo}>
              <View style={styles.sessionHeader}>
                <Ionicons
                  name="phone-portrait"
                  size={24}
                  color={colors.primary}
                />
                <View style={styles.sessionDetails}>
                  <Text style={[styles.sessionTitle, { color: colors.text }]}>
                    Session {index + 1}
                  </Text>
                  <Text
                    style={[styles.sessionDate, { color: colors.textSecondary }]}
                  >
                    Créée le {formatDate(session.createdAt)}
                  </Text>
                  <Text
                    style={[styles.sessionExpiry, { color: colors.textSecondary }]}
                  >
                    Expire le {formatDate(session.expiresAt)}
                  </Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              style={[
                styles.revokeButton,
                { backgroundColor: colors.error || '#ef4444' },
              ]}
              onPress={() => handleRevokeSession(session.id)}
            >
              <Text style={styles.revokeButtonText}>Révoquer</Text>
            </TouchableOpacity>
          </View>
        ))}

        {sessions.length > 1 && (
          <TouchableOpacity
            style={[
              styles.revokeAllButton,
              { backgroundColor: colors.error || '#ef4444' },
            ]}
            onPress={handleRevokeAllSessions}
          >
            <Ionicons name="trash" size={20} color="#ffffff" />
            <Text style={styles.revokeAllButtonText}>
              Révoquer toutes les sessions
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    );
  };

  return (
    <AuthGuard requireAuth={true}>
    <PageLayout header footer>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>
            Sessions actives
          </Text>
          <TouchableOpacity onPress={loadSessions}>
            <Ionicons name="refresh" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {renderContent()}
      </View>
      </PageLayout>
    </AuthGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    gap: 16,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryText: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  listContainer: {
    padding: 24,
  },
  sessionCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sessionInfo: {
    marginBottom: 12,
  },
  sessionHeader: {
    flexDirection: 'row',
    gap: 12,
  },
  sessionDetails: {
    flex: 1,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  sessionDate: {
    fontSize: 14,
    marginBottom: 2,
  },
  sessionExpiry: {
    fontSize: 14,
  },
  revokeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  revokeButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  revokeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    marginTop: 8,
  },
  revokeAllButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
