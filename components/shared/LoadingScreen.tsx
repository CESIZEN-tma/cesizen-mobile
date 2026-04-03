import { useTheme } from "@/hooks/themeHooks";
import React, { useEffect } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

type LoadingScreenProps = {
  progress: number;
  message?: string;
};

const LoadingScreen = ({ progress, message }: LoadingScreenProps) => {
  const { colors, theme } = useTheme();
  const bounceValue = useSharedValue(0);
  const scaleValue = useSharedValue(1);

  useEffect(() => {
    bounceValue.value = withRepeat(
      withSequence(
        withSpring(-20, { damping: 2, stiffness: 100 }),
        withSpring(0, { damping: 2, stiffness: 100 })
      ),
      -1,
      false
    );

    scaleValue.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 800 }),
        withTiming(1, { duration: 800 })
      ),
      -1,
      true
    );
  }, []);

  const bounceStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bounceValue.value }],
  }));

  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
  }));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Animated.View style={[styles.logoContainer, bounceStyle]}>
          <Animated.View style={scaleStyle}>
            <Image
              source={
                theme === "dark"
                  ? require("@/assets/images/splash-icon-dark.png")
                  : require("@/assets/images/splash-icon-light.png")
              }
              style={styles.logo}
              resizeMode="contain"
            />
          </Animated.View>
        </Animated.View>

        <View style={styles.progressContainer}>
          <View
            style={[styles.progressBarBackground, { backgroundColor: colors.surface }]}
          >
            <Animated.View
              style={[
                styles.progressBar,
                {
                  backgroundColor: colors.primary,
                  width: `${Math.min(progress, 100)}%`,
                },
              ]}
            />
          </View>
          <Text style={[styles.progressText, { color: colors.textSecondary }]}>
            {Math.round(progress)}%
          </Text>
        </View>

        {message && (
          <Text style={[styles.message, { color: colors.textSecondary }]}>
            {message}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingHorizontal: 40,
  },
  logoContainer: {
    marginBottom: 60,
  },
  logo: {
    width: 150,
    height: 150,
  },
  progressContainer: {
    width: "100%",
    alignItems: "center",
    gap: 12,
  },
  progressBarBackground: {
    width: "100%",
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 16,
    fontWeight: "600",
  },
  message: {
    marginTop: 24,
    fontSize: 14,
    textAlign: "center",
  },
});

export default LoadingScreen;
