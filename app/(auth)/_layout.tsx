import { useAuth } from "@/hooks/useAuth";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

export default function AuthLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) return;

    const inAuthFlow = segments.includes("(auth)");
    const inFirstOpenedPage = segments[segments.length - 1] === "firstOpenedPage";

    // If authenticated and trying to access login/register (not firstOpenedPage), redirect to main app
    if (isAuthenticated && inAuthFlow && !inFirstOpenedPage) {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, isLoading, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="firstOpenedPage" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="confirm-account" />
    </Stack>
  );
}
