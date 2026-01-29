import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import { colors } from "../theme/colors";
import { ui } from "../theme/ui";

export default function PrimaryButton({
    title,
    onPress,
    loading,
}: {
    title: string;
    onPress: () => void;
    loading?: boolean;
}) {
    const scale = useSharedValue(1);

    const aStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <Animated.View style={aStyle}>
            <Pressable
                onPress={onPress}
                disabled={loading}
                onPressIn={() => (scale.value = withTiming(0.985, { duration: 90 }))}
                onPressOut={() => (scale.value = withTiming(1, { duration: 120 }))}
                style={[styles.btn, loading && { opacity: 0.7 }]}
            >
                <Text style={styles.text}>{title}</Text>
            </Pressable>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    btn: {
        backgroundColor: colors.amber,
        paddingVertical: 14,
        borderRadius: ui.radius.m,
        alignItems: "center",
        ...ui.shadow,
    },
    text: { fontWeight: "900", fontSize: 15, color: colors.black },
});
