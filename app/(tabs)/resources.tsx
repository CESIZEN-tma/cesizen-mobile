import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import PageLayout from '@/components/PageLayout';
import { useTheme } from '@/hooks/themeHooks';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { apiClient } from '@/app/services/api/apiClient';
import { ENDPOINTS } from '@/app/services/api/endpoints';
import { InformationPageDTO, InformationTagDTO } from '@/app/services/api/types';

const PAGE_SIZE = 10;

export default function ResourcesScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);

  const [allPages, setAllPages] = useState<InformationPageDTO[]>([]);
  const [tags, setTags] = useState<InformationTagDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  const [tagModalVisible, setTagModalVisible] = useState(false);
  const [tagSearch, setTagSearch] = useState('');

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const data = await apiClient.get(ENDPOINTS.CONTENT.GET_PAGES);
        setAllPages(data ?? []);
      } catch {
        setAllPages([]);
      }
    };

    const fetchTags = async () => {
      try {
        const data = await apiClient.get(ENDPOINTS.CONTENT.GET_TAGS);
        setTags(data ?? []);
      } catch {
        setTags([]);
      }
    };

    (async () => {
      setIsLoading(true);
      await Promise.all([fetchPages(), fetchTags()]);
      setIsLoading(false);
    })();
  }, []);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [searchQuery, selectedTagIds]);

  const filteredPages = allPages.filter((page) => {
    const matchesSearch = page.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTags =
      selectedTagIds.length === 0 ||
      selectedTagIds.every((tagId) => page.tagIds?.includes(tagId));
    return matchesSearch && matchesTags;
  });

  const visiblePages = filteredPages.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPages.length;

  const loadMore = useCallback(() => {
    if (!hasMore) return;
    setVisibleCount((prev) => prev + PAGE_SIZE);
  }, [hasMore]);

  const handleScroll = useCallback((event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowScrollTop(offsetY > 300);
  }, []);

  const scrollToTop = useCallback(() => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, []);

  const filteredTagsForModal = tags.filter((tag) =>
    tag.label.toLowerCase().includes(tagSearch.toLowerCase())
  );

  const toggleTag = useCallback((tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  }, []);

  const resetTags = useCallback(() => {
    setSelectedTagIds([]);
  }, []);

  const activeTagLabel =
    selectedTagIds.length === 0
      ? 'Tous les tags'
      : `${selectedTagIds.length} tag${selectedTagIds.length > 1 ? 's' : ''} sélectionné${selectedTagIds.length > 1 ? 's' : ''}`;

  const renderPageCard = useCallback(
    ({ item }: { item: InformationPageDTO }) => {
      const itemTags = tags.filter((t) => item.tagIds?.includes(t.id));
      return (
        <TouchableOpacity
          style={[styles.pageCard, { backgroundColor: colors.surface }]}
          onPress={() => router.push(`/(tabs)/info-page/${item.id}` as any)}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={item.description ? `${item.title}. ${item.description}` : item.title}
          accessibilityHint="Ouvre l'article"
        >
          <Text style={[styles.pageTitle, { color: colors.text }]}>{item.title}</Text>
          {item.description ? (
            <Text style={[styles.pageDescription, { color: colors.textSecondary }]} numberOfLines={2}>
              {item.description}
            </Text>
          ) : null}
          {itemTags.length > 0 && (
            <View style={styles.tagChips}>
              {itemTags.map((tag) => (
                <View
                  key={tag.id}
                  style={[
                    styles.tagChip,
                    {
                      backgroundColor: selectedTagIds.includes(tag.id)
                        ? colors.primary
                        : colors.background,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.tagChipText,
                      {
                        color: selectedTagIds.includes(tag.id)
                          ? '#ffffff'
                          : colors.textSecondary,
                      },
                    ]}
                  >
                    {tag.label}
                  </Text>
                </View>
              ))}
            </View>
          )}
          <Ionicons
            name="chevron-forward"
            size={18}
            color={colors.textSecondary}
            style={styles.cardChevron}
            importantForAccessibility="no"
          />
        </TouchableOpacity>
      );
    },
    [tags, selectedTagIds, colors, router]
  );

  const renderFooter = useCallback(() => {
    if (!hasMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  }, [hasMore, colors.primary]);

  // Bottom offset: footer height (~60) + safe area + margin
  const scrollTopBottom = 60 + insets.bottom + 16;

  return (
    <PageLayout header footer scrollable={false}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.filtersContainer}>
          <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons name="search-outline" size={18} color={colors.textSecondary} importantForAccessibility="no" />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Rechercher un article..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              accessibilityLabel="Rechercher un article"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                accessibilityRole="button"
                accessibilityLabel="Effacer la recherche"
              >
                <Ionicons name="close-circle" size={18} color={colors.textSecondary} importantForAccessibility="no" />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.tagRow}>
            <TouchableOpacity
              style={[styles.tagFilterButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={() => setTagModalVisible(true)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={`Filtrer par tags : ${activeTagLabel}`}
            >
              <Ionicons name="pricetags-outline" size={16} color={colors.primary} importantForAccessibility="no" />
              <Text style={[styles.tagFilterText, { color: colors.text }]} numberOfLines={1}>
                {activeTagLabel}
              </Text>
              <Ionicons name="chevron-down" size={14} color={colors.textSecondary} importantForAccessibility="no" />
            </TouchableOpacity>

            {selectedTagIds.length > 0 && (
              <TouchableOpacity
                style={[styles.resetButton, { backgroundColor: colors.error ?? '#ef4444' }]}
                onPress={resetTags}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel="Réinitialiser les filtres"
              >
                <Ionicons name="close" size={14} color="#ffffff" importantForAccessibility="no" />
                <Text style={styles.resetButtonText}>Réinitialiser</Text>
              </TouchableOpacity>
            )}
          </View>

          {!isLoading && (
            <Text style={[styles.resultCount, { color: colors.textSecondary }]}>
              {filteredPages.length} article{filteredPages.length !== 1 ? 's' : ''} trouvé{filteredPages.length !== 1 ? 's' : ''}
            </Text>
          )}
        </View>

        {isLoading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : filteredPages.length === 0 ? (
          <View style={styles.center}>
            <Ionicons name="document-text-outline" size={52} color={colors.textSecondary} importantForAccessibility="no" />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Aucun article trouvé
            </Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={visiblePages}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            renderItem={renderPageCard}
            onEndReached={loadMore}
            onEndReachedThreshold={0.3}
            ListFooterComponent={renderFooter}
            onScroll={handleScroll}
            scrollEventThrottle={100}
          />
        )}

        {showScrollTop && (
          <TouchableOpacity
            style={[
              styles.scrollTopButton,
              { backgroundColor: colors.primary, bottom: scrollTopBottom },
            ]}
            onPress={scrollToTop}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Revenir en haut de la liste"
          >
            <Ionicons name="arrow-up" size={22} color="#ffffff" importantForAccessibility="no" />
          </TouchableOpacity>
        )}

        <Modal
          visible={tagModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setTagModalVisible(false)}
          accessibilityViewIsModal={true}
        >
          <View style={styles.modalOverlay}>
            <TouchableOpacity
              style={styles.modalBackdrop}
              activeOpacity={1}
              onPress={() => setTagModalVisible(false)}
            />
            <View style={[styles.modalSheet, { backgroundColor: colors.background }]}>
              <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>Filtrer par tags</Text>
                <TouchableOpacity
                  onPress={() => setTagModalVisible(false)}
                  accessibilityRole="button"
                  accessibilityLabel="Fermer le filtre par tags"
                >
                  <Ionicons name="close" size={24} color={colors.text} importantForAccessibility="no" />
                </TouchableOpacity>
              </View>

              <View style={[styles.modalSearchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Ionicons name="search-outline" size={16} color={colors.textSecondary} importantForAccessibility="no" />
                <TextInput
                  style={[styles.modalSearchInput, { color: colors.text }]}
                  placeholder="Rechercher un tag..."
                  placeholderTextColor={colors.textSecondary}
                  value={tagSearch}
                  onChangeText={setTagSearch}
                  accessibilityLabel="Rechercher un tag"
                />
                {tagSearch.length > 0 && (
                  <TouchableOpacity
                    onPress={() => setTagSearch('')}
                    accessibilityRole="button"
                    accessibilityLabel="Effacer la recherche de tags"
                  >
                    <Ionicons name="close-circle" size={16} color={colors.textSecondary} importantForAccessibility="no" />
                  </TouchableOpacity>
                )}
              </View>

              <ScrollView style={styles.modalTagList} showsVerticalScrollIndicator={false}>
                {filteredTagsForModal.map((tag) => {
                  const isSelected = selectedTagIds.includes(tag.id);
                  return (
                    <TouchableOpacity
                      key={tag.id}
                      style={[styles.modalTagRow, { borderBottomColor: colors.border }]}
                      onPress={() => toggleTag(tag.id)}
                      activeOpacity={0.7}
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked: isSelected }}
                      accessibilityLabel={tag.label}
                    >
                      <Text style={[styles.modalTagLabel, { color: colors.text }]}>{tag.label}</Text>
                      <View
                        style={[
                          styles.checkbox,
                          {
                            backgroundColor: isSelected ? colors.primary : 'transparent',
                            borderColor: isSelected ? colors.primary : colors.textSecondary,
                          },
                        ]}
                        importantForAccessibility="no"
                      >
                        {isSelected && <Ionicons name="checkmark" size={14} color="#ffffff" importantForAccessibility="no" />}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <View style={[styles.modalFooter, { borderTopColor: colors.border }]}>
                <TouchableOpacity
                  style={[styles.modalResetButton, { borderColor: colors.border }]}
                  onPress={() => { resetTags(); setTagSearch(''); }}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel="Réinitialiser les tags sélectionnés"
                >
                  <Text style={[styles.modalResetText, { color: colors.textSecondary }]}>Réinitialiser</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalApplyButton, { backgroundColor: colors.primary }]}
                  onPress={() => { setTagModalVisible(false); setTagSearch(''); }}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel="Appliquer les filtres"
                >
                  <Text style={styles.modalApplyText}>Appliquer</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filtersContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    padding: 0,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tagFilterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 6,
  },
  tagFilterText: {
    flex: 1,
    fontSize: 14,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    gap: 4,
  },
  resetButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
  resultCount: {
    fontSize: 13,
    marginTop: 2,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
    gap: 10,
  },
  pageCard: {
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  pageTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    paddingRight: 20,
  },
  pageDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  tagChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tagChip: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  tagChipText: {
    fontSize: 12,
    fontWeight: '500',
  },
  cardChevron: {
    position: 'absolute',
    right: 14,
    top: 16,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  scrollTopButton: {
    position: 'absolute',
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalSheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '75%',
    paddingBottom: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  modalSearchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    gap: 8,
  },
  modalSearchInput: {
    flex: 1,
    fontSize: 14,
    padding: 0,
  },
  modalTagList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  modalTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  modalTagLabel: {
    fontSize: 15,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  modalResetButton: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 13,
    alignItems: 'center',
  },
  modalResetText: {
    fontSize: 15,
    fontWeight: '600',
  },
  modalApplyButton: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
  },
  modalApplyText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
});
