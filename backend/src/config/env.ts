import dotenv from 'dotenv';

dotenv.config();

interface EnvConfig {
    NODE_ENV: string;
    PORT: number;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    OTP_EXPIRY_MINUTES: number;
    MSG91_AUTH_TOKEN: string;
    MSG91_TEMPLATE_ID: string;
    DATABASE_URL: string;
    WEATHER_API_KEY: string;
}

const getEnvVar = (key: string, defaultValue?: string): string => {
    const value = process.env[key] || defaultValue;
    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
};

export const config: EnvConfig = {
    NODE_ENV: getEnvVar('NODE_ENV', 'development'),
    PORT: parseInt(getEnvVar('PORT', '5000'), 10),
    JWT_SECRET: getEnvVar('JWT_SECRET'),
    JWT_EXPIRES_IN: getEnvVar('JWT_EXPIRES_IN', '30d'),
    OTP_EXPIRY_MINUTES: parseInt(getEnvVar('OTP_EXPIRY_MINUTES', '10'), 10),
    MSG91_AUTH_TOKEN: getEnvVar('MSG91_AUTH_TOKEN'),
    MSG91_TEMPLATE_ID: getEnvVar('MSG91_TEMPLATE_ID'),
    DATABASE_URL: getEnvVar('DATABASE_URL'),
    WEATHER_API_KEY: getEnvVar('WEATHER_API_KEY'),
};
