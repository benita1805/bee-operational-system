import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
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
import { COLORS } from "../../src/constants/theme";
import { useAuth } from "../../src/context/AuthContext";

export default function ProfileScreen() {
    const router = useRouter();
    const { logout } = useAuth();

    // 🔐 Backend-auth simulated user
    const phone = "Logged in user";
    const role = "Beekeeper";

    const handleLogout = () => {
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

    return (
        <View style={{ flex: 1 }}>
            <AppHeader title="Profile" subtitle="Account & tools" />

            <ScreenContainer>
                <ScrollView contentContainerStyle={{ paddingVertical: 16, paddingBottom: 40 }}>
                    {/* 👤 User Card */}
                    <Card style={styles.userCard}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>B</Text>
                        </View>

                        <View style={{ flex: 1 }}>
                            <Text style={styles.name}>Beekeeper</Text>
                            <Text style={styles.email}>{phone}</Text>

                            <View style={styles.badgeRow}>
                                <View style={[styles.badge, styles.badgeOk]}>
                                    <Ionicons name="checkmark-circle" size={14} color={colors.success} />
                                    <Text style={[styles.badgeText, { color: colors.success }]}>
                                        Verified
                                    </Text>
                                </View>

                                <View style={[styles.badge, styles.badgeRole]}>
                                    <Ionicons name="shield-outline" size={14} color={colors.black} />
                                    <Text style={[styles.badgeText, { color: colors.black }]}>
                                        {role}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </Card>

                    {/* 🧰 Tools */}
                    <Text style={styles.section}>TOOLS</Text>

                    <Grid>
                        <ToolTile
                            title="Farming Manual"
                            subtitle="Offline guide"
                            icon="book-outline"
                            onPress={() => router.push("/profile/manual")}
                        />
                        <ToolTile
                            title="Flowering Calendar"
                            subtitle="Season planner"
                            icon="calendar-outline"
                            onPress={() => router.push("/profile/calendar")}
                        />
                        <ToolTile
                            title="Settings"
                            subtitle="App preferences"
                            icon="settings-outline"
                            onPress={() => router.push("/profile/settings")}
                        />
                    </Grid>

                    {/* 🚪 Logout */}
                    <Text style={styles.section}>ACCOUNT</Text>

                    <TouchableOpacity
                        style={[styles.actionRow, styles.danger]}
                        activeOpacity={0.9}
                        onPress={handleLogout}
                    >
                        <View style={styles.actionLeft}>
                            <View style={[styles.iconWrap, { backgroundColor: "#FEE2E2" }]}>
                                <Ionicons name="log-out-outline" size={18} color={colors.danger} />
                            </View>
                            <View>
                                <Text style={[styles.actionTitle, { color: colors.danger }]}>
                                    Logout
                                </Text>
                                <Text style={styles.actionSub}>Sign out of app</Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                    </TouchableOpacity>

                    <Text style={styles.footer}>Buzz-Off • v1.0</Text>
                </ScrollView>
            </ScreenContainer>
        </View>
    );
}

/* -------- Components -------- */

function Grid({ children }: { children: React.ReactNode }) {
    return <View style={styles.grid}>{children}</View>;
}

function ToolTile({ title, subtitle, icon, onPress }: any) {
    return (
        <TouchableOpacity style={styles.tile} activeOpacity={0.9} onPress={onPress}>
            <View style={styles.tileIcon}>
                <Ionicons name={icon} size={18} color={colors.black} />
            </View>
            <Text style={styles.tileTitle}>{title}</Text>
            <Text style={styles.tileSub}>{subtitle}</Text>
        </TouchableOpacity>
    );
}

/* -------- Styles -------- */

const styles = StyleSheet.create({
    userCard: {
        borderRadius: ui.radius.xl,
        flexDirection: "row",
        gap: 14,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E6E8EC",
    },

    avatar: {
        width: 54,
        height: 54,
        borderRadius: 27,
        backgroundColor: colors.amber,
        justifyContent: "center",
        alignItems: "center",
    },
    avatarText: { fontWeight: "900", fontSize: 20 },

    name: { fontSize: 16, fontWeight: "900" },
    email: { marginTop: 2, color: colors.gray, fontWeight: "700" },

    badgeRow: {
        flexDirection: "row",
        gap: 8,
        marginTop: 10,
        flexWrap: "wrap",
    },

    badge: {
        flexDirection: "row",
        gap: 6,
        alignItems: "center",
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 999,
        borderWidth: 1,
    },

    badgeOk: { backgroundColor: "#ECFDF5", borderColor: "#A7F3D0" },
    badgeRole: { backgroundColor: "#F8FAFC", borderColor: "#E6E8EC" },

    badgeText: { fontSize: 12, fontWeight: "900" },

    section: {
        marginTop: 18,
        marginBottom: 10,
        fontWeight: "900",
        color: COLORS.textSecondary,
        letterSpacing: 1,
        fontSize: 12,
    },

    grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },

    tile: {
        width: "48%",
        backgroundColor: COLORS.card,
        borderRadius: ui.radius.xl,
        borderWidth: 1,
        borderColor: "#E6E8EC",
        padding: 14,
        elevation: 2,
    },

    tileIcon: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: "#F8FAFC",
        borderWidth: 1,
        borderColor: "#E6E8EC",
        justifyContent: "center",
        alignItems: "center",
    },

    tileTitle: {
        marginTop: 10,
        fontWeight: "900",
        fontSize: 13,
    },

    tileSub: {
        marginTop: 4,
        fontSize: 11,
        fontWeight: "700",
        color: colors.gray,
    },

    actionRow: {
        backgroundColor: COLORS.card,
        borderWidth: 1,
        borderColor: "#E6E8EC",
        padding: 16,
        borderRadius: ui.radius.xl,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    actionLeft: { flexDirection: "row", gap: 12, alignItems: "center" },

    iconWrap: {
        width: 40,
        height: 40,
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
    },

    actionTitle: { fontWeight: "900", fontSize: 14 },
    actionSub: { marginTop: 4, color: colors.gray, fontWeight: "700", fontSize: 12 },

    danger: {},

    footer: {
        textAlign: "center",
        marginTop: 18,
        fontWeight: "800",
        color: COLORS.textSecondary,
        fontSize: 12,
    },
});
