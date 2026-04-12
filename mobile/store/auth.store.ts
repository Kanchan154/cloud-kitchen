import { USER } from "@/types";
import { create } from "zustand"
import axios, { AxiosError } from "axios";
import { BASE_API_URL } from "@/constants";
import { USER_ROLE } from "../types";
import { ToastAndroid } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AUTHSTORE {
    user: USER | null;
    token: string | null;
    isCheckingAuth: boolean;
    isAuthenticated: boolean;
    login: (code: string) => Promise<{
        message: string;
        flag: boolean;
        role: string;
    }>;
    chooseRole: (role: USER_ROLE) => Promise<{
        flag: boolean;
        message: string;
        role: string;
    }>;
    checkAuth: () => Promise<{
        flag: boolean;
        role: string;
    }>;
}

export const useAuthStore = create<AUTHSTORE>((set, get) => ({
    user: null,
    token: null,
    isCheckingAuth: true,
    isAuthenticated: false,
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
            ToastAndroid.show(res.data.message, ToastAndroid.SHORT);
            return {
                message: res.data.message,
                flag: true,
                role: res.data.user.role
            }
        } catch (error: any) {
            if (error instanceof AxiosError) {
                ToastAndroid.show(error.response?.data.message, ToastAndroid.SHORT);
                return {
                    message: error.response?.data.message,
                    flag: false,
                    role: ""
                }
            }
            else {
                ToastAndroid.show("Login Failed", ToastAndroid.SHORT);
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
            ToastAndroid.show(res.data.message, ToastAndroid.SHORT);
            return {
                flag: true,
                message: res.data.message,
                role
            }

        } catch (error: any) {
            if (error instanceof AxiosError) {
                ToastAndroid.show(error.response?.data.message, ToastAndroid.SHORT);
                return {
                    flag: false,
                    message: error.response?.data.message,
                    role: ""
                }
            }
            else {
                ToastAndroid.show("User role update failed", ToastAndroid.SHORT);
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

    }
}))