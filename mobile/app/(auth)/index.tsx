import { AUTH_COLORS } from "@/constants";
import { useAuthStore } from "@/store/auth.store";
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";
import { AntDesign, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import Animated, {
    Easing,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from "react-native-reanimated";

const WEB_CLIENT_ID =
    process.env.EXPO_PUBLIC_WEB_CLIENT_ID ??
    process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID ??
    "";

const SignIn = () => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const { login } = useAuthStore();
    const pulse = useSharedValue(0);
    const float = useSharedValue(0);

    useEffect(() => {
        if (!WEB_CLIENT_ID) {
            setErrorMessage("Missing Google Web Client ID in env.");
            return;
        }

        GoogleSignin.configure({
            webClientId: WEB_CLIENT_ID,
            offlineAccess: true,
        });
    }, []);

    useEffect(() => {
        pulse.value = withRepeat(
            withSequence(
                withTiming(1, { duration: 1800, easing: Easing.out(Easing.quad) }),
                withTiming(0, { duration: 1800, easing: Easing.in(Easing.quad) })
            ),
            -1,
            false
        );

        float.value = withRepeat(
            withSequence(
                withTiming(1, { duration: 2400, easing: Easing.inOut(Easing.sin) }),
                withTiming(0, { duration: 2400, easing: Easing.inOut(Easing.sin) })
            ),
            -1,
            false
        );
    }, [float, pulse]);

    const heroOrbStyle = useAnimatedStyle(() => ({
        transform: [
            {
                scale: interpolate(pulse.value, [0, 1], [0.92, 1.08]),
            },
            {
                translateY: interpolate(float.value, [0, 1], [0, -16]),
            },
        ],
        opacity: interpolate(pulse.value, [0, 1], [0.72, 0.95]),
    }));

    const cardGlowStyle = useAnimatedStyle(() => ({
        transform: [
            {
                translateY: interpolate(float.value, [0, 1], [0, -10]),
            },
        ],
    }));

    const sendTokenToBackend = useCallback(async (authCode: string) => {
        setIsSubmitting(true);
        setErrorMessage(null);
        try {
            const res = await login(authCode);
            if (res.flag && res.role) {
                let targetRoute: "/customer/(tabs)" | "/seller/(tabs)" | "/rider/(tabs)";

                if (res.role === "customer") {
                    targetRoute = "/customer/(tabs)";
                } else if (res.role === "seller") {
                    targetRoute = "/seller/(tabs)";
                } else {
                    targetRoute = "/rider/(tabs)";
                }

                router.push(targetRoute);
            } else if (res.flag && !res.role) {
                router.push("/chooseRole");
            }
            else {
                throw new Error(res.message);
            }
        } catch (error) {
            const message =
                error instanceof Error ? error.message : "Login failed";
            setErrorMessage(message);
        } finally {
            setIsSubmitting(false);
        }
    }, []);

    const handleGoogleSignIn = useCallback(async () => {
        if (!WEB_CLIENT_ID) {
            setErrorMessage("Google sign-in is not configured.");
            return;
        }

        setIsSubmitting(true);
        setErrorMessage(null);

        try {
            try {
                // Ensure previous Google session is cleared so the user can pick a different account
                await GoogleSignin.signOut();
            } catch (signOutError) {
                // Ignore sign-out errors; we just want to reset any cached session
            }

            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            const response = await GoogleSignin.signIn();
            if (response.type !== "success" || !response.data) {
                throw new Error("Google sign-in did not return a user.");
            }

            const authCode = response.data.serverAuthCode;
            if (!authCode) {
                throw new Error("No authorization code returned from Google.");
            }

            await sendTokenToBackend(authCode);
        } catch (error) {
            if (error && typeof error === "object" && "code" in error) {
                const code = (error as { code?: string }).code;
                if (code === statusCodes.SIGN_IN_CANCELLED) {
                    setErrorMessage("Sign in cancelled.");
                } else if (code === statusCodes.IN_PROGRESS) {
                    setErrorMessage("Sign in already in progress.");
                } else if (code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                    setErrorMessage("Google Play Services not available.");
                } else {
                    setErrorMessage("Google sign-in failed.");
                }
            } else {
                const message =
                    error instanceof Error ? error.message : "Google sign-in failed --------.";
                setErrorMessage(message);
            }
        } finally {
            setIsSubmitting(false);
        }
    }, [sendTokenToBackend]);

    return (
        <View className="flex-1" style={{ backgroundColor: AUTH_COLORS.background }}>
            <View className="absolute inset-0" style={{ backgroundColor: AUTH_COLORS.background }} />
            <Animated.View
                className="absolute rounded-full -top-20 -left-12 h-72 w-72"
                style={[heroOrbStyle, { backgroundColor: "rgba(250, 204, 21, 0.20)" }]}
            />
            <Animated.View
                className="absolute rounded-full -bottom-24 -right-16 h-80 w-80"
                style={[cardGlowStyle, { backgroundColor: "rgba(56, 189, 248, 0.20)" }]}
            />
            <View className="absolute w-24 h-24 rounded-full top-24 left-8" style={{ backgroundColor: AUTH_COLORS.chip }} />
            <View className="absolute rounded-full bottom-32 left-10 h-14 w-14" style={{ backgroundColor: AUTH_COLORS.card }} />

            <View className="justify-between flex-1 px-6 pt-16 pb-8">
                <View className="gap-5">
                    <View className="flex-row items-center gap-3">
                        <View className="items-center justify-center w-12 h-12 rounded-2xl" style={{ backgroundColor: AUTH_COLORS.primary }}>
                            <MaterialCommunityIcons name="food-takeout-box" size={24} color={AUTH_COLORS.background} />
                        </View>
                        <View>
                            <Text className="text-sm uppercase tracking-[4px]" style={{ color: AUTH_COLORS.textSubtle }}>
                                Zomato Clone
                            </Text>
                            <Text className="text-3xl font-bold" style={{ color: AUTH_COLORS.textPrimary }}>
                                Sign in to continue
                            </Text>
                        </View>
                    </View>

                    <Text className="max-w-[320px] text-base leading-6" style={{ color: AUTH_COLORS.textMuted }}>
                        Fast delivery, live tracking, secure payments, and your favorite places in one place.
                    </Text>

                    <View className="flex-row flex-wrap gap-3">
                        {[
                            "Quick delivery",
                            "Live tracking",
                            "Secure checkout",
                        ].map((item) => (
                            <View
                                key={item}
                                className="px-4 py-2 border rounded-full"
                                style={{ backgroundColor: AUTH_COLORS.chip, borderColor: AUTH_COLORS.chipBorder }}
                            >
                                <Text className="text-sm" style={{ color: AUTH_COLORS.textPrimary }}>
                                    {item}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                <Animated.View
                    className="overflow-hidden rounded-[32px] border p-5"
                    style={[cardGlowStyle, { backgroundColor: AUTH_COLORS.card, borderColor: AUTH_COLORS.cardBorder }]}
                >
                    <View className="flex-row items-center justify-between mb-5">
                        <View>
                            <Text className="text-xs uppercase tracking-[3px]" style={{ color: AUTH_COLORS.textSubtle }}>
                                Welcome back
                            </Text>
                            <Text className="mt-1 text-xl font-semibold" style={{ color: AUTH_COLORS.textPrimary }}>
                                Continue with Google
                            </Text>
                        </View>
                        <View className="items-center justify-center w-12 h-12 rounded-2xl" style={{ backgroundColor: AUTH_COLORS.chip }}>
                            <AntDesign name="google" size={22} color={AUTH_COLORS.textPrimary} />
                        </View>
                    </View>

                    <Pressable
                        className="overflow-hidden rounded-2xl active:opacity-90"
                        style={{ backgroundColor: AUTH_COLORS.primary }}
                        disabled={isSubmitting || !WEB_CLIENT_ID}
                        onPress={handleGoogleSignIn}
                    >
                        <View className="flex-row items-center justify-center gap-3 px-5 py-4">
                            {isSubmitting ? (
                                <ActivityIndicator color={AUTH_COLORS.background} />
                            ) : (
                                <>
                                    <Feather name="log-in" size={20} color={AUTH_COLORS.background} />
                                    <Text className="text-base font-bold" style={{ color: AUTH_COLORS.background }}>
                                        Continue with Google
                                    </Text>
                                </>
                            )}
                        </View>
                    </Pressable>

                    <View className="flex-row items-center justify-center gap-2 mt-4">
                        <View className="flex-1 h-px" style={{ backgroundColor: AUTH_COLORS.cardBorder }} />
                        <Text className="text-xs uppercase tracking-[3px]" style={{ color: AUTH_COLORS.textSubtle }}>
                            Secure sign in
                        </Text>
                        <View className="flex-1 h-px" style={{ backgroundColor: AUTH_COLORS.cardBorder }} />
                    </View>

                    <Text className="mt-4 text-sm leading-5 text-center" style={{ color: AUTH_COLORS.textMuted }}>
                        We use your Google account to personalize restaurant suggestions and keep your profile synced.
                    </Text>

                    {errorMessage ? (
                        <View className="px-4 py-3 mt-4 border rounded-2xl" style={{ backgroundColor: AUTH_COLORS.errorBg, borderColor: AUTH_COLORS.errorBorder }}>
                            <Text className="text-sm text-center" style={{ color: AUTH_COLORS.errorText }}>
                                {errorMessage}
                            </Text>
                        </View>
                    ) : null}
                </Animated.View>
            </View>
        </View>
    );
};

export default SignIn;