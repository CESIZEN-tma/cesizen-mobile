import { useTheme } from "@/hooks/themeHooks";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, TouchableOpacity } from "react-native";

type SwitchProps = {
  isOn: boolean;
  onToggleOn: () => void;
  onToggleOff: () => void;
  colorOn?: string;
  colorOff?: string;
  iconOn?: keyof typeof Ionicons.glyphMap;
  iconOff?: keyof typeof Ionicons.glyphMap;
  iconColorOn?: string;
  iconColorOff?: string;
  width?: number;
  height?: number;
  accessibilityLabel?: string;
};

const Switch = ({
  isOn,
  onToggleOn,
  onToggleOff,
  colorOn,
  colorOff,
  iconOn = "checkmark",
  iconOff = "close",
  iconColorOn,
  iconColorOff,
  width = 60,
  height = 32,
  accessibilityLabel,
}: SwitchProps) => {
  const { colors } = useTheme();
  const translateX = useRef(new Animated.Value(isOn ? 1 : 0)).current;

  const activeColorOn = colorOn || colors.primary;
  const activeColorOff = colorOff || colors.border;
  const activeIconColorOn = iconColorOn || colors.primary;
  const activeIconColorOff = iconColorOff || colors.border;

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: isOn ? 1 : 0,
      useNativeDriver: true,
      tension: 80,
      friction: 8,
    }).start();
  }, [isOn]);

  const handlePress = () => {
    if (isOn) {
      onToggleOff();
    } else {
      onToggleOn();
    }
  };

  const thumbTranslate = translateX.interpolate({
    inputRange: [0, 1],
    outputRange: [2, width - height + 2],
  });

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      accessibilityRole="switch"
      accessibilityState={{ checked: isOn }}
      accessibilityLabel={accessibilityLabel}
      style={[
        styles.container,
        {
          width,
          height,
          backgroundColor: isOn ? activeColorOn : activeColorOff,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.thumb,
          {
            width: height - 4,
            height: height - 4,
            transform: [{ translateX: thumbTranslate }],
          },
        ]}
      >
        <Ionicons
          name={isOn ? iconOn : iconOff}
          size={height - 12}
          color={isOn ? activeIconColorOn : activeIconColorOff}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 100,
    justifyContent: "center",
  },
  thumb: {
    backgroundColor: "#fff",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
});

export default Switch;
