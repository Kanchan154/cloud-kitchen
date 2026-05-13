import { RoleOption } from "@/types";
import Constants from "expo-constants";

// colors
export const AUTH_COLORS = {
    background: "#07111f",
    primary: "#facc15",
    accent: "#38bdf8",
    textPrimary: "#ffffff",
    textMuted: "rgba(255,255,255,0.7)",
    textSubtle: "rgba(255,255,255,0.5)",
    card: "rgba(255,255,255,0.1)",
    cardBorder: "rgba(255,255,255,0.1)",
    chip: "rgba(255,255,255,0.05)",
    chipBorder: "rgba(255,255,255,0.1)",
    errorBg: "rgba(239,68,68,0.12)",
    errorBorder: "rgba(248,113,113,0.25)",
    errorText: "#fee2e2",
} as const;

// role options
export const ROLE_OPTIONS: RoleOption[] = [
    {
        id: "customer",
        title: "Customer",
        subtitle: "Order food and track deliveries in real time.",
        icon: "silverware-fork-knife",
    },
    {
        id: "seller",
        title: "Seller",
        subtitle: "Manage menu, orders, and restaurant operations.",
        icon: "storefront-outline",
    },
    {
        id: "rider",
        title: "Rider",
        subtitle: "Accept requests and deliver faster with route support.",
        icon: "bike-fast",
    },
];

const expoExtra = (Constants.expoConfig?.extra ?? {}) as {
    authApiUrl?: string;
    restaurantApiUrl?: string;
    utilsApiUrl?: string;
};

const DEFAULT_AUTH_API_URL = "https://lrcv0tlh-3000.inc1.devtunnels.ms/api";
const DEFAULT_RESTAURANT_API_URL = "https://lrcv0tlh-3001.inc1.devtunnels.ms/api/restaurant";
const DEFAULT_UTILS_API_URL = 'https://lrcv0tlh-3002.inc1.devtunnels.ms/api';

export const BASE_API_URL = expoExtra.authApiUrl ? `${expoExtra.authApiUrl}/api` : DEFAULT_AUTH_API_URL;
export const BASE_API_RESTAURANT_URL = expoExtra.restaurantApiUrl
    ? `${expoExtra.restaurantApiUrl}/api/restaurant`
    : DEFAULT_RESTAURANT_API_URL;
export const BASE_API_UTILS_URL = expoExtra.utilsApiUrl ? `${expoExtra.utilsApiUrl}/api` : DEFAULT_UTILS_API_URL;

// backend auth api keys
export const AUTH_API_ENDPOINTS = {
    LOGIN: `${BASE_API_URL}/auth/login`,
    ADD_ROLE: `${BASE_API_URL}/auth/add-role`,
    CHECK_AUTH: `${BASE_API_URL}/auth/check-auth`
}

// backend restaurant api kets
export const RESTAURANT_API_ENDPOINTS = {
    ADD_RESTAURANT: `${BASE_API_RESTAURANT_URL}/add-restaurant`,
    FETCH_MY_RESTAURANT: `${BASE_API_RESTAURANT_URL}/get-my-restaurant`,
    UPDATE_RESTAURANT_STATUS: `${BASE_API_RESTAURANT_URL}/update-status`,
    UPDATE_RESTAURANT: `${BASE_API_RESTAURANT_URL}/update-restaurant`,

    ADD_MENU_ITEM: `${BASE_API_RESTAURANT_URL}/menu-item/add-new`,
    TOGGLE_MENU_ITEM_AVAILABILITY: `${BASE_API_RESTAURANT_URL}/menu-item/toggle-availability`,
    DELETE_MENU_ITEM: `${BASE_API_RESTAURANT_URL}/menu-item/delete`,
    GET_ALL_MENU_ITEMS: `${BASE_API_RESTAURANT_URL}/menu-item/get-all`,

    // get all nearby restaurants
    GET_ALL_NEARBY_RESTURANTS: `${BASE_API_RESTAURANT_URL}/get-all`,

    // cart apis
    ADD_TO_CART: `${BASE_API_RESTAURANT_URL}/cart/add-to-cart`,
    GET_CART_ITEMS: `${BASE_API_RESTAURANT_URL}/cart/get-cart-items`,
    CLEAR_CART: `${BASE_API_RESTAURANT_URL}/cart/clear-cart`,
    UPDATE_CART: `${BASE_API_RESTAURANT_URL}/cart/update-cart`,
    INCREMENT_ITEM: `${BASE_API_RESTAURANT_URL}/cart/increase-quantity`,
    DECREMENT_ITEM: `${BASE_API_RESTAURANT_URL}/cart/decrease-quantity`,

    // address apis
    ADD_ADDRESS: `${BASE_API_RESTAURANT_URL}/address/add-address`,
    GET_ALL_ADDRESSES: `${BASE_API_RESTAURANT_URL}/address/get-all`,
    DELETE_ADDRESS: `${BASE_API_RESTAURANT_URL}/address/delete-address`,

    // order apis
    CREATE_ORDER: `${BASE_API_RESTAURANT_URL}/order/new`,
}

export const UTILS_ENDPOINTS = {
    CREATE_PAYMENT: `${BASE_API_UTILS_URL}/payment/create`,
    VERIFY_PAYMENT: `${BASE_API_UTILS_URL}/payment/verify`,
}