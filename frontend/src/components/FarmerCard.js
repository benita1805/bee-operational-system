import { Ionicons } from "@expo/vector-icons";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import { colors } from "../theme/colors";
import { ui } from "../theme/ui";
import Card from "./Card";

export default function FarmerCard({ farmer, onMessage }) {
    const call = () => Linking.openURL(`tel:${farmer.phone}`);

    const whatsapp = () => {
        const url = `whatsapp://send?phone=91${farmer.whatsapp}&text=Hi%20${encodeURIComponent(
            farmer.name
        )},%20I%20am%20a%20beekeeper%20from%20Buzz-Off.`;

        Linking.openURL(url).catch(() => {
            Linking.openURL(`https://wa.me/91${farmer.whatsapp}`);
        });
    };

    const openMaps = () => {
        if (!farmer.lat || !farmer.lon) return;
        const url = `https://www.google.com/maps/search/?api=1&query=${farmer.lat},${farmer.lon}`;
        Linking.openURL(url);
    };

    // Micro press animation
    const scale = useSharedValue(1);
    const aStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const distance =
        typeof farmer.distanceKm === "number" ? `${farmer.distanceKm.toFixed(1)} km` : null;

    return (
        <Animated.View style={aStyle}>
            <Pressable
                onPressIn={() => (scale.value = withTiming(0.992, { duration: 90 }))}
                onPressOut={() => (scale.value = withTiming(1, { duration: 120 }))}
            >
                <Card style={styles.card}>
                    {/* Header */}
                    <View style={styles.topRow}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.name} numberOfLines={1}>
                                {farmer.name}
                            </Text>
                            <Text style={styles.sub} numberOfLines={1}>
                                {farmer.locationText || "Unknown location"}
                            </Text>
                        </View>

                        {distance ? (
                            <View style={styles.badge}>
                                <Ionicons name="navigate-outline" size={14} color={colors.amberDark} />
                                <Text style={styles.badgeText}>{distance}</Text>
                            </View>
                        ) : null}
                    </View>

                    {/* Details */}
                    <View style={styles.details}>
                        <DetailRow icon="leaf-outline" label={`Crop`} value={farmer.cropType || "N/A"} />
                        <DetailRow
                            icon="map-outline"
                            label={`Area`}
                            value={`${farmer.areaAcres ?? "-"} acres`}
                        />
                        {!!farmer.notes && (
                            <Text style={styles.note} numberOfLines={2}>
                                {farmer.notes}
                            </Text>
                        )}
                    </View>

                    {/* Actions */}
                    <View style={styles.actions}>
                        <ActionIcon icon="call-outline" label="Call" onPress={call} />
                        <ActionIcon icon="logo-whatsapp" label="WhatsApp" onPress={whatsapp} />
                        <ActionIcon icon="location-outline" label="Maps" onPress={openMaps} />
                        <ActionIcon
                            icon="chatbubble-ellipses-outline"
                            label="Message"
                            onPress={onMessage}
                            primary
                        />
                    </View>
                </Card>
            </Pressable>
        </Animated.View>
    );
}

/* ---------- Components ---------- */

function DetailRow({ icon, label, value }) {
    return (
        <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
                <Ionicons name={icon} size={14} color={colors.black} />
            </View>
            <Text style={styles.detailText}>
                <Text style={styles.detailLabel}>{label}: </Text>
                {value}
            </Text>
        </View>
    );
}

function ActionIcon({ icon, label, onPress, primary }) {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.actionBtn,
                primary && styles.actionPrimary,
                pressed && { opacity: 0.85 },
            ]}
        >
            <Ionicons name={icon} size={16} color={primary ? colors.black : "#111827"} />
            <Text style={[styles.actionText, primary && { color: colors.black }]}>{label}</Text>
        </Pressable>
    );
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
    card: {
        padding: 16,
        borderRadius: ui.radius.xl,
    },

    topRow: {
        flexDirection: "row",
        gap: 12,
        alignItems: "center",
    },

    name: {
        fontSize: 16,
        fontWeight: "900",
        color: colors.black,
        letterSpacing: -0.2,
    },

    sub: {
        marginTop: 4,
        fontSize: 12,
        fontWeight: "700",
        color: colors.gray,
    },

    badge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: ui.radius.pill,
        backgroundColor: "#FFF7ED",
        borderWidth: 1,
        borderColor: "#FDE68A",
    },

    badgeText: {
        fontSize: 12,
        fontWeight: "900",
        color: colors.black,
    },

    details: {
        marginTop: 14,
        gap: 10,
    },

    detailRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },

    detailIcon: {
        width: 28,
        height: 28,
        borderRadius: 10,
        backgroundColor: "#F8FAFC",
        borderWidth: 1,
        borderColor: "#E6E8EC",
        justifyContent: "center",
        alignItems: "center",
    },

    detailText: {
        fontSize: 13,
        fontWeight: "700",
        color: "#111827",
    },

    detailLabel: {
        fontWeight: "900",
        color: colors.gray,
    },

    note: {
        marginTop: 4,
        fontSize: 12,
        fontWeight: "700",
        color: colors.gray,
        lineHeight: 18,
    },

    actions: {
        flexDirection: "row",
        gap: 10,
        marginTop: 16,
    },

    actionBtn: {
        flex: 1,
        borderRadius: ui.radius.m,
        paddingVertical: 12,
        backgroundColor: "#F8FAFC",
        borderWidth: 1,
        borderColor: "#E6E8EC",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
    },

    actionPrimary: {
        backgroundColor: colors.amber,
        borderColor: "#FDE68A",
    },

    actionText: {
        fontSize: 11,
        fontWeight: "900",
        color: "#111827",
    },
});
