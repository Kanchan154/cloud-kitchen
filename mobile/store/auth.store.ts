import { LocationData, USER } from "@/types";
import { create } from "zustand"
import axios, { AxiosError } from "axios";
import { BASE_API_URL } from "@/constants";
import { USER_ROLE } from "../types";
import { ToastAndroid } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";

const showToast = (message: unknown, fallback: string) => {
    const text = typeof message === "string" && message.trim().length > 0
        ? message
        : fallback;
    ToastAndroid.show(text, ToastAndroid.SHORT);
};

// interface for the useAuthStore function
interface AUTHSTORE {
    user: USER | null;
    token: string | null;
    isCheckingAuth: boolean;
    isAuthenticated: boolean;
    city: string | null;
    login: (code: string) => Promise<{
        message: string;
        flag: boolean;
        role: string;
    }>;
    location: LocationData | null;
    chooseRole: (role: USER_ROLE) => Promise<{
        flag: boolean;
        message: string;
        role: string;
    }>;
    checkAuth: () => Promise<{
        flag: boolean;
        role: string;
    }>;
    getLocation: () => Promise<void>;
    logout: () => Promise<void>;
}

// useAuthStore Function using Zustand for global state management
export const useAuthStore = create<AUTHSTORE>((set, get) => ({
    user: null,
    token: null,
    isCheckingAuth: true,
    isAuthenticated: false,
    location: null,
    city: null,
    // login controller
    login: async (code) => {
        try {
            const res = await axios.post(`${BASE_API_URL}/auth/login`, { code });
            if (res.status === 400) {
                throw new Error(res.data.message);
            }
            set({
                user: res.data.user,
                token: res.data.token,
                isAuthenticated: true
            })
            await AsyncStorage.setItem("token", res.data.token);
            showToast(res.data?.message, "Logged in successfully");
            return {
                message: res.data.message,
                flag: true,
                role: res.data.user.role
            }
        } catch (error: any) {
            if (error instanceof AxiosError) {
                showToast(error.response?.data?.message, "Login failed");
                return {
                    message: error.response?.data?.message || "Login failed",
                    flag: false,
                    role: ""
                }
            }
            else {
                showToast(null, "Login Failed");
                return {
                    message: "Login Failed",
                    flag: false,
                    role: ""
                }
            }
        }
    },
    // choose Role controller
    chooseRole: async (role) => {
        try {
            const res = await axios.put(`${BASE_API_URL}/auth/add-role`, { role },
                {
                    headers: {
                        Authorization: `Bearer ${get().token}`
                    }
                }
            );
            if (res.status === 400) {
                throw new Error(res.data.message);
            }
            set({
                user: res.data.user,
                token: res.data.token
            })
            await AsyncStorage.setItem("token", res.data.token);
            showToast(res.data?.message, "Role updated");
            return {
                flag: true,
                message: res.data.message,
                role
            }

        } catch (error: any) {
            if (error instanceof AxiosError) {
                showToast(error.response?.data?.message, "User role update failed");
                return {
                    flag: false,
                    message: error.response?.data?.message || "User role update failed",
                    role: ""
                }
            }
            else {
                showToast(null, "User role update failed");
                return {
                    flag: false,
                    message: "User role update failed",
                    role: ""
                }
            }
        }

    },
    // check auth controller
    checkAuth: async () => {
        const token = await AsyncStorage.getItem("token");
        try {
            if (!token) {
                return {
                    flag: false,
                    role: ""
                }
            }
            const res = await axios.get(`${BASE_API_URL}/auth/check-auth`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (res.status === 400) {
                throw new Error(res.data.message);
            }
            set({
                user: res.data.user,
                token,
                isAuthenticated: true
            })
            return {
                flag: true,
                role: ""
            }
        } catch (error) {
            return {
                flag: false,
                role: ""
            }
        }
        finally {
            set({
                isCheckingAuth: false
            })
        }
    },
    // get location controller
    getLocation: async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== "granted") {
                showToast("Location permission denied", "Location permission denied");
                return;
            }

            const position = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = position.coords;

            let formattedAddress = "";
            let city = "";

            try {
                const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
                if (geocode && geocode.length > 0) {
                    const place = geocode[0];
                    const parts = [
                        place.name,
                        place.street,
                        place.city,
                        place.region,
                        place.postalCode,
                        place.country
                    ].filter(Boolean);
                    formattedAddress = parts.join(", ");
                    city=place.city || place.district || "Your City"
                }
            } catch {
                formattedAddress = "";
                city=""
            }

            set({
                location: {
                    latitude,
                    longitude,
                    formattedAddress,
                } as LocationData,
                city: city
            });

            showToast("Location fetched successfully", "Location fetched successfully");
        } catch (error) {
            showToast("Failed to fetch location", "Failed to fetch location");
        }
    },
    // logout controller
    logout: async () => {
        await AsyncStorage.removeItem("token");
        set({
            user: null,
            token: null,
            isAuthenticated: false
        })
        showToast(null, "Logout Successfully");
    }
}))
