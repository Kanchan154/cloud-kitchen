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

            const buildAddress = (parts: Array<string | null | undefined>) =>
                parts.filter((part): part is string => typeof part === "string" && part.trim().length > 0).join(", ");

            try {
                const reverse = await Location.reverseGeocodeAsync({ latitude, longitude });
                const first = reverse?.[0];

                if (first) {
                    const parts = [
                        first.name,
                        first.street,
                        first.district,
                        first.city || first.subregion,
                        first.region,
                        first.postalCode,
                        first.country
                    ].filter(Boolean);

                    formattedAddress = parts.join(", ");
                    city = first.city || first.subregion || first.region || "Your City";
                }
            } catch (expoGeocodeError) {
                console.log("Expo reverse geocode failed: ", expoGeocodeError);
            }

            // Fallback to Nominatim only if native reverse geocoder fails.
            if (!formattedAddress) {
                try {
                    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&addressdetails=1&accept-language=en&email=cloudkitchen.app@gmail.com`;
                    const res = await fetch(url, {
                        headers: {
                            Accept: "application/json",
                            "Accept-Language": "en",
                            "User-Agent": "cloud-kitchen-mobile/1.0 (cloudkitchen.app@gmail.com)"
                        }
                    });

                    const raw = await res.text();
                    if (!res.ok) {
                        throw new Error(`Reverse geocoding failed (${res.status})`);
                    }

                    let data: any;
                    try {
                        data = JSON.parse(raw);
                    } catch {
                        throw new Error(`Invalid JSON from geocoding service: ${raw.slice(0, 120)}`);
                    }

                    const address = data?.address || {};
                    formattedAddress = data.display_name || "current location";
                    city = address.city || address.village || address.town || "Your City";
                } catch (error) {
                    console.log("Nominatim reverse geocode failed: ", error);
                }
            }

            // Secondary fallback for devices where Nominatim is blocked (403).
            if (!formattedAddress) {
                try {
                    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
                    const res = await fetch(url, {
                        headers: {
                            Accept: "application/json"
                        }
                    });

                    const raw = await res.text();
                    if (!res.ok) {
                        throw new Error(`BigDataCloud reverse geocoding failed (${res.status})`);
                    }

                    let data: any;
                    try {
                        data = JSON.parse(raw);
                    } catch {
                        throw new Error(`Invalid JSON from BigDataCloud: ${raw.slice(0, 120)}`);
                    }

                    formattedAddress = buildAddress([
                        data.locality,
                        data.city,
                        data.principalSubdivision,
                        data.countryName
                    ]) || "current location";

                    city = data.city || data.locality || data.principalSubdivision || "Your City";
                } catch (error) {
                    console.log("BigDataCloud reverse geocode failed:", error);
                    formattedAddress = "current location";
                    city = "Your City";
                }
            }

            set({
                location: {
                    latitude,
                    longitude,
                    formattedAddress,
                } as LocationData,
                city: city
            });
            console.log(get().location)

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
