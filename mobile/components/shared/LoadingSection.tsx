import { AUTH_COLORS } from '@/constants'
import React, { useEffect, useRef } from 'react'
import { Animated, Easing, View } from 'react-native'

const LoadingSection = () => {
  const pulse = useRef(new Animated.Value(0.35)).current

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.35,
          duration: 900,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    )

    animation.start()

    return () => animation.stop()
  }, [pulse])

  const SkeletonBlock = ({
    className,
    style,
  }: {
    className?: string
    style?: object
  }) => (
    <Animated.View
      className={className}
      style={[
        {
          backgroundColor: AUTH_COLORS.card,
          opacity: pulse,
        },
        style,
      ]}
    />
  )
  
  return (
    <View className="flex-1 px-5 pt-5 pb-10" style={{ backgroundColor: AUTH_COLORS.background }}>
      <View
        className="overflow-hidden border rounded-[28px]"
        style={{
          backgroundColor: AUTH_COLORS.background,
          borderColor: AUTH_COLORS.cardBorder,
        }}
      >
        <View className="p-4">
          <SkeletonBlock className="overflow-hidden rounded-[24px]" style={{ height: 220 }} />

          <View className="absolute flex-row items-start justify-between top-9 left-9 right-9">
            <View className="flex-row flex-wrap flex-1 gap-2 pr-3">
              <SkeletonBlock className="rounded-full" style={{ width: 82, height: 28 }} />
              <SkeletonBlock className="rounded-full" style={{ width: 104, height: 28 }} />
            </View>
            <SkeletonBlock className="rounded-full" style={{ width: 44, height: 44 }} />
          </View>

          <View className="absolute left-8 right-8 bottom-8">
            <SkeletonBlock className="mb-3 rounded-xl" style={{ width: '72%', height: 28 }} />
            <SkeletonBlock className="rounded-xl" style={{ width: '92%', height: 14 }} />
            <SkeletonBlock className="mt-2 rounded-xl" style={{ width: '84%', height: 14 }} />
          </View>
        </View>

        <View className="px-4 pb-4">
          <View className="flex-row flex-wrap gap-3 mb-4">
            <SkeletonBlock className="flex-1 min-w-[96px] rounded-2xl" style={{ height: 124 }} />
            <SkeletonBlock className="flex-1 min-w-[96px] rounded-2xl" style={{ height: 124 }} />
            <SkeletonBlock className="flex-1 min-w-[96px] rounded-2xl" style={{ height: 124 }} />
          </View>

          <SkeletonBlock className="mb-4 rounded-2xl" style={{ height: 148 }} />

          <View className="flex-row gap-3">
            <SkeletonBlock className="flex-1 rounded-2xl" style={{ height: 56 }} />
            <SkeletonBlock className="flex-1 rounded-2xl" style={{ height: 56 }} />
          </View>
        </View>
      </View>
    </View>
  )
}

export default LoadingSection