import { useTheme } from "@/hooks/themeHooks";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Home() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text>Home</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },

  buttonsContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 16,
    marginTop: 30,
  },

  slide: {
    height: 500,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  slideText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
});
