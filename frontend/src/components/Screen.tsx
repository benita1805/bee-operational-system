// src/components/Screen.tsx
import React from "react";
import { Platform, SafeAreaView, ScrollView, StyleSheet, View, ViewStyle } from "react-native";
import { colors } from "../theme/colors";

type Props = {
    children: React.ReactNode;
    scroll?: boolean;
    style?: ViewStyle;
    contentStyle?: ViewStyle;
};

export default function Screen({ children, scroll = false, style, contentStyle }: Props) {
    return (
        <SafeAreaView style={[styles.safe, style]}>
            {scroll ? (
                <ScrollView
                    contentContainerStyle={[styles.scrollBody, contentStyle]}
                    showsVerticalScrollIndicator={false}
                >
                    {children}
                </ScrollView>
            ) : (
                <View style={[styles.body, contentStyle]}>{children}</View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.lightGray },

    body: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: Platform.OS === "ios" ? 0 : 12,
    },

    scrollBody: {
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: Platform.OS === "ios" ? 34 : 16,
    },
});
