import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { addHive, fetchHives, updateHive } from "../../services/hiveApi";

import AppHeader from "../../components/AppHeader";
import Card from "../../components/Card";
import { colors } from "../../theme/colors";

function uid() {
    return "H" + Date.now().toString();
}

export default function HiveFormScreen() {
    const router = useRouter();
    const { hiveId } = useLocalSearchParams();

    const isEdit = useMemo(() => !!hiveId, [hiveId]);

    const [title, setTitle] = useState("");
    const [farmerName, setFarmerName] = useState("");
    const [fieldLocation, setFieldLocation] = useState("");
    const [notes, setNotes] = useState("");
    const [status, setStatus] = useState("ACTIVE");

    const [placementDate, setPlacementDate] = useState(new Date());
    const [harvestDate, setHarvestDate] = useState(new Date(Date.now() + 30 * 86400000));
    const [showPlacementPicker, setShowPlacementPicker] = useState(false);
    const [showHarvestPicker, setShowHarvestPicker] = useState(false);

    useEffect(() => {
        const load = async () => {
            if (!hiveId) return;

            // In a real connect-scenario, we might fetch from cloud too
            const all = await fetchHives();
            const existing = all.find((h) => h.id === hiveId);
            if (!existing) return;

            setTitle(existing.title);
            setFarmerName(existing.farmer_name || "");
            setFieldLocation(existing.field_location || "");
            setNotes(existing.notes || "");
            setStatus(existing.status || "ACTIVE");

            if (existing.placement_date) setPlacementDate(new Date(existing.placement_date));
            if (existing.expected_harvest_date) setHarvestDate(new Date(existing.expected_harvest_date));
        };

        load();
    }, [hiveId]);

    const validate = () => {
        if (!title.trim()) return "Hive Title is required";
        if (!farmerName.trim()) return "Farmer Name is required";
        if (!fieldLocation.trim()) return "Field Location is required";
        return null;
    };

    const save = async () => {
        const err = validate();
        if (err) {
            Alert.alert("Validation", err);
            return;
        }

        const hiveData = {
            title: title.trim(),
            farmer_name: farmerName.trim(),
            field_location: fieldLocation.trim(),
            notes: notes.trim(),
            status,
            placement_date: placementDate.toISOString(),
            expected_harvest_date: harvestDate.toISOString(),
        };

        try {
            if (isEdit) {
                await updateHive(hiveId, hiveData);
                Alert.alert("Saved", "Hive updated successfully");
            } else {
                await addHive(hiveData);
                Alert.alert("Saved", "Hive added successfully");
            }
            router.back();
        } catch (error) {
            console.error("Error saving hive:", error);
            Alert.alert("Error", "Failed to save hive to cloud");
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: colors.lightGray }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <AppHeader
                title={isEdit ? "Edit Hive" : "Add Hive"}
                subtitle="Track placement, harvest and status"
            />

            <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
                <Card style={styles.card}>
                    <Text style={styles.sectionTitle}>Hive Details</Text>

                    <Text style={styles.label}>Hive Title</Text>
                    <TextInput style={styles.input} value={title} onChangeText={setTitle} />

                    <Text style={styles.label}>Farmer Name</Text>
                    <TextInput style={styles.input} value={farmerName} onChangeText={setFarmerName} />

                    <Text style={styles.label}>Field Location</Text>
                    <TextInput style={styles.input} value={fieldLocation} onChangeText={setFieldLocation} />
                </Card>

                <Card style={styles.card}>
                    <Text style={styles.sectionTitle}>Dates</Text>

                    <TouchableOpacity style={styles.rowBtn} onPress={() => setShowPlacementPicker(true)}>
                        <Text style={styles.rowLabel}>Placement Date</Text>
                        <Text style={styles.rowValue}>{placementDate.toDateString()}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.rowBtn} onPress={() => setShowHarvestPicker(true)}>
                        <Text style={styles.rowLabel}>Expected Harvest</Text>
                        <Text style={styles.rowValue}>{harvestDate.toDateString()}</Text>
                    </TouchableOpacity>
                </Card>

                <Card style={styles.card}>
                    <Text style={styles.sectionTitle}>Status</Text>
                    <View style={styles.pillsRow}>
                        {["Active", "Harvested", "Relocated"].map((s) => (
                            <TouchableOpacity
                                key={s}
                                style={[styles.pill, status === s && styles.pillActive]}
                                onPress={() => setStatus(s)}
                            >
                                <Text style={styles.pillText}>{s}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </Card>

                <Card style={styles.card}>
                    <Text style={styles.sectionTitle}>Notes</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        value={notes}
                        onChangeText={setNotes}
                        multiline
                    />
                </Card>
            </ScrollView>

            <View style={styles.bottomBar}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
                    <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.saveBtn} onPress={save}>
                    <Ionicons name="checkmark" size={18} color={colors.black} />
                    <Text style={styles.saveText}>{isEdit ? "Update Hive" : "Save Hive"}</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    card: {
        marginBottom: 12,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#E6E8EC",
    },
    sectionTitle: { fontWeight: "900", fontSize: 14, marginBottom: 12 },
    label: { fontWeight: "800", color: colors.gray, marginTop: 10 },
    input: {
        backgroundColor: "#F8FAFC",
        borderWidth: 1,
        borderColor: "#E6E8EC",
        borderRadius: 16,
        padding: 14,
    },
    textArea: { minHeight: 96 },
    rowBtn: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "#EEF0F3" },
    rowLabel: { fontWeight: "800", fontSize: 12, color: colors.gray },
    rowValue: { fontWeight: "900", marginTop: 6 },
    pillsRow: { flexDirection: "row", gap: 10, flexWrap: "wrap" },
    pill: {
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 999,
        backgroundColor: "#F3F4F6",
    },
    pillActive: { backgroundColor: colors.amber },
    pillText: { fontWeight: "900" },
    bottomBar: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        flexDirection: "row",
        padding: 12,
        gap: 10,
    },
    cancelBtn: { flex: 1, backgroundColor: "#fff", borderRadius: 16, alignItems: "center", justifyContent: "center" },
    cancelText: { fontWeight: "900" },
    saveBtn: {
        flex: 2,
        backgroundColor: colors.amber,
        borderRadius: 16,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
    },
    saveText: { fontWeight: "900" },
});
