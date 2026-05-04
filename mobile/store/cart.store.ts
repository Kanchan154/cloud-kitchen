import { CartInputType, CartItemType } from "@/types";
import { create } from "zustand";

interface CARTSTORE {
    cartList: CartItemType[],
    addToCart: (input: CartInputType) => Promise<void>;
}
export const useCartStore = create<CARTSTORE>((set, get) => ({
    cartList: [],
    addToCart: async (input: CartInputType) => { }
}));