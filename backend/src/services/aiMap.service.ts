import axios from 'axios';
import { config } from '../config/env';
import { calculateFloweringProbability } from './flowering.service';

export const generateGridPoints = (lat: number, lng: number) => {
    const points: { lat: number; lng: number }[] = [];
    const offsets = [-0.05, -0.03, -0.01, 0, 0.01, 0.03, 0.05];

    offsets.forEach((latOffset) => {
        offsets.forEach((lngOffset) => {
            points.push({
                lat: lat + latOffset,
                lng: lng + lngOffset,
            });
        });
    });

    return points;
};

export const getFloweringForecast = async (lat: number, lng: number) => {
    const apiKey = config.WEATHER_API_KEY;

    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`;
        const response = await axios.get(url);

        const weatherData = {
            temp: response.data.main.temp,
            humidity: response.data.main.humidity,
            month: new Date().getMonth() + 1,
        };

        const floweringProbability = calculateFloweringProbability(
            'Wild Flora',
            weatherData.month,
            weatherData.temp,
            weatherData.humidity
        );

        return {
            lat,
            lng,
            floweringProbability,
        };
    } catch (error) {
        console.error(
            `[MAP] Weather API failed for ${lat}, ${lng}:`, error
        );
        throw new Error('Failed to fetch weather data for flowering forecast');
    }
};
