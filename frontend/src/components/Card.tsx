// src/components/Card.tsx
import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { ui } from "../theme/ui";

type Props = {
    children: React.ReactNode;
    style?: ViewStyle;
    variant?: "default" | "soft" | "outline";
};

export default function Card({ children, style, variant = "default" }: Props) {
    return (
        <View style={[styles.base, variantStyles[variant], style]}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    base: {
        borderRadius: ui.radius.xl,
        padding: 18,
    },

    default: {
        backgroundColor: "#FFFFFF",
        borderWidth: ui.border.width,
        borderColor: ui.border.color,
        ...ui.shadow.sm,
    },

    soft: {
        backgroundColor: "#F8FAFC",
        borderWidth: 1,
        borderColor: "#EEF2F7",
    },

    outline: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: "#E6E8EC",
    },
});

const variantStyles: Record<string, ViewStyle> = {
    default: styles.default,
    soft: styles.soft,
    outline: styles.outline,
};
