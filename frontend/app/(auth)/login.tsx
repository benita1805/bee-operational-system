import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const API = "http://192.168.1.9:3000"; // 🔴 CHANGE IF YOUR IP IS DIFFERENT

export default function Login() {
  const router = useRouter(); // ✅ MUST be inside component

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [serverOtp, setServerOtp] = useState<string | null>(null);
  const [stage, setStage] = useState<"PHONE" | "OTP">("PHONE");

  const requestOtp = async () => {
    try {
      const res = await fetch(`${API}/auth/request-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();
      console.log("OTP RESPONSE:", data);

      if (data.otp) {
        setServerOtp(data.otp);
        setStage("OTP");
      } else {
        Alert.alert("OTP not received from server");
      }
    } catch (err) {
      console.log("REQUEST OTP ERROR:", err);
      Alert.alert("Failed to request OTP");
    }
  };

  const verifyOtp = async () => {
    try {
      const res = await fetch(`${API}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp }),
      });

      const data = await res.json();
      console.log("VERIFY RESPONSE:", data);

      if (data.success) {
        router.replace("/(tabs)"); // ✅ THIS loads dashboard
      } else {
        Alert.alert("Incorrect OTP");
      }
    } catch (err) {
      console.log("VERIFY ERROR:", err);
      Alert.alert("Verification failed");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Phone Login</Text>

      {stage === "PHONE" && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter phone number"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />

          <TouchableOpacity style={styles.button} onPress={requestOtp}>
            <Text style={styles.buttonText}>Request OTP</Text>
          </TouchableOpacity>
        </>
      )}

      {stage === "OTP" && (
        <>
          {/* Demo OTP display */}
          <Text style={styles.devOtp}>OTP: {serverOtp}</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter OTP"
            keyboardType="number-pad"
            value={otp}
            onChangeText={setOtp}
          />

          <TouchableOpacity style={styles.button} onPress={verifyOtp}>
            <Text style={styles.buttonText}>Verify OTP</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#F5F6F8",
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#2563EB",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "800",
  },
  devOtp: {
    textAlign: "center",
    fontWeight: "800",
    marginBottom: 10,
    color: "#16A34A",
  },
});
