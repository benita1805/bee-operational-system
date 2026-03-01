import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import AppHeader from "../../components/AppHeader";
import Card from "../../components/Card";
import { colors } from "../../theme/colors";
import { daysRemaining } from "../../utils/date";

import { apiFetch } from "../../services/apiClient";
import { fetchHives } from "../../services/hiveApi";

export default function HiveDetailScreen() {
    const router = useRouter();
    const { hiveId } = useLocalSearchParams();
    const [hive, setHive] = useState(null);

    useEffect(() => {
        const load = async () => {
            const all = await fetchHives();
            setHive(all.find((h) => h.id === hiveId));
        };
        load();
    }, [hiveId]);

    const remove = async () => {
        Alert.alert("Delete Hive", "Are you sure?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: async () => {
                    try {
                        await apiFetch(`/hives/${hiveId}`, { method: "DELETE" });
                        router.back();
                    } catch (error) {
                        console.error("Error deleting hive:", error);
                        Alert.alert("Error", "Failed to delete hive from cloud");
                    }
                },
            },
        ]);
    };

    if (!hive) {
        return (
            <View style={{ flex: 1, backgroundColor: colors.lightGray }}>
                <AppHeader title="Hive Details" subtitle="Loading..." />
            </View>
        );
    }

    const remaining = daysRemaining(hive.expected_harvest_date);

    return (
        <View style={{ flex: 1, backgroundColor: colors.lightGray }}>
            <AppHeader title="Hive Details" subtitle={hive.title} />

            <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
                <Card>
                    <Text style={styles.k}>Hive Title</Text>
                    <Text style={styles.v}>{hive.title}</Text>

                    <Text style={styles.k}>Farmer</Text>
                    <Text style={styles.v}>{hive.farmer_name || "—"}</Text>

                    <Text style={styles.k}>Field</Text>
                    <Text style={styles.v}>{hive.field_location || "—"}</Text>

                    <Text style={styles.k}>Status</Text>
                    <Text style={styles.v}>{hive.status}</Text>

                    <Text style={styles.k}>Placement Date</Text>
                    <Text style={styles.v}>{hive.placement_date ? new Date(hive.placement_date).toDateString() : "—"}</Text>

                    <Text style={styles.k}>Harvest Date</Text>
                    <Text style={styles.v}>{hive.expected_harvest_date ? new Date(hive.expected_harvest_date).toDateString() : "—"}</Text>

                    <Text style={styles.k}>Harvest Countdown</Text>
                    <Text style={styles.v}>
                        {remaining === null ? "Not set" : `${remaining} days remaining`}
                    </Text>

                    <Text style={styles.k}>Notes</Text>
                    <Text style={styles.v}>{hive.notes || "—"}</Text>
                </Card>

                <TouchableOpacity
                    style={styles.editBtn}
                    onPress={() =>
                        router.push({
                            pathname: "/(hives)/hive-form",
                            params: { hiveId: hive.id },
                        })
                    }
                    activeOpacity={0.9}
                >
                    <Ionicons name="create-outline" size={18} color={colors.black} />
                    <Text style={styles.editText}>Edit Hive</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.del} onPress={remove} activeOpacity={0.9}>
                    <Text style={{ fontWeight: "900", color: colors.white }}>Delete Hive</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.back} onPress={() => router.back()} activeOpacity={0.9}>
                    <Text style={{ fontWeight: "900" }}>Back</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    k: { color: colors.gray, fontWeight: "800", marginTop: 10 },
    v: { fontSize: 16, fontWeight: "900", marginTop: 4, color: colors.black },

    editBtn: {
        marginTop: 14,
        backgroundColor: colors.amber,
        padding: 14,
        borderRadius: 16,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
        gap: 8,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 10 },
        elevation: 6,
    },
    editText: { fontWeight: "900", color: colors.black },

    del: {
        backgroundColor: colors.danger,
        padding: 14,
        borderRadius: 16,
        alignItems: "center",
        marginTop: 10,
    },
    back: {
        backgroundColor: colors.white,
        padding: 14,
        borderRadius: 16,
        alignItems: "center",
        marginTop: 10,
    },
});
