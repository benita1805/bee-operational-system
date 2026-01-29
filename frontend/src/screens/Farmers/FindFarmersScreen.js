import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import AppHeader from "../../components/AppHeader";
import Card from "../../components/Card";
import EmptyState from "../../components/EmptyState";
import FarmerCard from "../../components/FarmerCard";
import FilterRow from "../../components/FilterRow";
import Screen from "../../components/Screen";
import SearchBar from "../../components/SearchBar";

import { distanceKm } from "../../services/distance";
import { fetchFarmers } from "../../services/farmersApi";
import { getCurrentLocation } from "../../services/location";
import { colors } from "../../theme/colors";
import { ui } from "../../theme/ui";

export default function FindFarmersScreen() {
    const router = useRouter();

    const [farmers, setFarmers] = useState([]);
    const [search, setSearch] = useState("");
    const [cropFilter, setCropFilter] = useState("ALL");
    const [sortBy, setSortBy] = useState("DIST");

    useEffect(() => {
        const init = async () => {
            const beekeeperLoc = await getCurrentLocation();
            if (!beekeeperLoc) return;

            const farmersCloud = await fetchFarmers();

            const withDistance = farmersCloud.map((f) => ({
                ...f,
                distanceKm: distanceKm(beekeeperLoc.lat, beekeeperLoc.lon, f.lat, f.lon),
            }));

            setFarmers(withDistance);
        };

        init();
    }, []);

    const cropOptions = useMemo(() => {
        const crops = Array.from(new Set(farmers.map((f) => f.cropType)));
        return [{ label: "All", value: "ALL" }, ...crops.map((c) => ({ label: c, value: c }))];
    }, [farmers]);

    const filtered = useMemo(() => {
        let list = [...farmers];

        if (cropFilter !== "ALL") list = list.filter((f) => f.cropType === cropFilter);

        if (search.trim()) {
            const s = search.toLowerCase();
            list = list.filter(
                (f) =>
                    f.name.toLowerCase().includes(s) ||
                    f.locationText.toLowerCase().includes(s) ||
                    f.cropType.toLowerCase().includes(s)
            );
        }

        if (sortBy === "DIST") list.sort((a, b) => a.distanceKm - b.distanceKm);
        if (sortBy === "AREA") list.sort((a, b) => b.areaAcres - a.areaAcres);

        return list;
    }, [farmers, cropFilter, search, sortBy]);

    return (
        <View style={{ flex: 1, backgroundColor: colors.lightGray }}>
            <AppHeader title="Find Farmers" subtitle="Search verified crop owners for hive placement" />

            <Screen>
                {/* Search + Filters in a premium container */}
                <View style={styles.topArea}>
                    <Card style={styles.filterCard}>
                        <SearchBar
                            value={search}
                            onChangeText={setSearch}
                            placeholder="Search crop / farmer / location..."
                        />

                        <View style={styles.divider} />

                        <Text style={styles.filterLabel}>Sort</Text>
                        <FilterRow
                            options={[
                                { label: "Distance", value: "DIST" },
                                { label: "Area", value: "AREA" },
                            ]}
                            selected={sortBy}
                            onSelect={setSortBy}
                        />

                        <Text style={styles.filterLabel}>Crop Type</Text>
                        <FilterRow options={cropOptions} selected={cropFilter} onSelect={setCropFilter} />
                    </Card>
                </View>

                {/* Farmer list */}
                {filtered.length === 0 ? (
                    <View style={{ paddingHorizontal: 16, paddingTop: 10 }}>
                        <EmptyState
                            title="No farmers found"
                            message="Try adjusting filters or register a new farmer."
                        />
                    </View>
                ) : (
                    <FlatList
                        data={filtered}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={{ padding: 16, paddingBottom: 110 }}
                        renderItem={({ item }) => (
                            <FarmerCard
                                farmer={item}
                                onMessage={() =>
                                    router.push({
                                        pathname: "/farmer-chat",
                                        params: { farmer: JSON.stringify(item) },
                                    })
                                }
                            />
                        )}
                    />
                )}

                {/* Premium Floating Action Button */}
                <TouchableOpacity
                    activeOpacity={0.9}
                    style={styles.fab}
                    onPress={() => router.push("/farmer-register")}
                >
                    <Ionicons name="add" size={24} color={colors.black} />
                </TouchableOpacity>
            </Screen>
        </View>
    );
}

const styles = StyleSheet.create({
    topArea: {
        paddingHorizontal: 16,
        marginTop: 10,
    },

    filterCard: {
        padding: 14,
        borderRadius: ui.radius.xl,
    },

    divider: {
        height: 1,
        backgroundColor: "#E6E8EC",
        marginVertical: 12,
    },

    filterLabel: {
        fontSize: 12,
        fontWeight: "900",
        color: colors.gray,
        marginTop: 6,
        marginBottom: 8,
        letterSpacing: 0.8,
        textTransform: "uppercase",
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
        borderWidth: 1,
        borderColor: "#FDE68A",

        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 10 },
        elevation: 6,
    },
});
