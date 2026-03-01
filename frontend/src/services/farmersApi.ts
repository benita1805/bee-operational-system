import { apiClient } from "./apiClient";

export interface FarmerData {
    id?: string;
    name: string;
    crops: string[];
    location: string;
    latitude: number;
    longitude: number;
    [key: string]: any;
}

export const addFarmer = async (farmerData: FarmerData) => {
    try {
        if (!farmerData.name) throw new Error("Farmer name is required");

        const res = await apiClient.post("/farmers", farmerData);

        return res.data.data;
    } catch (error) {
        console.error("Error adding farmer:", error);
        throw error;
    }
};

export const fetchFarmers = async () => {
    try {
        const res = await apiClient.get("/farmers");
        return res.data.data || [];
    } catch (error) {
        console.error("Error fetching farmers:", error);
        return [];
    }
};
