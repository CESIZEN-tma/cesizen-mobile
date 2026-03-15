import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/themeHooks';

interface PhaseIndicatorProps {
  phaseLabel: string;
  timeRemaining: number;
}

export default function PhaseIndicator({
  phaseLabel,
  timeRemaining,
}: PhaseIndicatorProps) {
  const { colors } = useTheme();

  const formatTime = (seconds: number): string => {
    return Math.ceil(seconds).toString();
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.phaseText, { color: colors.text }]}>
        {phaseLabel}
      </Text>
      <Text style={[styles.timeText, { color: colors.primary }]}>
        {formatTime(timeRemaining)}s
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 8,
  },
  phaseText: {
    fontSize: 24,
    fontWeight: '600',
  },
  timeText: {
    fontSize: 48,
    fontWeight: '700',
  },
});
