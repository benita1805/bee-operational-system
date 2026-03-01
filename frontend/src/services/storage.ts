import AsyncStorage from "@react-native-async-storage/async-storage";

export const StorageKeys = {
    HIVES: "HIVES",
    FARMERS: "FARMERS",
    MANUAL_BOOKMARKS: "MANUAL_BOOKMARKS",
};

export async function loadData<T>(key: string, fallback: T): Promise<T> {
    try {
        const raw = await AsyncStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
        return fallback;
    }
}

export async function saveData<T>(key: string, value: T): Promise<void> {
    await AsyncStorage.setItem(key, JSON.stringify(value));
}
