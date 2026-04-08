import React, { useEffect } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { BreathingPhase } from '@/types/exercise.types';
import { useTheme } from '@/hooks/themeHooks';

const PHASE_LABELS: Record<BreathingPhase, string> = {
  inhale: 'Inspiration',
  retention1: 'Rétention poumons pleins',
  exhale: 'Expiration',
  retention2: 'Rétention poumons vides',
};

interface BreathingCircleProps {
  phase: BreathingPhase;
  inhaleDuration: number;
  retention1Duration: number;
  exhaleDuration: number;
  retention2Duration: number;
  isPlaying: boolean;
}

export default function BreathingCircle({
  phase,
  inhaleDuration,
  retention1Duration,
  exhaleDuration,
  retention2Duration,
  isPlaying,
}: BreathingCircleProps) {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();

  const CONTAINER_SIZE = Math.min(Math.round(width * 0.67), 300);
  const OUTER_SIZE = Math.round(CONTAINER_SIZE * 0.6);
  const INNER_SIZE = Math.round(CONTAINER_SIZE * 0.4);
  const OUTER_RADIUS = OUTER_SIZE / 2;
  const INNER_RADIUS = INNER_SIZE / 2;
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.6);

  useEffect(() => {
    if (!isPlaying) {
      scale.value = 1;
      opacity.value = 0.6;
      return;
    }

    switch (phase) {
      case 'inhale':
        scale.value = withTiming(1.8, {
          duration: inhaleDuration * 1000,
          easing: Easing.inOut(Easing.ease),
        });
        opacity.value = withTiming(0.9, {
          duration: inhaleDuration * 1000,
        });
        break;
      case 'retention1':
        break;
      case 'exhale':
        scale.value = withTiming(1, {
          duration: exhaleDuration * 1000,
          easing: Easing.inOut(Easing.ease),
        });
        opacity.value = withTiming(0.6, {
          duration: exhaleDuration * 1000,
        });
        break;
      case 'retention2':
        break;
    }
  }, [phase, isPlaying]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const phaseLabel = PHASE_LABELS[phase];
  const accessibilityLabel = isPlaying
    ? `Exercice de respiration en cours : ${phaseLabel}`
    : 'Exercice de respiration en pause';

  return (
    <View
      style={[styles.container, { width: CONTAINER_SIZE, height: CONTAINER_SIZE }]}
      accessible={true}
      accessibilityLabel={accessibilityLabel}
      accessibilityLiveRegion="polite"
    >
      <Animated.View
        style={[
          styles.circle,
          {
            width: OUTER_SIZE,
            height: OUTER_SIZE,
            borderRadius: OUTER_RADIUS,
            backgroundColor: colors.primary,
          },
          animatedStyle,
        ]}
        importantForAccessibility="no"
      />
      <View
        style={[
          styles.innerCircle,
          {
            width: INNER_SIZE,
            height: INNER_SIZE,
            borderRadius: INNER_RADIUS,
            backgroundColor: colors.background,
            borderColor: colors.primary,
          },
        ]}
        importantForAccessibility="no"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    position: 'absolute',
  },
  innerCircle: {
    borderWidth: 3,
  },
});
