import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TextInput, View } from "react-native";

import { colors } from "../theme/colors";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

export default function SearchBar({
  value,
  onChangeText,
  placeholder = "Search...",
}: Props) {
  return (
    <View style={styles.wrap}>
      <Ionicons
        name="search"
        size={18}
        color="#9CA3AF"
        style={styles.icon}
      />

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        style={styles.input}
        autoCorrect={false}
        autoCapitalize="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E6E8EC",
    borderRadius: 16,
    paddingHorizontal: 12,
    height: 46,
  },

  icon: {
    marginRight: 8,
  },

  input: {
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    color: colors.black,
  },
});
