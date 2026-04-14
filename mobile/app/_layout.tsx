import ProtectedRoute from "@/components/shared/ProtectedRoute";
import "../global.css";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <ProtectedRoute>

      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="customer/(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="seller/(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="rider/(tabs)" options={{ headerShown: false }} />
      </Stack>
    </ProtectedRoute>
  );
}
