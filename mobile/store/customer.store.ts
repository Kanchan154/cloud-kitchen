import { RESTAURANT_API_ENDPOINTS } from "@/constants";
import { IRestaurant } from "@/types";
import axios from "axios";
import { create } from "zustand";
import { useAuthStore } from "./auth.store";

interface CUSTOMERSTORE {
    searchRestraunt: string;
    restaurants: IRestaurant[]
    setSearchRestraunt: (searchRestraunt: string) => void;
    fetchRestaurant: () => Promise<void>;
}

export const useCustomerStore = create<CUSTOMERSTORE>((set, get) => ({
    searchRestraunt: "",
    restaurants: [],

    setSearchRestraunt: (searchRestraunt: string) => {
        set({ searchRestraunt });
    },
    // fetch restaurants
    fetchRestaurant: async () => {
        const location = useAuthStore.getState().location;
        const token = useAuthStore.getState().token;
        if (!token) return
        if (!location || !location.latitude || !location.longitude) {
            return;
        }
        try {
            const { data } = await axios.get(RESTAURANT_API_ENDPOINTS.GET_ALL_NEARBY_RESTURANTS, {
                params: {
                    latitude: location.latitude,
                    longitude: location.longitude,
                    search: useAuthStore.getState().city
                },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            set({
                restaurants: data.restaurants ?? []
            })
        } catch (error) {
            console.log(error)
        }
    },
}))
