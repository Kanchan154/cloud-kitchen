import { AUTH_COLORS } from '@/constants';
import { useSellerStore } from '@/store/seller.store';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from 'react-native';

type Props = {
    visible: boolean;
    onClose: () => void;
};

type FormErrors = Partial<Record<'name' | 'description' | 'price' | 'image', string>>;

const initialFormState = {
    name: '',
    description: '',
    price: '',
    imageUri: null as string | null,
};

const AddMenuItemDialogBox = ({ visible, onClose }: Props) => {
    const { addMenuItem } = useSellerStore();
    const [form, setForm] = useState(initialFormState);
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!visible) {
            return;
        }

        setForm(initialFormState);
        setErrors({});
    }, [visible]);

    const updateField = (field: keyof Pick<typeof form, 'name' | 'description'>, value: string) => {
        setForm((current) => ({ ...current, [field]: value }));
        setErrors((current) => ({ ...current, [field]: undefined }));
    };

    const updatePrice = (value: string) => {
        const normalized = value.replace(/[^0-9.]/g, '');
        const dotIndex = normalized.indexOf('.');
        const safeValue = dotIndex === -1 ? normalized : `${normalized.slice(0, dotIndex + 1)}${normalized.slice(dotIndex + 1).replace(/\./g, '')}`;
        setForm((current) => ({ ...current, price: safeValue }));
        setErrors((current) => ({ ...current, price: undefined }));
    };

    const pickImage = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permission.granted) {
            Alert.alert('Permission needed', 'Allow media library access to choose a menu item image.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.85,
        });

        if (!result.canceled && result.assets.length > 0) {
            setForm((current) => ({ ...current, imageUri: result.assets[0].uri }));
            setErrors((current) => ({ ...current, image: undefined }));
        }
    };

    const validate = () => {
        const nextErrors: FormErrors = {};
        const name = form.name.trim();
        const description = form.description.trim();
        const priceValue = Number(form.price);

        if (name.length < 2) {
            nextErrors.name = 'Item name must be at least 2 characters.';
        } else if (name.length > 60) {
            nextErrors.name = 'Item name cannot exceed 60 characters.';
        }

        if (description.length < 10) {
            nextErrors.description = 'Description must be at least 10 characters.';
        } else if (description.length > 250) {
            nextErrors.description = 'Description cannot exceed 250 characters.';
        }

        if (!form.price || Number.isNaN(priceValue) || priceValue <= 0) {
            nextErrors.price = 'Price must be a valid amount greater than 0.';
        }

        if (!form.imageUri) {
            nextErrors.image = 'Menu item image is required.';
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleClose = () => {
        setErrors({});
        setForm(initialFormState);
        onClose();
    };

    const handleSubmit = async () => {
        if (!validate()) {
            return;
        }

        setIsSubmitting(true);
        try {
            const success = await addMenuItem({
                name: form.name.trim(),
                description: form.description.trim(),
                price: Number(form.price),
                isAvailable: true,
                file: form.imageUri as string,
            });

            if (success) {
                handleClose();
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
            <View className="justify-end flex-1" style={{ backgroundColor: 'rgba(0,0,0,0.72)' }}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                    <View
                        className="overflow-hidden border-t-2 rounded-t-[28px]"
                        style={{
                            maxHeight: '92%',
                            backgroundColor: AUTH_COLORS.background,
                            borderColor: AUTH_COLORS.cardBorder,
                        }}
                    >
                        <View className="px-5 pt-4 pb-3 border-b" style={{ borderColor: AUTH_COLORS.cardBorder }}>
                            <View className="flex-row items-center justify-between">
                                <View>
                                    <Text className="text-2xl font-extrabold" style={{ color: AUTH_COLORS.textPrimary }}>
                                        Add Menu Item
                                    </Text>
                                    <Text className="mt-1 text-xs" style={{ color: AUTH_COLORS.textSubtle }}>
                                        Fill in item details and add a dish image.
                                    </Text>
                                </View>

                                <Pressable
                                    onPress={handleClose}
                                    className="items-center justify-center w-10 h-10 rounded-full"
                                    style={{ backgroundColor: AUTH_COLORS.card }}
                                >
                                    <MaterialCommunityIcons name="close" size={22} color={AUTH_COLORS.textPrimary} />
                                </Pressable>
                            </View>
                        </View>

                        <ScrollView
                            keyboardShouldPersistTaps="handled"
                            contentContainerClassName="px-5 pt-5 pb-8"
                            showsVerticalScrollIndicator={false}
                        >
                            <View className="mb-4">
                                <Text className="mb-2 text-sm font-semibold" style={{ color: AUTH_COLORS.textPrimary }}>
                                    Item Name
                                </Text>
                                <TextInput
                                    value={form.name}
                                    onChangeText={(value) => updateField('name', value)}
                                    placeholder="Enter item name"
                                    placeholderTextColor={AUTH_COLORS.textSubtle}
                                    autoCapitalize="words"
                                    autoCorrect={false}
                                    maxLength={60}
                                    returnKeyType="next"
                                    style={{
                                        color: AUTH_COLORS.textPrimary,
                                        backgroundColor: AUTH_COLORS.card,
                                        borderColor: errors.name ? '#f87171' : AUTH_COLORS.cardBorder,
                                        borderWidth: 1,
                                        borderRadius: 16,
                                        paddingHorizontal: 16,
                                        paddingVertical: 14,
                                    }}
                                />
                                <Text className="mt-1 text-xs" style={{ color: AUTH_COLORS.textSubtle }}>
                                    2 to 60 characters.
                                </Text>
                                {errors.name ? (
                                    <Text className="mt-1 text-xs font-medium" style={{ color: '#fda4af' }}>
                                        {errors.name}
                                    </Text>
                                ) : null}
                            </View>

                            <View className="mb-4">
                                <Text className="mb-2 text-sm font-semibold" style={{ color: AUTH_COLORS.textPrimary }}>
                                    Description
                                </Text>
                                <TextInput
                                    value={form.description}
                                    onChangeText={(value) => updateField('description', value)}
                                    placeholder="Describe this menu item"
                                    placeholderTextColor={AUTH_COLORS.textSubtle}
                                    multiline
                                    numberOfLines={4}
                                    maxLength={250}
                                    textAlignVertical="top"
                                    autoCapitalize="sentences"
                                    style={{
                                        minHeight: 120,
                                        color: AUTH_COLORS.textPrimary,
                                        backgroundColor: AUTH_COLORS.card,
                                        borderColor: errors.description ? '#f87171' : AUTH_COLORS.cardBorder,
                                        borderWidth: 1,
                                        borderRadius: 16,
                                        paddingHorizontal: 16,
                                        paddingVertical: 14,
                                    }}
                                />
                                <Text className="mt-1 text-xs" style={{ color: AUTH_COLORS.textSubtle }}>
                                    10 to 250 characters.
                                </Text>
                                {errors.description ? (
                                    <Text className="mt-1 text-xs font-medium" style={{ color: '#fda4af' }}>
                                        {errors.description}
                                    </Text>
                                ) : null}
                            </View>

                            <View className="mb-4">
                                <Text className="mb-2 text-sm font-semibold" style={{ color: AUTH_COLORS.textPrimary }}>
                                    Price
                                </Text>
                                <TextInput
                                    value={form.price}
                                    onChangeText={updatePrice}
                                    placeholder="Enter item price"
                                    placeholderTextColor={AUTH_COLORS.textSubtle}
                                    keyboardType="decimal-pad"
                                    inputMode="decimal"
                                    style={{
                                        color: AUTH_COLORS.textPrimary,
                                        backgroundColor: AUTH_COLORS.card,
                                        borderColor: errors.price ? '#f87171' : AUTH_COLORS.cardBorder,
                                        borderWidth: 1,
                                        borderRadius: 16,
                                        paddingHorizontal: 16,
                                        paddingVertical: 14,
                                    }}
                                />
                                <Text className="mt-1 text-xs" style={{ color: AUTH_COLORS.textSubtle }}>
                                    Numeric value greater than 0.
                                </Text>
                                {errors.price ? (
                                    <Text className="mt-1 text-xs font-medium" style={{ color: '#fda4af' }}>
                                        {errors.price}
                                    </Text>
                                ) : null}
                            </View>

                            <View className="mb-4">
                                <Text className="mb-2 text-sm font-semibold" style={{ color: AUTH_COLORS.textPrimary }}>
                                    Item Image
                                </Text>
                                <Pressable
                                    onPress={pickImage}
                                    className="items-center justify-center overflow-hidden border border-dashed rounded-2xl"
                                    style={{
                                        minHeight: 180,
                                        borderColor: errors.image ? '#f87171' : AUTH_COLORS.cardBorder,
                                        backgroundColor: AUTH_COLORS.card,
                                    }}
                                >
                                    {form.imageUri ? (
                                        <Image source={{ uri: form.imageUri }} style={{ width: '100%', height: 220, borderRadius: 16 }} resizeMode="cover" />
                                    ) : (
                                        <View className="items-center justify-center px-6 py-8">
                                            <MaterialCommunityIcons name="image-plus" size={42} color={AUTH_COLORS.primary} />
                                            <Text className="mt-3 text-base font-semibold text-center" style={{ color: AUTH_COLORS.textPrimary }}>
                                                Tap to add item image
                                            </Text>
                                            <Text className="mt-1 text-xs text-center" style={{ color: AUTH_COLORS.textSubtle }}>
                                                JPG or PNG. Best results with a square food photo.
                                            </Text>
                                        </View>
                                    )}
                                </Pressable>
                                <Text className="mt-1 text-xs" style={{ color: AUTH_COLORS.textSubtle }}>
                                    Required. Choose a clear and appetizing image.
                                </Text>
                                {errors.image ? (
                                    <Text className="mt-1 text-xs font-medium" style={{ color: '#fda4af' }}>
                                        {errors.image}
                                    </Text>
                                ) : null}
                            </View>

                            <View className="flex-row gap-3 mt-2">
                                <Pressable
                                    onPress={handleClose}
                                    className="items-center justify-center flex-1 py-4 border rounded-2xl"
                                    style={{ backgroundColor: AUTH_COLORS.card, borderColor: AUTH_COLORS.cardBorder }}
                                >
                                    <Text className="text-sm font-semibold" style={{ color: AUTH_COLORS.textPrimary }}>
                                        Cancel
                                    </Text>
                                </Pressable>

                                <Pressable
                                    onPress={handleSubmit}
                                    disabled={isSubmitting}
                                    className="items-center justify-center flex-1 py-4 rounded-2xl"
                                    style={{ backgroundColor: AUTH_COLORS.primary, opacity: isSubmitting ? 0.8 : 1 }}
                                >
                                    <Text className="text-sm font-extrabold" style={{ color: AUTH_COLORS.background }}>
                                        {isSubmitting ? 'Saving...' : 'Save Item'}
                                    </Text>
                                </Pressable>
                            </View>
                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
};

export default AddMenuItemDialogBox;