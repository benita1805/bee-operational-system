import { floweringCalendar } from '../data/floweringCalendar';

export const getSeasonalScore = (crop: string, month: number): number => {
    const entry = floweringCalendar.find(
        (c) => c.crop.toLowerCase() === crop.toLowerCase()
    );

    if (!entry) return 20;

    if (entry.floweringMonths.includes(month)) {
        return entry.baseScore;
    }

    return entry.baseScore * 0.3;
};

export const calculateWeatherScore = (temp: number, humidity: number): number => {
    let score = 0;

    if (temp >= 20 && temp <= 32) score += 40;
    if (humidity >= 50) score += 30;

    return score;
};

export const calculateFloweringProbability = (
    crop: string,
    month: number,
    temp: number,
    humidity: number
): number => {
    const seasonal = getSeasonalScore(crop, month);
    const weather = calculateWeatherScore(temp, humidity);

    const finalScore = seasonal * 0.6 + weather * 0.4;

    return Math.max(0, Math.min(100, Math.round(finalScore)));
};
