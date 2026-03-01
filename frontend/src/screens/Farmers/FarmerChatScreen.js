import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import AppHeader from "../../components/AppHeader";
import { colors } from "../../theme/colors";

export default function FarmerChatScreen() {
    const params = useLocalSearchParams();
    const farmer = params?.farmer ? JSON.parse(params.farmer) : null;
    const router = useRouter();
    const [msg, setMsg] = useState("");
    const [messages, setMessages] = useState([
        { id: "1", from: "farmer", text: "Hello, can we discuss hive placement?" },
    ]);

    useEffect(() => {
        if (!farmer?.id) return;
        // Firebase listenMessages removed. Using local state.
    }, [farmer?.id]);

    const send = async () => {
        if (!msg.trim()) return;

        const newMessage = {
            id: Date.now().toString(),
            text: msg,
            from: "me",
            createdAt: Date.now(),
        };

        setMessages([newMessage, ...messages]);
        setMsg("");
    };
    return (
        <View style={{ flex: 1, backgroundColor: colors.lightGray }}>
            <AppHeader title={`Chat: ${farmer?.name || "Farmer"}`} subtitle={farmer?.cropType} />

            <View style={{ flex: 1, padding: 16 }}>
                <FlatList
                    data={messages}
                    inverted
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => {
                        const isMe = item.from === "me";
                        return (
                            <View style={[styles.bubble, isMe ? styles.me : styles.them]}>
                                <Text style={{ fontWeight: "700" }}>{item.text}</Text>
                            </View>
                        );
                    }}
                />

                <View style={styles.row}>
                    <TextInput
                        value={msg}
                        onChangeText={setMsg}
                        placeholder="Type message..."
                        style={styles.input}
                    />
                    <TouchableOpacity style={styles.sendBtn} onPress={send}>
                        <Text style={{ fontWeight: "900" }}>Send</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.back} onPress={() => router.back()}>
                    <Text style={{ fontWeight: "900" }}>Back</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    bubble: { padding: 12, borderRadius: 14, marginBottom: 10, maxWidth: "80%" },
    me: { alignSelf: "flex-end", backgroundColor: colors.amber },
    them: { alignSelf: "flex-start", backgroundColor: colors.white },
    row: { flexDirection: "row", gap: 10 },
    input: { flex: 1, backgroundColor: colors.white, borderRadius: 14, padding: 12 },
    sendBtn: { backgroundColor: colors.amber, padding: 12, borderRadius: 14 },
    back: {
        marginTop: 10,
        alignSelf: "center",
        padding: 10,
        borderRadius: 14,
        backgroundColor: colors.white,
    },
});
