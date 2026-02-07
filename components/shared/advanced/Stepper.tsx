import { useTheme } from "@/hooks/themeHooks";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export type Step = {
  label: string;
  description?: string;
};

type StepperProps = {
  steps: Step[];
  currentStep: number;
};

const Stepper = ({ steps, currentStep }: StepperProps) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isUpcoming = index > currentStep;

        return (
          <View key={index} style={styles.stepContainer}>
            <View style={styles.stepIndicator}>
              <View
                style={[
                  styles.circle,
                  {
                    backgroundColor: isCompleted || isCurrent
                      ? colors.primary
                      : colors.border,
                  },
                ]}
              >
                {isCompleted ? (
                  <Ionicons name="checkmark" size={16} color="#fff" />
                ) : (
                  <Text style={styles.stepNumber}>{index + 1}</Text>
                )}
              </View>
              
              {index < steps.length - 1 && (
                <View
                  style={[
                    styles.line,
                    {
                      backgroundColor: isCompleted
                        ? colors.primary
                        : colors.border,
                    },
                  ]}
                />
              )}
            </View>

            <View style={styles.stepContent}>
              <Text
                style={[
                  styles.stepLabel,
                  {
                    color: isCurrent ? colors.primary : colors.text,
                    fontWeight: isCurrent ? "700" : "400",
                  },
                ]}
              >
                {step.label}
              </Text>
              {step.description && (
                <Text
                  style={[styles.stepDescription, { color: colors.border }]}
                >
                  {step.description}
                </Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
  },
  stepContainer: {
    flexDirection: "row",
    marginBottom: 24,
  },
  stepIndicator: {
    alignItems: "center",
    marginRight: 16,
  },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  stepNumber: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  line: {
    width: 2,
    flex: 1,
    marginTop: 8,
  },
  stepContent: {
    flex: 1,
    paddingTop: 4,
  },
  stepLabel: {
    fontSize: 16,
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
  },
});

export default Stepper;