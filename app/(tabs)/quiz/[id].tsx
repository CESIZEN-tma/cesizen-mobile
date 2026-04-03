import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTheme } from "@/hooks/themeHooks";
import { useAuth } from "@/hooks/useAuth";
import { useQuiz } from "@/hooks/useQuiz";
import { quizApi } from "@/app/services/api/quizApi";
import QuizQuestion from "@/components/quiz/QuizQuestion";
import PressButton from "@/components/shared/PressButton";
import Loader from "@/components/shared/Loader";
import { Ionicons } from "@expo/vector-icons";
import { Quiz } from "@/types/quiz.types";

export default function QuizTakingScreen() {
  const { colors } = useTheme();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    quizState,
    startQuiz,
    selectAnswer,
    goToNextQuestion,
    goToPreviousQuestion,
    submitQuiz,
    canGoNext,
    canGoPrevious,
    isLastQuestion,
  } = useQuiz();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadQuiz();
  }, [id]);

  const loadQuiz = async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      const quizData = await quizApi.getQuizById(id);

      const quiz: Quiz = {
        id: quizData.id,
        nom: quizData.nom,
        active: quizData.active,
        questions: (quizData.questions ?? [])
          .map((q) => ({
            id: q.id,
            text: q.text,
            position: q.position,
            idQuizz: quizData.id,
            responsesOptions: q.options ?? [],
          }))
          .sort((a, b) => a.position - b.position),
      };

      startQuiz(quiz);
    } catch (err: any) {
      console.error("Failed to load quiz:", err);
      setError("Impossible de charger le quiz. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      handleSubmit();
    } else {
      goToNextQuestion();
    }
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      Alert.alert(
        "Connexion requise",
        "Vous devez être connecté pour sauvegarder votre configuration personnalisée.",
        [
          { text: "Annuler", style: "cancel" },
          {
            text: "Se connecter",
            onPress: () => router.replace("/(auth)/login" as any),
          },
        ]
      );
      return;
    }

    try {
      const configuration = await submitQuiz();
      router.replace({
        pathname: "/(tabs)/quiz/result" as any,
        params: { configId: configuration.id },
      });
    } catch (err: any) {
      console.error("Failed to submit quiz:", err);
      setError("Échec de la soumission. Veuillez réessayer.");
    }
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

  if (error || !quizState.currentQuiz) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle" size={60} color={colors.error || "#ef4444"} />
          <Text style={[styles.errorText, { color: colors.text }]}>
            {error || "Quiz introuvable"}
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

  const currentQuestion = quizState.currentQuiz.questions[quizState.currentQuestionIndex];
  const currentResponse = quizState.responses.find(
    (r) => r.questionId === currentQuestion.id
  );
  const progress =
    ((quizState.currentQuestionIndex + 1) / quizState.currentQuiz.questions.length) *
    100;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="close" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.quizTitle, { color: colors.text }]}>
          {quizState.currentQuiz.nom}
        </Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { backgroundColor: colors.surface }]}>
          <View
            style={[
              styles.progressFill,
              { backgroundColor: colors.primary, width: `${progress}%` },
            ]}
          />
        </View>
        <Text style={[styles.progressText, { color: colors.textSecondary }]}>
          Question {quizState.currentQuestionIndex + 1} /{" "}
          {quizState.currentQuiz.questions.length}
        </Text>
      </View>

      <View style={styles.questionContainer}>
        <QuizQuestion
          question={currentQuestion}
          selectedOptionId={currentResponse?.selectedOptionId || null}
          onSelectOption={(optionId) => selectAnswer(currentQuestion.id, optionId)}
        />
      </View>

      <View style={[styles.navigationContainer, { paddingBottom: 24 + insets.bottom }]}>
        <TouchableOpacity
          onPress={goToPreviousQuestion}
          disabled={!canGoPrevious}
          style={[
            styles.navButton,
            !canGoPrevious && styles.navButtonDisabled,
          ]}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={canGoPrevious ? colors.primary : colors.textSecondary}
          />
          <Text
            style={[
              styles.navButtonText,
              {
                color: canGoPrevious ? colors.primary : colors.textSecondary,
              },
            ]}
          >
            Précédent
          </Text>
        </TouchableOpacity>

        <PressButton
          label={
            quizState.isSubmitting
              ? "Envoi..."
              : isLastQuestion
              ? "Terminer"
              : "Suivant"
          }
          onPress={canGoNext ? handleNext : () => {}}
          width={150}
          height={50}
          secondary={!canGoNext}
        />
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
  backButton: {
    padding: 4,
  },
  quizTitle: {
    fontSize: 20,
    fontWeight: "600",
    flex: 1,
  },
  progressContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    textAlign: "center",
  },
  questionContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    padding: 8,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: "600",
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
