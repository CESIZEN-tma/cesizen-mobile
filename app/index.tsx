import { useFirstLaunch } from "@/hooks/useFirstLaunch";
import { Redirect } from "expo-router";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function Index() {
  const { isFirstLaunch, isLoading } = useFirstLaunch();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // First launch - show onboarding
  if (isFirstLaunch) {
    return <Redirect href="/(auth)/firstOpenedPage" />;
  }

  // Not first launch - always go to main app
  return <Redirect href="/(tabs)" />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
