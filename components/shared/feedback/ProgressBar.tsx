import { useTheme } from "@/hooks/themeHooks";
import React from "react";
import { View, Text, StyleSheet } from "react-native";

type ProgressBarProps = {
  progress: number;
  showPercentage?: boolean;
  height?: number;
  color?: string;
};

const ProgressBar = ({
  progress,
  showPercentage = true,
  height = 8,
  color,
}: ProgressBarProps) => {
  const { colors } = useTheme();
  const percentage = Math.min(Math.max(progress, 0), 100);
  const barColor = color || colors.primary;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.track,
          { height, backgroundColor: colors.border },
        ]}
      >
        <View
          style={[
            styles.fill,
            {
              width: `${percentage}%`,
              backgroundColor: barColor,
            },
          ]}
        />
      </View>
      {showPercentage && (
        <Text style={[styles.percentage, { color: colors.text }]}>
          {Math.round(percentage)}%
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  track: {
    flex: 1,
    borderRadius: 100,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 100,
  },
  percentage: {
    fontSize: 14,
    fontWeight: "600",
    minWidth: 40,
    textAlign: "right",
  },
});

export default ProgressBar;