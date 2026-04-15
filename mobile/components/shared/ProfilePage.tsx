import React, { useEffect } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

import { AUTH_COLORS } from "@/constants";
import { useAuthStore } from "@/store/auth.store";

const ProfilePage = () => {
    const { user, logout, location } = useAuthStore();

    const cardScale = useSharedValue(0.96);
    const cardTranslateY = useSharedValue(18);
    const logoutScale = useSharedValue(1);

    useEffect(() => {
        cardScale.value = withTiming(1, {
            duration: 450,
            easing: Easing.out(Easing.quad),
        });
        cardTranslateY.value = withTiming(0, {
            duration: 450,
            easing: Easing.out(Easing.quad),
        });
    }, [cardScale, cardTranslateY]);

    const cardStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: cardScale.value },
            { translateY: cardTranslateY.value },
        ],
    }));

    const logoutButtonStyle = useAnimatedStyle(() => ({
        transform: [{ scale: logoutScale.value }],
    }));

    const handleLogout = async () => {
        logoutScale.value = withTiming(0.95, { duration: 90 }, () => {
            logoutScale.value = withTiming(1, { duration: 140 });
        });
        await logout();
    };

    const initials = user?.name?.[0]?.toUpperCase() ?? "?";

    return (
        <View
            className="flex-1"
            style={{ backgroundColor: AUTH_COLORS.background }}
        >
            <View
                className="absolute"
                style={{
                    width: 260,
                    height: 260,
                    borderRadius: 130,
                    backgroundColor: AUTH_COLORS.accent,
                    opacity: 0.16,
                    top: -80,
                    right: -60,
                }}
            />
            <View
                className="absolute"
                style={{
                    width: 320,
                    height: 320,
                    borderRadius: 160,
                    backgroundColor: AUTH_COLORS.primary,
                    opacity: 0.12,
                    bottom: -130,
                    left: -90,
                }}
            />

            <ScrollView
                contentContainerClassName="px-6 pt-14 pb-9"
                showsVerticalScrollIndicator={false}
            >
                <View className="flex-row items-center justify-between mb-6">
                    <View>
                        <Text
                            className="text-2xl font-extrabold"
                            style={{ color: AUTH_COLORS.textPrimary, letterSpacing: 0.6 }}
                        >
                            Profile
                        </Text>
                        <Text
                            className="mt-1 text-xs"
                            style={{ color: AUTH_COLORS.textSubtle, letterSpacing: 0.2 }}
                        >
                            Manage your account, preferences, and sessions.
                        </Text>
                    </View>
                </View>

                <Animated.View
                    className="flex-row items-center px-4 pt-4 pb-5 mb-6 border rounded-2xl"
                    style={[
                        {
                            backgroundColor: AUTH_COLORS.card,
                            borderColor: AUTH_COLORS.cardBorder,
                        },
                        cardStyle,
                    ]}
                >
                    {user?.image ? (
                        <Image
                            source={{ uri: user.image }}
                            className="w-16 h-16 mr-4 rounded-full"
                        />
                    ) : (
                        <View
                            className="items-center justify-center w-16 h-16 mr-4 border rounded-full"
                            style={{
                                backgroundColor: AUTH_COLORS.chip,
                                borderColor: AUTH_COLORS.chipBorder,
                            }}
                        >
                            <Text
                                className="text-xl font-bold"
                                style={{ color: AUTH_COLORS.primary }}
                            >
                                {initials}
                            </Text>
                        </View>
                    )}

                    <View className="flex-1">
                        <Text
                            className="text-base font-semibold"
                            style={{ color: AUTH_COLORS.textPrimary }}
                            numberOfLines={1}
                        >
                            {user?.name ?? "Guest user"}
                        </Text>
                        <Text
                            className="mt-1 text-xs"
                            style={{ color: AUTH_COLORS.textMuted }}
                            numberOfLines={1}
                        >
                            {user?.email ?? "Sign in to sync your data"}
                        </Text>

                        {user?.role && (
                            <View
                                className="self-start px-3 py-1 mt-3 border rounded-full"
                                style={{
                                    backgroundColor: AUTH_COLORS.chip,
                                    borderColor: AUTH_COLORS.chipBorder,
                                }}
                            >
                                <Text
                                    className="text-[11px] font-semibold uppercase"
                                    style={{
                                        color: AUTH_COLORS.textMuted,
                                        letterSpacing: 0.8,
                                    }}
                                >
                                    {user.role}
                                </Text>
                            </View>
                        )}
                    </View>
                </Animated.View>

                <View className="flex-row justify-between px-4 py-4 mb-6 border rounded-2xl"
                    style={{
                        backgroundColor: AUTH_COLORS.card,
                        borderColor: AUTH_COLORS.cardBorder,
                    }}
                >
                    <View className="items-center flex-1">
                        <Text
                            className="text-lg font-semibold"
                            style={{ color: AUTH_COLORS.primary }}
                        >
                            12
                        </Text>
                        <Text
                            className="mt-1 text-[11px]"
                            style={{ color: AUTH_COLORS.textSubtle }}
                        >
                            Orders
                        </Text>
                    </View>
                    <View className="items-center flex-1">
                        <Text
                            className="text-lg font-semibold"
                            style={{ color: AUTH_COLORS.accent }}
                        >
                            5
                        </Text>
                        <Text
                            className="mt-1 text-[11px]"
                            style={{ color: AUTH_COLORS.textSubtle }}
                        >
                            Favorites
                        </Text>
                    </View>
                    <View className="items-center flex-1">
                        <Text
                            className="text-lg font-semibold"
                            style={{ color: AUTH_COLORS.textPrimary }}
                        >
                            4.8★
                        </Text>
                        <Text
                            className="mt-1 text-[11px]"
                            style={{ color: AUTH_COLORS.textSubtle }}
                        >
                            Rating
                        </Text>
                    </View>
                </View>

                <View
                    className="px-4 py-4 mb-5 border rounded-2xl"
                    style={{
                        backgroundColor: AUTH_COLORS.card,
                        borderColor: AUTH_COLORS.cardBorder,
                    }}
                >
                    <Text
                        className="mb-3 text-xs font-semibold uppercase"
                        style={{ color: AUTH_COLORS.textSubtle, letterSpacing: 0.9 }}
                    >
                        Account
                    </Text>

                    <Pressable
                        className="flex-row items-center justify-between py-2"
                        android_ripple={{ color: AUTH_COLORS.chip }}
                    >
                        <Text
                            className="text-sm"
                            style={{ color: AUTH_COLORS.textPrimary }}
                        >
                            Edit profile
                        </Text>
                        <Text
                            className="text-xs"
                            style={{ color: AUTH_COLORS.textSubtle }}
                        >
                            Coming soon
                        </Text>
                    </Pressable>

                    <Pressable
                        className="flex-row items-center justify-between py-2"
                        android_ripple={{ color: AUTH_COLORS.chip }}
                    >
                        <Text
                            className="text-sm"
                            style={{ color: AUTH_COLORS.textPrimary }}
                        >
                            Notifications
                        </Text>
                        <Text
                            className="text-xs"
                            style={{ color: AUTH_COLORS.textSubtle }}
                        >
                            Default
                        </Text>
                    </Pressable>

                    <Pressable
                        className="flex-row items-center justify-between py-2"
                        android_ripple={{ color: AUTH_COLORS.chip }}
                    >
                        <Text
                            className="text-sm"
                            style={{ color: AUTH_COLORS.textPrimary }}
                        >
                            Help & Support
                        </Text>
                        <Text
                            className="text-xs"
                            style={{ color: AUTH_COLORS.textSubtle }}
                        >
                            FAQs & contact
                        </Text>
                    </Pressable>
                </View>

                <View
                    className="px-4 py-4 mb-5 border rounded-2xl"
                    style={{
                        backgroundColor: AUTH_COLORS.card,
                        borderColor: AUTH_COLORS.cardBorder,
                    }}
                >
                    <Text
                        className="mb-3 text-xs font-semibold uppercase"
                        style={{ color: AUTH_COLORS.textSubtle, letterSpacing: 0.9 }}
                    >
                        Settings
                    </Text>

                    <Pressable
                        className="flex-row items-center justify-between py-2"
                        android_ripple={{ color: AUTH_COLORS.chip }}
                    >
                        <Text
                            className="text-sm"
                            style={{ color: AUTH_COLORS.textPrimary }}
                        >
                            Address
                        </Text>
                        <Text
                            className="text-xs"
                            style={{ color: AUTH_COLORS.textSubtle }}
                        >
                            {location?.formattedAddress || "Not set"}
                        </Text>
                    </Pressable>
                    <Pressable
                        className="flex-row items-center justify-between py-2"
                        android_ripple={{ color: AUTH_COLORS.chip }}
                    >
                        <Text
                            className="text-sm"
                            style={{ color: AUTH_COLORS.textPrimary }}
                        >
                            Orders
                        </Text>
                        <Text
                            className="text-xs"
                            style={{ color: AUTH_COLORS.textSubtle }}
                        >
                            orders -to do
                        </Text>
                    </Pressable>
                </View>

                <Animated.View style={logoutButtonStyle} className="mb-3">
                    <Pressable
                        onPress={handleLogout}
                        style={({ pressed }) => [
                            {
                                paddingVertical: 12,
                                borderRadius: 999,
                                borderWidth: 1,
                                backgroundColor: AUTH_COLORS.errorBg,
                                borderColor: AUTH_COLORS.errorBorder,
                                opacity: pressed ? 0.9 : 1,
                            },
                        ]}
                        className="items-center justify-center py-2 bg-yellow-500 rounded-full"
                    >
                        <Text
                            className="text-lg font-semibold text-gray-600"
                            style={{ color: AUTH_COLORS.errorText, letterSpacing: 0.4 }}
                        >
                            Log out
                        </Text>
                    </Pressable>
                </Animated.View>

                {!user && (
                    <Text
                        className="mt-1 text-center text-[11px]"
                        style={{ color: AUTH_COLORS.textSubtle }}
                    >
                        You are browsing as a guest. Sign in to unlock
                        personalized recommendations and faster checkout.
                    </Text>
                )}
            </ScrollView>
        </View>
    );
};

export default ProfilePage;