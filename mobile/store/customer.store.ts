import { create } from "zustand";
import { useAuthStore } from "./auth.store";
import { Alert } from "react-native";
import axios from "axios";
import { RESTAURANT_API_ENDPOINTS } from "@/constants";
import { IRestaurant } from "@/types";

interface CUSTOMERSTORE {
    searchRestraunt: string;
    restaurants: IRestaurant[]
    setSearchRestraunt: () => Promise<void>;
    city: string;
    setCity: () => void;
    fetchRestaurant: () => Promise<void>;
}

export const useCustomerStore = create<CUSTOMERSTORE>((set, get) => ({
    city: "",
    searchRestraunt: "",
    restaurants: [],

    setCity: () => {

    },
    setSearchRestraunt: async () => {

    },
    // fetch restaurants
    fetchRestaurant: async () => {
        const location = useAuthStore.getState().location;
        const token = useAuthStore.getState().token;
        if (!token) return
        if (!location || !location.latitude || !location.longitude) {
            Alert.alert("You need to give permission of you location to continue");
            return
        }
        try {
            const { data } = await axios.get(RESTAURANT_API_ENDPOINTS.GET_ALL_NEARBY_RESTURANTS, {
                params: {
                    latitude: location.latitude,
                    longitude: location.longitude,
                    search: get().city
                },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            set({
                restaurants: data.restaurants ?? []
            })
        } catch (error) {

        }

    }
}))