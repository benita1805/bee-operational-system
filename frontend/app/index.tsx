import { useRouter } from "expo-router";
import { useContext, useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { AuthContext } from "../src/context/AuthContext";
import { colors } from "../src/theme/colors";

export default function Index() {
    const router = useRouter();
    const { user, loading } = useContext(AuthContext);

    useEffect(() => {
        if (loading) return;

        if (user) router.replace("/(tabs)" as const);
        else router.replace("/(auth)/login" as const);
    }, [user, loading]);

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color={colors.amberDark} />
        </View>
    );
}
