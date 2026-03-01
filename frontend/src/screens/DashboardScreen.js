import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import AppHeader from "../components/AppHeader";
import { AppCard } from "../components/ui/AppCard";
import { COLORS } from "../constants/theme";
import { fetchFarmers } from "../services/farmersApi";
import { fetchHives } from "../services/hiveApi";
import { colors } from "../theme/colors";
import { ui } from "../theme/ui";
import { daysRemaining } from "../utils/date";

import { ScreenContainer } from "../components/layout/ScreenContainer";

export default function DashboardScreen() {
    const router = useRouter();
    const { width } = useWindowDimensions();

    const [hives, setHives] = useState([]);
    const [farmers, setFarmers] = useState([]);

    useEffect(() => {
        const load = async () => {
            const h = await fetchHives();
            const f = await fetchFarmers();
            setHives(h || []);
            setFarmers(f || []);
        };
        load();
    }, []);

    const harvestSoonCount = useMemo(() => {
        return hives.filter((h) => {
            const d = daysRemaining(h.expected_harvest_date);
            return d !== null && d >= 0 && d <= 7;
        }).length;
    }, [hives]);

    const activeHives = useMemo(() => hives.filter((h) => h.status === "ACTIVE").length, [hives]);

    const gridGap = 12;
    const cardWidth = useMemo(() => {
        return width >= 420 ? (width - 16 * 2 - gridGap) / 2 : width - 16 * 2;
    }, [width]);

    return (
        <View style={{ flex: 1 }}>
            <AppHeader title="Buzz-Off" subtitle="AI-Driven Hive Management System" />

            <ScreenContainer>
                <ScrollView style={styles.body} contentContainerStyle={{ paddingBottom: 28 }}>
                    {/* Top Status Card */}
                    <View style={styles.hero}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.heroTitle}>Hive Protection Status</Text>
                            <Text style={styles.heroSub}>
                                Monitor hive activity, harvest readiness, and field placements.
                            </Text>

                            <View style={styles.heroBadgeRow}>
                                <StatusPill icon="shield-checkmark-outline" text="Protection Active" />
                                <StatusPill icon="notifications-outline" text="Alerts Enabled" />
                            </View>
                        </View>

                        <View style={styles.heroIcon}>
                            <Ionicons name="shield-outline" size={28} color={colors.black} />
                        </View>
                    </View>

                    {/* Quick Actions */}
                    <Text style={styles.sectionTitle}>Quick Actions</Text>

                    <View style={styles.actionsRow}>
                        <ActionButton
                            icon="people-outline"
                            label="Find Farmers"
                            onPress={() => router.push("/(tabs)/farmers")}
                        />
                        <ActionButton
                            icon="leaf-outline"
                            label="Calendar"
                            onPress={() => router.push("/profile/calendar")}
                        />
                        <ActionButton
                            icon="book-outline"
                            label="Manual"
                            onPress={() => router.push("/profile/manual")}
                        />
                        <ActionButton
                            icon="sparkles-outline"
                            label="AI Insights"
                            onPress={() => router.push("/(tabs)/insights")}
                        />
                    </View>

                    {/* Summary grid */}
                    <Text style={styles.sectionTitle}>Overview</Text>

                    <View style={styles.grid}>
                        <MiniStat
                            title="Total Hives"
                            value={`${hives.length}`}
                            subtitle={`${activeHives} Active`}
                            icon="cube-outline"
                            width={cardWidth}
                        />

                        <MiniStat
                            title="Harvest Due"
                            value={`${harvestSoonCount}`}
                            subtitle="Next 7 days"
                            icon="time-outline"
                            width={cardWidth}
                            highlight
                        />

                        <MiniStat
                            title="Farmers Connected"
                            value={`${farmers.length}`}
                            subtitle="Saved contacts"
                            icon="call-outline"
                            width={cardWidth}
                        />

                        <MiniStat
                            title="Hive Records"
                            value={hives.length > 0 ? "Updated" : "Empty"}
                            subtitle={hives.length > 0 ? "Tracking enabled" : "Add your first hive"}
                            icon="document-text-outline"
                            width={cardWidth}
                        />
                    </View>

                    {/* AI Insights card */}
                    <AppCard style={{ marginTop: 6 }}>
                        <View style={styles.aiTop}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.cardTitle}>AI Insights</Text>
                                <Text style={styles.cardSub}>
                                    Generates hive risk score and management recommendations from your records.
                                </Text>
                            </View>

                            <View style={styles.aiIcon}>
                                <Ionicons name="sparkles-outline" size={20} color={colors.black} />
                            </View>
                        </View>

                        <ActionButtonAiInsights
                            label="Open AI Insights"
                            onPress={() => router.push("/(tabs)/insights")}
                        />
                    </AppCard>

                    {/* Pro Tip */}
                    <AppCard style={{ marginTop: 12 }}>
                        <Text style={styles.cardTitle}>Best Practice</Text>
                        <Text style={styles.cardSub}>
                            When harvest is within 7 days, inspect hives twice a week and prepare extraction equipment.
                        </Text>
                    </AppCard>
                </ScrollView>
            </ScreenContainer>
        </View>
    );
}

/* ------------------- UI Components ------------------- */

function StatusPill({ icon, text }) {
    return (
        <View style={styles.pill}>
            <Ionicons name={icon} size={14} color={colors.amberDark} />
            <Text style={styles.pillText}>{text}</Text>
        </View>
    );
}

function ActionButton({ icon, label, onPress }) {
    const scale = useSharedValue(1);
    const aStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <Animated.View style={[{ flex: 1 }, aStyle]}>
            <Pressable
                onPress={onPress}
                onPressIn={() => (scale.value = withTiming(0.96, { duration: 90 }))}
                onPressOut={() => (scale.value = withTiming(1, { duration: 120 }))}
                style={({ pressed }) => [styles.actionBtn, pressed && { opacity: 0.9 }]}
            >
                <View style={styles.actionIcon}>
                    <Ionicons name={icon} size={18} color={colors.black} />
                </View>
                <Text style={styles.actionText}>{label}</Text>
            </Pressable>
        </Animated.View>
    );
}

function ActionButtonAiInsights({ label, onPress }) {
    const scale = useSharedValue(1);
    const aStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <Animated.View style={aStyle}>
            <Pressable
                onPress={onPress}
                onPressIn={() => (scale.value = withTiming(0.96, { duration: 90 }))}
                onPressOut={() => (scale.value = withTiming(1, { duration: 120 }))}
                style={({ pressed }) => [styles.primaryBtn, pressed && { opacity: 0.9 }]}
            >
                <Text style={styles.primaryBtnText}>{label}</Text>
                <Ionicons name="chevron-forward" size={16} color={colors.black} />
            </Pressable>
        </Animated.View>
    );
}

function MiniStat({ title, value, subtitle, icon, width, highlight }) {
    return (
        <AppCard style={[styles.miniCard, { width }, highlight && styles.miniHighlight]}>
            <View style={styles.miniTop}>
                <Text style={styles.miniTitle}>{title}</Text>
                <Ionicons name={icon} size={18} color={highlight ? colors.amberDark : "#111827"} />
            </View>

            <Text style={styles.miniValue}>{value}</Text>
            <Text style={styles.miniSub}>{subtitle}</Text>
        </AppCard>
    );
}

/* ------------------- Styles ------------------- */

const styles = StyleSheet.create({
    body: { paddingHorizontal: 16 },

    hero: {
        marginTop: 12,
        padding: 18,
        borderRadius: ui.radius.xl,
        backgroundColor: colors.white,
        borderWidth: ui.border.width,
        borderColor: ui.border.color,
        flexDirection: "row",
        gap: 14,
        ...ui.shadow,
    },

    heroTitle: { fontWeight: "900", fontSize: 16, color: colors.black },
    heroSub: { marginTop: 6, fontWeight: "700", color: colors.gray, lineHeight: 18 },

    heroBadgeRow: { flexDirection: "row", gap: 8, flexWrap: "wrap", marginTop: 12 },

    heroIcon: {
        width: 46,
        height: 46,
        borderRadius: ui.radius.pill,
        backgroundColor: "#FFF7ED",
        borderWidth: ui.border.width,
        borderColor: "#FDE68A",
        justifyContent: "center",
        alignItems: "center",
    },

    sectionTitle: {
        marginTop: 22,
        marginBottom: 10,
        color: COLORS.textSecondary,
        fontSize: 12,
        fontWeight: "900",
        letterSpacing: 1,
    },

    pill: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: "#F8FAFC",
        borderWidth: 1,
        borderColor: "#E6E8EC",
        borderRadius: ui.radius.pill,
    },
    pillText: { fontSize: 12, fontWeight: "800", color: colors.black },

    actionsRow: { flexDirection: "row", justifyContent: "space-between", gap: 10 },
    actionBtn: {
        flex: 1,
        backgroundColor: COLORS.card,
        borderWidth: 1,
        borderColor: "#E6E8EC",
        borderRadius: ui.radius.l,
        paddingVertical: 14,
        alignItems: "center",
        ...ui.shadow,
    },
    actionIcon: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: "#F8FAFC",
        borderWidth: 1,
        borderColor: "#E6E8EC",
        justifyContent: "center",
        alignItems: "center",
    },
    actionText: { marginTop: 10, fontWeight: "900", fontSize: 12, color: colors.black },

    grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },

    miniCard: {
        padding: 16,
        borderRadius: ui.radius.l,
    },
    miniHighlight: {
        borderColor: "#FDE68A",
        backgroundColor: "#FFFBEB",
    },

    miniTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    miniTitle: { fontSize: 12, fontWeight: "900", color: colors.gray },
    miniValue: { marginTop: 10, fontSize: 22, fontWeight: "900", color: colors.black },
    miniSub: { marginTop: 6, fontSize: 12, fontWeight: "700", color: colors.gray },

    cardTitle: { fontWeight: "900", fontSize: 15, color: colors.black },
    cardSub: { marginTop: 6, fontWeight: "700", color: colors.gray, lineHeight: 18 },

    aiTop: { flexDirection: "row", gap: 12, alignItems: "center" },
    aiIcon: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: "#FFF7ED",
        borderWidth: 1,
        borderColor: "#FDE68A",
        justifyContent: "center",
        alignItems: "center",
    },

    primaryBtn: {
        marginTop: 14,
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderRadius: ui.radius.m,
        backgroundColor: colors.amber,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    primaryBtnText: { fontWeight: "900", color: colors.black },
});
