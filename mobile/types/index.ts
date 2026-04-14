import { MaterialCommunityIcons } from "@expo/vector-icons";

export type USER = {
    name: string;
    email: string;
    image: string;
    role?: string;
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