import { useCallback, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";

GoogleSignin.configure({
    webClientId:
        "185985383799-nqtnc3gc6a6g3igf4jvajf5fm6quqcck.apps.googleusercontent.com"
});

const SignIn = () => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const sendTokenToBackend = useCallback(async (idToken: string) => {
        setIsSubmitting(true);
        setErrorMessage(null);

        try {
            const res = await fetch(
                "https://lrcv0tlh-8000.inc1.devtunnels.ms/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ idToken }),
                }
            );

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || "Login failed");
            }

            // TODO: handle backend response (tokens / profile / navigation)
        } catch (error) {
            const message =
                error instanceof Error ? error.message : "Login failed";
            setErrorMessage(message);
        } finally {
            setIsSubmitting(false);
        }
    }, []);

    const handleGoogleSignIn = useCallback(async () => {
        setIsSubmitting(true);
        setErrorMessage(null);

        try {
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            const response = await GoogleSignin.signIn();
            if (response && response.data) {
                console.log(response.data);
                // await sendTokenToBackend(response.data);
            }
        } catch (error) {
            console.log(error)
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
        <View className="items-center justify-center flex-1 px-6 bg-white">
            <Text className="text-2xl font-semibold text-black">Sign in</Text>
            <Pressable
                className="items-center w-full py-3 mt-6 bg-black rounded-full"
                disabled={isSubmitting}
                onPress={handleGoogleSignIn}
            >
                {isSubmitting ? (
                    <ActivityIndicator color="#ffffff" />
                ) : (
                    <Text className="text-base font-semibold text-white">
                        Continue with Google
                    </Text>
                )}
            </Pressable>

            {errorMessage ? (
                <Text className="mt-4 text-sm text-center text-red-600">
                    {errorMessage}
                </Text>
            ) : null}
        </View>
    );
};

export default SignIn;
