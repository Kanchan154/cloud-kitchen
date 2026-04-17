import { AUTH_COLORS } from '@/constants';
import { useAuthStore } from '@/store/auth.store';
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
};

type FormErrors = Partial<Record<'name' | 'description' | 'phone' | 'image' | 'location', string>>;

const initialFormState = (location: ReturnType<typeof useAuthStore.getState>['location']) => ({
  name: '',
  description: '',
  phone: '',
  imageUri: null as string | null,
  latitude: location?.latitude ?? 0,
  longitude: location?.longitude ?? 0,
  formattedAddress: location?.formattedAddress ?? '',
});

const AddRestaurantDialogBox = ({ visible }: Props) => {
  const location = useAuthStore((state) => state.location);
  const [form, setForm] = useState(initialFormState(location));
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!visible) {
      return;
    }

    setForm((current) => ({
      ...current,
      latitude: location?.latitude ?? current.latitude,
      longitude: location?.longitude ?? current.longitude,
      formattedAddress: location?.formattedAddress ?? current.formattedAddress,
    }));
  }, [location, visible]);

  // update field
  const updateField = (field: keyof Pick<typeof form, 'name' | 'description'>, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  // update phone
  const updatePhone = (value: string) => {
    const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
    setForm((current) => ({ ...current, phone: digitsOnly }));
    setErrors((current) => ({ ...current, phone: undefined }));
  };

  // hanvdle image Picker
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permission needed', 'Allow media library access to choose a restaurant image.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.85,
    });

    if (!result.canceled && result.assets.length > 0) {
      setForm((current) => ({ ...current, imageUri: result.assets[0].uri }));
      setErrors((current) => ({ ...current, image: undefined }));
    }
  };

  const { addRestaurant } = useSellerStore();

  // validate form
  const validate = () => {
    const nextErrors: FormErrors = {};
    const name = form.name.trim();
    const description = form.description.trim();

    if (name.length < 3) {
      nextErrors.name = 'Restaurant name must be at least 3 characters.';
    } else if (name.length > 50) {
      nextErrors.name = 'Restaurant name cannot exceed 50 characters.';
    }

    if (description.length < 20) {
      nextErrors.description = 'Description must be at least 20 characters.';
    } else if (description.length > 300) {
      nextErrors.description = 'Description cannot exceed 300 characters.';
    }

    if (form.phone.length !== 10) {
      nextErrors.phone = 'Phone number must contain exactly 10 digits.';
    }

    if (!form.imageUri) {
      nextErrors.image = 'Restaurant image is required.';
    }

    if (!location?.formattedAddress || !location.latitude || !location.longitude) {
      nextErrors.location = 'Set your location in the app before adding a restaurant.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  // handle Submit form
  const handleSubmit = async () => {
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await addRestaurant({
        name: form.name.trim(),
        description: form.description.trim(),
        file: form.imageUri as string,
        formattedAddress: form.formattedAddress,
        latitude: form.latitude,
        longitude: form.longitude,
        phone: Number(form.phone),
      }).then((success) => {
        if (success) {
          handleClose();
        }
      })
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setErrors({});
    setForm(initialFormState(location));
  };

  const hasLocation = Boolean(location?.formattedAddress && location.latitude && location.longitude);

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
                    Add Restaurant
                  </Text>
                  <Text className="mt-1 text-xs" style={{ color: AUTH_COLORS.textSubtle }}>
                    Fill in the restaurant details and choose a cover image.
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
                  Restaurant Name
                </Text>
                <TextInput
                  value={form.name}
                  onChangeText={(value) => updateField('name', value)}
                  placeholder="Enter restaurant name"
                  placeholderTextColor={AUTH_COLORS.textSubtle}
                  autoCapitalize="words"
                  autoCorrect={false}
                  maxLength={50}
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
                  3 to 50 characters. Use a proper restaurant or brand name.
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
                  placeholder="Write a short description"
                  placeholderTextColor={AUTH_COLORS.textSubtle}
                  multiline
                  numberOfLines={4}
                  maxLength={300}
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
                  20 to 300 characters. Keep it concise and useful.
                </Text>
                {errors.description ? (
                  <Text className="mt-1 text-xs font-medium" style={{ color: '#fda4af' }}>
                    {errors.description}
                  </Text>
                ) : null}
              </View>

              <View className="mb-4">
                <Text className="mb-2 text-sm font-semibold" style={{ color: AUTH_COLORS.textPrimary }}>
                  Phone Number
                </Text>
                <TextInput
                  value={form.phone}
                  onChangeText={updatePhone}
                  placeholder="10-digit phone number"
                  placeholderTextColor={AUTH_COLORS.textSubtle}
                  keyboardType="number-pad"
                  inputMode="numeric"
                  maxLength={10}
                  style={{
                    color: AUTH_COLORS.textPrimary,
                    backgroundColor: AUTH_COLORS.card,
                    borderColor: errors.phone ? '#f87171' : AUTH_COLORS.cardBorder,
                    borderWidth: 1,
                    borderRadius: 16,
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                  }}
                />
                <Text className="mt-1 text-xs" style={{ color: AUTH_COLORS.textSubtle }}>
                  Digits only, exactly 10 numbers.
                </Text>
                {errors.phone ? (
                  <Text className="mt-1 text-xs font-medium" style={{ color: '#fda4af' }}>
                    {errors.phone}
                  </Text>
                ) : null}
              </View>

              <View className="mb-4">
                <Text className="mb-2 text-sm font-semibold" style={{ color: AUTH_COLORS.textPrimary }}>
                  Restaurant Image
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
                    <Image source={{ uri: form.imageUri }} style={{ width: '100%', height: 200, borderRadius: 16 }} resizeMode="cover" />
                  ) : (
                    <View className="items-center justify-center px-6 py-8">
                      <MaterialCommunityIcons name="image-plus" size={42} color={AUTH_COLORS.primary} />
                      <Text className="mt-3 text-base font-semibold text-center" style={{ color: AUTH_COLORS.textPrimary }}>
                        Tap to add a cover image
                      </Text>
                      <Text className="mt-1 text-xs text-center" style={{ color: AUTH_COLORS.textSubtle }}>
                        JPG or PNG. We will crop it to a restaurant-friendly cover image.
                      </Text>
                    </View>
                  )}
                </Pressable>
                <Text className="mt-1 text-xs" style={{ color: AUTH_COLORS.textSubtle }}>
                  Required. Pick a clear image with good lighting.
                </Text>
                {errors.image ? (
                  <Text className="mt-1 text-xs font-medium" style={{ color: '#fda4af' }}>
                    {errors.image}
                  </Text>
                ) : null}
              </View>

              <View className="mb-4">
                <Text className="mb-2 text-sm font-semibold" style={{ color: AUTH_COLORS.textPrimary }}>
                  Location
                </Text>
                <View
                  className="px-4 py-4 border rounded-2xl"
                  style={{
                    backgroundColor: AUTH_COLORS.card,
                    borderColor: errors.location ? '#f87171' : AUTH_COLORS.cardBorder,
                  }}
                >
                  <View className="flex-row items-start mb-3">
                    <MaterialCommunityIcons name="map-marker-radius" size={20} color={AUTH_COLORS.accent} />
                    <View className="flex-1 ml-2">
                      <Text className="text-sm font-semibold" style={{ color: AUTH_COLORS.textPrimary }}>
                        Default address from your profile
                      </Text>
                      <Text className="mt-1 text-xs leading-5" style={{ color: AUTH_COLORS.textSubtle }}>
                        {location?.formattedAddress || 'No saved location found.'}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row flex-wrap gap-2">
                    <View className="px-3 py-2 border rounded-full" style={{ backgroundColor: AUTH_COLORS.chip, borderColor: AUTH_COLORS.chipBorder }}>
                      <Text className="text-xs font-semibold" style={{ color: AUTH_COLORS.textPrimary }}>
                        Lat: {hasLocation ? location!.latitude.toFixed(6) : '--'}
                      </Text>
                    </View>
                    <View className="px-3 py-2 border rounded-full" style={{ backgroundColor: AUTH_COLORS.chip, borderColor: AUTH_COLORS.chipBorder }}>
                      <Text className="text-xs font-semibold" style={{ color: AUTH_COLORS.textPrimary }}>
                        Lng: {hasLocation ? location!.longitude.toFixed(6) : '--'}
                      </Text>
                    </View>
                  </View>
                </View>
                <Text className="mt-1 text-xs" style={{ color: AUTH_COLORS.textSubtle }}>
                  This form uses your saved location automatically.
                </Text>
                {errors.location ? (
                  <Text className="mt-1 text-xs font-medium" style={{ color: '#fda4af' }}>
                    {errors.location}
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
                    {isSubmitting ? 'Saving...' : 'Save Restaurant'}
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

export default AddRestaurantDialogBox;