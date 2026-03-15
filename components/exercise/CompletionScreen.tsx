import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/themeHooks';
import PressButton from '@/components/shared/PressButton';

interface CompletionScreenProps {
  cyclesCompleted: number;
  totalDuration: number;
  onRestart: () => void;
  onExit: () => void;
}

export default function CompletionScreen({
  cyclesCompleted,
  totalDuration,
  onRestart,
  onExit,
}: CompletionScreenProps) {
  const { colors } = useTheme();

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}min ${secs}s`;
  };

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Ionicons
        name="checkmark-circle"
        size={100}
        color={colors.primary}
        style={styles.icon}
      />

      <Text style={[styles.title, { color: colors.text }]}>
        Exercice terminé !
      </Text>

      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Félicitations pour avoir complété cet exercice
      </Text>

      <View style={[styles.statsCard, { backgroundColor: colors.surface }]}>
        <View style={styles.statRow}>
          <Ionicons name="refresh" size={24} color={colors.primary} />
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Cycles complétés
          </Text>
          <Text style={[styles.statValue, { color: colors.text }]}>
            {cyclesCompleted}
          </Text>
        </View>

        <View style={styles.statRow}>
          <Ionicons name="time" size={24} color={colors.primary} />
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Durée totale
          </Text>
          <Text style={[styles.statValue, { color: colors.text }]}>
            {formatTime(totalDuration)}
          </Text>
        </View>
      </View>

      <View style={styles.buttonsContainer}>
        <PressButton
          label="Recommencer"
          onPress={onRestart}
          width={300}
          height={56}
        />
        <PressButton
          label="Terminer"
          onPress={onExit}
          width={300}
          height={56}
          secondary
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  icon: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 40,
    textAlign: 'center',
  },
  statsCard: {
    width: '100%',
    borderRadius: 16,
    padding: 24,
    marginBottom: 40,
    gap: 20,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statLabel: {
    flex: 1,
    fontSize: 16,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  buttonsContainer: {
    gap: 16,
    alignItems: 'center',
  },
});
