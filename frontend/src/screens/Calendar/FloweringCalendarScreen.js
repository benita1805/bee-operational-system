import { useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import AppHeader from "../../components/AppHeader";
import Card from "../../components/Card";
import FilterRow from "../../components/FilterRow";
import { colors } from "../../theme/colors";

import { FloweringDB, INDIA_REGIONS, MONTHS } from "../../data/indiaFloweringData";

export default function FloweringCalendarScreen() {
    const [region, setRegion] = useState("TN");
    const [month, setMonth] = useState("Jan");

    const crops = useMemo(() => {
        const list = FloweringDB[region] || [];
        return list
            .map((c) => ({
                ...c,
                active: c.flowering.includes(month),
            }))
            .sort((a, b) => (a.active === b.active ? 0 : a.active ? -1 : 1));
    }, [region, month]);

    return (
        <View style={{ flex: 1, backgroundColor: colors.lightGray }}>
            <AppHeader
                title="Flowering Calendar"
                subtitle="India-focused yield planning"
            />

            {/* Region selector */}
            <View style={{ paddingHorizontal: 16, marginTop: 8 }}>
                <Text style={styles.smallLabel}>Select Region</Text>
                <FilterRow
                    options={INDIA_REGIONS.map((r) => ({ label: r.name, value: r.id }))}
                    selected={region}
                    onSelect={setRegion}
                />
            </View>

            {/* Month selector */}
            <View style={{ paddingHorizontal: 16, marginTop: 4 }}>
                <Text style={styles.smallLabel}>Select Month</Text>
                <FilterRow
                    options={MONTHS.map((m) => ({ label: m, value: m }))}
                    selected={month}
                    onSelect={setMonth}
                />
            </View>

            <FlatList
                data={crops}
                keyExtractor={(item) => item.crop}
                contentContainerStyle={{ padding: 16, paddingBottom: 30 }}
                renderItem={({ item }) => (
                    <Card style={[styles.card, item.active && styles.activeCard]}>
                        <View style={styles.row}>
                            <Text style={styles.crop}>{item.crop}</Text>
                            <Text style={[styles.badge, item.active ? styles.on : styles.off]}>
                                {item.active ? "FLOW NOW" : "Off-season"}
                            </Text>
                        </View>

                        <Text style={styles.meta}>
                            Flowering: {item.flowering.join(", ")} • Nectar: {item.nectarFlow} • Yield:{" "}
                            {item.yieldPotential}
                        </Text>

                        <Text style={styles.note}>{item.placementAdvice}</Text>
                        <Text style={styles.subnote}>{item.notes}</Text>
                    </Card>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    smallLabel: { fontWeight: "900", color: colors.gray, marginBottom: 8 },
    card: { marginBottom: 12 },
    activeCard: { borderColor: "#FFD54F" },
    row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    crop: { fontSize: 16, fontWeight: "900" },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
        fontWeight: "900",
        fontSize: 12,
    },
    on: { backgroundColor: "#FFF4CC", color: "#8A5A00" },
    off: { backgroundColor: "#F3F4F6", color: "#6B7280" },
    meta: { marginTop: 8, color: colors.gray, fontWeight: "700" },
    note: { marginTop: 10, fontWeight: "900", color: colors.black },
    subnote: { marginTop: 4, color: colors.gray, lineHeight: 18 },
});
