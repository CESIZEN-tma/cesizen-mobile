import { useTheme } from "@/hooks/themeHooks";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";
import SliderComponent from "@react-native-community/slider";

type SliderProps = {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  showValue?: boolean;
  disabled?: boolean;
};

const Slider = ({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  showValue = true,
  disabled = false,
}: SliderProps) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {label && (
          <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
        )}
        {showValue && (
          <Text style={[styles.value, { color: colors.primary }]}>
            {value}
          </Text>
        )}
      </View>

      <SliderComponent
        value={value}
        onValueChange={onChange}
        minimumValue={min}
        maximumValue={max}
        step={step}
        disabled={disabled}
        minimumTrackTintColor={colors.primary}
        maximumTrackTintColor={colors.border}
        thumbTintColor={colors.primary}
        style={styles.slider}
      />

      <View style={styles.range}>
        <Text style={[styles.rangeText, { color: colors.border }]}>{min}</Text>
        <Text style={[styles.rangeText, { color: colors.border }]}>{max}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
  },
  value: {
    fontSize: 16,
    fontWeight: "700",
  },
  slider: {
    width: "100%",
    height: 40,
  },
  range: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rangeText: {
    fontSize: 12,
  },
});

export default Slider;