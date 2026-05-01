import { View, Text, FlatList, Image, Pressable, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { MenuItemsType } from '@/types';
import { useCustomerStore } from '@/store/customer.store';
import { useAuthStore } from '@/store/auth.store';
import axios from 'axios';
import { RESTAURANT_API_ENDPOINTS } from '@/constants';

const RestaurantDetailPage = () => {
    const { restaurants } = useCustomerStore();
    const { id } = useLocalSearchParams();
    const restaurant = restaurants.find((r) => r._id === id);
    const [menuItems, setmenuItems] = useState<MenuItemsType[]>([]);
    const [isFetching, setisFetching] = useState(true);

    const getRestaurantMenu = async () => {
        try {
            const { token } = useAuthStore();
            if (!token) return

            const res = await axios.get(`${RESTAURANT_API_ENDPOINTS.GET_ALL_MENU_ITEMS}/${id}?fromCustomer=true`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (res.status === 400) throw new Error(res.data.message);

            setmenuItems(res.data.items);
        } catch (error) {

        }
        finally {
            setisFetching(false);
        }
    }

    useEffect(() => {
        restaurant && getRestaurantMenu();
    }, [restaurant]);
    if (!restaurant) return <Text>Restaurant not found</Text>;

    const renderMenuItem = ({ item }: { item: MenuItemsType }) => (
        <Pressable className="mx-4 mb-4 overflow-hidden bg-white border border-gray-200 rounded-lg">
            <View className="flex-row">
                {/* Image */}
                <Image
                    source={{ uri: item.image }}
                    className="w-24 h-24 rounded-lg"
                    defaultSource={require('@/assets/images/icon.png')}
                />
                {/* Details */}
                <View className="justify-between flex-1 p-3">
                    <View>
                        <Text className="text-base font-semibold text-gray-900">{item.name}</Text>
                        <Text className="mt-1 text-sm text-gray-600" numberOfLines={2}>
                            {item.description}
                        </Text>
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

    return (
        <View className="flex-1 bg-gray-50">
            {/* Restaurant Header */}
            <View className="px-4 py-4 bg-white border-b border-gray-200">
                <Text className="text-2xl font-bold text-gray-900">{restaurant.name}</Text>
                <Text className="mt-1 text-sm text-gray-600">{restaurant.description}</Text>
            </View>

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
                    data={menuItems}
                    renderItem={renderMenuItem}
                    keyExtractor={(item) => item._id}
                    scrollEnabled={true}
                    contentContainerStyle={{ paddingVertical: 12 }}
                />
            )}
        </View>
    )
}

export default RestaurantDetailPage