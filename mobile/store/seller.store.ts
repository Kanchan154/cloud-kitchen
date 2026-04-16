import { RESTAURANT_API_ENDPOINTS } from "@/constants";
import { IRestaurant, RestaurantInputType } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosError } from "axios";
import { ToastAndroid } from "react-native";
import { create } from "zustand";
import { useAuthStore } from "./auth.store";

const showToast = (message: unknown, fallback: string) => {
    const text = typeof message === "string" && message.trim().length > 0
        ? message
        : fallback;
    ToastAndroid.show(text, ToastAndroid.SHORT);
};

interface UseSellerStoreInterface {
    myRestaurant: IRestaurant | null;
    getMyRestaurant: () => Promise<void>;
    addRestaurant: (input: RestaurantInputType) => Promise<boolean>;
    isFetching: boolean
}

export const useSellerStore = create<UseSellerStoreInterface>((set, get) => ({
    myRestaurant: null,
    isFetching: true,
    getMyRestaurant: async () => {
        try {
            set({ isFetching: true })
            const token = useAuthStore.getState().token;

            if (!token) {
                throw new Error("Missing authentication token");
            }

            const res = await axios.get(`${RESTAURANT_API_ENDPOINTS.FETCH_MY_RESTAURANT}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (res.status === 400) {
                throw new Error(res.data.message);
            }
            set({ myRestaurant: res.data.restaurant });
            if (res.data.token) {
                await AsyncStorage.setItem("token", res.data.token);
                useAuthStore.setState({
                    token: res.data.token
                })
            }
        } catch (error: any) {
            if (error instanceof AxiosError) {
                showToast(error.response?.data?.message, "Failed to load restaurant");
            } else {
                showToast(error?.message, "Failed to load restaurant");
            }
        }
        finally {
            set({ isFetching: false })
        }
    },
    addRestaurant: async (input: RestaurantInputType) => {
        try {
            const token = useAuthStore.getState().token;

            if (!token) {
                throw new Error("Missing authentication token");
            }

            const fileName = input.file.split("/").pop() || `restaurant-${Date.now()}.jpg`;
            const fileExtension = fileName.split(".").pop()?.toLowerCase() || "jpg";
            const mimeType = fileExtension === "png" ? "image/png" : "image/jpeg";

            const formData = new FormData();
            formData.append("name", input.name);
            formData.append("description", input.description);
            formData.append("latitude", String(input.latitude));
            formData.append("longitude", String(input.longitude));
            formData.append("formattedAddress", input.formattedAddress);
            formData.append("phone", String(input.phone));
            formData.append("file", {
                uri: input.file,
                name: fileName,
                type: mimeType,
            } as any);
            
            console.log(formData)
            const res = await axios.post(RESTAURANT_API_ENDPOINTS.ADD_RESTAURANT, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.status === 201) {
                set({ myRestaurant: res.data.restaurant });

                if (res.data.token) {
                    await AsyncStorage.setItem("token", res.data.token);
                    useAuthStore.setState({
                        token: res.data.token,
                    });
                }

                showToast(res.data?.message, "Restaurant created successfully");
                return true;
            }

            throw new Error(res.data?.message || "Failed to create restaurant");

        } catch (error) {
            if (error instanceof AxiosError) {
                showToast(error.response?.data?.message, "Failed to create restaurant");
            } else {
                showToast((error as any)?.message, "Failed to create restaurant");
            }

        }
        return false;
    }
}));