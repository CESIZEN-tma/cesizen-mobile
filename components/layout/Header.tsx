import { useTheme } from "@/hooks/themeHooks";
import { useAuth } from "@/hooks/useAuth";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import Switch from "../shared/Switch";
import SlideInMenu from "./SlideInMenu";

type HeaderProps = {
  onMenuPress?: () => void;
};

const Header = ({ onMenuPress }: HeaderProps) => {
  const { colors, theme, toggleTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 600 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const handleMenuPress = () => {
    if (onMenuPress) {
      onMenuPress();
    } else {
      setIsMenuOpen(true);
    }
  };

  const handleAuthAction = () => {
    if (isAuthenticated) {
      router.push("/(tabs)/profile" as any);
    } else {
      router.push("/(auth)/login");
    }
  };

  return (
    <>
      <Animated.View style={[styles.container, animatedStyle]}>
        <TouchableOpacity onPress={handleMenuPress} style={styles.menuButton}>
          <Ionicons name="menu" size={28} color={colors.text} />
        </TouchableOpacity>

      <View style={styles.rightSection}>
        <TouchableOpacity
          onPress={handleAuthAction}
          style={[
            styles.authButton,
            {
              backgroundColor: isAuthenticated
                ? colors.surface
                : colors.secondary,
            },
          ]}
        >
          {isAuthenticated ? (
            <>
              <Ionicons
                name="person-circle-outline"
                size={20}
                color={colors.text}
              />
              <Text style={[styles.authButtonText, { color: colors.text }]}>
                {user?.firstName || "User"}
              </Text>
            </>
          ) : (
            <>
              <Ionicons name="log-in-outline" size={20} color="#fff" />
              <Text style={[styles.authButtonText, { color: "#fff" }]}>
                Se connecter
              </Text>
            </>
          )}
        </TouchableOpacity>
        <Switch
          isOn={theme === "dark"}
          onToggleOff={toggleTheme}
          onToggleOn={toggleTheme}
          iconOff="sunny-outline"
          iconOn="moon-outline"
          colorOff="#FDB813"
          colorOn="#1e293b"
          iconColorOn="#FDB813"
          iconColorOff="#1e293b"
        />
      </View>
    </Animated.View>

    <SlideInMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)}  />
  </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 60,
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  menuButton: {
    padding: 8,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  authButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  authButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
});

export default Header;
