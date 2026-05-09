import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Modal,
    FlatList,
    Pressable,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAddressStore } from '@/store/address.store';
import { AddressType, AddressInputType } from '@/types';
// import AddAddressDialogBox from './AddAddressDialogBox';
import { AUTH_COLORS } from '@/constants';
import AddAddressDialogBox from './AddAddressDialogBox';
import Background from '../shared/Background';

type Props = {
    visible: boolean;
    onClose: () => void;
};

const AddressList = ({ visible, onClose }: Props) => {
    const { fetchAllAddresses, addressList, currentAddress, setCurrentAddress, deleteAddress } =
        useAddressStore();
    const [isLoading, setIsLoading] = useState(false);
    const [showAddAddressDialog, setShowAddAddressDialog] = useState(false);

    useEffect(() => {
        if (visible) {
            loadAddresses();
        }
    }, [visible]);

    const loadAddresses = async () => {
        try {
            setIsLoading(true);
            await fetchAllAddresses();
        } catch (error) {
            Alert.alert('Error', 'Failed to load addresses');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectAddress = (address: AddressType) => {
        setCurrentAddress(address);
        onClose();
    };

    const handleDeleteAddress = (address: AddressType) => {
        Alert.alert('Delete Address', 'Are you sure you want to delete this address?', [
            { text: 'Cancel', onPress: () => { }, style: 'cancel' },
            {
                text: 'Delete',
                onPress: async () => {
                    try {
                        // Note: DeleteAddress API might need an ID field
                        // Assuming address has an _id field from MongoDB
                        const addressId = address._id;
                        if (!addressId) {
                            Alert.alert('Error', 'Address ID not found');
                            return;
                        }
                        await deleteAddress(addressId);
                    } catch (error) {
                        Alert.alert('Error', 'Failed to delete address');
                    }
                },
                style: 'destructive',
            },
        ]);
    };

    const renderAddressCard = ({ item }: { item: AddressType }) => {
        const isCurrentAddress =
            currentAddress?.formattedAddress === item.formattedAddress &&
            currentAddress?.mobile === item.mobile &&
            currentAddress?.location.coordinates[0] === item.location.coordinates[0] &&
            currentAddress?.location.coordinates[1] === item.location.coordinates[1];

        return (
            <Pressable
                onPress={() => handleSelectAddress(item)}
                className="mx-4 mb-3 overflow-hidden rounded-2xl"
                style={{
                    borderWidth: 2,
                    borderColor: isCurrentAddress ? AUTH_COLORS.primary : '#E5E7EB',
                }}
            >
                <View className="p-4">
                    {/* Header with Current Badge */}
                    <View className="flex-row items-start justify-between mb-3">
                        <View className="flex-row items-center flex-1 gap-2">
                            <MaterialCommunityIcons
                                name="map-marker"
                                size={20}
                                color={isCurrentAddress ? AUTH_COLORS.primary : '#6B7280'}
                            />
                            <Text
                                className="flex-1 text-sm font-semibold text-gray-300"
                                numberOfLines={1}
                            >
                                Address
                            </Text>
                        </View>
                        {isCurrentAddress && (
                            <View
                                className="px-3 py-1 bg-blue-100 rounded-full"
                                style={{ backgroundColor: AUTH_COLORS.primary + '20' }}
                            >
                                <Text
                                    className="text-xs font-semibold"
                                    style={{ color: AUTH_COLORS.primary }}
                                >
                                    Current
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Address Details */}
                    <View className="mb-3">
                        <Text className="mb-2 text-sm leading-5 text-gray-400">
                            {item.formattedAddress}
                        </Text>
                        <View className="flex-row items-center gap-2">
                            <MaterialCommunityIcons
                                name="phone"
                                size={16}
                                color="#6B7280"
                            />
                            <Text className="text-sm font-medium text-gray-400">
                                +91 {item.mobile}
                            </Text>
                        </View>
                    </View>

                    {/* Coordinates */}
                    <View className="p-3 mb-3 rounded-lg ">
                        <Text className="mb-2 text-xs font-semibold text-gray-200">
                            COORDINATES
                        </Text>
                        <View className="flex-row justify-between">
                            <View className="flex-1">
                                <Text className="mb-1 text-xs text-gray-200">Lat</Text>
                                <Text className="font-mono text-xs text-gray-400">
                                    {item.location.coordinates[1].toFixed(4)}
                                </Text>
                            </View>
                            <View className="flex-1">
                                <Text className="mb-1 text-xs text-gray-200">Lng</Text>
                                <Text className="font-mono text-xs text-gray-400">
                                    {item.location.coordinates[0].toFixed(4)}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Action Buttons */}
                    <View className="flex-row gap-2">
                        {!isCurrentAddress && (
                            <Pressable
                                onPress={() => handleSelectAddress(item)}
                                className="flex-1 py-2 bg-yellow-100 rounded-lg active:bg-blue-100"
                                style={{
                                    backgroundColor: AUTH_COLORS.primary + '15',
                                }}
                            >
                                <Text
                                    className="text-sm font-semibold text-center"
                                    style={{ color: AUTH_COLORS.primary }}
                                >
                                    Select
                                </Text>
                            </Pressable>
                        )}
                        <Pressable
                            onPress={() => handleDeleteAddress(item)}
                            className="flex-1 py-2 bg-red-100 rounded-lg active:bg-red-100"
                        >
                            <Text className="text-sm font-semibold text-center text-red-600">
                                Delete
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </Pressable>
        );
    };

    const renderEmptyState = () => (
        <View className="items-center justify-center flex-1 py-12">
            <MaterialCommunityIcons
                name="map-marker-off"
                size={48}
                color="#D1D5DB"
            />
            <Text className="mt-4 text-lg font-semibold text-gray-600">
                No Addresses Yet
            </Text>
            <Text className="px-6 mt-2 text-sm text-center text-gray-500">
                Add your first address to get started with ordering
            </Text>
        </View>
    );

    return (
        <>
            <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
                <View className="flex-1 bg-black/50">
                    <Background>
                        <View className="flex-1 mt-auto overflow-hidden rounded-t-3xl">
                            {/* Header */}
                            <View className="flex-row items-center justify-between px-5 py-4 border-b border-gray-200">
                                <Text className="text-lg font-bold text-gray-400">
                                    My Addresses
                                </Text>
                                <Pressable
                                    onPress={onClose}
                                    className="p-2 rounded-full active:bg-gray-100"
                                >
                                    <MaterialCommunityIcons
                                        name="close"
                                        size={24}
                                        color={AUTH_COLORS.primary}
                                    />
                                </Pressable>
                            </View>

                            {/* FlatList */}
                            {isLoading ? (
                                <View className="items-center justify-center flex-1">
                                    <ActivityIndicator
                                        size="large"
                                        color={AUTH_COLORS.primary}
                                    />
                                </View>
                            ) : (
                                <FlatList
                                    data={addressList}
                                    renderItem={renderAddressCard}
                                    keyExtractor={(item, index) =>
                                        (item as any)?._id || `address-${index}`
                                    }
                                    ListEmptyComponent={renderEmptyState}
                                    contentContainerStyle={{
                                        flexGrow: 1,
                                        paddingTop: 12,
                                        paddingBottom: 20,
                                    }}
                                    scrollEnabled={addressList.length > 0}
                                />
                            )}

                            {/* Add Address Button */}
                            <View className="gap-3 px-5 py-4 border-t border-gray-200">
                                <Pressable
                                    onPress={() => setShowAddAddressDialog(true)}
                                    className="flex-row items-center justify-center py-3 rounded-xl active:opacity-80"
                                    style={{
                                        backgroundColor: AUTH_COLORS.primary,
                                    }}
                                >
                                    <MaterialCommunityIcons
                                        name="plus"
                                        size={20}
                                        color="white"
                                    />
                                    <Text className="ml-2 font-semibold text-white">
                                        Add New Address
                                    </Text>
                                </Pressable>
                                <Pressable
                                    onPress={onClose}
                                    className="py-3 bg-gray-100 rounded-xl active:bg-gray-200"
                                >
                                    <Text className="font-semibold text-center text-gray-700">
                                        Close
                                    </Text>
                                </Pressable>
                            </View>
                        </View>
                    </Background>
                </View>
            </Modal>

            {/* Add Address Dialog */}
            <AddAddressDialogBox
                visible={showAddAddressDialog}
                onClose={() => {
                    setShowAddAddressDialog(false);
                    loadAddresses();
                }}
            />
        </>
    );
};

export default AddressList;