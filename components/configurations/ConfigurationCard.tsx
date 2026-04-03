import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/themeHooks';
import { Configuration } from '@/types/api.types';
import { useRouter } from 'expo-router';

interface ConfigurationCardProps {
  configuration: Configuration;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onBookmark?: (id: string) => void;
  isBookmarked?: boolean;
  showActions?: boolean;
  publicConfig?: boolean;
}

export default function ConfigurationCard({
  configuration,
  onEdit,
  onDelete,
  onBookmark,
  isBookmarked = false,
  showActions = true,
  publicConfig = false
}: ConfigurationCardProps) {
  const { colors } = useTheme();
  const router = useRouter();

  const handleStart = () => {
    router.push(`/(tabs)/exercise/${configuration.id}${ publicConfig ? "?isPublicConfig=true" : ""}` as any);
  };

  const renderDifficulty = () => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i < configuration.difficulty ? 'star' : 'star-outline'}
          size={16}
          color={colors.primary}
        />
      );
    }
    return <View style={styles.starsContainer}>{stars}</View>;
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          {configuration.name}
        </Text>
        {onBookmark && (
          <TouchableOpacity onPress={() => onBookmark(configuration.id)}>
            <Ionicons
              name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
              size={24}
              color={colors.primary}
            />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.difficultyRow}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Difficulté:
        </Text>
        {renderDifficulty()}
      </View>

      <View style={styles.patternContainer}>
        <Text style={[styles.pattern, { color: colors.text }]}>
          {configuration.inhalation}s inspire → {configuration.retention1}s
          retient →
        </Text>
        <Text style={[styles.pattern, { color: colors.text }]}>
          {configuration.exhalation}s expire → {configuration.retention2}s
          retient
        </Text>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Ionicons name="time" size={16} color={colors.textSecondary} />
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            {configuration.durationMinutes} min
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="flag" size={16} color={colors.textSecondary} />
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            {configuration.objective}
          </Text>
        </View>
      </View>

      {showActions && (
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.startButton, { backgroundColor: colors.primary }]}
            onPress={handleStart}
          >
            <Ionicons name="play" size={20} color="#ffffff" />
            <Text style={styles.startButtonText}>Démarrer</Text>
          </TouchableOpacity>

          {onEdit && (
            <TouchableOpacity
              style={[styles.iconButton, { backgroundColor: colors.surface }]}
              onPress={() => onEdit(configuration.id)}
            >
              <Ionicons name="create" size={20} color={colors.primary} />
            </TouchableOpacity>
          )}

          {onDelete && (
            <TouchableOpacity
              style={[styles.iconButton, { backgroundColor: colors.surface }]}
              onPress={() => onDelete(configuration.id)}
            >
              <Ionicons
                name="trash"
                size={20}
                color={colors.error || '#ef4444'}
              />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  difficultyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  label: {
    fontSize: 14,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  patternContainer: {
    marginBottom: 12,
  },
  pattern: {
    fontSize: 14,
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 14,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  startButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  iconButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
});
