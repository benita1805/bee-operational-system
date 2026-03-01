import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import { colors } from "../theme/colors";
import { ui } from "../theme/ui";
import { daysRemaining } from "../utils/date";
import { AppCard } from "./ui/AppCard";

export type Hive = {
  id: string;
  title?: string;
  farmerName?: string;
  fieldLocation?: string;
  placementDate?: number;
  harvestDate?: number;
  status?: "Active" | "Harvested" | "Relocated" | string;
};

type Props = {
  hive: Hive;
  onPress: () => void;
};

export default function HiveCard({ hive, onPress }: Props) {
  const remaining = daysRemaining(hive.harvestDate);

  let badge = hive.status || "Active";
  let badgeVariant: "default" | "warn" | "success" | "muted" = "default";

  if (remaining !== null && remaining <= 7 && remaining >= 0) {
    badge = "Harvest Soon";
    badgeVariant = "warn";
  } else if (hive.status === "Harvested") {
    badgeVariant = "success";
  } else if (hive.status === "Relocated") {
    badgeVariant = "muted";
  }

  const harvestLabel =
    remaining === null
      ? "Harvest date not set"
      : remaining < 0
        ? "Overdue harvest"
        : `Harvest in ${remaining} days`;

  const scale = useSharedValue(1);
  const aStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.wrap, aStyle]}>
      <Pressable
        onPress={onPress}
        onPressIn={() => (scale.value = withTiming(0.96, { duration: 90 }))}
        onPressOut={() => (scale.value = withTiming(1, { duration: 120 }))}
        style={({ pressed }) => [{ opacity: pressed ? 0.97 : 1 }]}
      >
        <AppCard style={styles.card}>
          <View style={styles.topRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title} numberOfLines={1}>
                {hive.title || "Hive Record"}
              </Text>

              <View style={styles.subRow}>
                <InfoChip icon="person-outline" text={hive.farmerName || "Unknown farmer"} />
                <InfoChip icon="location-outline" text={hive.fieldLocation || "Unknown location"} />
              </View>
            </View>

            <View style={styles.rightCol}>
              <StatusPill text={badge} variant={badgeVariant} />
              <Ionicons name="chevron-forward" size={18} color="#9CA3AF" style={{ marginTop: 10 }} />
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.bottomRow}>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Placement</Text>
              <Text style={styles.statValue}>
                {hive.placementDate ? new Date(hive.placementDate).toDateString() : "Not set"}
              </Text>
            </View>

            <View style={styles.stat}>
              <Text style={styles.statLabel}>Harvest</Text>
              <Text
                style={[
                  styles.statValue,
                  remaining !== null && remaining <= 7 && remaining >= 0 && { color: colors.amberDark },
                  remaining !== null && remaining < 0 && { color: colors.danger },
                ]}
                numberOfLines={1}
              >
                {harvestLabel}
              </Text>
            </View>
          </View>
        </AppCard>
      </Pressable>
    </Animated.View>
  );
}

function InfoChip({ icon, text }: { icon: keyof typeof Ionicons.glyphMap; text: string }) {
  return (
    <View style={styles.chip}>
      <Ionicons name={icon} size={13} color={colors.black} />
      <Text style={styles.chipText} numberOfLines={1}>
        {text}
      </Text>
    </View>
  );
}

function StatusPill({
  text,
  variant,
}: {
  text: string;
  variant: "default" | "warn" | "success" | "muted";
}) {
  const stylesByVariant =
    variant === "warn"
      ? { backgroundColor: "#FFFBEB", borderColor: "#FDE68A", textColor: colors.amberDark }
      : variant === "success"
        ? { backgroundColor: "#ECFDF5", borderColor: "#A7F3D0", textColor: colors.success }
        : variant === "muted"
          ? { backgroundColor: "#F3F4F6", borderColor: "#E5E7EB", textColor: "#6B7280" }
          : { backgroundColor: "#F8FAFC", borderColor: "#E6E8EC", textColor: "#111827" };

  return (
    <View
      style={[
        styles.pill,
        { backgroundColor: stylesByVariant.backgroundColor, borderColor: stylesByVariant.borderColor },
      ]}
    >
      <Text style={[styles.pillText, { color: stylesByVariant.textColor }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 12 },

  card: { padding: 16, borderRadius: ui.radius.xl },

  topRow: { flexDirection: "row", gap: 12, alignItems: "flex-start" },

  title: { fontSize: 16, fontWeight: "900", color: colors.black, letterSpacing: -0.2 },

  rightCol: { alignItems: "flex-end", justifyContent: "flex-start" },

  subRow: { flexDirection: "row", gap: 8, marginTop: 10, flexWrap: "wrap" },

  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    maxWidth: 220,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: ui.radius.pill,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E6E8EC",
  },

  chipText: { fontSize: 12, fontWeight: "800", color: "#111827" },

  pill: { paddingHorizontal: 10, paddingVertical: 7, borderRadius: ui.radius.pill, borderWidth: 1 },

  pillText: { fontWeight: "900", fontSize: 12 },

  divider: { height: 1, backgroundColor: "#E6E8EC", marginTop: 14, marginBottom: 12 },

  bottomRow: { flexDirection: "row", gap: 12 },

  stat: { flex: 1 },

  statLabel: {
    fontSize: 11,
    fontWeight: "900",
    color: colors.gray,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },

  statValue: { marginTop: 6, fontSize: 12, fontWeight: "800", color: "#111827", lineHeight: 18 },
});
