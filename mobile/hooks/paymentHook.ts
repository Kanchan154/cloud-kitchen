import { RESTAURANT_API_ENDPOINTS } from "@/constants";
import { useAddressStore } from "@/store/address.store";
import { useAuthStore } from "@/store/auth.store"
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { ToastAndroid } from "react-native";

const showToast = (message: unknown, fallback: string) => {
    const text = typeof message === "string" && message.trim().length > 0
        ? message
        : fallback;
    ToastAndroid.show(text, ToastAndroid.SHORT);
};
const usePaymentHandlers = () => {
    const { token } = useAuthStore();
    const [isLoading, setisLoading] = useState(false);
    const { currentAddress } = useAddressStore();

    const createOrder = async (paymentMethod: "razorpay" | "stripe", distance: number) => {
        if (!currentAddress) return;

        setisLoading(true);
        try {
            const response = await axios.post(`${RESTAURANT_API_ENDPOINTS.CREATE_ORDER}`, {
                addressId: currentAddress._id,
                paymentMethod,
                distance
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (response.status === 400) throw new Error(response.data.message);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                console.log(error.response?.data)
                showToast(error.response?.data?.message, "Failed to create order");
            }
            else {
                showToast((error as any)?.message, "Failed to create order");
            }
            return null;
        }
        finally {
            setisLoading(false);
        }
    }

    return { createOrder, isLoading };


}
export default usePaymentHandlers;