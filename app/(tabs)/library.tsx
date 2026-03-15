import React from "react";
import { View, Text, StyleSheet } from "react-native";
import PageLayout from "@/components/PageLayout";
import { useTheme } from "@/hooks/themeHooks";
import { Ionicons } from "@expo/vector-icons";

export default function LibraryScreen() {
  const { colors } = useTheme();

  return (
    <PageLayout header footer>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Ionicons name="library-outline" size={80} color={colors.textSecondary} />
        <Text style={[styles.title, { color: colors.text }]}>
          Bibliothèque
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Vos configurations sauvegardées apparaîtront ici
        </Text>
        <Text style={[styles.comingSoon, { color: colors.primary }]}>
          Bientôt disponible
        </Text>
      </View>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
  },
  comingSoon: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
  },
});
