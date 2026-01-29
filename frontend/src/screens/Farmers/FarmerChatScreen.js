import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import AppHeader from "../../components/AppHeader";
import { listenMessages, sendMessage } from "../../services/chatApi";
import { auth } from "../../services/firebase";
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
        const unsubscribe = listenMessages(farmer.id, setMessages);
        return unsubscribe;
    }, []);

    const send = async () => {
        if (!msg.trim()) return;

        await sendMessage(farmer.id, {
            text: msg,
            from: auth.currentUser?.uid,
            createdAt: Date.now(),
        });

        setMsg("");
    };
    const isMe = item.from === auth.currentUser?.uid;

    return (
        <View style={{ flex: 1, backgroundColor: colors.lightGray }}>
            <AppHeader title={`Chat: ${farmer?.name || "Farmer"}`} subtitle={farmer?.cropType} />

            <View style={{ flex: 1, padding: 16 }}>
                <FlatList
                    data={messages}
                    inverted
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={[styles.bubble, item.from === "me" ? styles.me : styles.them]}>
                            <Text style={{ fontWeight: "700" }}>{item.text}</Text>
                        </View>
                    )}
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

                <TouchableOpacity style={styles.back} onPress={() => routerack()}>
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
