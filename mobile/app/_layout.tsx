import ProtectedRoute from "@/components/shared/ProtectedRoute";
import "../global.css";
import { Stack } from "expo-router";
import { useAuthStore } from "@/store/auth.store";
import { useEffect } from "react";

export default function RootLayout() {
  const { getLocation } = useAuthStore();
  useEffect(() => {
    getLocation();
  }, [])
  return (
    <ProtectedRoute>

      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="customer/(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="seller/(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="rider/(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="customer/restaurant/[restaurant]" options={{ headerShown: false }} />
        <Stack.Screen name="customer/checkout/index" options={{ headerShown: false }} />
        <Stack.Screen name="customer/orders/index" options={{ headerShown: false }} />
        <Stack.Screen name="customer/paymentSuccess/index" options={{ headerShown: false }} />
      </Stack>
    </ProtectedRoute>
  );
}
