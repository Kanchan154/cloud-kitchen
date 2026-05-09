const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

const baseConfig = require('./app.json');

const googleClientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || '';
const webClientId = process.env.EXPO_PUBLIC_WEB_CLIENT_ID || '';
const razorpayId = process.env.EXPO_PUBLIC_RAZORPAY_ID || '';
const googleMapsApiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_ID || process.env.GOOGLE_MAPS_API_KEY || '';
const authApiUrl = process.env.EXPO_PUBLIC_AUTH_URL || '';
const restaurantApiUrl = process.env.EXPO_PUBLIC_RESTAURANT_URL || '';

module.exports = {
    ...baseConfig,
    expo: {
        ...baseConfig.expo,
        android: {
            ...baseConfig.expo.android,
            config: {
                ...baseConfig.expo.android?.config,
                googleMaps: {
                    apiKey: googleMapsApiKey,
                },
            },
        },
        extra: {
            ...baseConfig.expo.extra,
            googleClientId,
            webClientId,
            razorpayId,
            googleMapsApiKey,
            authApiUrl,
            restaurantApiUrl,
        },
    },
};