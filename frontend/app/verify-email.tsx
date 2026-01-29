import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import Animated, {
  Easing,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from "react-native-reanimated";

import { auth, db } from "../src/services/firebase";
import { colors } from "../src/theme/colors";
import { ui } from "../src/theme/ui";

export default function Signup() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // subtle entrance animation for whole screen
  const containerOpacity = useSharedValue(0);
  const containerY = useSharedValue(12);

  useEffect(() => {
    containerOpacity.value = withTiming(1, { duration: 260 });
    containerY.value = withTiming(0, { duration: 260 });
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
    transform: [{ translateY: containerY.value }],
  }));

  const signup = async () => {
    if (submitting) return;

    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Fill all fields");
      return;
    }
    if (!email.includes("@")) {
      Alert.alert("Error", "Enter a valid email");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      setSubmitting(true);

      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      await sendEmailVerification(cred.user);

      await setDoc(doc(db, "users", cred.user.uid), {
        name,
        email: email.trim(),
        role: "beekeeper",
        createdAt: Date.now(),
      });

      router.replace("/verify-email" as any);
    } catch (e: any) {
      console.log("SIGNUP ERROR:", e?.code, e?.message);
      Alert.alert("Signup failed", e?.message ?? "Unknown error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <Animated.View style={containerStyle}>
        {/* Branding */}
        <View style={styles.brand}>
          <Text style={styles.logo}>Buzz-Off</Text>
          <Text style={styles.tagline}>AI Driven Hive Protection System</Text>

          {/* ✅ Premium Animated Chips */}
          <View style={styles.chipsRow}>
            <AnimatedChip
              delay={120}
              title="Hornet Detection"
              icon="camera-outline"
            />
            <AnimatedChip
              delay={220}
              title="Buzzer Control"
              icon="shield-checkmark-outline"
            />
            <AnimatedChip
              delay={320}
              title="Instant Alerts"
              icon="notifications-outline"
            />
          </View>
        </View>

        {/* Signup Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Create account</Text>

          <Text style={styles.label}>Name</Text>
          <TextInput
            placeholder="Your name"
            placeholderTextColor="#9CA3AF"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            placeholder="example@gmail.com"
            placeholderTextColor="#9CA3AF"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            placeholder="••••••••"
            placeholderTextColor="#9CA3AF"
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            placeholder="••••••••"
            placeholderTextColor="#9CA3AF"
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.btn, submitting && { opacity: 0.7 }]}
            onPress={signup}
            activeOpacity={0.9}
          >
            {submitting ? <ActivityIndicator /> : <Text style={styles.btnText}>Sign Up</Text>}
          </TouchableOpacity>

          {/* Link */}
          <View style={styles.linksRow}>
            <TouchableOpacity onPress={() => router.replace("/(auth)/login" as const)}>
              <Text style={styles.link}>Back to login</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Your account enables secure hive tracking, AI insights, and hornet protection system monitoring.
        </Text>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

/* ✅ Animated Chip */
function AnimatedChip({
  title,
  icon,
  delay,
}: {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  delay: number;
}) {
  return (
    <Animated.View
      entering={FadeInUp.duration(420)
        .delay(delay)
        .easing(Easing.out(Easing.cubic))}
    >
      <View style={styles.chip}>
        <View style={styles.chipIcon}>
          <Ionicons name={icon} size={14} color={colors.black} />
        </View>
        <Text style={styles.chipText}>{title}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F5F6F8",
    paddingHorizontal: 18,
    paddingTop: 46,
  },

  brand: { marginBottom: 20 },
  logo: {
    fontSize: 32,
    fontWeight: "900",
    color: colors.black,
    letterSpacing: -0.4,
  },
  tagline: { marginTop: 6, color: colors.gray, fontWeight: "700" },

  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 16,
  },

  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E6E8EC",
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 999,
  },

  chipIcon: {
    width: 24,
    height: 24,
    borderRadius: 10,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E6E8EC",
    justifyContent: "center",
    alignItems: "center",
  },

  chipText: {
    fontSize: 12,
    fontWeight: "900",
    color: colors.black,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: ui.radius.xl,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E6E8EC",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 2,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: colors.black,
    marginBottom: 16,
  },

  label: { color: colors.gray, fontWeight: "800", marginBottom: 6, marginTop: 8 },

  input: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E6E8EC",
    borderRadius: ui.radius.l,
    padding: 14,
    color: colors.black,
  },

  btn: {
    marginTop: 16,
    backgroundColor: colors.amber,
    paddingVertical: 14,
    borderRadius: ui.radius.l,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.10,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
  },

  btnText: { fontWeight: "900", fontSize: 16, color: colors.black },

  linksRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 14,
  },

  link: {
    fontWeight: "900",
    color: colors.amberDark,
    fontSize: 13,
  },

  footer: {
    marginTop: 18,
    textAlign: "center",
    color: "#9CA3AF",
    fontWeight: "700",
    fontSize: 12,
    lineHeight: 18,
  },
});
