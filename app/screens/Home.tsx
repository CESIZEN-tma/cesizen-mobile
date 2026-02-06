import Loader from "@/components/shared/Loader";
import PressButton from "@/components/shared/PressButton";
import { useTheme } from "@/hooks/themeHooks";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Home() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Home</Text>
      <PressButton label="Go to details" />
      <Loader fullSized={true} />
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
});
