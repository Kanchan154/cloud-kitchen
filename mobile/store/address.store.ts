import { AddressInputType, AddressType } from "@/types";
import { create } from "zustand";
import { useAuthStore } from "./auth.store";
import axios, { AxiosError } from "axios";
import { RESTAURANT_API_ENDPOINTS } from "@/constants";
import { ToastAndroid } from "react-native";

const showToast = (message: unknown, fallback: string) => {
    const text = typeof message === "string" && message.trim().length > 0
        ? message
        : fallback;
    ToastAndroid.show(text, ToastAndroid.SHORT);
};

interface AddressStore {
    addressList: AddressType[]
    currentAddress: AddressType | null
    addAddress: (address: AddressInputType) => Promise<void>
    fetchAllAddresses: () => Promise<void>
    setCurrentAddress: (address: AddressType) => void
    deleteAddress: (id: string) => Promise<void>
}

export const useAddressStore = create<AddressStore>((set, get) => ({
    addressList: [],
    currentAddress: null,
    setCurrentAddress: (address) => set({ currentAddress: address }),
    fetchAllAddresses: async () => {
        try {
            const token = useAuthStore.getState().token;
            if (!token) return
            const { data } = await axios.get(RESTAURANT_API_ENDPOINTS.GET_ALL_ADDRESSES, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            set({ addressList: data.addresses })
        } catch (error) {

        }
    },
    addAddress: async (address) => {
        try {
            const token = useAuthStore.getState().token;
            if (!token) return
            if (!address) return
            await axios.post(RESTAURANT_API_ENDPOINTS.ADD_ADDRESS, address, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then((res) => {
                get().fetchAllAddresses();
            }).catch((error: any) => {
                throw new Error(error.response.data.message)
            })
        } catch (error) {
            if (error instanceof AxiosError) showToast(error.response?.data?.message, "Failed to add address");
            else showToast(error, "Failed to add address");
        }

    },
    deleteAddress: async (id) => {
        try {
            const token = useAuthStore.getState().token;
            if (!token) return;

            if (!id) return ToastAndroid.show("Address id is required", ToastAndroid.SHORT);
            const response = await axios.delete(`${RESTAURANT_API_ENDPOINTS.DELETE_ADDRESS}/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            get().fetchAllAddresses();
            showToast(response.data?.message, "Address deleted successfully");
        } catch (error) {
            if (error instanceof AxiosError) {
                showToast(error.response?.data?.message, "Failed to delete address");
            } else {
                showToast((error as any)?.message, "Failed to delete address");
            }
        }
    },
}))