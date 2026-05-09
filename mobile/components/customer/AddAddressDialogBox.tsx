import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Modal,
    Pressable,
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Alert,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuthStore } from '@/store/auth.store';
import { useAddressStore } from '@/store/address.store';
import Constants from 'expo-constants';
import { AUTH_COLORS } from '@/constants';
import Background from '../shared/Background';

type Props = {
    visible: boolean;
    onClose: () => void;
};

interface FormData {
    latitude: number;
    longitude: number;
    formattedAddress: string;
    mobile: string;
}

const AddAddressDialogBox = ({ visible, onClose }: Props) => {
    const { location: defaultLocation } = useAuthStore();
    const { addAddress } = useAddressStore();
    const [form, setForm] = useState<FormData>({
        latitude: defaultLocation?.latitude ?? 28.7041,
        longitude: defaultLocation?.longitude ?? 77.1025,
        formattedAddress: defaultLocation?.formattedAddress ?? '',
        mobile: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

    useEffect(() => {
        if (visible && defaultLocation) {
            setForm((current) => ({
                ...current,
                latitude: defaultLocation.latitude,
                longitude: defaultLocation.longitude,
                formattedAddress: defaultLocation.formattedAddress,
            }));
        }
    }, [visible, defaultLocation]);

    const updateMobile = (value: string) => {
        const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
        setForm((current) => ({ ...current, mobile: digitsOnly }));
        setErrors((current) => ({ ...current, mobile: undefined }));
    };

    const updateAddress = (value: string) => {
        setForm((current) => ({ ...current, formattedAddress: value }));
        setErrors((current) => ({ ...current, formattedAddress: undefined }));
    };


    const validate = (): boolean => {
        const nextErrors: Partial<Record<keyof FormData, string>> = {};

        if (!form.mobile || form.mobile.length < 10) {
            nextErrors.mobile = 'Mobile number must be 10 digits.';
        }

        if (form.formattedAddress.trim().length < 5) {
            nextErrors.formattedAddress = 'Address must be at least 5 characters.';
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        try {
            setIsSubmitting(true);
            await addAddress({
                formattedAddress: form.formattedAddress,
                mobile: parseInt(form.mobile),
                latitude: form.latitude,
                longitude: form.longitude,
            });
            Alert.alert('Success', 'Address added successfully!');
            handleClose();
        } catch (error) {
            Alert.alert('Error', 'Failed to add address. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setForm({
            latitude: defaultLocation?.latitude ?? 28.7041,
            longitude: defaultLocation?.longitude ?? 77.1025,
            formattedAddress: defaultLocation?.formattedAddress ?? '',
            mobile: '',
        });
        setErrors({});
        onClose();
    };

    return (
        <Modal visible={visible} animationType="slide" onRequestClose={handleClose}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <View className="flex-1 bg-black">
                    <Background>
                        <View className="flex-1 mt-auto overflow-hidden rounded-t-3xl">
                            {/* Header */}
                            <View className="flex-row items-center justify-between px-5 py-4 border-b border-gray-200">
                                <Text className="text-lg font-bold text-gray-200">Add New Address</Text>
                                <Pressable
                                    onPress={handleClose}
                                    className="p-2 rounded-full active:bg-gray-100"
                                >
                                    <MaterialCommunityIcons name="close" size={24} color={AUTH_COLORS.primary} />
                                </Pressable>
                            </View>

                            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
                                {/* Map Section */}
                                <View className="px-5 py-4">
                                    <Text className="mb-3 text-sm font-semibold text-gray-300">
                                        Select Location on Map
                                    </Text>
                                    <View className="h-64 overflow-hidden border-2 border-gray-200 rounded-2xl">
                                        <MapView
                                            provider={PROVIDER_GOOGLE}
                                            style={{ flex: 1 }}
                                            initialRegion={{
                                                latitude: form.latitude,
                                                longitude: form.longitude,
                                                latitudeDelta: 0.01,
                                                longitudeDelta: 0.01,
                                            }}
                                            onPress={async (e) => {
                                                try {
                                                    const { latitude, longitude } = e.nativeEvent.coordinate;
                                                    setForm((current) => ({ ...current, latitude, longitude }));
                                                    // reverse geocode with Google Geocoding API
                                                    const apiKey =
                                                        // read the injected Expo config value
                                                        (Constants?.expoConfig as any)?.android?.config?.googleMaps?.apiKey ||
                                                        (Constants?.expoConfig as any)?.extra?.googleMapsApiKey ||
                                                        '';
                                                    if (apiKey) {
                                                        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;
                                                        const res = await fetch(url);
                                                        const data = await res.json();
                                                        if (data && data.results && data.results[0]) {
                                                            const formatted = data.results[0].formatted_address;
                                                            setForm((current) => ({ ...current, formattedAddress: formatted }));
                                                        }
                                                    }
                                                } catch (err) {
                                                    // ignore
                                                }
                                            }}
                                        >
                                            <Marker
                                                coordinate={{ latitude: form.latitude, longitude: form.longitude }}
                                                title="Selected Location"
                                                description={form.formattedAddress}
                                            />
                                        </MapView>
                                    </View>
                                    <Text className="mt-2 text-xs text-gray-200">
                                        Tap on the map to select a location
                                    </Text>
                                </View>

                                {/* Coordinates Display */}
                                <View className="px-5 py-3 mx-5 rounded-xl">
                                    <View className="flex-row justify-between mb-2">
                                        <View className="flex-1">
                                            <Text className="mb-1 text-xs text-gray-100">Latitude</Text>
                                            <Text className="text-sm font-semibold text-gray-200">
                                                {form.latitude.toFixed(6)}
                                            </Text>
                                        </View>
                                        <View className="flex-1">
                                            <Text className="mb-1 text-xs text-gray-100">Longitude</Text>
                                            <Text className="text-sm font-semibold text-gray-200">
                                                {form.longitude.toFixed(6)}
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                {/* Formatted Address Section */}
                                <View className="px-5 py-4">
                                    <Text className="mb-3 text-sm font-semibold text-gray-200">
                                        Address Details
                                    </Text>
                                    <TextInput
                                        placeholder="Enter or search formatted address"
                                        placeholderTextColor="#999"
                                        value={form.formattedAddress}
                                        onChangeText={updateAddress}
                                        multiline
                                        numberOfLines={3}
                                        className="px-4 py-3 text-gray-200 border-2 border-gray-300 rounded-xl"
                                        style={{
                                            borderColor: errors.formattedAddress
                                                ? '#EF4444'
                                                : '#D1D5DB',
                                        }}
                                    />
                                    {errors.formattedAddress && (
                                        <Text className="mt-1 text-xs text-red-500">
                                            {errors.formattedAddress}
                                        </Text>
                                    )}
                                </View>

                                {/* Mobile Number Section */}
                                <View className="px-5 py-4">
                                    <Text className="mb-3 text-sm font-semibold text-gray-100">
                                        Mobile Number
                                    </Text>
                                    <View className="flex-row items-center px-4 overflow-hidden border-2 border-gray-300 rounded-xl"
                                        style={{
                                            borderColor: errors.mobile
                                                ? '#EF4444'
                                                : '#D1D5DB',
                                        }}>
                                        <Text className="mr-2 font-semibold text-gray-200">+91</Text>
                                        <TextInput
                                            placeholder="Enter mobile number"
                                            placeholderTextColor="#999"
                                            value={form.mobile}
                                            onChangeText={updateMobile}
                                            keyboardType="phone-pad"
                                            maxLength={10}
                                            className="flex-1 py-3 text-gray-200"
                                        />
                                    </View>
                                    {errors.mobile && (
                                        <Text className="mt-1 text-xs text-red-500">
                                            {errors.mobile}
                                        </Text>
                                    )}
                                </View>

                                {/* Button Section */}
                                <View className="flex-row gap-3 px-5 py-4 pb-6">
                                    <Pressable
                                        onPress={handleClose}
                                        className="flex-1 py-3 bg-gray-200 rounded-xl active:bg-gray-300"
                                    >
                                        <Text className="font-semibold text-center text-gray-700">
                                            Cancel
                                        </Text>
                                    </Pressable>
                                    <Pressable
                                        onPress={handleSubmit}
                                        disabled={isSubmitting}
                                        className="flex-1 py-3 rounded-xl active:opacity-80"
                                        style={{
                                            backgroundColor: isSubmitting
                                                ? '#CCCCCC'
                                                : AUTH_COLORS.primary,
                                        }}
                                    >
                                        {isSubmitting ? (
                                            <ActivityIndicator color="white" />
                                        ) : (
                                            <Text className="font-semibold text-center text-white">
                                                Save Address
                                            </Text>
                                        )}
                                    </Pressable>
                                </View>
                            </ScrollView>
                        </View>
                    </Background>

                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

export default AddAddressDialogBox;