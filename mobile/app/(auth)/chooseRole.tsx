import { AUTH_COLORS, ROLE_OPTIONS } from "@/constants";
import { useAuthStore } from "@/store/auth.store";
import { USER_ROLE } from "@/types";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import Animated, {
  Easing,
  FadeInDown,
  FadeInUp,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import type { RoleOption } from "@/types";


const ChooseRole = () => {
  const router = useRouter();
  const { chooseRole } = useAuthStore();
  const [selectedRole, setSelectedRole] = useState<USER_ROLE | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pulse = useSharedValue(0);
  const float = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2200, easing: Easing.out(Easing.quad) }),
        withTiming(0, { duration: 2200, easing: Easing.in(Easing.quad) })
      ),
      -1,
      false
    );

    float.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2600, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 2600, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
  }, [float, pulse]);

  const orbStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: interpolate(pulse.value, [0, 1], [0.92, 1.1]) },
      { translateY: interpolate(float.value, [0, 1], [0, -18]) },
    ],
    opacity: interpolate(pulse.value, [0, 1], [0.6, 0.95]),
  }));

  const cardFloatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(float.value, [0, 1], [0, -8]) }],
  }));

  const selectedRoleDetails = useMemo(
    () => ROLE_OPTIONS.find((option) => option.id === selectedRole),
    [selectedRole]
  );

  const handleContinue = async () => {
    if (!selectedRole || isSubmitting) {
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const response = await chooseRole(selectedRole);
      if (!response.flag) {
        throw new Error(response.message);
      }
      let targetRoute: "/customer/(tabs)" | "/seller/(tabs)" | "/rider/(tabs)";

      if (response.role === "customer") {
        targetRoute = "/customer/(tabs)";
      } else if (response.role === "seller") {
        targetRoute = "/seller/(tabs)";
      } else {
        targetRoute = "/rider/(tabs)";
      }

      router.push(targetRoute);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to set role.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="flex-1" style={{ backgroundColor: AUTH_COLORS.background }}>
      <Animated.View
        style={[orbStyle, { backgroundColor: "rgba(250, 204, 21, 0.20)" }]}
        className="absolute rounded-full -top-16 -left-10 h-72 w-72"
      />
      <Animated.View
        style={[cardFloatStyle, { backgroundColor: "rgba(56, 189, 248, 0.18)" }]}
        className="absolute rounded-full -bottom-24 -right-16 h-80 w-80"
      />

      <View className="flex-1 px-6 pt-16 pb-8">
        <Animated.View entering={FadeInUp.duration(500)} className="mb-8">
          <View className="flex-row items-center gap-3">
            <View
              className="items-center justify-center w-12 h-12 rounded-2xl"
              style={{ backgroundColor: AUTH_COLORS.primary }}
            >
              <MaterialCommunityIcons name="account-switch" size={24} color={AUTH_COLORS.background} />
            </View>
            <View>
              <Text className="text-sm uppercase tracking-[3px]" style={{ color: AUTH_COLORS.textSubtle }}>
                Final step
              </Text>
              <Text className="text-3xl font-bold" style={{ color: AUTH_COLORS.textPrimary }}>
                Choose your role
              </Text>
            </View>
          </View>

          <Text className="mt-4 text-base leading-6" style={{ color: AUTH_COLORS.textMuted }}>
            Select how you want to use Zomato Clone today. You can update this later from profile.
          </Text>
        </Animated.View>

        <View className="gap-3">
          {ROLE_OPTIONS.map((option, index) => {
            const selected = selectedRole === option.id;
            return (
              <Animated.View
                entering={FadeInDown.delay(120 + index * 80).duration(420)}
                key={option.id}
                style={cardFloatStyle}
              >
                <Pressable
                  onPress={() => setSelectedRole(option.id)}
                  className="p-4 border rounded-3xl"
                  style={{
                    backgroundColor: selected ? "rgba(250, 204, 21, 0.16)" : AUTH_COLORS.card,
                    borderColor: selected ? AUTH_COLORS.primary : AUTH_COLORS.cardBorder,
                  }}
                >
                  <View className="flex-row items-center justify-between max-w-[90%]">
                    <View className="flex-row items-center gap-3 pr-3">
                      <View
                        className="items-center justify-center h-11 w-11 rounded-2xl"
                        style={{ backgroundColor: selected ? AUTH_COLORS.primary : AUTH_COLORS.chip }}
                      >
                        <MaterialCommunityIcons
                          name={option.icon}
                          size={22}
                          color={selected ? AUTH_COLORS.background : AUTH_COLORS.textPrimary}
                        />
                      </View>
                      <View className="flex-shrink">
                        <Text className="text-lg font-semibold" style={{ color: AUTH_COLORS.textPrimary }}>
                          {option.title}
                        </Text>
                        <Text className="mt-1 text-sm leading-5" style={{ color: AUTH_COLORS.textMuted }}>
                          {option.subtitle}
                        </Text>
                      </View>
                    </View>

                    <View
                      className="items-center justify-center border rounded-full h-7 w-7"
                      style={{
                        borderColor: selected ? AUTH_COLORS.primary : AUTH_COLORS.chipBorder,
                        backgroundColor: selected ? AUTH_COLORS.primary : "transparent",
                      }}
                    >
                      {selected ? <Feather name="check" size={16} color={AUTH_COLORS.background} /> : null}
                    </View>
                  </View>
                </Pressable>
              </Animated.View>
            );
          })}
        </View>

        <View className="mt-auto">
          {selectedRoleDetails ? (
            <Text className="mb-3 text-sm text-center" style={{ color: AUTH_COLORS.textSubtle }}>
              Selected: {selectedRoleDetails.title}
            </Text>
          ) : (
            <Text className="mb-3 text-sm text-center" style={{ color: AUTH_COLORS.textSubtle }}>
              Please choose a role to continue
            </Text>
          )}

          <Pressable
            disabled={!selectedRole || isSubmitting}
            onPress={handleContinue}
            className="items-center justify-center py-4 rounded-2xl"
            style={{
              backgroundColor: selectedRole ? AUTH_COLORS.primary : "rgba(250, 204, 21, 0.45)",
            }}
          >
            {isSubmitting ? (
              <ActivityIndicator color={AUTH_COLORS.background} />
            ) : (
              <Text className="text-base font-bold" style={{ color: AUTH_COLORS.background }}>
                Continue
              </Text>
            )}
          </Pressable>

          {errorMessage ? (
            <View
              className="px-4 py-3 mt-3 border rounded-2xl"
              style={{
                backgroundColor: AUTH_COLORS.errorBg,
                borderColor: AUTH_COLORS.errorBorder,
              }}
            >
              <Text className="text-sm text-center" style={{ color: AUTH_COLORS.errorText }}>
                {errorMessage}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
};

export default ChooseRole;