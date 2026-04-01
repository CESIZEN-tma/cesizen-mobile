import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTheme } from "@/hooks/themeHooks";
import { apiClient } from "@/app/services/api/apiClient";
import { ENDPOINTS } from "@/app/services/api/endpoints";
import { Configuration } from "@/types/api.types";
import { useBreathingExercise } from "@/hooks/useBreathingExercise";
import BreathingCircle from "@/components/exercise/BreathingCircle";
import PhaseIndicator from "@/components/exercise/PhaseIndicator";
import ExerciseControls from "@/components/exercise/ExerciseControls";
import CompletionScreen from "@/components/exercise/CompletionScreen";
import Loader from "@/components/shared/Loader";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

export default function ExerciseScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { configId, isPublicConfig } = useLocalSearchParams<{
    configId: string;
    isPublicConfig?: string;
  }>();

  const [configuration, setConfiguration] = useState<Configuration | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadConfiguration();
  }, [configId]);

  const loadConfiguration = async () => {
    if (!configId) return;

    try {
      setIsLoading(true);
      const config = isPublicConfig
        ? await apiClient.get(ENDPOINTS.CONFIGURATIONS.GET_BY_ID(configId))
        : await apiClient.get(
            ENDPOINTS.USER_CONFIGURATIONS.GET_BY_ID(configId),
          );
      setConfiguration(config);
    } catch (err: any) {
      console.error("Failed to load configuration:", err);
      setError("Impossible de charger la configuration.");
    } finally {
      setIsLoading(false);
    }
  };

  const exerciseConfig = configuration
    ? {
        inhalation: configuration.inhalation,
        retention1: configuration.retention1,
        exhalation: configuration.exhalation,
        retention2: configuration.retention2,
        durationMinutes: configuration.durationMinutes,
      }
    : {
        inhalation: 4,
        retention1: 4,
        exhalation: 4,
        retention2: 4,
        durationMinutes: 5,
      };

  const { state, togglePlayPause, stop, getPhaseLabel, progress, isCompleted } =
    useBreathingExercise(exerciseConfig);

  useEffect(() => {
    if (state.isPlaying && !state.isPaused) {
      if (
        Math.ceil(state.phaseTimeRemaining) ===
        Math.ceil(
          state.currentPhase === "inhale"
            ? exerciseConfig.inhalation
            : state.currentPhase === "retention1"
              ? exerciseConfig.retention1
              : state.currentPhase === "exhale"
                ? exerciseConfig.exhalation
                : exerciseConfig.retention2,
        )
      ) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    }
  }, [state.currentPhase, state.isPlaying]);

  const handleRestart = () => {
    stop();
    setTimeout(() => {
      togglePlayPause();
    }, 100);
  };

  const handleExit = () => {
    stop();
    router.back();
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle="light-content" />
        <View style={styles.centerContainer}>
          <Loader size={60} />
        </View>
      </View>
    );
  }

  if (error || !configuration) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle="light-content" />
        <View style={styles.centerContainer}>
          <Ionicons
            name="alert-circle"
            size={60}
            color={colors.error || "#ef4444"}
          />
          <Text style={[styles.errorText, { color: colors.text }]}>
            {error || "Configuration introuvable"}
          </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={[styles.backText, { color: colors.primary }]}>
              Retour
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (isCompleted) {
    return (
      <>
        <StatusBar barStyle="light-content" />
        <CompletionScreen
          cyclesCompleted={state.cycleCount}
          totalDuration={state.totalTimeElapsed}
          onRestart={handleRestart}
          onExit={handleExit}
        />
      </>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={handleExit} style={styles.closeButton}>
          <Ionicons name="close" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.configName, { color: colors.text }]}>
          {configuration.name}
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.circleContainer}>
          <BreathingCircle
            phase={state.currentPhase}
            inhaleDuration={exerciseConfig.inhalation}
            retention1Duration={exerciseConfig.retention1}
            exhaleDuration={exerciseConfig.exhalation}
            retention2Duration={exerciseConfig.retention2}
            isPlaying={state.isPlaying && !state.isPaused}
          />
        </View>

        <View style={styles.phaseContainer}>
          <PhaseIndicator
            phaseLabel={getPhaseLabel(state.currentPhase)}
            timeRemaining={state.phaseTimeRemaining}
          />
        </View>

        <View style={styles.controlsContainer}>
          <ExerciseControls
            isPlaying={state.isPlaying}
            isPaused={state.isPaused}
            progress={progress}
            totalTimeElapsed={state.totalTimeElapsed}
            durationMinutes={exerciseConfig.durationMinutes}
            onPlayPause={togglePlayPause}
            onStop={stop}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
    gap: 16,
  },
  closeButton: {
    padding: 4,
  },
  configName: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "space-around",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  circleContainer: {
    alignItems: "center",
  },
  phaseContainer: {
    alignItems: "center",
  },
  controlsContainer: {
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
  },
  backText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
