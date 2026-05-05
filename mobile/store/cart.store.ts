import { CartInputType, CartItemType } from "@/types";
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

interface CARTSTORE {
    cartList: CartItemType[],
    subTotal: number
    cartLenght: number
    addToCart: (input: CartInputType) => Promise<void>;
    fetchCart: () => Promise<void>;
}
export const useCartStore = create<CARTSTORE>((set, get) => ({
    cartList: [],
    subTotal: 0,
    cartLenght: 0,
    // add to cart functionality 
    addToCart: async (input: CartInputType) => {
        try {
            const { token, user } = useAuthStore.getState();
            if (!user || !token) return;
            await axios.post(RESTAURANT_API_ENDPOINTS.ADD_TO_CART, input, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then((res) => {
                showToast(res.data.message, "Item added to cart");
                get().fetchCart();
            }).catch((error: any) => { throw new Error(error.response.data.message) })
        } catch (error) {
            if (error instanceof AxiosError) {
                showToast(error.response?.data?.message, "Failed to add to cart");
            }
            else showToast(error, "Failed to add to cart");
        }
    },

    // fetch card functionality
    fetchCart: async () => {
        try {
            const { token, user } = useAuthStore.getState();
            if (!user || !token) return;
            const { data } = await axios.get(RESTAURANT_API_ENDPOINTS.GET_CART_ITEMS, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            set({
                cartList: data.cart,
                subTotal: Number(data.subTotal ?? 0),
                cartLenght: Number(data.cartLength ?? 0)
            })
        } catch (error) {
            console.log(error);
        }
    },
    
    // clear cart functionlity
}));