import { LocationData } from "@/types";

interface CUSTOMERSTORE {
    searchRestraunt: string;
    setSearchRestraunt: () => Promise<void>;
    city: string;
    setCity: () => void;
    location: LocationData | null;
    setLocation: () => void;
}