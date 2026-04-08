import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
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
      style={styles.container}
      accessible={true}
      accessibilityLabel={accessibilityLabel}
      accessibilityLiveRegion="polite"
    >
      <Animated.View
        style={[
          styles.circle,
          {
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
    width: 250,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  innerCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
  },
});
