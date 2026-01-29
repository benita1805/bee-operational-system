import { Stack } from "expo-router";

export default function ProfileStackLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                animation: "slide_from_right", // ✅ iOS style
            }}
        >
            <Stack.Screen name="index" />
            <Stack.Screen name="manual" />
            <Stack.Screen name="calendar" />
        </Stack>
    );
}
