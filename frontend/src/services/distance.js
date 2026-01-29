import AsyncStorage from "@react-native-async-storage/async-storage";

export const StorageKeys = {
    FARMERS: "BUZZOFF_FARMERS",
    HIVES: "BUZZOFF_HIVES",
    MANUAL_BOOKMARKS: "BUZZOFF_MANUAL_BOOKMARKS",
    BEEKEEPER_PROFILE: "BUZZOFF_BEEKEEPER_PROFILE",
};

export async function saveData(key, value) {
    await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function loadData(key, fallback = null) {
    const raw = await AsyncStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
}
