// app/(tabs)/_layout.tsx
import PageLayout from "@/components/PageLayout";
import { Stack } from "expo-router";

export default function TabsLayout() {
  return (
    <PageLayout header footer>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
      </Stack>
    </PageLayout>
  );
}
