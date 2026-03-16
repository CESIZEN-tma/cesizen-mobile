import { useTheme } from "@/hooks/themeHooks";
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
};

const navItems: NavItem[] = [
  {
    icon: "home-outline",
    activeIcon: "home",
    route: "/(tabs)",
    matchPaths: ["/", "/(tabs)", "/(tabs)/"]
  },
  {
    icon: "list-outline",
    activeIcon: "list",
    route: "/(tabs)/quizzes",
    matchPaths: ["/quizzes", "/(tabs)/quizzes"]
  },
  {
    icon: "library-outline",
    activeIcon: "library",
    route: "/(tabs)/library",
    matchPaths: ["/library", "/(tabs)/library"]
  },
  {
    icon: "person-outline",
    activeIcon: "person",
    route: "/(tabs)/profile",
    matchPaths: ["/profile", "/(tabs)/profile"]
  },
];

const isRouteActive = (pathname: string, item: NavItem): boolean => {
  return item.matchPaths.some(path => pathname === path || pathname.startsWith(path + "/"));
};

const Footer = () => {
  const { colors } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useEffect(() => {
  }, [pathname]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          paddingBottom: insets.bottom + 10,
        },
      ]}
    >
      {navItems.map((item, index) => {
        const isActive = isRouteActive(pathname, item);
        return (
          <TouchableOpacity
            key={index}
            style={styles.navItem}
            onPress={() => router.navigate(item.route as any)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isActive ? item.activeIcon : item.icon}
              size={28}
              color={isActive ? colors.primary : colors.textSecondary}
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
