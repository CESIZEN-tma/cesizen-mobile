import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Question, ResponseOption } from "@/types/quiz.types";
import QuizRadioButton from "./QuizRadioButton";
import { useTheme } from "@/hooks/themeHooks";

interface QuizQuestionProps {
  question: Question;
  selectedOptionId: string | null;
  onSelectOption: (optionId: string) => void;
}

export default function QuizQuestion({
  question,
  selectedOptionId,
  onSelectOption,
}: QuizQuestionProps) {
  const { colors } = useTheme();

  const sortedOptions = [...question.responsesOptions].sort(
    (a, b) => a.position - b.position
  );

  return (
    <View style={styles.container}>
      <Text style={[styles.questionText, { color: colors.text }]}>
        {question.text}
      </Text>

      <View style={styles.optionsContainer}>
        {sortedOptions.map((option) => (
          <QuizRadioButton
            key={option.id}
            label={option.label}
            selected={selectedOptionId === option.id}
            onPress={() => onSelectOption(option.id)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  questionText: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 24,
    lineHeight: 28,
  },
  optionsContainer: {
    gap: 12,
  },
  optionWrapper: {
    width: "100%",
  },
});
