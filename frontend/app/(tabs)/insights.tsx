import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

import AppHeader from "../../src/components/AppHeader";
import Card from "../../src/components/Card";
import EmptyState from "../../src/components/EmptyState";

import { loadData, StorageKeys } from "../../src/services/storage";
import { colors } from "../../src/theme/colors";

import {
    computeHiveRiskScore,
    generateRecommendations,
    getRiskLabel,
} from "../../src/services/aiEngine";

type Hive = {
    id: string;
    title: string;
    farmerName: string;
    fieldLocation?: string;
    placementDate?: string;
    harvestDate?: string;
    status: "Active" | "Harvested" | "Relocated";
    notes?: string;
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const getCurrentMonth = () => MONTHS[new Date().getMonth()];
const DEFAULT_REGION = "TN";

export default function AIInsightsScreen() {
    const [hives, setHives] = useState<Hive[]>([]);
    const month = getCurrentMonth();

    useFocusEffect(
        useCallback(() => {
            let active = true;

            const load = async () => {
                const data = await loadData(StorageKeys.HIVES, []);
                if (active) setHives(data);
            };

            load();

            return () => {
                active = false;
            };
        }, [])
    );

    const enriched = useMemo(() => {
        return hives.map((h) => {
            const score = computeHiveRiskScore(h, DEFAULT_REGION, month);
            const risk = getRiskLabel(score);
            const recs = generateRecommendations(h, DEFAULT_REGION, month);

            return {
                ...h,
                aiScore: score,
                aiRiskLabel: risk.label,
                aiRiskColor: risk.color,
                aiRecs: recs,
            };
        });
    }, [hives, month]);

    const overallScore = useMemo(() => {
        if (enriched.length === 0) return 0;
        const avg = enriched.reduce((sum, h) => sum + (h.aiScore || 0), 0) / enriched.length;
        return Math.round(avg);
    }, [enriched]);

    const priority = useMemo(() => {
        return [...enriched].sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0));
    }, [enriched]);

    return (
        <View style={{ flex: 1, backgroundColor: colors.lightGray }}>
            <AppHeader title="AI Insights" subtitle="Risk scoring + smart recommendations" />

            <View style={{ paddingHorizontal: 16, marginTop: 6 }}>
                <Card style={styles.summaryCard}>
                    <Text style={styles.summaryTitle}>Overall Risk Score</Text>
                    <Text style={styles.summaryValue}>{overallScore}/100</Text>
                    <Text style={styles.summaryNote}>
                        Based on harvest schedule, season suitability, hive status and notes.
                    </Text>
                </Card>
            </View>

            {priority.length === 0 ? (
                <EmptyState
                    title="No hives found"
                    message="Add a hive record to generate AI insights."
                />
            ) : (
                <FlatList
                    data={priority}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
                    renderItem={({ item }) => (
                        <Card style={styles.hiveCard}>
                            <View style={styles.row}>
                                <Text style={styles.hiveTitle}>{item.title}</Text>

                                <View
                                    style={[
                                        styles.scoreBadge,
                                        item.aiRiskColor === "danger" && styles.badgeDanger,
                                        item.aiRiskColor === "amber" && styles.badgeAmber,
                                        item.aiRiskColor === "success" && styles.badgeSuccess,
                                    ]}
                                >
                                    <Text style={styles.badgeText}>{item.aiScore}/100</Text>
                                </View>
                            </View>

                            <Text style={styles.meta}>
                                Farmer: {item.farmerName} • Status: {item.status}
                            </Text>

                            <Text style={styles.riskLabel}>Risk: {item.aiRiskLabel}</Text>

                            <Text style={styles.recTitle}>Recommended Actions</Text>

                            {item.aiRecs.slice(0, 3).map((r: string, idx: number) => (
                                <View key={idx} style={styles.recRow}>
                                    <Text style={styles.bullet}>•</Text>
                                    <Text style={styles.recText}>{r}</Text>
                                </View>
                            ))}

                            {item.aiRecs.length > 3 && (
                                <Text style={styles.more}>+ {item.aiRecs.length - 3} more tips</Text>
                            )}
                        </Card>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    summaryCard: {
        borderRadius: 22,
        borderWidth: 1,
        borderColor: "#E6E8EC",
    },
    summaryTitle: { fontWeight: "900", color: colors.gray },
    summaryValue: { marginTop: 8, fontSize: 30, fontWeight: "900", color: colors.black },
    summaryNote: { marginTop: 10, color: colors.gray, lineHeight: 18, fontWeight: "700", fontSize: 12 },

    hiveCard: { marginBottom: 12, borderRadius: 22, borderWidth: 1, borderColor: "#E6E8EC" },
    row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    hiveTitle: { fontSize: 16, fontWeight: "900", flex: 1 },

    meta: { marginTop: 8, color: colors.gray, fontWeight: "700", fontSize: 12 },
    riskLabel: { marginTop: 8, fontWeight: "900", color: colors.black },

    scoreBadge: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: "#E6E8EC",
        backgroundColor: "#F9FAFB",
    },
    badgeText: { fontWeight: "900", fontSize: 12 },

    badgeDanger: { backgroundColor: "#FEE2E2", borderColor: "#FCA5A5" },
    badgeAmber: { backgroundColor: "#FEF3C7", borderColor: "#FCD34D" },
    badgeSuccess: { backgroundColor: "#DCFCE7", borderColor: "#86EFAC" },

    recTitle: { marginTop: 14, fontWeight: "900", fontSize: 13 },
    recRow: { flexDirection: "row", gap: 10, marginTop: 8 },
    bullet: { fontWeight: "900", color: colors.amberDark },
    recText: { flex: 1, color: colors.gray, lineHeight: 18, fontWeight: "600" },
    more: { marginTop: 10, fontWeight: "800", color: colors.amberDark, fontSize: 12 },
});
