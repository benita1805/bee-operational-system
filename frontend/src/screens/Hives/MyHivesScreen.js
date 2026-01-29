import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import AppHeader from "../../components/AppHeader";
import Card from "../../components/Card";
import FilterRow from "../../components/FilterRow";
import HiveCard from "../../components/HiveCard";
import SearchBar from "../../components/SearchBar";

import { loadData, StorageKeys } from "../../services/storage";
import { colors } from "../../theme/colors";
import { daysRemaining } from "../../utils/date";

export default function MyHivesScreen() {
    const router = useRouter();

    const [hives, setHives] = useState([]);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("ALL");

    // ✅ Reload when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            let active = true;

            const load = async () => {
                const data = await loadData(StorageKeys.HIVES, []);
                if (active) setHives(data || []); // ✅ FIX: no crash on null
            };

            load();

            return () => {
                active = false;
            };
        }, [])
    );

    // ✅ Premium quick stats
    const stats = useMemo(() => {
        const total = hives.length;
        const active = hives.filter((h) => h.status === "Active").length;

        const dueSoon = hives.filter((h) => {
            const d = daysRemaining(h.harvestDate);
            return d !== null && d >= 0 && d <= 7;
        }).length;

        return { total, active, dueSoon };
    }, [hives]);

    const filtered = useMemo(() => {
        let list = [...hives];

        // filter
        if (status !== "ALL") list = list.filter((h) => h.status === status);

        // search
        if (search.trim()) {
            const s = search.toLowerCase();
            list = list.filter(
                (h) =>
                    (h.title || "").toLowerCase().includes(s) ||
                    (h.farmerName || "").toLowerCase().includes(s) ||
                    (h.fieldLocation || "").toLowerCase().includes(s)
            );
        }

        // ✅ FIX: correct sort active first
        list.sort((a, b) => {
            const aActive = a.status === "Active" ? 0 : 1;
            const bActive = b.status === "Active" ? 0 : 1;
            return aActive - bActive;
        });

        return list;
    }, [hives, search, status]);

    return (
        <View style={{ flex: 1, backgroundColor: colors.lightGray }}>
            <AppHeader title="My Hives" subtitle="Multi-hive management" />

            {/* ✅ Premium Stats Row */}
            <View style={styles.statsRow}>
                <Card style={styles.statCard}>
                    <Text style={styles.statLabel}>Total</Text>
                    <Text style={styles.statValue}>{stats.total}</Text>
                </Card>

                <Card style={styles.statCard}>
                    <Text style={styles.statLabel}>Active</Text>
                    <Text style={styles.statValue}>{stats.active}</Text>
                </Card>

                <Card style={styles.statCard}>
                    <Text style={styles.statLabel}>Due Soon</Text>
                    <Text style={styles.statValue}>{stats.dueSoon}</Text>
                </Card>
            </View>

            <SearchBar
                value={search}
                onChangeText={setSearch}
                placeholder="Search hive / farmer / location..."
            />

            <FilterRow
                options={[
                    { label: "All", value: "ALL" },
                    { label: "Active", value: "Active" },
                    { label: "Harvested", value: "Harvested" },
                    { label: "Relocated", value: "Relocated" },
                ]}
                selected={status}
                onSelect={setStatus}
            />

            {/* ✅ Premium Empty State */}
            {filtered.length === 0 ? (
                <View style={{ paddingHorizontal: 16, marginTop: 8 }}>
                    <Card style={styles.emptyCard}>
                        <View style={styles.emptyIconWrap}>
                            <Ionicons name="cube-outline" size={26} color={colors.amberDark} />
                        </View>

                        <Text style={styles.emptyTitle}>No hives yet</Text>

                        <Text style={styles.emptyMsg}>
                            Add your first hive placement record to start tracking harvest time and hive activity.
                        </Text>

                        <TouchableOpacity
                            style={styles.emptyBtn}
                            activeOpacity={0.9}
                            onPress={() => router.push("/(hives)/hive-form")}
                        >
                            <Ionicons name="add" size={18} color={colors.black} />
                            <Text style={styles.emptyBtnText}>Add Hive</Text>
                        </TouchableOpacity>
                    </Card>
                </View>
            ) : (
                <FlatList
                    data={filtered}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
                    renderItem={({ item }) => (
                        <HiveCard
                            hive={item}
                            onPress={() =>
                                router.push({
                                    pathname: "/(hives)/hive-detail",
                                    params: { hiveId: item.id },
                                })
                            }
                        />
                    )}
                />
            )}

            {/* ✅ Premium FAB */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => router.push("/(hives)/hive-form")}
                activeOpacity={0.85}
            >
                <Ionicons name="add" size={26} color={colors.black} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    statsRow: {
        flexDirection: "row",
        gap: 10,
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 6,
    },

    statCard: {
        flex: 1,
        paddingVertical: 14,
        alignItems: "center",
    },

    statLabel: {
        color: colors.gray,
        fontWeight: "800",
        fontSize: 12,
    },

    statValue: {
        marginTop: 6,
        fontSize: 20,
        fontWeight: "900",
        color: colors.black,
    },

    emptyCard: {
        alignItems: "center",
        paddingVertical: 28,
        paddingHorizontal: 16,
    },

    emptyIconWrap: {
        width: 54,
        height: 54,
        borderRadius: 27,
        backgroundColor: "#FFF3C4",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#FFE08A",
    },

    emptyTitle: {
        fontWeight: "900",
        fontSize: 16,
        marginTop: 14,
        color: colors.black,
    },

    emptyMsg: {
        textAlign: "center",
        marginTop: 8,
        color: colors.gray,
        lineHeight: 20,
    },

    emptyBtn: {
        marginTop: 18,
        paddingVertical: 12,
        paddingHorizontal: 18,
        borderRadius: 14,
        backgroundColor: colors.amber,
        flexDirection: "row",
        gap: 8,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 10 },
        elevation: 5,
    },

    emptyBtnText: {
        fontWeight: "900",
        fontSize: 14,
        color: colors.black,
    },

    fab: {
        position: "absolute",
        right: 18,
        bottom: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.amber,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.18,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 10 },
        elevation: 6,
    },
});
