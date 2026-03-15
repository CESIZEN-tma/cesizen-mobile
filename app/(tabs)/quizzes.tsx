import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import PageLayout from "@/components/PageLayout";
import { useTheme } from "@/hooks/themeHooks";
import { quizApi } from "@/app/services/api/quizApi";
import { QuizDTO } from "@/app/services/api/types";
import Loader from "@/components/shared/Loader";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function QuizzesScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<QuizDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      setIsLoading(true);
      const data = await quizApi.getQuizzes();
      setQuizzes(data.filter((q) => q.active));
    } catch (err: any) {
      console.error("Failed to load quizzes:", err);
      setError("Impossible de charger les quiz. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuizPress = (quizId: string) => {
    router.push(`/(tabs)/quiz/${quizId}` as any);
  };

  if (isLoading) {
    return (
      <PageLayout header footer>
        <View style={styles.centerContainer}>
          <Loader size={60} />
        </View>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout header footer>
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle" size={60} color={colors.error || "#ef4444"} />
          <Text style={[styles.errorText, { color: colors.text }]}>{error}</Text>
          <TouchableOpacity onPress={loadQuizzes} style={styles.retryButton}>
            <Text style={[styles.retryText, { color: colors.primary }]}>
              Réessayer
            </Text>
          </TouchableOpacity>
        </View>
      </PageLayout>
    );
  }

  return (
    <PageLayout header footer>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>
          Quiz de respiration
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Découvrez le pattern de respiration qui vous convient
        </Text>

        {quizzes.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="documents-outline" size={80} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Aucun quiz disponible pour le moment
            </Text>
          </View>
        ) : (
          <FlatList
            data={quizzes}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.quizCard, { backgroundColor: colors.surface }]}
                onPress={() => handleQuizPress(item.id)}
                activeOpacity={0.7}
              >
                <View style={styles.quizHeader}>
                  <View style={styles.iconContainer}>
                    <Ionicons
                      name="clipboard-outline"
                      size={32}
                      color={colors.primary}
                    />
                  </View>
                  <View style={styles.quizInfo}>
                    <Text style={[styles.quizName, { color: colors.text }]}>
                      {item.nom}
                    </Text>
                    <Text style={[styles.quizDetails, { color: colors.textSecondary }]}>
                      {item.questions.length} question{item.questions.length > 1 ? "s" : ""}
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={24}
                    color={colors.textSecondary}
                  />
                </View>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
  },
  listContent: {
    paddingBottom: 24,
  },
  quizCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quizHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    backgroundColor: "rgba(88, 204, 2, 0.1)",
  },
  quizInfo: {
    flex: 1,
  },
  quizName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  quizDetails: {
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    padding: 12,
  },
  retryText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
