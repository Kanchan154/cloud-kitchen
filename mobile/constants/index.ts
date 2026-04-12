import { RoleOption } from "@/types";

export const AUTH_COLORS = {
    background: "#07111f",
    primary: "#facc15",
    accent: "#38bdf8",
    textPrimary: "#ffffff",
    textMuted: "rgba(255,255,255,0.7)",
    textSubtle: "rgba(255,255,255,0.5)",
    card: "rgba(255,255,255,0.1)",
    cardBorder: "rgba(255,255,255,0.1)",
    chip: "rgba(255,255,255,0.05)",
    chipBorder: "rgba(255,255,255,0.1)",
    errorBg: "rgba(239,68,68,0.12)",
    errorBorder: "rgba(248,113,113,0.25)",
    errorText: "#fee2e2",
} as const;

export const ROLE_OPTIONS: RoleOption[] = [
    {
        id: "customer",
        title: "Customer",
        subtitle: "Order food and track deliveries in real time.",
        icon: "silverware-fork-knife",
    },
    {
        id: "seller",
        title: "Seller",
        subtitle: "Manage menu, orders, and restaurant operations.",
        icon: "storefront-outline",
    },
    {
        id: "rider",
        title: "Rider",
        subtitle: "Accept requests and deliver faster with route support.",
        icon: "bike-fast",
    },
];

export const BASE_API_URL = "https://lrcv0tlh-3000.inc1.devtunnels.ms/api";

export const AUTH_API_ENDPOINTS = {
    LOGIN: `${BASE_API_URL}/auth/login`,
    ADD_ROLE: `${BASE_API_URL}/auth/add-role`,
    CHECK_AUTH: `${BASE_API_URL}/auth/check-auth`
}