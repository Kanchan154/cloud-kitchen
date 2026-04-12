import ProtectedRoute from "@/components/ProtectedRoute";
import "../global.css";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <ProtectedRoute>

      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </ProtectedRoute>
  );
}
