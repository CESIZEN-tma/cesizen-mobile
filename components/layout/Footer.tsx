import { useTheme } from "@/hooks/themeHooks";
import { useAuth } from "@/hooks/useAuth";
import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type NavItem = {
  icon: keyof typeof Ionicons.glyphMap;
  activeIcon: keyof typeof Ionicons.glyphMap;
  route: string;
  matchPaths: string[];
  label: string;
  authNeeded?: boolean;
};

const navItems: NavItem[] = [
  {
    icon: "home-outline",
    activeIcon: "home",
    route: "/(tabs)",
    matchPaths: ["/", "/(tabs)", "/(tabs)/"],
    label: "Accueil",
  },
  {
    icon: "list-outline",
    activeIcon: "list",
    route: "/(tabs)/quizzes",
    matchPaths: ["/quizzes", "/(tabs)/quizzes"],
    label: "Quiz",
  },
  {
    icon: "library-outline",
    activeIcon: "library",
    route: "/(tabs)/library",
    matchPaths: ["/library", "/(tabs)/library"],
    label: "Bibliothèque",
  },
  {
    icon: "newspaper-outline",
    activeIcon: "newspaper",
    route: "/(tabs)/resources",
    matchPaths: ["/resources", "/(tabs)/resources"],
    label: "Actualités",
  },
  {
    icon: "person-outline",
    activeIcon: "person",
    route: "/(tabs)/profile",
    matchPaths: ["/profile", "/(tabs)/profile"],
    label: "Profil",
    authNeeded: true,
  },
];

const isRouteActive = (pathname: string, item: NavItem): boolean => {
  return item.matchPaths.some(
    (path) => pathname === path || pathname.startsWith(path + "/"),
  );
};

const Footer = () => {
  const { isAuthenticated } = useAuth();
  const { colors } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useEffect(() => {}, [pathname]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          paddingBottom: insets.bottom + 10,
        },
      ]}
      accessibilityRole="tablist"
    >
      {navItems.map((item, index) => {
        if (item.authNeeded && !isAuthenticated) return null;
        const isActive = isRouteActive(pathname, item);
        return (
          <TouchableOpacity
            key={index}
            style={styles.navItem}
            onPress={() => router.navigate(item.route as any)}
            activeOpacity={0.7}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={item.label}
          >
            <Ionicons
              name={isActive ? item.activeIcon : item.icon}
              size={28}
              color={isActive ? colors.primary : colors.textSecondary}
              importantForAccessibility="no"
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 16,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.1)",
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
});

export default Footer;
