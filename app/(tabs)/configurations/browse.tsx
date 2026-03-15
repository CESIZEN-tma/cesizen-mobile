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
import { useTheme } from '@/hooks/themeHooks';
import { useConfiguration } from '@/hooks/useConfiguration';
import ConfigurationCard from '@/components/configurations/ConfigurationCard';
import Loader from '@/components/shared/Loader';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function BrowseConfigurationsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const {
    adminConfigurations,
    isLoading,
    addBookmark,
    removeBookmark,
    isBookmarked,
  } = useConfiguration();

  const [selectedObjective, setSelectedObjective] = useState<string | null>(
    null
  );
  const [selectedDifficulty, setSelectedDifficulty] = useState<number | null>(
    null
  );

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

  const objectives = Array.from(
    new Set(adminConfigurations.map((c) => c.objective))
  );

  const difficulties = [1, 2, 3, 4, 5];

  const filteredConfigurations = adminConfigurations.filter((config) => {
    if (selectedObjective && config.objective !== selectedObjective) {
      return false;
    }
    if (
      selectedDifficulty !== null &&
      config.difficulty !== selectedDifficulty
    ) {
      return false;
    }
    return true;
  });

  const clearFilters = () => {
    setSelectedObjective(null);
    setSelectedDifficulty(null);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.centerContainer}>
          <Loader size={60} />
        </View>
      );
    }

    if (filteredConfigurations.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="search-outline"
            size={80}
            color={colors.textSecondary}
          />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            Aucune configuration trouvée
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            Essayez de modifier vos filtres
          </Text>
          {(selectedObjective || selectedDifficulty !== null) && (
            <TouchableOpacity onPress={clearFilters}>
              <Text style={[styles.clearFilters, { color: colors.primary }]}>
                Effacer les filtres
              </Text>
            </TouchableOpacity>
          )}
        </View>
      );
    }

    return (
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      >
        {filteredConfigurations.map((config) => (
          <ConfigurationCard
            key={config.id}
            configuration={config}
            onBookmark={handleBookmark}
            isBookmarked={isBookmarked(config.id)}
            showActions={true}
          />
        ))}
      </ScrollView>
    );
  };

  return (
    <PageLayout header footer>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>
            Parcourir
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.filtersContainer}>
          <Text style={[styles.filtersTitle, { color: colors.text }]}>
            Filtres
          </Text>

          <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>
            Objectif
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterScroll}
          >
            <TouchableOpacity
              style={[
                styles.filterChip,
                !selectedObjective && {
                  backgroundColor: colors.primary,
                  borderColor: colors.primary,
                },
                { borderColor: colors.surface },
              ]}
              onPress={() => setSelectedObjective(null)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  {
                    color: !selectedObjective ? '#ffffff' : colors.text,
                  },
                ]}
              >
                Tous
              </Text>
            </TouchableOpacity>
            {objectives.map((objective) => (
              <TouchableOpacity
                key={objective}
                style={[
                  styles.filterChip,
                  selectedObjective === objective && {
                    backgroundColor: colors.primary,
                    borderColor: colors.primary,
                  },
                  { borderColor: colors.surface },
                ]}
                onPress={() => setSelectedObjective(objective)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    {
                      color:
                        selectedObjective === objective
                          ? '#ffffff'
                          : colors.text,
                    },
                  ]}
                >
                  {objective}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text
            style={[
              styles.filterLabel,
              { color: colors.textSecondary, marginTop: 16 },
            ]}
          >
            Difficulté
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterScroll}
          >
            <TouchableOpacity
              style={[
                styles.filterChip,
                selectedDifficulty === null && {
                  backgroundColor: colors.primary,
                  borderColor: colors.primary,
                },
                { borderColor: colors.surface },
              ]}
              onPress={() => setSelectedDifficulty(null)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  {
                    color: selectedDifficulty === null ? '#ffffff' : colors.text,
                  },
                ]}
              >
                Tous
              </Text>
            </TouchableOpacity>
            {difficulties.map((difficulty) => (
              <TouchableOpacity
                key={difficulty}
                style={[
                  styles.filterChip,
                  selectedDifficulty === difficulty && {
                    backgroundColor: colors.primary,
                    borderColor: colors.primary,
                  },
                  { borderColor: colors.surface },
                ]}
                onPress={() => setSelectedDifficulty(difficulty)}
              >
                <View style={styles.filterStarsContainer}>
                  {Array.from({ length: difficulty }).map((_, i) => (
                    <Ionicons
                      key={i}
                      name="star"
                      size={14}
                      color={selectedDifficulty === difficulty ? '#ffffff' : colors.primary}
                    />
                  ))}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {renderContent()}
      </View>
    </PageLayout>
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
    fontSize: 24,
    fontWeight: '700',
  },
  filtersContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  filtersTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  filterScroll: {
    marginBottom: 8,
  },
  filterChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  filterStarsContainer: {
    flexDirection: 'row',
    gap: 2,
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
  clearFilters: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  scrollView: {
    flex: 1,
  },
  listContainer: {
    padding: 24,
  },
});
