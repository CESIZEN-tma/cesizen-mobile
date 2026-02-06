import { useTheme } from "@/hooks/themeHooks";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type RadioOption = {
  label: string;
  value: string;
};

type RadioGroupProps = {
  options: RadioOption[];
  selectedValue: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

const RadioGroup = ({
  options,
  selectedValue,
  onChange,
  disabled = false,
}: RadioGroupProps) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {options.map((option) => {
        const isSelected = selectedValue === option.value;

        return (
          <TouchableOpacity
            key={option.value}
            activeOpacity={0.7}
            onPress={() => !disabled && onChange(option.value)}
            style={styles.radioItem}
            disabled={disabled}
          >
            <View
              style={[
                styles.radioOuter,
                {
                  borderColor: isSelected ? colors.primary : colors.border,
                },
                disabled && styles.disabled,
              ]}
            >
              {isSelected && (
                <View
                  style={[
                    styles.radioInner,
                    { backgroundColor: colors.primary },
                  ]}
                />
              )}
            </View>

            <Text
              style={[
                styles.label,
                { color: colors.text },
                disabled && styles.disabledText,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  label: {
    marginLeft: 12,
    fontSize: 16,
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.5,
  },
});

export default RadioGroup;
