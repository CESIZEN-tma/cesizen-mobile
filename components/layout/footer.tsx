import { useTheme } from "@/hooks/themeHooks";
import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

type NavItem = {
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
};

const navItems: NavItem[] = [
  { icon: "home", route: "/" },
  { icon: "search", route: "/search" },
  { icon: "add-circle", route: "/create" },
  { icon: "heart", route: "/favorites" },
  { icon: "person", route: "/profile" },
];

const Footer = () => {
  const { colors } = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      {navItems.map((item, index) => {
        const isActive = pathname === item.route;
        return (
          <TouchableOpacity
            key={index}
            style={styles.navItem}
            onPress={() => router.navigate(item.route as any)}
          >
            <Ionicons
              name={item.icon}
              size={28}
              color={isActive ? colors.primary : colors.text}
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
    height: 70,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 16,
    paddingBottom: 10,
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
