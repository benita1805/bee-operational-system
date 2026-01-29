import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { colors } from "../theme/colors";
import { ui } from "../theme/ui";

type Props = {
    title: string;
    subtitle?: string;
    showBack?: boolean;
    rightSlot?: React.ReactNode;
};

export default function AppHeader({ title, subtitle, showBack = false, rightSlot }: Props) {
    const router = useRouter();

    const safeSubtitle = useMemo(() => (subtitle ? subtitle.trim() : ""), [subtitle]);

    return (
        <Animated.View entering={FadeInDown.duration(280)} style={styles.wrap}>
            <View style={styles.row}>
                {/* Back */}
                <View style={styles.left}>
                    {showBack ? (
                        <TouchableOpacity style={styles.backBtn} activeOpacity={0.85} onPress={() => router.back()}>
                            <Ionicons name="chevron-back" size={18} color={colors.black} />
                        </TouchableOpacity>
                    ) : (
                        <View style={{ width: 38 }} />
                    )}
                </View>

                {/* Title */}
                <View style={styles.center}>
                    <Text style={styles.title} numberOfLines={1}>
                        {title}
                    </Text>
                    {!!safeSubtitle && (
                        <Text style={styles.sub} numberOfLines={1}>
                            {safeSubtitle}
                        </Text>
                    )}
                </View>

                {/* Right slot */}
                <View style={styles.right}>{rightSlot ?? <View style={{ width: 38 }} />}</View>
            </View>

            <View style={styles.divider} />
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    wrap: {
        paddingTop: Platform.OS === "ios" ? 54 : 22,
        paddingHorizontal: 16,
        backgroundColor: colors.lightGray,
    },

    row: {
        flexDirection: "row",
        alignItems: "center",
        paddingBottom: 14,
    },

    left: { width: 44, alignItems: "flex-start" },
    right: { width: 44, alignItems: "flex-end" },

    backBtn: {
        width: 38,
        height: 38,
        borderRadius: 999,
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E6E8EC",
        ...ui.shadow.sm,
    },

    center: { flex: 1, alignItems: "center" },

    title: {
        fontSize: 18,
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

    divider: {
        height: 1,
        backgroundColor: "#E6E8EC",
    },
});
