import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import AppHeader from "../../components/AppHeader";
import { ScreenContainer } from "../../components/layout/ScreenContainer";
import { addFarmer } from "../../services/farmersApi";
import { colors } from "../../theme/colors";
import { isValidPhone, required } from "../../utils/validators";

export default function FarmerRegisterScreen() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [cropType, setCropType] = useState("");
    const [locationText, setLocationText] = useState("");
    const [areaAcres, setAreaAcres] = useState("");
    const [phone, setPhone] = useState("");
    const [whatsapp, setWhatsapp] = useState("");
    const [lat, setLat] = useState("");
    const [lon, setLon] = useState("");

    const submit = async () => {
        if (!required(name) || !required(cropType) || !required(locationText)) {
            Alert.alert("Validation error", "Name, Crop type and Location are required.");
            return;
        }

        if (!isValidPhone(phone)) {
            Alert.alert("Validation error", "Enter valid phone number.");
            return;
        }

        const newFarmer = {
            name,
            crops: [cropType],
            location: locationText,
            latitude: Number(lat || 0),
            longitude: Number(lon || 0),
            // Note: phone, whatsapp and areaAcres are not in the current backend schema for farmers
        };

        await addFarmer(newFarmer);

        Alert.alert("Success", "Farmer saved to cloud!");
        router.back();
    };

    return (
        <View style={{ flex: 1 }}>
            <AppHeader title="Register Farmer" subtitle="Add crop & field details" />
            <ScreenContainer>
                <ScrollView contentContainerStyle={{ paddingVertical: 16, paddingBottom: 32 }}>
                    <Field label="Farmer Name" value={name} onChangeText={setName} />
                    <Field label="Crop Type" value={cropType} onChangeText={setCropType} />
                    <Field label="Location (City/Area)" value={locationText} onChangeText={setLocationText} />
                    <Field label="Area (Acres)" value={areaAcres} onChangeText={setAreaAcres} keyboardType="numeric" />
                    <Field label="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
                    <Field label="WhatsApp (optional)" value={whatsapp} onChangeText={setWhatsapp} keyboardType="phone-pad" />
                    <Field label="Latitude (optional)" value={lat} onChangeText={setLat} keyboardType="numeric" />
                    <Field label="Longitude (optional)" value={lon} onChangeText={setLon} keyboardType="numeric" />

                    <TouchableOpacity style={styles.btn} onPress={submit}>
                        <Text style={styles.btnText}>Save Farmer</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.btnGhost} onPress={() => router.back()}>
                        <Text style={styles.btnText}>Cancel</Text>
                    </TouchableOpacity>
                </ScrollView>
            </ScreenContainer>
        </View>
    );
}

function Field({ label, ...props }) {
    return (
        <View style={{ marginBottom: 12 }}>
            <Text style={{ fontWeight: "900", marginBottom: 6 }}>{label}</Text>
            <TextInput
                {...props}
                style={{
                    backgroundColor: "white",
                    padding: 12,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: "#eee",
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    btn: {
        marginTop: 8,
        backgroundColor: colors.amber,
        padding: 14,
        borderRadius: 14,
        alignItems: "center",
    },
    btnGhost: {
        marginTop: 10,
        backgroundColor: colors.lightGray,
        padding: 14,
        borderRadius: 14,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ddd",
    },
    btnText: { fontWeight: "900" },
});
