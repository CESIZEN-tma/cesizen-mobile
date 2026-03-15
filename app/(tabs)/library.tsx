import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import PageLayout from '@/components/PageLayout';
import AuthGuard from '@/components/auth/AuthGuard';
import { useTheme } from '@/hooks/themeHooks';
import { useConfiguration } from '@/hooks/useConfiguration';
import ConfigurationCard from '@/components/configurations/ConfigurationCard';
import Loader from '@/components/shared/Loader';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Configuration } from '@/types/api.types';

export default function LibraryScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const {
    myConfigurations,
    bookmarks,
    adminConfigurations,
    isLoading,
    deleteConfiguration,
    addBookmark,
    removeBookmark,
    isBookmarked,
  } = useConfiguration();

  const [activeTab, setActiveTab] = useState<'my' | 'bookmarks'>('my');

  const handleEdit = (id: string) => {
    router.push(`/(tabs)/configurations/${id}/edit` as any);
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Supprimer la configuration',
      'Êtes-vous sûr de vouloir supprimer cette configuration ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteConfiguration(id);
            } catch (error) {
              Alert.alert(
                'Erreur',
                'Impossible de supprimer la configuration'
              );
            }
          },
        },
      ]
    );
  };

  const handleBookmark = async (configId: string) => {
    try {
      if (isBookmarked(configId)) {
        await removeBookmark(configId);
      } else {
        await addBookmark(configId);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de modifier les favoris');
    }
  };

  const handleCreateNew = () => {
    router.push('/(tabs)/configurations/create' as any);
  };

  const handleBrowse = () => {
    router.push('/(tabs)/configurations/browse' as any);
  };

  const getBookmarkedConfigurations = (): Configuration[] => {
    const bookmarkedIds = bookmarks.map((b) => b.configurationId);
    return [
      ...myConfigurations.filter((c) => bookmarkedIds.includes(c.id)),
      ...adminConfigurations.filter((c) => bookmarkedIds.includes(c.id)),
    ];
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.centerContainer}>
          <Loader size={60} />
        </View>
      );
    }

    const configurations =
      activeTab === 'my' ? myConfigurations : getBookmarkedConfigurations();

    if (configurations.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons
            name={activeTab === 'my' ? 'add-circle-outline' : 'bookmark-outline'}
            size={80}
            color={colors.textSecondary}
          />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            {activeTab === 'my'
              ? 'Aucune configuration'
              : 'Aucun favori'}
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            {activeTab === 'my'
              ? 'Créez votre première configuration personnalisée'
              : 'Ajoutez des configurations à vos favoris'}
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
        {configurations.map((config) => (
          <ConfigurationCard
            key={config.id}
            configuration={config}
            onEdit={activeTab === 'my' ? handleEdit : undefined}
            onDelete={activeTab === 'my' ? handleDelete : undefined}
            onBookmark={handleBookmark}
            isBookmarked={isBookmarked(config.id)}
            showActions={true}
          />
        ))}
      </ScrollView>
    );
  };

  return (
    <AuthGuard requireAuth={true}>
      <PageLayout header footer>
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <View style={styles.headerContainer}>
            <Text style={[styles.title, { color: colors.text }]}>
              Bibliothèque
            </Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={[styles.headerButton, { backgroundColor: colors.surface }]}
              onPress={handleBrowse}
            >
              <Ionicons name="search" size={20} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.headerButton, { backgroundColor: colors.primary }]}
              onPress={handleCreateNew}
            >
              <Ionicons name="add" size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'my' && {
                borderBottomColor: colors.primary,
                borderBottomWidth: 2,
              },
            ]}
            onPress={() => setActiveTab('my')}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color: activeTab === 'my' ? colors.primary : colors.textSecondary,
                  fontWeight: activeTab === 'my' ? '600' : '400',
                },
              ]}
            >
              Mes Configs
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'bookmarks' && {
                borderBottomColor: colors.primary,
                borderBottomWidth: 2,
              },
            ]}
            onPress={() => setActiveTab('bookmarks')}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    activeTab === 'bookmarks'
                      ? colors.primary
                      : colors.textSecondary,
                  fontWeight: activeTab === 'bookmarks' ? '600' : '400',
                },
              ]}
            >
              Favoris
            </Text>
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
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    gap: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  listContainer: {
    padding: 24,
  },
});
