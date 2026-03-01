import { apiClient } from './apiClient';

export interface HiveData {
    title: string;
    farmer_name: string;
    field_location: string;
    notes?: string;
    status: string;
    placement_date: string;
    expected_harvest_date: string;
}

export const fetchHives = async () => {
    const res = await apiClient.get('/hives');
    return res.data.data || [];
};

export const addHive = async (hiveData: HiveData) => {
    const res = await apiClient.post('/hives', hiveData);
    return res.data.data;
};

export const updateHive = async (hiveId: string, hiveData: Partial<HiveData>) => {
    const res = await apiClient.patch(`/hives/${hiveId}`, hiveData);
    return res.data.data;
};
