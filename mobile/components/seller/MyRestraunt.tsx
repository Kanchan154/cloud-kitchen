import { AUTH_COLORS } from '@/constants';
import { IRestaurant } from '@/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, Text, View } from 'react-native';

type Props = {
    restaurant: IRestaurant;
};

const MyRestraunt = ({ restaurant }: Props) => {
    const [isOpen, setIsOpen] = useState(restaurant.isOpen);

    const rating = useMemo(() => {
        const base = restaurant.isVerified ? 4.8 : 4.4;
        return base.toFixed(1);
    }, [restaurant.isVerified]);

    const formattedPhone = useMemo(() => {
        const phone = String(restaurant.phone);
        return phone.length === 10 ? `+91 ${phone.slice(0, 5)} ${phone.slice(5)}` : phone;
    }, [restaurant.phone]);

    const coordinates = restaurant.autoLocation?.coordinates ?? [0, 0];
    const latitude = coordinates[1] ?? 0;
    const longitude = coordinates[0] ?? 0;

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
        <ScrollView
            className="flex-1"
            contentContainerClassName="px-5 pt-5 pb-10"
            showsVerticalScrollIndicator={false}
        >
            <View
                className="overflow-hidden border rounded-[28px]"
                style={{
                    backgroundColor: AUTH_COLORS.background,
                    borderColor: AUTH_COLORS.cardBorder,
                }}
            >
                <View className="p-4">
                    <View className="overflow-hidden rounded-[24px] border" style={{ borderColor: AUTH_COLORS.cardBorder }}>
                        <Image source={{ uri: restaurant.image }} style={{ width: '100%', height: 220 }} resizeMode="cover" />

                        <View
                            className="absolute top-0 bottom-0 left-0 right-0"
                            style={{ backgroundColor: 'rgba(7,17,31,0.18)' }}
                        />

                        <View className="absolute flex-row items-start justify-between top-4 left-4 right-4">
                            <View className="flex-row flex-wrap flex-1 gap-2 pr-3">
                                <View className="px-3 py-2 border rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.12)', borderColor: 'rgba(255,255,255,0.16)' }}>
                                    <Text className="text-[11px] font-bold uppercase" style={{ color: AUTH_COLORS.textPrimary }}>
                                        {isOpen ? 'Open now' : 'Closed'}
                                    </Text>
                                </View>

                                {restaurant.isVerified ? (
                                    <View className="px-3 py-2 border rounded-full" style={{ backgroundColor: 'rgba(250,204,21,0.18)', borderColor: 'rgba(250,204,21,0.35)' }}>
                                        <Text className="text-[11px] font-bold uppercase" style={{ color: AUTH_COLORS.primary }}>
                                            Verified
                                        </Text>
                                    </View>
                                ) : (
                                    <View className="px-3 py-2 border rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.12)', borderColor: 'rgba(255,255,255,0.16)' }}>
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

                <View className="px-4 pb-4">
                    <View className="flex-row flex-wrap gap-3 mb-4">
                        <View className="flex-1 min-w-[96px] px-4 py-4 border rounded-2xl" style={{ backgroundColor: AUTH_COLORS.card, borderColor: AUTH_COLORS.cardBorder }}>
                            <View className="flex-row items-center justify-between">
                                <MaterialCommunityIcons name="star-circle" size={22} color={AUTH_COLORS.primary} />
                                <Text className="text-[10px] font-semibold uppercase" style={{ color: AUTH_COLORS.textSubtle }}>
                                    Rating
                                </Text>
                            </View>
                            <Text className="mt-3 text-2xl font-extrabold" style={{ color: AUTH_COLORS.textPrimary }}>
                                {rating}
                            </Text>
                            <Text className="mt-1 text-xs" style={{ color: AUTH_COLORS.textSubtle }}>
                                Seller performance
                            </Text>
                        </View>

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

                    <View className="flex-row gap-3">
                        <Pressable
                            onPress={() => handleAction('Manage menu')}
                            className="items-center justify-center flex-1 py-4 rounded-2xl"
                            style={{ backgroundColor: AUTH_COLORS.primary }}
                        >
                            <Text className="text-sm font-extrabold" style={{ color: AUTH_COLORS.background }}>
                                Manage Menu
                            </Text>
                        </Pressable>

                        <Pressable
                            onPress={() => handleAction('Restaurant insights')}
                            className="items-center justify-center flex-1 py-4 border rounded-2xl"
                            style={{ backgroundColor: AUTH_COLORS.card, borderColor: AUTH_COLORS.cardBorder }}
                        >
                            <Text className="text-sm font-bold" style={{ color: AUTH_COLORS.textPrimary }}>
                                Insights
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

export default MyRestraunt;