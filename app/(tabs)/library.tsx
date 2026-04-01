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

type ActiveTab = 'public' | 'mine' | 'bookmarks';

export default function LibraryScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const {
    adminConfigurations,
    myConfigurations,
    bookmarks,
    isLoading,
    deleteConfiguration,
    addBookmark,
    removeBookmark,
    isBookmarked,
  } = useConfiguration();

  const [activeTab, setActiveTab] = useState<ActiveTab>('public');

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
              Alert.alert('Erreur', 'Impossible de supprimer la configuration');
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

  const getBookmarkedConfigurations = (): Configuration[] => {
    const bookmarkedIds = bookmarks.map((b) => b.configurationId);
    return adminConfigurations.filter((c) => bookmarkedIds.includes(c.id));
  };

  const getConfigurations = (): Configuration[] => {
    switch (activeTab) {
      case 'public':
        return adminConfigurations;
      case 'mine':
        return myConfigurations;
      case 'bookmarks':
        return getBookmarkedConfigurations();
    }
  };

  const getEmptyMessage = (): { title: string; subtitle: string; icon: string } => {
    switch (activeTab) {
      case 'public':
        return {
          icon: 'grid-outline',
          title: 'Aucune configuration',
          subtitle: 'Aucune configuration publique disponible',
        };
      case 'mine':
        return {
          icon: 'add-circle-outline',
          title: 'Aucune configuration',
          subtitle: 'Créez votre première configuration personnalisée',
        };
      case 'bookmarks':
        return {
          icon: 'bookmark-outline',
          title: 'Aucun favori',
          subtitle: 'Ajoutez des configurations publiques à vos favoris',
        };
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.centerContainer}>
          <Loader size={60} />
        </View>
      );
    }

    const configurations = getConfigurations();

    if (configurations.length === 0) {
      const { icon, title, subtitle } = getEmptyMessage();
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name={icon as any} size={80} color={colors.textSecondary} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>{title}</Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            {subtitle}
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
            onEdit={activeTab === 'mine' ? handleEdit : undefined}
            onDelete={activeTab === 'mine' ? handleDelete : undefined}
            onBookmark={activeTab !== 'mine' ? handleBookmark : undefined}
            isBookmarked={isBookmarked(config.id)}
            showActions={true}
          />
        ))}
      </ScrollView>
    );
  };

  const tabs: { key: ActiveTab; label: string }[] = [
    { key: 'public', label: 'Publiques' },
    { key: 'mine', label: 'Mes configs' },
    { key: 'bookmarks', label: 'Favoris' },
  ];

  return (
    <AuthGuard requireAuth={true}>
      <PageLayout header footer>
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <View style={styles.headerContainer}>
            <Text style={[styles.title, { color: colors.text }]}>
              Bibliothèque
            </Text>
            {activeTab === 'mine' && (
              <TouchableOpacity
                style={[styles.headerButton, { backgroundColor: colors.primary }]}
                onPress={handleCreateNew}
              >
                <Ionicons name="add" size={20} color="#ffffff" />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.tabsContainer}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.tab,
                  activeTab === tab.key && {
                    borderBottomColor: colors.primary,
                    borderBottomWidth: 2,
                  },
                ]}
                onPress={() => setActiveTab(tab.key)}
              >
                <Text
                  style={[
                    styles.tabText,
                    {
                      color:
                        activeTab === tab.key
                          ? colors.primary
                          : colors.textSecondary,
                      fontWeight: activeTab === tab.key ? '600' : '400',
                    },
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
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
    fontSize: 14,
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
