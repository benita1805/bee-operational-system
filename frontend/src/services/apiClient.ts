import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';

export const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(async (config) => {
    try {
        const token = await SecureStore.getItemAsync('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    } catch (error) {
        console.error('[DEBUG] Failed to get token from SecureStore', error);
    }
    return config;
});

// For backward compatibility while refactoring other files
export const apiFetch = async (endpoint: string, options: any = {}) => {
    const method = options.method?.toLowerCase() || 'get';
    try {
        const response = await (apiClient as any)[method](endpoint, options.body ? JSON.parse(options.body) : undefined, {
            headers: options.headers,
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message);
    }
};

export default apiClient;
