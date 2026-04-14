import React, { useEffect, useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { AUTH_COLORS } from "@/constants";

const AppSplashScreen = () => {
  const [boosted, setBoosted] = useState(false);
  const [progressLabel, setProgressLabel] = useState("Preparing your kitchen...");

  const logoScale = useSharedValue(1);
  const logoLift = useSharedValue(0);
  const ringRotation = useSharedValue(0);
  const glowPulse = useSharedValue(1);
  const progress = useSharedValue(0.08);
  const buttonScale = useSharedValue(1);

  const statusMessages = useMemo(
    () => [
      "Preparing your kitchen...",
      "Syncing menu items...",
      "Warming up delivery network...",
      "Finalizing your experience...",
    ],
    []
  );

  useEffect(() => {
    logoScale.value = withRepeat(
      withTiming(1.08, {
        duration: 1200,
        easing: Easing.inOut(Easing.quad),
      }),
      -1,
      true
    );

    logoLift.value = withRepeat(
      withTiming(-8, {
        duration: 1400,
        easing: Easing.inOut(Easing.sin),
      }),
      -1,
      true
    );

    ringRotation.value = withRepeat(
      withTiming(360, {
        duration: 2600,
        easing: Easing.linear,
      }),
      -1,
      false
    );

    glowPulse.value = withRepeat(
      withTiming(1.15, {
        duration: 1700,
        easing: Easing.inOut(Easing.quad),
      }),
      -1,
      true
    );

    return () => {
      cancelAnimation(logoScale);
      cancelAnimation(logoLift);
      cancelAnimation(ringRotation);
      cancelAnimation(glowPulse);
      cancelAnimation(progress);
      cancelAnimation(buttonScale);
    };
  }, [buttonScale, glowPulse, logoLift, logoScale, progress, ringRotation]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgressLabel((prev) => {
        const currentIndex = statusMessages.indexOf(prev);
        const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % statusMessages.length;
        return statusMessages[nextIndex];
      });

      const nextStep = boosted ? 0.18 : 0.09;
      const target = progress.value + nextStep >= 1 ? 0.16 : progress.value + nextStep;

      progress.value = withTiming(target, {
        duration: boosted ? 450 : 900,
        easing: Easing.inOut(Easing.cubic),
      });
    }, boosted ? 800 : 1400);

    return () => clearInterval(interval);
  }, [boosted, progress, statusMessages]);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }, { translateY: logoLift.value }],
  }));

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${ringRotation.value}deg` }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glowPulse.value }],
    opacity: 0.35 + (glowPulse.value - 1) * 0.7,
  }));

  const progressStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: progress.value }],
  }));

  const ctaStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handleBoostPress = () => {
    setBoosted((prev) => !prev);

    buttonScale.value = withTiming(0.95, { duration: 90 }, () => {
      buttonScale.value = withTiming(1, { duration: 140 });
    });
  };

  return (
    <View
      className="items-center justify-center flex-1 px-6 overflow-hidden"
      style={{ backgroundColor: AUTH_COLORS.background }}
    >
      <View
        className="absolute"
        style={{
          width: 260,
          height: 260,
          borderRadius: 130,
          backgroundColor: AUTH_COLORS.accent,
          opacity: 0.17,
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

      <Animated.View
        className="absolute"
        style={[
          {
            width: 240,
            height: 240,
            borderRadius: 120,
            backgroundColor: AUTH_COLORS.primary,
          },
          glowStyle,
        ]}
      />

      <Animated.View className="mb-7 h-[170px] w-[170px] items-center justify-center" style={logoStyle}>
        <Animated.View
          className="absolute h-[170px] w-[170px] rounded-full border-2"
          style={[
            {
              borderColor: AUTH_COLORS.accent,
              borderTopColor: AUTH_COLORS.primary,
              opacity: 0.8,
            },
            ringStyle,
          ]}
        />
        <View
          className="items-center justify-center border rounded-full h-28 w-28"
          style={{
            backgroundColor: AUTH_COLORS.card,
            borderColor: AUTH_COLORS.cardBorder,
          }}
        >
          <Text
            className="text-[42px] font-black"
            style={{ color: AUTH_COLORS.primary, letterSpacing: 1 }}
          >
            Z
          </Text>
        </View>
      </Animated.View>

      <View className="items-center mb-6">
        <Text
          className="text-[32px] font-extrabold"
          style={{ color: AUTH_COLORS.textPrimary, letterSpacing: 0.7 }}
        >
          Cloud Kitchen
        </Text>
        <Text
          className="mt-2 text-sm text-center"
          style={{ color: AUTH_COLORS.textMuted, letterSpacing: 0.3 }}
        >
          {progressLabel}
        </Text>
      </View>

      <View
        className="h-3 w-[86%] max-w-[360px] overflow-hidden rounded-full border"
        style={{
          backgroundColor: AUTH_COLORS.chip,
          borderColor: AUTH_COLORS.chipBorder,
        }}
      >
        <Animated.View
          className="w-full h-full"
          style={[
            {
              backgroundColor: AUTH_COLORS.primary,
              transformOrigin: "left",
            },
            progressStyle,
          ]}
        />
      </View>

      <Animated.View style={ctaStyle}>
        <Pressable
          onPress={handleBoostPress}
          style={({ pressed }) => [
            {
              marginTop: 26,
              paddingVertical: 12,
              paddingHorizontal: 18,
              borderRadius: 999,
              backgroundColor: boosted ? AUTH_COLORS.primary : AUTH_COLORS.card,
              borderWidth: 1,
              borderColor: boosted ? AUTH_COLORS.primary : AUTH_COLORS.cardBorder,
              opacity: pressed ? 0.9 : 1,
            },
          ]}
          className="items-center justify-center"
        >
          <Text
            className="text-[13px] font-bold"
            style={{
              color: boosted ? AUTH_COLORS.background : AUTH_COLORS.textPrimary,
              letterSpacing: 0.3,
            }}
          >
            {boosted ? "Boost On: Turbo Loading" : "Tap to Boost Loading"}
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
};

export default AppSplashScreen;