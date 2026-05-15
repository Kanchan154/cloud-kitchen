import { View } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { useAuthStore } from '@/store/auth.store'
import { useSocketStore } from '@/store/socket.store'
import { Redirect, useSegments } from 'expo-router';
import AppSplashScreen from './AppSplashScreen';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { checkAuth, isCheckingAuth, user, isAuthenticated } = useAuthStore();
    const { initSocket, disconnectSocket } = useSocketStore();
    const hasStartedAuthCheck = useRef(false);

    const segments = useSegments();

    useEffect(() => {
        if (!hasStartedAuthCheck.current && isCheckingAuth) {
            hasStartedAuthCheck.current = true;
            void checkAuth();
        }
    }, [checkAuth, isCheckingAuth]);

    // Initialize socket when user is authenticated
    useEffect(() => {
        if (isAuthenticated && !isCheckingAuth) {
            initSocket();
        } else if (!isAuthenticated && !isCheckingAuth) {
            disconnectSocket();
        }
    }, [isAuthenticated, isCheckingAuth, initSocket, disconnectSocket]);

    // Cleanup socket on unmount
    useEffect(() => {
        return () => {
            disconnectSocket();
        };
    }, [disconnectSocket]);

    const isAuthScreen = segments[0] === "(auth)";

    if (isCheckingAuth) return <AppSplashScreen />;

    if (isAuthScreen && user && isAuthenticated) {
        if (user.role === "customer") return <Redirect href="/customer/(tabs)" />
        else if (user.role === "rider") return <Redirect href="/rider/(tabs)" />
        else if (user.role === "seller") return <Redirect href="/seller/(tabs)" />
    } else if (user && !user.role) return <Redirect href="/chooseRole" />
    else if (!isAuthScreen && !user) return <Redirect href="/(auth)" />

    return <View className='flex-1'>{children}</View>
}

export default ProtectedRoute