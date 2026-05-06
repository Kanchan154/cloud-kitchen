import { AUTH_COLORS } from '@/constants';
import { useCartStore } from '@/store/cart.store';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  useAnimatedProps,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type TabIconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

type CustomerButtonProps = BottomTabBarButtonProps & {
  label: string;
  icon: TabIconName;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedIcon = Animated.createAnimatedComponent(MaterialCommunityIcons);

const CustomerButton = ({
  accessibilityState,
  onPress,
  onLongPress,
  label,
  icon,
}: CustomerButtonProps) => {
  const focused = Boolean(accessibilityState?.selected);
  const progress = useSharedValue(focused ? 1 : 0);
  const pressProgress = useSharedValue(0);
  const { cartLenght, fetchCart } = useCartStore();

  useEffect(() => {
    cartLenght === 0 && fetchCart();
  }, [cartLenght])
  useEffect(() => {
    progress.value = withSpring(focused ? 1 : 0, {
      damping: 16,
      stiffness: 220,
      mass: 0.8,
    });
  }, [focused, progress]);

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(progress.value, [0, 1], [1, 1.04]) * interpolate(pressProgress.value, [0, 1], [1, 0.96]),
      },
      {
        translateY: interpolate(pressProgress.value, [0, 1], [0, 1]),
      },
    ],
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      ['rgba(255,255,255,0.04)', 'rgba(250,204,21,0.20)'],
    ),
    borderColor: interpolateColor(
      progress.value,
      [0, 1],
      [AUTH_COLORS.cardBorder, 'rgba(250,204,21,0.45)'],
    ),
  }));

  const iconWrapStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(progress.value, [0, 1], [0, -1.5]) },
      { scale: interpolate(progress.value, [0, 1], [1, 1.06]) },
    ],
  }));

  const labelStyle = useAnimatedStyle(() => ({
    color: interpolateColor(progress.value, [0, 1], [AUTH_COLORS.textSubtle, AUTH_COLORS.primary]),
  }));

  const indicatorStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0, 1]),
    transform: [{ scaleX: interpolate(progress.value, [0, 1], [0.55, 1]) }],
  }));

  const activeBadgeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0, 1]),
    transform: [
      { translateY: interpolate(progress.value, [0, 1], [4, 0]) },
      { scale: interpolate(progress.value, [0, 1], [0.9, 1]) },
    ],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0, 0.6]),
    transform: [{ scale: interpolate(progress.value, [0, 1], [0.7, 1.1]) }],
  }));

  const iconAnimatedProps = useAnimatedProps(() => ({
    color: interpolateColor(progress.value, [0, 1], [AUTH_COLORS.textSubtle, AUTH_COLORS.primary]),
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={() => {
        pressProgress.value = withSpring(1, { damping: 14, stiffness: 260 });
      }}
      onPressOut={() => {
        pressProgress.value = withSpring(0, { damping: 14, stiffness: 220 });
      }}
      className="items-center justify-center mx-1 border h-14 rounded-2xl"
      style={buttonStyle}
    >
      <Animated.View
        pointerEvents="none"
        className="absolute w-10 h-10 rounded-full"
        style={[glowStyle, { backgroundColor: 'rgba(250,204,21,0.22)' }]}
      />
      <Animated.View
        pointerEvents="none"
        className="absolute top-1 h-[3px] w-8 rounded-full"
        style={[indicatorStyle, { backgroundColor: AUTH_COLORS.primary }]}
      />
      <Animated.View style={iconWrapStyle}>
        {label === "Cart" && cartLenght > 0 && (
          <View
            className="absolute items-center justify-center w-4 h-4 rounded-full -right-2 -top-1"
            style={{
              backgroundColor: AUTH_COLORS.primary,
              borderColor: 'rgba(250,204,21,0.6)',
              borderWidth: 1,
            }}
          >
            <Text className="text-[10px] font-extrabold" style={{ color: '#07111F' }}>
              {cartLenght}
            </Text>
          </View>
        )}
        <AnimatedIcon
          name={icon}
          size={20}
          animatedProps={iconAnimatedProps as any}
        />
      </Animated.View>
      <Animated.Text className="mt-1 text-[11px] font-extrabold tracking-wide uppercase" style={labelStyle}>
        {label}
      </Animated.Text>
      <Animated.View
        pointerEvents="none"
        className="absolute -bottom-2 px-2 py-[2px] rounded-full"
        style={[activeBadgeStyle, { backgroundColor: 'rgba(250,204,21,0.18)' }]}
      >
        <Text className="text-[9px] font-extrabold uppercase" style={{ color: AUTH_COLORS.primary }}>
          Active
        </Text>
      </Animated.View>
    </AnimatedPressable>
  );
};

const TabLayoutSeller = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          left: 14,
          right: 14,
          bottom: insets.bottom + 10,
          height: 60 + insets.bottom,
          paddingTop: 10,
          paddingBottom: 10,
          paddingHorizontal: 10,
          borderTopWidth: 0,
          elevation: 0,
          backgroundColor: 'transparent',
          shadowColor: 'transparent',
          alignItems: 'center'
        },
        tabBarItemStyle: {
          flex: 0,
          alignItems: 'stretch',
          justifyContent: 'center',
          width: "28%",
          marginHorizontal: 4,
        },
        tabBarActiveTintColor: AUTH_COLORS.primary,
        tabBarInactiveTintColor: AUTH_COLORS.textSubtle,
        tabBarBackground: () => (
          <View
            className="flex-1 border rounded-[24px] w-[90%] mx-auto flex items-center justify-center"
            style={{
              backgroundColor: 'rgba(7,17,31,0.96)',
              borderColor: AUTH_COLORS.cardBorder,
            }}
          />
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarButton: (props) => (
            <CustomerButton
              {...props}
              label="Home"
              icon="storefront-outline"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          tabBarButton: (props) => (
            <CustomerButton
              {...props}
              label="Cart"
              icon="cart-arrow-right"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarButton: (props) => (
            <CustomerButton
              {...props}
              label="Profile"
              icon="account-circle-outline"
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayoutSeller;