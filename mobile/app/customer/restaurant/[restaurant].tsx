import { View, Text, FlatList, Pressable, ActivityIndicator, Image, ToastAndroid, Animated } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { MenuItemsType } from '@/types';
import { useCustomerStore } from '@/store/customer.store';
import { useAuthStore } from '@/store/auth.store';
import axios, { AxiosError } from 'axios';
import { AUTH_COLORS, RESTAURANT_API_ENDPOINTS } from '@/constants';
import Background from '@/components/shared/Background';
import { Ionicons } from '@expo/vector-icons';

const RestaurantDetailPage = () => {
    const { restaurants } = useCustomerStore();
    const { restaurant } = useLocalSearchParams();
    const [menuItems, setmenuItems] = useState<MenuItemsType[]>([]);
    const [isFetching, setisFetching] = useState(true);
    const Irestaurant = restaurants.find((r) => r._id === restaurant);
    const { token } = useAuthStore();

    const getRestaurantMenu = async () => {
        try {
            if (!token) return

            const res = await axios.get(`${RESTAURANT_API_ENDPOINTS.GET_ALL_MENU_ITEMS}/${restaurant}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (res.status === 400) throw new Error(res.data.message);
            setmenuItems(res.data.items);
        } catch (error: any) {
            if (error instanceof AxiosError) {
                ToastAndroid.show(error.response?.data.message || "Somwthing went wrong", ToastAndroid.SHORT);
            }
            console.log(error.message)
        }
        finally {
            setisFetching(false);
        }
    }

    useEffect(() => {
        restaurant && getRestaurantMenu();
    }, [restaurant]);
    if (!restaurant) return <Text>Restaurant not found</Text>;

    return Irestaurant && (
        <Background>
            {/* Menu Items List */}
            {isFetching ? (
                <View className="items-center justify-center flex-1">
                    <ActivityIndicator size="large" color="#ef4444" />
                </View>
            ) : menuItems.length === 0 ? (
                <View className="items-center justify-center flex-1">
                    <Text className="text-lg text-gray-500">No menu items available</Text>
                </View>
            ) : (
                <FlatList
                    ListHeaderComponent={() => (
                        <View className="flex-row items-end gap-4 px-4 py-4 mb-5 border-b border-gray-200">
                            <Image source={{ uri: Irestaurant.image }} className='size-24 rounded-xl' />
                            <View>
                                <Text className="text-3xl font-bold text-white">{Irestaurant.name}</Text>
                                <Text className="mt-1 text-base text-gray-400">{Irestaurant.description}</Text>
                            </View>
                        </View>
                    )}
                    data={menuItems}
                    renderItem={renderMenuItem}
                    keyExtractor={(item) => item._id}
                    scrollEnabled={true}
                    contentContainerStyle={{ paddingVertical: 12 }}
                    refreshing={isFetching}
                    onRefresh={getRestaurantMenu}
                />
            )}
        </Background>
    )
}

export default RestaurantDetailPage;

const renderMenuItem = ({ item }: { item: MenuItemsType }) => (
    <Pressable className="mx-4 mb-4 overflow-hidden border border-gray-200 rounded-lg">
        <View className="flex-row py-1">
            {/* Image */}
            <Image
                source={{ uri: item.image }}
                className="rounded-lg size-28"
                defaultSource={require('@/assets/images/icon.png')}
            />
            {/* Details */}
            <View className="justify-between flex-1 p-3">
                <View className='flex-row items-start justify-between'>
                    <View>
                        <Text className="text-lg font-bold text-white">{item.name}</Text>
                        <Text className="mt-1 text-sm text-gray-400" numberOfLines={2}>
                            {item.description}
                        </Text>
                    </View>
                    {
                        item.isAvailable && (
                            <Pressable
                                className='px-3 py-2.5 bg-red-500 rounded-full flex items-center justify-center'
                                style={{
                                    shadowColor: '#ef4444',
                                    shadowOffset: { width: 0, height: 3 },
                                    shadowOpacity: 0.4,
                                    shadowRadius: 4,
                                    elevation: 6,
                                }}
                            >
                                <Ionicons name='cart-outline' size={20} color='white' />
                            </Pressable>
                        )
                    }
                </View>
                <View className="flex-row items-center justify-between">
                    <Text className="text-lg font-bold text-red-500">₹{item.price}</Text>
                    <View
                        className={`px-3 py-1 rounded-full ${item.isAvailable
                            ? 'bg-green-100'
                            : 'bg-red-100'
                            }`}
                    >
                        <Text
                            className={`text-xs font-semibold ${item.isAvailable
                                ? 'text-green-700'
                                : 'text-red-700'
                                }`}
                        >
                            {item.isAvailable ? 'Available' : 'Out of Stock'}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    </Pressable>
);