import { apiClient } from './apiClient';

export const requestOtp = async (phone_number: string) => {
    return apiClient('/auth/request-otp', {
        method: 'POST',
        body: JSON.stringify({ phone_number }),
    });
};

export const verifyOtp = async (phone_number: string, otp: string) => {
    return apiClient('/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ phone_number, otp }),
    });
};
