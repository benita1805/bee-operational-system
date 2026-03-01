import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useContext, useState } from "react";
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
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { AuthContext } from "../../src/context/AuthContext";
import { apiClient } from "../../src/services/apiClient";

const PRIMARY_GREEN = '#2E7D32';
const BACKGROUND_LIGHT = '#F7F9FA';
const TEXT_PRIMARY = '#1A1A1A';
const CARD_BG = '#ffffff';
const INPUT_BG = '#F3F5F7';

export default function Login() {
  const router = useRouter();
  const { setUser } = useContext(AuthContext);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [stage, setStage] = useState<"PHONE" | "OTP">("PHONE");
  const [loading, setLoading] = useState(false);

  const handleRequestOtp = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      Alert.alert("Invalid Phone", "Please enter a valid phone number.");
      return;
    }

    setLoading(true);
    console.log(`[DEBUG] handleRequestOtp called with phone: ${phoneNumber}`);
    try {
      await apiClient.post('/auth/request-otp', {
        phone: phoneNumber,
      });
      setStage("OTP");
    } catch (error: any) {
      console.error(`[DEBUG] handleRequestOtp error:`, error);
      Alert.alert("Error", error.response?.data?.message || error.message || "Failed to request OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpCode || otpCode.length < 6) {
      Alert.alert("Invalid OTP", "Please enter the 6-digit code.");
      return;
    }

    setLoading(true);
    try {
      const res = await apiClient.post('/auth/verify-otp', {
        phone: phoneNumber,
        otp: otpCode,
      });

      const token = res.data.data.token;
      const userData = res.data.data.user;

      await SecureStore.setItemAsync("authToken", token);
      setUser(userData);

      router.replace("/(tabs)");
    } catch (error: any) {
      console.error(`[DEBUG] handleVerifyOtp error:`, error);
      Alert.alert("Error", error.response?.data?.message || error.message || "Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.title}>Buzz-Off</Text>
          <Text style={styles.subtitle}>Multi-Hive Management System</Text>
        </View>

        {/* Card Section */}
        <View style={styles.card}>
          {stage === "PHONE" ? (
            <Animated.View entering={FadeIn} exiting={FadeOut} key="phone-input">
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                placeholder="+1 234 567 890"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                style={styles.input}
                placeholderTextColor="#999"
              />
              <TouchableOpacity
                onPress={handleRequestOtp}
                disabled={loading}
                style={styles.primaryButton}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Request OTP</Text>
                )}
              </TouchableOpacity>
            </Animated.View>
          ) : (
            <Animated.View entering={FadeIn} exiting={FadeOut} key="otp-input">
              <Text style={styles.label}>Verification Code</Text>
              <TextInput
                placeholder="Enter 6-digit code"
                value={otpCode}
                onChangeText={setOtpCode}
                keyboardType="number-pad"
                maxLength={6}
                style={[styles.input, styles.otpInput]}
                placeholderTextColor="#999"
              />
              <TouchableOpacity
                onPress={handleVerifyOtp}
                disabled={loading}
                style={[styles.primaryButton, { backgroundColor: '#34C759' }]}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Verify & Login</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setStage("PHONE")}
                style={styles.secondaryButton}
              >
                <Text style={styles.secondaryButtonText}>Back to Phone Number</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_LIGHT,
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    paddingTop: 80,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: TEXT_PRIMARY,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    fontWeight: '400',
  },
  card: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: TEXT_PRIMARY,
    marginBottom: 8,
  },
  input: {
    height: 52,
    borderRadius: 12,
    backgroundColor: INPUT_BG,
    paddingHorizontal: 16,
    fontSize: 16,
    color: TEXT_PRIMARY,
    marginBottom: 20,
  },
  otpInput: {
    textAlign: 'center',
    letterSpacing: 4,
    fontSize: 20,
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: PRIMARY_GREEN,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
});
