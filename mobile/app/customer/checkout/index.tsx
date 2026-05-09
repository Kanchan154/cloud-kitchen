import { View, Text, Pressable, Alert, Image, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { CartItemType, IRestaurant } from '@/types';
import AddressList from '@/components/customer/AddressList';
import Background from '@/components/shared/Background';
import { useAddressStore } from '@/store/address.store';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AUTH_COLORS } from '@/constants';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withRepeat, withSequence } from 'react-native-reanimated';
import { useCartStore } from '@/store/cart.store';
import { getDistanceinKM } from '@/services/getDistance';

const CheckOutPage = () => {
    const { restaurant, total } = useLocalSearchParams();
    const restaurantObj: IRestaurant = JSON.parse(Array.isArray(restaurant) ? restaurant[0] : restaurant);
    const [showAddresses, setShowAddresses] = useState(false);
    const [showPay, setShowPay] = useState(false);
    const router = useRouter();
    const { } = useCartStore();

    // animations
    const topAnim = useSharedValue(0);
    const bottomAnim = useSharedValue(0);

    useEffect(() => {
        topAnim.value = withTiming(1, { duration: 450 });
        const t = setTimeout(() => {
            bottomAnim.value = withTiming(1, { duration: 450 });
        }, 120);
        return () => clearTimeout(t);
    }, []);

    const topStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: (1 - topAnim.value) * -8 }],
        opacity: topAnim.value,
    }));

    const bottomStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: (1 - bottomAnim.value) * 12 }],
        opacity: bottomAnim.value,
    }));

    const { currentAddress } = useAddressStore();
    const totalValue = Number(Array.isArray(total) ? total[0] : total) || 0;
    const formattedTotal = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(totalValue);
    const { cartList, subTotal } = useCartStore();
    const safeSubTotal = Number(subTotal ?? 0);
    const deliveryFee = safeSubTotal >= 500 ? 0 : 50;
    const tax = safeSubTotal * 0.05;
    const orderTotal = safeSubTotal + deliveryFee + tax;
    const formattedOrderTotal = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(orderTotal);
    const distance = getDistanceinKM(currentAddress?.location?.coordinates[0] ?? 0, currentAddress?.location?.coordinates[1] ?? 0, restaurantObj.autoLocation?.coordinates[0] ?? 0, restaurantObj.autoLocation?.coordinates[1] ?? 0);
    return (
        <Background>
            <View className="justify-between flex-1">
                {/* Top: Restaurant Details */}
                <Animated.View style={topStyle as any} className="px-4 pt-6">
                    <View style={{ borderWidth: 2, borderColor: AUTH_COLORS.primary }} className="p-4 rounded-2xl bg-[#07111f]">
                        <View className="flex-row items-center justify-between">
                            <View className="flex-1 pr-3">
                                <Text className="text-lg font-bold text-white">{(restaurantObj).name ?? 'Restaurant'}</Text>
                                {((restaurantObj as any)?.description) && (
                                    <Text className="mt-1 text-xs text-gray-400">{restaurantObj.description}</Text>
                                )}
                                {((restaurantObj as any)?.rating) && (
                                    <Text className="mt-1 text-xs text-gray-400">Rating: {(restaurantObj as any).rating}</Text>
                                )}
                            </View>
                            <Image source={{ uri: restaurantObj.image }} className="bg-gray-800 size-20 rounded-xl" />
                        </View>
                        <View className="flex-row items-center justify-start gap-3 mt-3">
                            <Text className="text-xs text-gray-400">{((restaurantObj)?.phone) ?? 'Multi-cuisine'}</Text>
                            <Text className="text-xs text-gray-400">•</Text>
                            <Text className="text-xs text-gray-400">{`${distance} km away`}</Text>
                        </View>
                    </View>
                </Animated.View>

                {/* Address card (tap to change) */}
                <Pressable
                    onPress={() => setShowAddresses(true)}
                    className="mx-4 my-4 overflow-hidden rounded-2xl"
                    style={{ borderWidth: 2, borderColor: AUTH_COLORS.primary, borderRadius: 16 }}
                >
                    {currentAddress ? (
                        <View className="p-4 bg-[#07111f] rounded-lg">
                            <View className="flex-row items-center justify-between">
                                <View className="flex-1">
                                    <Text className="text-sm font-semibold text-white">Delivery Address</Text>
                                    <Text className="mt-1 text-xs text-gray-400" numberOfLines={2}>{currentAddress?.formattedAddress}</Text>
                                </View>
                                <View className="items-end ml-3">
                                    <Text className="text-xs text-gray-400">+91 {currentAddress?.mobile}</Text>
                                </View>
                            </View>
                        </View>
                    ) : (
                        <View className="p-4 bg-[#07111f] rounded-lg flex-row items-center justify-center">
                            <MaterialCommunityIcons name="map-marker" size={20} color={AUTH_COLORS.primary} />
                            <Text className="ml-2 text-sm text-gray-300">Select delivery address</Text>
                        </View>
                    )}
                </Pressable>
                {/* Cart items and order summary */}
                <ScrollView contentContainerStyle={{ paddingHorizontal: 16 }} showsVerticalScrollIndicator={false} className="mb-4">
                    <Text className='mx-3 my-1 text-xl text-white'>Order Summary</Text>
                    {cartList.map((ci: CartItemType, idx: number) => {
                        const menu = typeof ci.itemId === 'string' ? null : (ci.itemId as any);
                        if (!menu) return null;
                        return (
                            <View key={`${ci.itemId._id ?? idx}`} className="mb-4 overflow-hidden border rounded-[20px] flex-row" style={{ backgroundColor: AUTH_COLORS.card, borderColor: AUTH_COLORS.cardBorder }}>
                                <Image source={{ uri: menu.image }} className="w-24 h-24" style={{ width: 96, height: 96 }} />
                                <View className="justify-between flex-1 p-3">
                                    <View className='flex-row justify-between flex-1'>
                                        <View>
                                            <Text className="text-sm font-bold" style={{ color: AUTH_COLORS.textPrimary }} numberOfLines={1}>{menu.name}</Text>
                                            <Text className="mt-1 text-xs" style={{ color: AUTH_COLORS.textSubtle }} numberOfLines={2}>{menu.description}</Text>
                                        </View>
                                        <View className='pr-4'>
                                            <Text className="text-base font-bold" style={{ color: AUTH_COLORS.primary }}>₹{ci.quantity * menu.price}</Text>
                                        </View>
                                    </View>
                                    <View className="flex-row items-center justify-between">
                                        <Text className="text-base font-bold" style={{ color: AUTH_COLORS.primary }}>₹{menu.price}</Text>
                                        <View className="flex-row items-center gap-2 px-2 py-1 border rounded-lg" style={{ backgroundColor: AUTH_COLORS.background, borderColor: AUTH_COLORS.cardBorder }}>
                                            <Text className="w-6 text-xs font-semibold text-center" style={{ color: AUTH_COLORS.textPrimary }}>{ci.quantity}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )
                    })}

                    {/* Order summary */}
                    <View className="px-4 py-4 mb-4 border rounded-[20px]" style={{ backgroundColor: AUTH_COLORS.card, borderColor: AUTH_COLORS.cardBorder }}>
                        <View className="mb-3">
                            <View className="flex-row justify-between mb-2">
                                <Text style={{ color: AUTH_COLORS.textSubtle }} className="text-sm">Subtotal</Text>
                                <Text style={{ color: AUTH_COLORS.textPrimary }} className="text-sm font-semibold">₹{safeSubTotal.toFixed(2)}</Text>
                            </View>
                            <View className="flex-row justify-between mb-2">
                                <Text style={{ color: AUTH_COLORS.textSubtle }} className="text-sm">Delivery Fee</Text>
                                <Text style={{ color: AUTH_COLORS.textPrimary }} className="text-sm font-semibold">{`${deliveryFee === 0 ? 'Free' : `₹${deliveryFee.toFixed(2)}`}`}</Text>
                            </View>
                            <View className="flex-row justify-between">
                                <Text style={{ color: AUTH_COLORS.textSubtle }} className="text-sm">Taxes</Text>
                                <Text style={{ color: AUTH_COLORS.textPrimary }} className="text-sm font-semibold">₹{tax.toFixed(2)}</Text>
                            </View>
                        </View>
                        <View className="h-[1px] my-3" style={{ backgroundColor: AUTH_COLORS.cardBorder }} />
                        <View className="flex-row items-center justify-between">
                            <Text style={{ color: AUTH_COLORS.textPrimary }} className="text-lg font-bold">Total</Text>
                            <Text style={{ color: AUTH_COLORS.primary }} className="text-2xl font-extrabold">{formattedOrderTotal}</Text>
                        </View>
                        {deliveryFee !== 0 && (
                            <Text style={{ color: AUTH_COLORS.primary }} className="mt-2 text-sm font-semibold">{`Add item worth ₹${Math.max(0, 500 - safeSubTotal)} to get free delivery`}</Text>
                        )}
                    </View>
                </ScrollView>

                {/* Bottom payable area */}
                <Animated.View style={bottomStyle as any} className="px-4 pb-6">
                    <View style={{ borderWidth: 2, borderColor: AUTH_COLORS.primary }} className="p-4 rounded-2xl bg-[#07111f] flex-row items-center justify-between">
                        <View>
                            <Text className="text-xs text-gray-300">Payable Amount</Text>
                            <Text className="text-2xl font-bold text-white">{formattedOrderTotal}</Text>
                        </View>

                        <View className="flex-row gap-3">
                            <Pressable
                                onPress={() => router.back()}
                                className="px-4 py-2 rounded-xl"
                                style={{ backgroundColor: '#2A2F36' }}
                            >
                                <Text className="text-sm text-gray-200">Cancel</Text>
                            </Pressable>

                            <Pressable
                                onPress={() => {
                                    if (!currentAddress) {
                                        Alert.alert('No address selected', 'Please select a delivery address first.');
                                        return;
                                    }
                                    setShowPay(true);
                                    Alert.alert('Proceed to pay', `Pay ${formattedOrderTotal} for ${(restaurantObj as any)?.name ?? 'your order'}`);
                                }}
                                className="px-4 py-2 rounded-xl"
                                style={{ backgroundColor: AUTH_COLORS.primary }}
                            >
                                <Text className="text-sm font-semibold text-black">Pay</Text>
                            </Pressable>
                        </View>
                    </View>
                </Animated.View>
            </View>

            <AddressList
                visible={showAddresses}
                onClose={() => setShowAddresses(false)}
            />
        </Background>
    )
}

export default CheckOutPage
