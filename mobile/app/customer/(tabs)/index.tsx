import Background from '@/components/shared/Background'
import { AUTH_COLORS } from '@/constants'
import { getDistanceinKM } from '@/services/getDistance'
import { useAuthStore } from '@/store/auth.store'
import { useCustomerStore } from '@/store/customer.store'
import { IRestaurant } from '@/types'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, Image, Pressable, Text, View } from 'react-native'

const Home = () => {
  const { fetchRestaurant, restaurants } = useCustomerStore();
  const { location, city } = useAuthStore();
  const [isFetching, setIsFetching] = useState(false)

  useEffect(() => {
    let isActive = true

    const loadRestaurants = async () => {
      setIsFetching(true)
      try {
        await fetchRestaurant()
      } finally {
        if (isActive) {
          setIsFetching(false)
        }
      }
    }

    loadRestaurants()

    return () => {
      isActive = false
    }
  }, [fetchRestaurant, location?.latitude, location?.longitude])

  const handleRefresh = async () => {
    setIsFetching(true)
    try {
      await fetchRestaurant()
    } finally {
      setIsFetching(false)
    }
  }

  return (
    <Background>
      <FlatList
        data={restaurants}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <RestaurantCard restaurant={item} />}
        ListHeaderComponent={
          <HeaderList
            restaurantCount={restaurants.length}
          />
        }
        ListEmptyComponent={isFetching ? LoadingSection : EmptySection}
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshing={isFetching}
        onRefresh={handleRefresh}
      />
    </Background>
  )
}

const RestaurantCard = ({ restaurant }: { restaurant: IRestaurant }) => {
  const router = useRouter();
  const coordinates = restaurant.autoLocation?.coordinates ?? [0, 0]
  const longitude = coordinates[0] ?? 0
  const latitude = coordinates[1] ?? 0
  const formattedPhone = String(restaurant.phone)
  const { location } = useAuthStore();
  const distance = getDistanceinKM(location?.latitude ?? 0, location?.longitude ?? 0, latitude, longitude);

  return (
    <Pressable
      className="mb-4 overflow-hidden border rounded-[28px]"
      style={{
        backgroundColor: AUTH_COLORS.card,
        borderColor: AUTH_COLORS.cardBorder,
      }}
    >
      <Image
        source={{ uri: restaurant.image }}
        className="w-full"
        style={{ height: 190 }}
        resizeMode="cover"
      />

      <View className="p-4">
        <View className="flex-row items-start justify-between gap-3">
          <View className="flex-1">
            <Text className="text-xl font-extrabold" style={{ color: AUTH_COLORS.textPrimary }} numberOfLines={1}>
              {restaurant.name}
            </Text>
            <Text className="mt-1 text-xs leading-5" style={{ color: AUTH_COLORS.textSubtle }} numberOfLines={2}>
              {restaurant.description}
            </Text>
          </View>

          <View
            className="px-3 py-2 border rounded-full"
            style={{
              backgroundColor: restaurant.isOpen ? 'rgba(16,185,129,0.14)' : 'rgba(239,68,68,0.14)',
              borderColor: restaurant.isOpen ? 'rgba(16,185,129,0.28)' : 'rgba(239,68,68,0.24)',
            }}
          >
            <Text className="text-[10px] font-extrabold uppercase" style={{ color: restaurant.isOpen ? '#34d399' : '#fca5a5' }}>
              {restaurant.isOpen ? 'Open' : 'Closed'}
            </Text>
          </View>
        </View>

        <View className="flex-row flex-wrap gap-2 mt-4">
          <View className="px-3 py-2 border rounded-full" style={{ backgroundColor: AUTH_COLORS.chip, borderColor: AUTH_COLORS.chipBorder }}>
            <Text className="text-xs font-semibold" style={{ color: AUTH_COLORS.textPrimary }} numberOfLines={1}>
              {restaurant.autoLocation.formattedAddress}
            </Text>
          </View>
          <View className="px-3 py-2 border rounded-full" style={{ backgroundColor: AUTH_COLORS.chip, borderColor: AUTH_COLORS.chipBorder }}>
            <Text className="text-xs font-semibold" style={{ color: AUTH_COLORS.textPrimary }}>
              {distance} km away
            </Text>
          </View>
          <View className="px-3 py-2 border rounded-full" style={{ backgroundColor: AUTH_COLORS.chip, borderColor: AUTH_COLORS.chipBorder }}>
            <Text className="text-xs font-semibold" style={{ color: AUTH_COLORS.textPrimary }}>
              {formattedPhone}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center justify-between mt-4">
          <View className="flex-row items-center gap-2">
            <MaterialCommunityIcons
              name={restaurant.isVerified ? 'check-decagram' : 'alert-circle-outline'}
              size={18}
              color={restaurant.isVerified ? '#34d399' : AUTH_COLORS.textSubtle}
            />
            <Text className="text-xs font-semibold" style={{ color: AUTH_COLORS.textSubtle }}>
              {restaurant.isVerified ? 'Verified restaurant' : 'Verification pending'}
            </Text>
          </View>

          <Pressable
            onPress={() => router.push({
              pathname: "/customer/restaurant/[restaurant]",
              params: { restaurant: restaurant._id as string | number },
            })}
            className="flex-row items-center px-3 py-2 border rounded-full"
            style={{ backgroundColor: AUTH_COLORS.background, borderColor: AUTH_COLORS.cardBorder }}
          >
            <Text className="text-xs font-bold" style={{ color: AUTH_COLORS.textPrimary }}>
              View menu
            </Text>
            <MaterialCommunityIcons name="chevron-right" size={16} color={AUTH_COLORS.textPrimary} />
          </Pressable>
        </View>
      </View>
    </Pressable>
  )
}

const LoadingSection = () => {
  return (
    <View
      className="items-center justify-center px-5 py-10 border rounded-3xl"
      style={{
        backgroundColor: AUTH_COLORS.card,
        borderColor: AUTH_COLORS.cardBorder,
      }}
    >
      <ActivityIndicator size="small" color={AUTH_COLORS.primary} />
      <Text className="mt-3 text-sm font-semibold" style={{ color: AUTH_COLORS.textPrimary }}>
        Loading restaurants...
      </Text>
      <Text className="mt-1 text-xs text-center" style={{ color: AUTH_COLORS.textSubtle }}>
        We are checking nearby kitchens for you.
      </Text>
    </View>
  )
}

const EmptySection = () => {
  return (
    <View
      className="items-center justify-center px-5 py-10 border rounded-3xl"
      style={{
        backgroundColor: AUTH_COLORS.card,
        borderColor: AUTH_COLORS.cardBorder,
      }}
    >
      <MaterialCommunityIcons name="store-search-outline" size={34} color={AUTH_COLORS.textSubtle} />
      <Text className="mt-3 text-base font-bold" style={{ color: AUTH_COLORS.textPrimary }}>
        No restaurants found
      </Text>
      <Text className="mt-1 text-xs text-center" style={{ color: AUTH_COLORS.textSubtle }}>
        Try refreshing after allowing location access or changing your search area.
      </Text>
    </View>
  )
}

type Props = {
  restaurantCount: number;
}
const HeaderList = ({ restaurantCount }: Props) => {
  return (
    <View className="mb-5">
      <View
        className="px-4 py-4 mb-4 border rounded-[28px]"
        style={{
          backgroundColor: AUTH_COLORS.card,
          borderColor: AUTH_COLORS.cardBorder,
        }}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-1 pr-3">
            <Text className="text-xs font-semibold uppercase" style={{ color: AUTH_COLORS.textSubtle }}>
              Nearby kitchens
            </Text>
            <Text className="mt-2 text-2xl font-extrabold" style={{ color: AUTH_COLORS.textPrimary }}>
              Discover restaurants around you
            </Text>
            <Text className="mt-2 text-xs leading-5" style={{ color: AUTH_COLORS.textSubtle }}>
              Browse open restaurants, verify details, and jump into the menu quickly.
            </Text>
          </View>

          <View
            className="items-center justify-center w-16 h-16 border rounded-2xl"
            style={{
              backgroundColor: AUTH_COLORS.background,
              borderColor: AUTH_COLORS.cardBorder,
            }}
          >
            <MaterialCommunityIcons name="silverware-fork-knife" size={24} color={AUTH_COLORS.primary} />
          </View>
        </View>
      </View>

      <View className="flex-row items-center justify-between px-1">
        <Text className="text-sm font-bold" style={{ color: AUTH_COLORS.textPrimary }}>
          Restaurants
        </Text>
        <View className="px-3 py-2 border rounded-full" style={{ backgroundColor: AUTH_COLORS.chip, borderColor: AUTH_COLORS.chipBorder }}>
          <Text className="text-xs font-semibold" style={{ color: AUTH_COLORS.textPrimary }}>
            {restaurantCount} found
          </Text>
        </View>
      </View>
    </View>
  )
}

export default Home