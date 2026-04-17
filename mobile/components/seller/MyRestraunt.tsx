import { AUTH_COLORS } from '@/constants';
import { IRestaurant } from '@/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';

type Props = {
    restaurant: IRestaurant;
};

const MyRestraunt = ({ restaurant }: Props) => {
    const [isOpen, setIsOpen] = useState(restaurant.isOpen);
    const { height } = useWindowDimensions();

    const formattedPhone = useMemo(() => {
        const phone = String(restaurant.phone);
        return phone.length === 10 ? `+91 ${phone.slice(0, 5)} ${phone.slice(5)}` : phone;
    }, [restaurant.phone]);

    const coordinates = restaurant.autoLocation?.coordinates ?? [0, 0];
    const latitude = coordinates[1] ?? 0;
    const longitude = coordinates[0] ?? 0;
    const heroHeight = Math.max(240, Math.min(360, height * 0.36));

    const handleToggleOpen = () => {
        const nextValue = !isOpen;
        setIsOpen(nextValue);
        Alert.alert(
            nextValue ? 'Restaurant opened' : 'Restaurant paused',
            nextValue
                ? 'Customers can now see the restaurant as open.'
                : 'The restaurant is now marked as closed for customers.',
        );
    };

    const handleAction = (label: string) => {
        Alert.alert(label, 'Hook this action to your seller workflow next.');
    };

    return (
        <View className="flex-1" style={{ backgroundColor: AUTH_COLORS.background }}>
            <View
                className="absolute"
                style={{
                    width: 260,
                    height: 260,
                    borderRadius: 130,
                    backgroundColor: AUTH_COLORS.accent,
                    opacity: 0.16,
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

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingVertical: 20 }}
                showsVerticalScrollIndicator={false}
            >
                <View
                    className="flex-1"
                    style={{
                        backgroundColor: 'transparent',
                        minHeight: height - 46,
                    }}
                >
                    <View className="py-4">
                        <View className="" style={{ borderColor: AUTH_COLORS.cardBorder }}>
                            <Image source={{ uri: restaurant.image }} style={{ width: '100%', height: heroHeight }} resizeMode="cover" />

                            <View
                                className="absolute top-0 bottom-0 left-0 right-0"
                                style={{ backgroundColor: 'rgba(7,17,31,0.18)' }}
                            />

                            <View className="absolute flex-row items-center justify-between top-4 left-4 right-4">
                                <View className="flex-row flex-wrap flex-1 gap-5 pr-3">
                                    <View className={`px-3 py-2 border rounded-full ${isOpen ? 'bg-green-500' : 'bg-red-500'}`} style={{ borderColor: 'rgba(255,255,255,0.16)' }}>
                                        <Text className="text-[11px] font-bold uppercase" style={{ color: AUTH_COLORS.textPrimary }}>
                                            {isOpen ? 'Open now' : 'Closed'}
                                        </Text>
                                    </View>

                                    {restaurant.isVerified ? (
                                        <View className="px-3 py-2 bg-green-500 border rounded-full" style={{ borderColor: 'rgba(250,204,21,0.35)' }}>
                                            <Text className="text-[11px] font-bold uppercase" style={{ color: AUTH_COLORS.primary }}>
                                                Verified
                                            </Text>
                                        </View>
                                    ) : (
                                        <View className="px-3 py-2 bg-yellow-500 border rounded-full" style={{ borderColor: 'rgba(255,255,255,0.16)' }}>
                                            <Text className="text-[11px] font-bold uppercase" style={{ color: AUTH_COLORS.textPrimary }}>
                                                Pending verification
                                            </Text>
                                        </View>
                                    )}
                                </View>

                                <Pressable
                                    onPress={() => handleAction('Edit restaurant')}
                                    className="items-center justify-center border rounded-full w-11 h-11"
                                    style={{ backgroundColor: 'rgba(255,255,255,0.12)', borderColor: 'rgba(255,255,255,0.16)' }}
                                >
                                    <MaterialCommunityIcons name="pencil" size={20} color={AUTH_COLORS.textPrimary} />
                                </Pressable>
                            </View>

                            <View className="absolute left-4 right-4 bottom-4">
                                <Text className="text-3xl font-extrabold" style={{ color: AUTH_COLORS.textPrimary }} numberOfLines={1}>
                                    {restaurant.name}
                                </Text>
                                <Text className="mt-1 text-xs" style={{ color: 'rgba(255,255,255,0.82)' }} numberOfLines={2}>
                                    {restaurant.description}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View className="flex-1 px-4 pb-4">
                        <View className="justify-between flex-1">
                            <View>
                                <View className="flex-row flex-wrap gap-3 mb-4">
                                    <View className="flex-1 min-w-[96px] px-4 py-4 border rounded-2xl" style={{ backgroundColor: AUTH_COLORS.card, borderColor: AUTH_COLORS.cardBorder }}>
                                        <View className="flex-row items-center justify-between">
                                            <MaterialCommunityIcons name="map-marker-radius" size={22} color={AUTH_COLORS.accent} />
                                            <Text className="text-[10px] font-semibold uppercase" style={{ color: AUTH_COLORS.textSubtle }}>
                                                Location
                                            </Text>
                                        </View>
                                        <Text className="mt-3 text-lg font-extrabold" style={{ color: AUTH_COLORS.textPrimary }} numberOfLines={1}>
                                            Saved
                                        </Text>
                                        <Text className="mt-1 text-xs" style={{ color: AUTH_COLORS.textSubtle }} numberOfLines={2}>
                                            {restaurant.autoLocation.formattedAddress}
                                        </Text>
                                    </View>

                                    <View className="flex-1 min-w-[96px] px-4 py-4 border rounded-2xl" style={{ backgroundColor: AUTH_COLORS.card, borderColor: AUTH_COLORS.cardBorder }}>
                                        <View className="flex-row items-center justify-between">
                                            <MaterialCommunityIcons name="phone" size={22} color={AUTH_COLORS.primary} />
                                            <Text className="text-[10px] font-semibold uppercase" style={{ color: AUTH_COLORS.textSubtle }}>
                                                Contact
                                            </Text>
                                        </View>
                                        <Text className="mt-3 text-lg font-extrabold" style={{ color: AUTH_COLORS.textPrimary }} numberOfLines={1}>
                                            {formattedPhone}
                                        </Text>
                                        <Text className="mt-1 text-xs" style={{ color: AUTH_COLORS.textSubtle }}>
                                            Customer support line
                                        </Text>
                                    </View>
                                </View>

                                <View className="px-4 py-4 mb-4 border rounded-2xl" style={{ backgroundColor: AUTH_COLORS.card, borderColor: AUTH_COLORS.cardBorder }}>
                                    <View className="flex-row items-center justify-between mb-3">
                                        <View>
                                            <Text className="text-base font-bold" style={{ color: AUTH_COLORS.textPrimary }}>
                                                Restaurant Status
                                            </Text>
                                            <Text className="mt-1 text-xs" style={{ color: AUTH_COLORS.textSubtle }}>
                                                Tap to switch availability for customers.
                                            </Text>
                                        </View>

                                        <Pressable
                                            onPress={handleToggleOpen}
                                            className="px-4 py-3 rounded-full"
                                            style={{
                                                backgroundColor: isOpen ? 'rgba(16,185,129,0.18)' : 'rgba(239,68,68,0.18)',
                                                borderWidth: 1,
                                                borderColor: isOpen ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.28)',
                                            }}
                                        >
                                            <Text className="text-xs font-extrabold uppercase" style={{ color: isOpen ? '#34d399' : '#fca5a5' }}>
                                                {isOpen ? 'Open' : 'Closed'}
                                            </Text>
                                        </Pressable>
                                    </View>

                                    <View className="flex-row flex-wrap gap-2">
                                        <View className="px-3 py-2 border rounded-full" style={{ backgroundColor: AUTH_COLORS.chip, borderColor: AUTH_COLORS.chipBorder }}>
                                            <Text className="text-xs font-semibold" style={{ color: AUTH_COLORS.textPrimary }}>
                                                Owner ID: {restaurant.ownerId.slice(-6)}
                                            </Text>
                                        </View>
                                        <View className="px-3 py-2 border rounded-full" style={{ backgroundColor: AUTH_COLORS.chip, borderColor: AUTH_COLORS.chipBorder }}>
                                            <Text className="text-xs font-semibold" style={{ color: AUTH_COLORS.textPrimary }}>
                                                {latitude.toFixed(5)}, {longitude.toFixed(5)}
                                            </Text>
                                        </View>
                                        <View className="px-3 py-2 border rounded-full" style={{ backgroundColor: AUTH_COLORS.chip, borderColor: AUTH_COLORS.chipBorder }}>
                                            <Text className="text-xs font-semibold" style={{ color: AUTH_COLORS.textPrimary }}>
                                                Created {new Date(restaurant.createdAt).toLocaleDateString()}
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default MyRestraunt;