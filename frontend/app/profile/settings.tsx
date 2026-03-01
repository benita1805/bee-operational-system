import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import AppHeader from "../../src/components/AppHeader";
import Card from "../../src/components/Card";
import { colors } from "../../src/theme/colors";
import { ui } from "../../src/theme/ui";

import { ScreenContainer } from "../../src/components/layout/ScreenContainer";
import { useAuth } from "../../src/context/AuthContext";

export default function SettingsScreen() {
    const router = useRouter();
    const { logout } = useAuth();
    const [phone, setPhone] = useState<string | null>(null);

    useEffect(() => {
        AsyncStorage.getItem("userPhone").then(setPhone);
    }, []);

    const handleLogout = async () => {
        Alert.alert("Logout", "Do you want to logout?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Logout",
                style: "destructive",
                onPress: async () => {
                    await logout();
                    router.replace("/(auth)/login");
                },
            },
        ]);
    };

    const clearLocalData = async () => {
        Alert.alert("Clear local data", "Cloud data will remain safe.", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Clear",
                style: "destructive",
                onPress: async () => {
                    await AsyncStorage.removeItem("HIVES");
                    Alert.alert("Done", "Local cache cleared");
                },
            },
        ]);
    };

    return (
        <View style={{ flex: 1 }}>
            <AppHeader title="Settings" subtitle="Account & data controls" />

            <ScreenContainer>
                <ScrollView contentContainerStyle={{ paddingVertical: 16, paddingBottom: 40 }}>
                    {/* Account */}
                    <Section title="ACCOUNT">
                        <Card style={styles.row}>
                            <Ionicons name="call-outline" size={18} color={colors.black} />
                            <Text style={styles.text}>{phone || "Unknown"}</Text>
                        </Card>
                    </Section>

                    {/* Data */}
                    <Section title="DATA">
                        <Action
                            icon="cloud-upload-outline"
                            label="Sync to cloud"
                            onPress={() => Alert.alert("Sync", "Auto sync enabled")}
                        />

                        <Action
                            icon="trash-outline"
                            label="Clear local cache"
                            danger
                            onPress={clearLocalData}
                        />
                    </Section>

                    {/* App */}
                    <Section title="APP">
                        <Card style={styles.row}>
                            <Ionicons name="information-circle-outline" size={18} color={colors.black} />
                            <Text style={styles.text}>Version 1.0.0</Text>
                        </Card>
                    </Section>

                    {/* Security */}
                    <Section title="SECURITY">
                        <Action
                            icon="log-out-outline"
                            label="Logout"
                            danger
                            onPress={handleLogout}
                        />
                    </Section>
                </ScrollView>
            </ScreenContainer>
        </View>
    );
}

/* ---------- Helpers ---------- */

function Section({ title, children }: any) {
    return (
        <View style={{ marginBottom: 20 }}>
            <Text style={styles.section}>{title}</Text>
            {children}
        </View>
    );
}

function Action({ icon, label, onPress, danger }: any) {
    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={onPress}
            style={[
                styles.actionRow,
                danger && { borderColor: "#FECACA", backgroundColor: "#FFF5F5" },
            ]}
        >
            <View style={styles.actionLeft}>
                <Ionicons
                    name={icon}
                    size={18}
                    color={danger ? colors.danger : colors.black}
                />
                <Text
                    style={[
                        styles.text,
                        danger && { color: colors.danger },
                    ]}
                >
                    {label}
                </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
        </TouchableOpacity>
    );
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
    section: {
        fontWeight: "900",
        color: "#6B7280",
        marginBottom: 10,
        fontSize: 12,
        letterSpacing: 1,
    },

    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        padding: 16,
        borderRadius: ui.radius.xl,
        borderWidth: 1,
        borderColor: "#E6E8EC",
    },

    actionRow: {
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#E6E8EC",
        padding: 16,
        borderRadius: ui.radius.xl,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },

    actionLeft: {
        flexDirection: "row",
        gap: 12,
        alignItems: "center",
    },

    text: {
        fontWeight: "800",
        color: colors.black,
        fontSize: 14,
    },
});
