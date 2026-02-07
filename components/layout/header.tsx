import { useTheme } from "@/hooks/themeHooks";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Switch from "../shared/Switch";

type HeaderProps = {
  onMenuPress?: () => void;
};

const Header = ({ onMenuPress }: HeaderProps) => {
  const { colors, theme, toggleTheme } = useTheme();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
        <Ionicons name="menu" size={28} color={colors.text} />
      </TouchableOpacity>
      <Switch
        isOn={theme === "dark"}
        onToggleOff={toggleTheme}
        onToggleOn={toggleTheme}
        iconOff="sunny-outline"
        iconOn="moon-outline"
        colorOff="black"
        colorOn="white"
      />
    </View>
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
});

export default Header;
