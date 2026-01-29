// src/components/EmptyState.tsx
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { colors } from "../theme/colors";
import { ui } from "../theme/ui";

type Props = {
  title: string;
  message: string;
  icon?: keyof typeof Ionicons.glyphMap;
  actionText?: string;
  onAction?: () => void;
};

export default function EmptyState({
  title,
  message,
  icon = "leaf-outline",
  actionText,
  onAction,
}: Props) {
  return (
    <Animated.View entering={FadeInDown.duration(260)} style={styles.wrap}>
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={26} color={colors.amberDark} />
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.msg}>{message}</Text>

      {!!actionText && !!onAction && (
        <TouchableOpacity style={styles.btn} activeOpacity={0.9} onPress={onAction}>
          <Text style={styles.btnText}>{actionText}</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 10,
    backgroundColor: "#fff",
    borderWidth: ui.border.width,
    borderColor: ui.border.color,
    borderRadius: ui.radius.xl,
    paddingVertical: 26,
    paddingHorizontal: 20,
    alignItems: "center",
    ...ui.shadow.sm,
  },

  iconWrap: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#FFF7ED",
    borderWidth: 1,
    borderColor: "#FDE68A",
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    marginTop: 14,
    fontSize: 16,
    fontWeight: "900",
    color: colors.black,
    letterSpacing: -0.2,
  },

  msg: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "700",
    color: colors.gray,
    textAlign: "center",
    lineHeight: 18,
  },

  btn: {
    marginTop: 16,
    backgroundColor: colors.amber,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: ui.radius.l,
    ...ui.shadow.sm,
  },

  btnText: {
    fontWeight: "900",
    fontSize: 13,
    color: colors.black,
  },
});
