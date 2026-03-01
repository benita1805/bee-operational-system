export interface FloweringEntry {
    crop: string;
    floweringMonths: number[];
    baseScore: number;
}

export const floweringCalendar: FloweringEntry[] = [
    {
        crop: 'Lavender',
        floweringMonths: [6, 7, 8],
        baseScore: 85
    },
    {
        crop: 'Sunflower',
        floweringMonths: [7, 8, 9],
        baseScore: 80
    },
    {
        crop: 'Almonds',
        floweringMonths: [2, 3],
        baseScore: 90
    },
    {
        crop: 'Cherries',
        floweringMonths: [4, 5],
        baseScore: 85
    },
    {
        crop: 'Wild Flora',
        floweringMonths: [3, 4, 5, 6, 7, 8, 9, 10],
        baseScore: 70
    }
];
