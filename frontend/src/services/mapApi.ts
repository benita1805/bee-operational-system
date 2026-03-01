import { apiClient } from './apiClient';

export const fetchFloweringForecast = async (lat: number, lng: number) => {
    try {
        const res = await apiClient(`/map/flowering-forecast?lat=${lat}&lng=${lng}`);
        return res?.data || res || {};
    } catch (error) {
        console.error("Error fetching flowering forecast:", error);
        return {};
    }
};
