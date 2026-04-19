import { RESTAURANT_API_ENDPOINTS } from "@/constants";
import { IRestaurant, MenuItemInputType, MenuItemsType, RestaurantInputType, RestaurantUpdateInputType } from "@/types";
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
    // variables
    myRestaurant: IRestaurant | null;
    isFetching: boolean
    menuItemList: MenuItemsType[]

    // functions
    getMyRestaurant: () => Promise<void>;
    addRestaurant: (input: RestaurantInputType) => Promise<boolean>;
    updateRestaurantStatus: () => Promise<void>;
    updateRestaurant: (input: RestaurantUpdateInputType) => Promise<boolean>;
    addMenuItem: (input: MenuItemInputType) => Promise<boolean>;
    updateAvailability: (id: string) => Promise<void>;
    deleteMenuItem: (id: string) => Promise<void>;
    getAllMenuItems: () => Promise<void>;
}

export const useSellerStore = create<UseSellerStoreInterface>((set, get) => ({
    myRestaurant: null,
    isFetching: true,
    menuItemList: [],
    // get my restaurant controller
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
    // add my restaurant controller
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
            const res = await axios.post(RESTAURANT_API_ENDPOINTS.ADD_RESTAURANT, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
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

        } catch (error: any) {
            if (error instanceof AxiosError) {
                showToast(error.response?.data?.message, "Failed to create restaurant");
            } else {
                showToast((error as any)?.message, "Failed to create restaurant");
            }
        }
        return false;
    },
    // update my restaurant controller
    updateRestaurantStatus: async () => {
        try {
            const token = useAuthStore.getState().token;

            if (!token) {
                throw new Error("Missing authentication token");
            }
            const status = get().myRestaurant?.isOpen;
            const response = await axios.put(`${RESTAURANT_API_ENDPOINTS.UPDATE_RESTAURANT_STATUS}`,
                { status: !status },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            if (response.status === 400) throw new Error(response.data.message);
            set({
                myRestaurant: response.data.restaurant,
            })
            showToast(response.data?.message, "Status updated successfully");

        } catch (error: any) {
            if (error instanceof AxiosError) {
                showToast(error.response?.data?.message, "Failed to update status");
            } else {
                showToast((error as any)?.message, "Failed to update status");
            }
        }
    },
    // update restaurant Status
    updateRestaurant: async (input: RestaurantUpdateInputType) => {
        try {
            const token = useAuthStore.getState().token;

            if (!token) {
                throw new Error("Missing authentication token");
            }
            const response = await axios.put(`${RESTAURANT_API_ENDPOINTS.UPDATE_RESTAURANT}`,
                input,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            if (response.status === 400) {
                throw new Error(response.data.message);
            }
            set({
                myRestaurant: response.data.restaurant
            })
            showToast(response.data?.message, "Restaurant updated successfully");
            return true
        } catch (error) {
            if (error instanceof AxiosError) {
                showToast(error.response?.data?.message, "Failed to create restaurant");
            } else {
                showToast((error as any)?.message, "Failed to create restaurant");
            }
        }
        return false
    },

    // menu items controller

    // get all menuItems
    getAllMenuItems: async () => {
        try {
            set({ isFetching: true });
            const token = useAuthStore.getState().token;
            const restaurantId = get().myRestaurant?._id || useAuthStore.getState().user?.restaurantId;

            if (!token) {
                throw new Error("Missing authentication token");
            }

            if (!restaurantId) {
                throw new Error("Restaurant not found");
            }

            const response = await axios.get(`${RESTAURANT_API_ENDPOINTS.GET_ALL_MENU_ITEMS}/${restaurantId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            set({ menuItemList: response.data?.items || [] });
        } catch (error) {
            if (error instanceof AxiosError) {
                console.log(error.response?.data)
                showToast(error.response?.data?.message, "Failed to fetch menu items");
            } else {
                showToast((error as any)?.message, "Failed to fetch menu items");
            }
        } finally {
            set({ isFetching: false });
        }
    },
    // add menu item
    addMenuItem: async (input: MenuItemInputType) => {
        try {
            const token = useAuthStore.getState().token;

            if (!token) {
                throw new Error("Missing authentication token");
            }
            const fileName = input.file.split('/').pop() || `menu-item-${Date.now()}.jpg`;
            const fileExtension = fileName.split('.').pop()?.toLowerCase() || 'jpg';
            const mimeType = fileExtension === 'png' ? 'image/png' : 'image/jpeg';

            const formData = new FormData();
            formData.append('name', input.name);
            formData.append('description', input.description);
            formData.append('price', String(input.price));
            formData.append('isAvailable', String(input.isAvailable));
            formData.append('file', {
                uri: input.file,
                name: fileName,
                type: mimeType,
            } as any);
            const response = await axios.post(`${RESTAURANT_API_ENDPOINTS.ADD_MENU_ITEM}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.status === 201) {
                const nextItem = response.data?.menuItem as MenuItemsType | undefined;
                if (nextItem) {
                    set((state) => ({
                        menuItemList: [nextItem, ...state.menuItemList],
                    }));
                }
                showToast(response.data?.message, "Menu item added successfully");
                return true
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                showToast(error.response?.data?.message, "Failed to add menu item");
            } else {
                showToast((error as any)?.message, "Failed to add menu item");
            }
        }
        return false;
    },

    // update availability
    updateAvailability: async (id) => {
        try {
            const token = useAuthStore.getState().token;

            if (!token) {
                throw new Error("Missing authentication token");
            }

            const response = await axios.get(`${RESTAURANT_API_ENDPOINTS.TOGGLE_MENU_ITEM_AVAILABILITY}/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const updatedItem = response.data?.item as MenuItemsType | undefined;
            if (updatedItem) {
                set((state) => ({
                    menuItemList: state.menuItemList.map((menuItem) =>
                        menuItem._id === id ? updatedItem : menuItem,
                    ),
                }));
            }

            showToast(response.data?.message, "Availability updated");
        } catch (error) {
            if (error instanceof AxiosError) {
                showToast(error.response?.data?.message, "Failed to update availability");
            } else {
                showToast((error as any)?.message, "Failed to update availability");
            }
        }
    },
    // delete menu item
    deleteMenuItem: async (id) => {
        try {
            const token = useAuthStore.getState().token;

            if (!token) {
                throw new Error("Missing authentication token");
            }

            const response = await axios.delete(`${RESTAURANT_API_ENDPOINTS.DELETE_MENU_ITEM}/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            set((state) => ({
                menuItemList: state.menuItemList.filter((menuItem) => menuItem._id !== id),
            }));

            showToast(response.data?.message, "Item deleted successfully");
        } catch (error) {
            if (error instanceof AxiosError) {
                showToast(error.response?.data?.message, "Failed to delete menu item");
            } else {
                showToast((error as any)?.message, "Failed to delete menu item");
            }
        }
    },
}));