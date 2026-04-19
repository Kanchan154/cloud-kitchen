import React, { useState } from 'react';
import { Alert, Image, Pressable, Text, View } from 'react-native';
import { AUTH_COLORS } from '@/constants';
import { MenuItemsType } from '@/types';
import { useSellerStore } from '@/store/seller.store';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const MenuItemCard = ({ item }: { item: MenuItemsType }) => {
    const { updateAvailability, deleteMenuItem } = useSellerStore();
    const [isToggling, setIsToggling] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleToggleAvailability = async () => {
        if (isToggling) {
            return;
        }

        setIsToggling(true);
        try {
            await updateAvailability(item._id);
        } finally {
            setIsToggling(false);
        }
    };

    const confirmDelete = () => {
        Alert.alert('Delete Item', `Delete ${item.name} from your menu?`, [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: handleDelete,
            },
        ]);
    };

    const handleDelete = async () => {
        if (isDeleting) {
            return;
        }

        setIsDeleting(true);
        try {
            await deleteMenuItem(item._id);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <View
            className="p-3 mb-3 border rounded-2xl"
            style={{
                backgroundColor: AUTH_COLORS.card,
                borderColor: AUTH_COLORS.cardBorder,
            }}
        >
            <View className="flex-row">
                <Image
                    source={{ uri: item.image }}
                    className="w-[92px] h-[92px] rounded-xl"
                    resizeMode="cover"
                />

                <View className="flex-1 ml-3">
                    <View className="flex-row items-start justify-between">
                        <Text className="flex-1 mr-2 text-base font-extrabold" style={{ color: AUTH_COLORS.textPrimary }} numberOfLines={1}>
                            {item.name}
                        </Text>
                        <Text className="text-sm font-extrabold" style={{ color: AUTH_COLORS.primary }}>
                            Rs {item.price}
                        </Text>
                    </View>

                    <Text className="mt-1 text-xs leading-5" style={{ color: AUTH_COLORS.textSubtle }} numberOfLines={2}>
                        {item.description}
                    </Text>

                    <View className="flex-row items-center justify-between mt-3">
                        <Pressable
                            onPress={handleToggleAvailability}
                            disabled={isToggling}
                            className="px-3 py-2 border rounded-full"
                            style={{
                                borderColor: item.isAvailable ? 'rgba(16,185,129,0.35)' : 'rgba(239,68,68,0.3)',
                                backgroundColor: item.isAvailable ? 'rgba(16,185,129,0.18)' : 'rgba(239,68,68,0.18)',
                                opacity: isToggling ? 0.7 : 1,
                            }}
                        >
                            <Text
                                className="text-[11px] font-extrabold uppercase"
                                style={{ color: item.isAvailable ? '#34d399' : '#fca5a5' }}
                            >
                                {isToggling ? 'Updating...' : item.isAvailable ? 'Available' : 'Unavailable'}
                            </Text>
                        </Pressable>

                        <Pressable
                            onPress={confirmDelete}
                            disabled={isDeleting}
                            className="items-center justify-center border rounded-full w-9 h-9"
                            style={{
                                borderColor: 'rgba(248,113,113,0.35)',
                                backgroundColor: 'rgba(239,68,68,0.16)',
                                opacity: isDeleting ? 0.7 : 1,
                            }}
                        >
                            <MaterialCommunityIcons name="trash-can-outline" size={18} color="#fca5a5" />
                        </Pressable>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default MenuItemCard;