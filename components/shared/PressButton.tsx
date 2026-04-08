import { useTheme } from "@/hooks/themeHooks";
import { Ionicons } from "@expo/vector-icons";
import React, { useRef } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type PressableButtonProps = {
  width?: number;
  height?: number;
  secondary?: boolean;
  label: string;
  onPress?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
};

export default function PressButton({
  width = 200,
  height = 40,
  secondary = false,
  label,
  onPress,
  icon,
}: PressableButtonProps) {
  const { colors } = useTheme();
  const [borderRadius, setBorderRadius] = React.useState(2);
  const translateY = useRef(new Animated.Value(-4)).current;

  const pressIn = () => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: 80,
      useNativeDriver: true,
    }).start();
  };

  const pressOut = () => {
    Animated.timing(translateY, {
      toValue: -4,
      duration: 80,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      onPressIn={pressIn}
      onPressOut={pressOut}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[
        styles.button,
        {
          width,
          height,
          borderRadius,
          backgroundColor: secondary ? colors.gray600 : colors.shadowSecondary,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.buttonInner,
          {
            transform: [{ translateY }],
            borderRadius,
            backgroundColor: secondary ? colors.gray400 : colors.secondary,
          },
        ]}
      >
        <View style={styles.content}>
          {icon && (
            <Ionicons name={icon} size={20} color="#fff" style={styles.icon} />
          )}
          {label && <Text style={[styles.text, { color: "#fff" }]}>{label}</Text>}
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {},

  buttonInner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  icon: {
    marginRight: 4,
  },

  text: {
    fontWeight: "600",
  },
});
