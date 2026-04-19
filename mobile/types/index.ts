import { MaterialCommunityIcons } from "@expo/vector-icons";

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