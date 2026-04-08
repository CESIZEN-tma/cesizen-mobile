import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/themeHooks';

interface ExerciseControlsProps {
  isPlaying: boolean;
  isPaused: boolean;
  progress: number;
  totalTimeElapsed: number;
  durationMinutes: number;
  onPlayPause: () => void;
  onStop: () => void;
}

export default function ExerciseControls({
  isPlaying,
  isPaused,
  progress,
  totalTimeElapsed,
  durationMinutes,
  onPlayPause,
  onStop,
}: ExerciseControlsProps) {
  const { colors } = useTheme();

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const totalSeconds = durationMinutes * 60;

  return (
    <View style={styles.container}>
      <View
        style={[styles.progressBar, { backgroundColor: colors.surface }]}
        accessibilityRole="progressbar"
        accessibilityValue={{ min: 0, max: 100, now: Math.round(progress) }}
        accessibilityLabel="Progression de l'exercice"
      >
        <View
          style={[
            styles.progressFill,
            {
              backgroundColor: colors.primary,
              width: `${progress}%`,
            },
          ]}
        />
      </View>

      <Text style={[styles.timeText, { color: colors.textSecondary }]}>
        {formatTime(totalTimeElapsed)} / {formatTime(totalSeconds)}
      </Text>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.controlButton, { backgroundColor: colors.primary }]}
          onPress={onPlayPause}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={!isPlaying ? 'Démarrer' : isPaused ? 'Reprendre' : 'Mettre en pause'}
        >
          <Ionicons
            name={!isPlaying || isPaused ? 'play' : 'pause'}
            size={32}
            color="#ffffff"
            importantForAccessibility="no"
          />
        </TouchableOpacity>

        {isPlaying && (
          <TouchableOpacity
            style={[
              styles.controlButton,
              styles.stopButton,
              { backgroundColor: colors.error || '#ef4444' },
            ]}
            onPress={onStop}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Arrêter l'exercice"
          >
            <Ionicons name="stop" size={32} color="#ffffff" importantForAccessibility="no" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    gap: 16,
  },
  progressBar: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  timeText: {
    fontSize: 16,
    fontWeight: '600',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  controlButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  stopButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
});
