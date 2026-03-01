import React from 'react';
import { StyleSheet, View } from 'react-native';
import { COLORS, SPACING } from '../../constants/theme';

export const ScreenContainer = ({ children }: { children: React.ReactNode }) => {
    return <View style={styles.container}>{children}</View>;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        paddingHorizontal: SPACING.md,
    },
});
