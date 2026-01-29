import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
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

import AppHeader from "../../components/AppHeader";
import Card from "../../components/Card";
import { loadData, saveData, StorageKeys } from "../../services/storage";
import { colors } from "../../theme/colors";

function uid() {
    return "H" + Date.now().toString();
}

export default function HiveFormScreen() {
    const router = useRouter();
    const { hiveId } = useLocalSearchParams();

    const isEdit = useMemo(() => !!hiveId, [hiveId]);

    // form fields
    const [title, setTitle] = useState("");
    const [farmerName, setFarmerName] = useState("");
    const [fieldLocation, setFieldLocation] = useState("");
    const [notes, setNotes] = useState("");
    const [status, setStatus] = useState("Active");

    const [placementDate, setPlacementDate] = useState(new Date());
    const [harvestDate, setHarvestDate] = useState(new Date(Date.now() + 30 * 86400000));

    const [showPlacementPicker, setShowPlacementPicker] = useState(false);
    const [showHarvestPicker, setShowHarvestPicker] = useState(false);

    useEffect(() => {
        // If editing, load hive and prefill
        const load = async () => {
            if (!hiveId) return;

            const all = await loadData(StorageKeys.HIVES, []);
            const existing = all.find((h) => h.id === hiveId);

            if (!existing) return;

            setTitle(existing.title ?? "");
            setFarmerName(existing.farmerName ?? "");
            setFieldLocation(existing.fieldLocation ?? "");
            setNotes(existing.notes ?? "");
            setStatus(existing.status ?? "Active");

            if (existing.placementDate) setPlacementDate(new Date(existing.placementDate));
            if (existing.harvestDate) setHarvestDate(new Date(existing.harvestDate));
        };

        load();
    }, [hiveId]);

    const validate = () => {
        if (!title.trim()) return "Hive title is required";
        if (!farmerName.trim()) return "Farmer name is required";
        if (!fieldLocation.trim()) return "Field location is required";
        return null;
    };

    const save = async () => {
        const err = validate();
        if (err) {
            Alert.alert("Validation", err);
            return;
        }

        const all = await loadData(StorageKeys.HIVES, []);

        if (isEdit) {
            const updated = all.map((h) =>
                h.id === hiveId
                    ? {
                        ...h,
                        title: title.trim(),
                        farmerName: farmerName.trim(),
                        fieldLocation: fieldLocation.trim(),
                        notes: notes.trim(),
                        status,
                        placementDate: placementDate.toISOString(),
                        harvestDate: harvestDate.toISOString(),
                        updatedAt: Date.now(),
                    }
                    : h
            );

            await saveData(StorageKeys.HIVES, updated);
            Alert.alert("Saved", "Hive updated successfully");
            router.back();
            return;
        }

        const newHive = {
            id: uid(),
            title: title.trim(),
            farmerName: farmerName.trim(),
            fieldLocation: fieldLocation.trim(),
            notes: notes.trim(),
            status,
            placementDate: placementDate.toISOString(),
            harvestDate: harvestDate.toISOString(),
            createdAt: Date.now(),
        };

        await saveData(StorageKeys.HIVES, [newHive, ...all]);
        Alert.alert("Saved", "Hive added successfully");
        router.back();
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
                {/* Section: Basic */}
                <Card style={styles.card}>
                    <Text style={styles.sectionTitle}>Hive Details</Text>

                    <Text style={styles.label}>Hive Title</Text>
                    <TextInput
                        placeholder="Example: Hive A - Coconut Farm"
                        placeholderTextColor="#9CA3AF"
                        style={styles.input}
                        value={title}
                        onChangeText={setTitle}
                    />

                    <Text style={styles.label}>Farmer Name</Text>
                    <TextInput
                        placeholder="Example: Ramesh Kumar"
                        placeholderTextColor="#9CA3AF"
                        style={styles.input}
                        value={farmerName}
                        onChangeText={setFarmerName}
                    />

                    <Text style={styles.label}>Field Location</Text>
                    <TextInput
                        placeholder="Example: Madurai, Tamil Nadu"
                        placeholderTextColor="#9CA3AF"
                        style={styles.input}
                        value={fieldLocation}
                        onChangeText={setFieldLocation}
                    />
                </Card>

                {/* Section: Dates */}
                <Card style={styles.card}>
                    <Text style={styles.sectionTitle}>Dates</Text>

                    <TouchableOpacity
                        style={styles.rowBtn}
                        onPress={() => setShowPlacementPicker(true)}
                        activeOpacity={0.9}
                    >
                        <Text style={styles.rowLabel}>Placement Date</Text>
                        <Text style={styles.rowValue}>{placementDate.toDateString()}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.rowBtn}
                        onPress={() => setShowHarvestPicker(true)}
                        activeOpacity={0.9}
                    >
                        <Text style={styles.rowLabel}>Expected Harvest</Text>
                        <Text style={styles.rowValue}>{harvestDate.toDateString()}</Text>
                    </TouchableOpacity>

                    {showPlacementPicker && (
                        <DateTimePicker
                            value={placementDate}
                            mode="date"
                            display="default"
                            onChange={(event, date) => {
                                setShowPlacementPicker(false);
                                if (date) setPlacementDate(date);
                            }}
                        />
                    )}

                    {showHarvestPicker && (
                        <DateTimePicker
                            value={harvestDate}
                            mode="date"
                            display="default"
                            onChange={(event, date) => {
                                setShowHarvestPicker(false);
                                if (date) setHarvestDate(date);
                            }}
                        />
                    )}
                </Card>

                {/* Section: Status */}
                <Card style={styles.card}>
                    <Text style={styles.sectionTitle}>Status</Text>

                    <View style={styles.pillsRow}>
                        {["Active", "Harvested", "Relocated"].map((s) => {
                            const active = status === s;
                            return (
                                <TouchableOpacity
                                    key={s}
                                    style={[styles.pill, active && styles.pillActive]}
                                    onPress={() => setStatus(s)}
                                    activeOpacity={0.9}
                                >
                                    <Text style={[styles.pillText, active && styles.pillTextActive]}>{s}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </Card>

                {/* Section: Notes */}
                <Card style={styles.card}>
                    <Text style={styles.sectionTitle}>Notes</Text>
                    <TextInput
                        placeholder="Any observations, disease notes, hornet activity..."
                        placeholderTextColor="#9CA3AF"
                        style={[styles.input, styles.textArea]}
                        value={notes}
                        onChangeText={setNotes}
                        multiline
                    />
                </Card>
            </ScrollView>

            {/* Sticky bottom save */}
            <View style={styles.bottomBar}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()} activeOpacity={0.9}>
                    <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.saveBtn} onPress={save} activeOpacity={0.9}>
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

    sectionTitle: {
        fontWeight: "900",
        fontSize: 14,
        color: colors.black,
        marginBottom: 12,
    },

    label: {
        fontWeight: "800",
        color: colors.gray,
        marginBottom: 6,
        marginTop: 10,
    },

    input: {
        backgroundColor: "#F8FAFC",
        borderWidth: 1,
        borderColor: "#E6E8EC",
        borderRadius: 16,
        padding: 14,
        color: colors.black,
    },

    textArea: {
        minHeight: 96,
        textAlignVertical: "top",
    },

    rowBtn: {
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: "#EEF0F3",
    },

    rowLabel: {
        color: colors.gray,
        fontWeight: "800",
        fontSize: 12,
    },
    rowValue: {
        marginTop: 6,
        fontWeight: "900",
        color: colors.black,
        fontSize: 14,
    },

    pillsRow: {
        flexDirection: "row",
        gap: 10,
        flexWrap: "wrap",
        marginTop: 8,
    },
    pill: {
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 999,
        backgroundColor: "#F3F4F6",
        borderWidth: 1,
        borderColor: "#E6E8EC",
    },
    pillActive: {
        backgroundColor: colors.amber,
        borderColor: colors.amberDark,
    },
    pillText: { fontWeight: "900", color: colors.black },
    pillTextActive: { color: colors.black },

    bottomBar: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: "row",
        gap: 10,
        backgroundColor: "#F5F6F8",
        borderTopWidth: 1,
        borderTopColor: "#E6E8EC",
    },
    cancelBtn: {
        flex: 1,
        height: 52,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#E6E8EC",
    },
    cancelText: { fontWeight: "900", color: colors.black },

    saveBtn: {
        flex: 2,
        height: 52,
        borderRadius: 16,
        backgroundColor: colors.amber,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        gap: 8,
        shadowColor: "#000",
        shadowOpacity: 0.18,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 10 },
        elevation: 6,
    },
    saveText: { fontWeight: "900", color: colors.black },
});
