import { AUTH_COLORS } from '@/constants'
import { useAuthStore } from '@/store/auth.store'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import React, { useState } from 'react'
import { Pressable, Text, TextInput, View } from 'react-native'



const Header = () => {
    const { city } = useAuthStore();
    const [searchValue, setSearchValue] = useState("");

    const onSearchChange = (text: string) => {
        setSearchValue(text);
    };

    const onSearchSubmit = () => {
        console.log(searchValue);
    };

    return (
        <View className="flex-row items-center gap-2 mb-4">
            <View
                className="items-center justify-center px-2 py-2 border rounded-xl min-w-[68px]"
                style={{
                    backgroundColor: AUTH_COLORS.background,
                    borderColor: AUTH_COLORS.cardBorder,
                }}
            >
                <MaterialCommunityIcons name="map-marker-radius" size={14} color={AUTH_COLORS.primary} />
                <Text className="mt-1 text-[9px] font-bold text-center" style={{ color: AUTH_COLORS.textPrimary }} numberOfLines={1}>
                    {city}
                </Text>
            </View>

            <View
                className="flex-row items-center flex-1 px-3 border rounded-xl"
                style={{
                    backgroundColor: AUTH_COLORS.background,
                    borderColor: AUTH_COLORS.cardBorder,
                    height: 40,
                }}
            >
                <MaterialCommunityIcons name="magnify" size={16} color={AUTH_COLORS.textSubtle} />
                <TextInput
                    value={searchValue}
                    onChangeText={onSearchChange}
                    onSubmitEditing={onSearchSubmit}
                    placeholder="Search restaurants..."
                    placeholderTextColor={AUTH_COLORS.textSubtle}
                    returnKeyType="search"
                    className="flex-1 ml-2 text-sm"
                    style={{ color: AUTH_COLORS.textPrimary }}
                />
                <Pressable
                    onPress={onSearchSubmit}
                    className="items-center justify-center w-8 h-8 rounded-lg"
                    style={{ backgroundColor: AUTH_COLORS.primary }}
                >
                    <MaterialCommunityIcons name="arrow-right" size={14} color={AUTH_COLORS.background} />
                </Pressable>
            </View>
        </View>
    )
}

export default Header