import { MaterialCommunityIcons } from "@expo/vector-icons";

// auth types
export type USER = {
    name: string;
    email: string;
    image: string;
    role?: string;
    restaurantId?: string;
}

export type USER_ROLE = "customer" | "seller" | "rider";

export type RoleOption = {
    id: USER_ROLE;
    title: string;
    subtitle: string;
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
};

export type LocationData = {
    latitude: number;
    longitude: number;
    formattedAddress: string;
}

// type for restaurant
export type IRestaurant = {
    _id: string;
    name: string;
    description: string;
    image: string;
    ownerId: string;
    phone: number;
    isVerified: boolean;
    autoLocation: {
        type: "Point",
        coordinates: [number, number];
        formattedAddress: string;
    };
    isOpen: boolean;
    createdAt: Date;
}

export type RestaurantInputType = {
    name: string;
    description: string;
    latitude: number;
    longitude: number;
    formattedAddress: string;
    phone: number;
    file: string
}

export type RestaurantUpdateInputType = {
    name: string;
    description: string;
    latitude: number;
    longitude: number;
    formattedAddress: string;
    phone: number;
}

// menu Items
export type MenuItemInputType = {
    name: string;
    description: string;
    price: number;
    isAvailable: boolean;
    file: string
}

export type MenuItemsType = {
    _id: string;
    name: string;
    description: string;
    price: number;
    isAvailable: boolean;
    image: string;
}

// Cart 
export type CartItemType = {
    userId: string;
    restaurantId: string | IRestaurant;
    itemId: string | MenuItemsType;
    quantity: number;
    createdAt: Date;
    updatedAt: Date;
}

// cart input type
export type CartInputType = {
    restaurantId: string;
    itemId: string;
}
