import * as Location from "expo-location";

export async function getCurrentLocation() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return null;

    try {
        const loc = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
        });
        return {
            lat: loc.coords.latitude,
            lon: loc.coords.longitude
        };
    } catch (e) {
        return null;
    }

}
