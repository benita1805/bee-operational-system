import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { fetchFarmers } from "../services/farmersApi";
import { getCurrentLocation } from "../services/location";

export default function MapScreen() {
    const [loc, setLoc] = useState(null);
    const [farmers, setFarmers] = useState([]);

    useEffect(() => {
        const init = async () => {
            const l = await getCurrentLocation();
            setLoc(l);

            const f = await fetchFarmers();
            setFarmers(f);
        };
        init();
    }, []);

    if (!loc) return null;

    return (
        <View style={{ flex: 1 }}>
            <MapView
                style={StyleSheet.absoluteFillObject}
                initialRegion={{
                    latitude: loc.lat,
                    longitude: loc.lon,
                    latitudeDelta: 2,
                    longitudeDelta: 2,
                }}
            >
                {/* Beekeeper marker */}
                <Marker coordinate={{ latitude: loc.lat, longitude: loc.lon }} title="You" />

                {/* Farmers markers */}
                {farmers.map((f) => (
                    <Marker
                        key={f.id}
                        coordinate={{ latitude: f.lat, longitude: f.lon }}
                        title={f.name}
                        description={`${f.cropType} • ${f.locationText}`}
                    />
                ))}
            </MapView>
        </View>
    );
}
