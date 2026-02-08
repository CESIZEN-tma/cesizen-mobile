import { useTheme } from "@/hooks/themeHooks";
import React, { useRef } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity } from "react-native";

type PressableButtonProps = {
  width?: number;
  height?: number;
  secondary?: boolean;
  label: string;
  onPress?: () => void;
};

export default function PressButton({
  width = 200,
  height = 40,
  secondary = false,
  label,
  onPress,
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
        <Text style={[styles.text, { color: "#fff" }]}>{label}</Text>
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

  text: {
    fontWeight: "600",
  },
});
