import { View } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { useAuthStore } from '@/store/auth.store'
import { Redirect, useSegments } from 'expo-router';
import AppSplashScreen from './AppSplashScreen';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { checkAuth, isCheckingAuth, user, isAuthenticated } = useAuthStore();
    const hasStartedAuthCheck = useRef(false);

    const segments = useSegments();
    useEffect(() => {
        if (!hasStartedAuthCheck.current && isCheckingAuth) {
            hasStartedAuthCheck.current = true;
            void checkAuth();
        }
    }, [checkAuth, isCheckingAuth]);

    const isAuthScreen = segments[0] === "(auth)";
    const isTabScreen = segments[0] === "(tabs)";

    if (isCheckingAuth) return <AppSplashScreen />;

    if (isAuthScreen && user && isAuthenticated) {
        if (user.role) return <Redirect href="/(tabs)" />
    } else if (user && !user.role) return <Redirect href="/chooseRole" />
    else if (isTabScreen && !user) return <Redirect href="/(auth)" />

    return <View className='flex-1'>{children}</View>
}

export default ProtectedRoute