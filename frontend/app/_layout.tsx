import { Slot, useRouter, useSegments } from "expo-router";
import React, { useContext, useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

import { AuthContext, AuthProvider } from "../src/context/AuthContext";
import { colors } from "../src/theme/colors";

function AuthGate() {
  const router = useRouter();
  const segments = useSegments();

  const { user, loading } = useContext(AuthContext);

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inTabsGroup = segments[0] === "(tabs)";
    const inVerifyScreen = segments[0] === "verify-email";

    // 1) Not logged in → force auth screens
    if (!user) {
      if (!inAuthGroup) router.replace("/(auth)/login");
      return;
    }

    // 2) Logged in but NOT verified → force verify screen
    if (!user.emailVerified) {
      if (!inVerifyScreen) router.replace("/verify-email");
      return;
    }

    // 3) Logged in + verified → force tabs
    if (!inTabsGroup) {
      router.replace("/(tabs)");
    }
  }, [user, loading, segments]);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.lightGray,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthGate />
    </AuthProvider>
  );
}
