import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTheme } from "@/hooks/themeHooks";
import { useQuiz } from "@/hooks/useQuiz";
import { apiClient } from "@/app/services/api/apiClient";
import { ENDPOINTS } from "@/app/services/api/endpoints";
import PressButton from "@/components/shared/PressButton";
import Loader from "@/components/shared/Loader";
import { Ionicons } from "@expo/vector-icons";
import { Configuration } from "@/types/api.types";

export default function QuizResultScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { configId } = useLocalSearchParams<{ configId: string }>();
  const { resetQuiz } = useQuiz();

  const [configuration, setConfiguration] = useState<Configuration | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadConfiguration();
    return () => {
      resetQuiz();
    };
  }, [configId]);

  const loadConfiguration = async () => {
    if (!configId) return;

    try {
      setIsLoading(true);
      const config = await apiClient.get(
        ENDPOINTS.USER_CONFIGURATIONS.GET_BY_ID(configId)
      );
      setConfiguration(config);
    } catch (err: any) {
      console.error("Failed to load configuration:", err);
      setError("Impossible de charger la configuration.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartExercise = () => {
    if (configuration) {
      router.push(`/(tabs)/exercise/${configuration.id}` as any);
    }
  };

  const handleBackToQuizzes = () => {
    router.replace("/(tabs)/quizzes" as any);
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.centerContainer}>
          <Loader size={60} />
        </View>
      </View>
    );
  }

  if (error || !configuration) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle" size={60} color={colors.error || "#ef4444"} />
          <Text style={[styles.errorText, { color: colors.text }]}>
            {error || "Configuration introuvable"}
          </Text>
          <PressButton
            label="Retour aux quiz"
            onPress={handleBackToQuizzes}
            width={200}
            height={50}
          />
        </View>
      </View>
    );
  }

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
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.successHeader}>
        <Ionicons name="checkmark-circle" size={80} color={colors.primary} />
        <Text style={[styles.successTitle, { color: colors.text }]}>
          Configuration générée !
        </Text>
        <Text style={[styles.successSubtitle, { color: colors.textSecondary }]}>
          Votre pattern de respiration personnalisé est prêt
        </Text>
      </View>

      <View style={[styles.configCard, { backgroundColor: colors.surface }]}>
        <Text style={[styles.configName, { color: colors.text }]}>
          {configuration.name}
        </Text>

        <View style={styles.configDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="fitness-outline" size={20} color={colors.primary} />
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
              Objectif:
            </Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>
              {configuration.objective}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="star-outline" size={20} color={colors.primary} />
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
              Difficulté:
            </Text>
            {renderDifficulty()}
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={20} color={colors.primary} />
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
              Durée:
            </Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>
              {configuration.durationMinutes} minutes
            </Text>
          </View>
        </View>

        <View style={styles.breathingPattern}>
          <Text style={[styles.patternTitle, { color: colors.text }]}>
            Pattern de respiration
          </Text>
          <View style={styles.patternRow}>
            <View style={styles.patternItem}>
              <Ionicons name="arrow-down" size={24} color={colors.secondary} />
              <Text style={[styles.patternLabel, { color: colors.textSecondary }]}>
                Inspire
              </Text>
              <Text style={[styles.patternValue, { color: colors.text }]}>
                {configuration.inhalation}s
              </Text>
            </View>

            <View style={styles.patternItem}>
              <Ionicons name="pause" size={24} color={colors.secondary} />
              <Text style={[styles.patternLabel, { color: colors.textSecondary }]}>
                Retiens
              </Text>
              <Text style={[styles.patternValue, { color: colors.text }]}>
                {configuration.retention1}s
              </Text>
            </View>

            <View style={styles.patternItem}>
              <Ionicons name="arrow-up" size={24} color={colors.secondary} />
              <Text style={[styles.patternLabel, { color: colors.textSecondary }]}>
                Expire
              </Text>
              <Text style={[styles.patternValue, { color: colors.text }]}>
                {configuration.exhalation}s
              </Text>
            </View>

            <View style={styles.patternItem}>
              <Ionicons name="pause" size={24} color={colors.secondary} />
              <Text style={[styles.patternLabel, { color: colors.textSecondary }]}>
                Retiens
              </Text>
              <Text style={[styles.patternValue, { color: colors.text }]}>
                {configuration.retention2}s
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <PressButton
          label="Démarrer l'exercice"
          onPress={handleStartExercise}
          width={300}
          height={56}
        />
        <PressButton
          label="Retour aux quiz"
          onPress={handleBackToQuizzes}
          width={300}
          height={56}
          secondary
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  successHeader: {
    alignItems: "center",
    marginBottom: 32,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  successSubtitle: {
    fontSize: 16,
    textAlign: "center",
  },
  configCard: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  configName: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  configDetails: {
    gap: 12,
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailLabel: {
    fontSize: 16,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  breathingPattern: {
    marginTop: 16,
  },
  patternTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  patternRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  patternItem: {
    alignItems: "center",
    gap: 4,
  },
  patternLabel: {
    fontSize: 12,
  },
  patternValue: {
    fontSize: 18,
    fontWeight: "700",
  },
  buttonContainer: {
    gap: 16,
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
  },
});
