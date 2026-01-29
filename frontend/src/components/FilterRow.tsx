// src/components/FilterRow.tsx
import React, { useEffect, useRef } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { colors } from "../theme/colors";
import { ui } from "../theme/ui";

type Option = { label: string; value: string };

type Props = {
  options: Option[];
  selected: string;
  onSelect: (value: string) => void;
};

export default function FilterRow({ options, selected, onSelect }: Props) {
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    // OPTIONAL: auto scroll to selected
    const idx = options.findIndex((x) => x.value === selected);
    if (idx >= 0) {
      scrollRef.current?.scrollTo({ x: idx * 110, animated: true });
    }
  }, [selected]);

  return (
    <Animated.View entering={FadeIn.duration(220)} style={styles.wrap}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {options.map((opt) => (
          <FilterPill
            key={opt.value}
            label={opt.label}
            active={selected === opt.value}
            onPress={() => onSelect(opt.value)}
          />
        ))}
      </ScrollView>
    </Animated.View>
  );
}

function FilterPill({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withTiming(active ? 1.03 : 1, { duration: 160 });
  }, [active]);

  const aStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={aStyle}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        style={[styles.pill, active && styles.active]}
      >
        <Text style={[styles.text, active && styles.activeText]} numberOfLines={1}>
          {label}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingTop: 10 },

  row: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 10,
    alignItems: "center",
  },

  pill: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: ui.radius.pill,
    borderWidth: 1,
    borderColor: "#E6E8EC",
    backgroundColor: "#FFFFFF",
  },

  active: {
    backgroundColor: colors.amber,
    borderColor: "#FDE68A",
    ...ui.shadow.sm,
  },

  text: {
    fontSize: 12,
    fontWeight: "900",
    color: colors.black,
  },

  activeText: {
    color: colors.black,
  },
});
