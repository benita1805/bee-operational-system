import React, { useEffect, useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { fetchFloweringForecast } from '../services/mapApi';

export default function MapScreen() {
    const [forecastPoints, setForecastPoints] = useState<any[]>([]);

    useEffect(() => {
        const loadForecastGrid = async () => {
            try {
                const baseLat = 13.0827;
                const baseLng = 80.2707;

                const offsets = [
                    [0, 0],
                    [0.01, 0],
                    [-0.01, 0],
                    [0, 0.01],
                    [0, -0.01],
                ];

                const results = await Promise.all(
                    offsets.map(([latOffset, lngOffset]) =>
                        fetchFloweringForecast(baseLat + latOffset, baseLng + lngOffset)
                    )
                );

                setForecastPoints(results);
            } catch (err) {
                console.error(err);
            }
        };

        loadForecastGrid();
    }, []);

    return (
        <ScrollView contentContainerStyle={styles.webContainer}>
            <Text style={styles.webText}>Map view is not directly supported on web browser.</Text>
            <Text style={styles.webSubText}>Please use a mobile device or emulator for full map functionality.</Text>

            <View style={styles.mapPlaceholder}>
                <Text style={styles.placeholderIcon}>📍</Text>
                <Text style={styles.placeholderText}>[ Flowering Forecast Data ]</Text>
                {forecastPoints.map((p, i) => (
                    <Text key={i} style={styles.dataRow}>
                        {p.lat.toFixed(4)}, {p.lng.toFixed(4)}: {p.floweringProbability}%
                    </Text>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    webContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#F3F4F6',
    },
    webText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
        textAlign: 'center',
    },
    webSubText: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 8,
        textAlign: 'center',
    },
    mapPlaceholder: {
        marginTop: 30,
        width: '100%',
        height: 300,
        backgroundColor: '#E5E7EB',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#D1D5DB',
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderIcon: {
        fontSize: 40,
    },
    placeholderText: {
        marginTop: 10,
        marginBottom: 10,
        color: '#9CA3AF',
        fontWeight: '600',
    },
    dataRow: {
        fontSize: 12,
        color: '#374151',
        marginVertical: 2,
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    }
});
