import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Polygon, PROVIDER_GOOGLE } from 'react-native-maps';
import { COLORS, RADIUS, SPACING } from '../constants/theme';
import { fetchFloweringForecast } from '../services/mapApi';

export default function MapScreen() {
    const [forecastPoints, setForecastPoints] = useState<any[]>([]);

    useEffect(() => {
        const loadForecastGrid = async () => {
            try {
                const baseLat = 13.0827;
                const baseLng = 80.2707;

                const result = await fetchFloweringForecast(baseLat, baseLng);
                setForecastPoints(Array.isArray(result) ? result : []);
                console.log('MAP API DATA:', result);
            } catch (err) {
                console.error(err);
            }
        };

        loadForecastGrid();
    }, []);

    const getProbabilityColor = (prob: number) => {
        if (prob >= 80) return 'rgba(46, 125, 50, 0.5)'; // High - Green
        if (prob >= 50) return 'rgba(251, 192, 45, 0.5)'; // Medium - Yellow
        if (prob >= 20) return 'rgba(245, 124, 0, 0.5)';  // Low - Orange
        return 'rgba(211, 47, 47, 0.5)';                 // Very Low - Red
    };

    const renderPolygons = () => {
        const size = 0.008; // polygon size
        return forecastPoints.map((point, index) => {
            const lat = Number(point.lat);
            const lng = Number(point.lng);
            const prob = Number(point.floweringProbability);

            const coordinates = [
                { latitude: lat - size, longitude: lng - size },
                { latitude: lat + size, longitude: lng - size },
                { latitude: lat + size, longitude: lng + size },
                { latitude: lat - size, longitude: lng + size },
            ];

            return (
                <Polygon
                    key={`poly-${index}`}
                    coordinates={coordinates}
                    fillColor={getProbabilityColor(prob)}
                    strokeWidth={0}
                />
            );
        });
    };

    return (
        <View style={{ flex: 1 }}>
            {/* ── Map (base layer) ── */}
            <MapView
                provider={PROVIDER_GOOGLE}
                style={{ flex: 1 }}
                initialRegion={{
                    latitude: 13.0827,
                    longitude: 80.2707,
                    latitudeDelta: 0.15,
                    longitudeDelta: 0.15,
                }}
            >
                {renderPolygons()}
            </MapView>

            {/* ── Floating Header ── */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Flowering Intelligence Map</Text>
            </View>

            {/* ── Bottom Info Panel ── */}
            <View style={styles.bottomPanel} />
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        position: 'absolute',
        top: 60,
        left: 16,
        right: 16,
        backgroundColor: COLORS.card,
        borderRadius: 12,
        paddingVertical: SPACING.sm,
        paddingHorizontal: SPACING.md,
        elevation: 6,
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        alignItems: 'center',
    },

    headerTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.textPrimary,
    },

    bottomPanel: {
        position: 'absolute',
        bottom: 30,
        left: 16,
        right: 16,
        minHeight: 80,
        backgroundColor: COLORS.card,
        borderRadius: RADIUS.lg,
        padding: SPACING.md,
        elevation: 6,
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
    },
});


