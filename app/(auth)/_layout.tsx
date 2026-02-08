import { useAuth } from "@/hooks/useAuth";
import { useFirstLaunch } from "@/hooks/useFirstLaunch";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";

export default function AuthLayout() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { isFirstLaunch, isLoading: firstLaunchLoading } = useFirstLaunch();
  const router = useRouter();
  const segments = useSegments();

  const isLoading = authLoading || firstLaunchLoading;

  useEffect(() => {
    if (isLoading) return;

    const inFirstOpenedPage = segments[segments.length - 1] === "firstOpenedPage";

    // If first launch, show firstOpenedPage
    if (isFirstLaunch && !inFirstOpenedPage) {
      router.replace("/(auth)/firstOpenedPage");
      return;
    }

    // If not first launch and authenticated, redirect to main app
    if (!isFirstLaunch && isAuthenticated && !inFirstOpenedPage) {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, isFirstLaunch, isLoading, segments]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="firstOpenedPage" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="forgot-password" />
    </Stack>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
