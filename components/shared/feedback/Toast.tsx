import { useTheme } from "@/hooks/themeHooks";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export type ToastType = "success" | "error" | "warning" | "info";

type ToastProps = {
  visible: boolean;
  message: string;
  type?: ToastType;
  duration?: number;
  onHide: () => void;
};

const Toast = ({
  visible,
  message,
  type = "info",
  duration = 3000,
  onHide,
}: ToastProps) => {
  const { colors } = useTheme();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-100)).current;

  const typeConfig = {
    success: { icon: "checkmark-circle", color: "#10b981" },
    error: { icon: "close-circle", color: "#ef4444" },
    warning: { icon: "warning", color: "#f59e0b" },
    info: { icon: "information-circle", color: colors.secondary },
  };

  const config = typeConfig[type];

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => onHide());
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <Ionicons
        name={config.icon as any}
        size={24}
        color={config.color}
        style={styles.icon}
      />
      <Text style={[styles.message, { color: colors.text }]} numberOfLines={2}>
        {message}
      </Text>
      <TouchableOpacity onPress={hideToast} style={styles.closeButton}>
        <Ionicons name="close" size={20} color={colors.text} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 9999,
  },
  icon: {
    marginRight: 12,
  },
  message: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
  },
  closeButton: {
    padding: 4,
    marginLeft: 8,
  },
});

export default Toast;