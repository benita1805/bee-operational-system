import { useEffect, useMemo, useState } from "react";
import {
    FlatList,
    LayoutAnimation,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    UIManager,
    View,
} from "react-native";

import AppHeader from "../../components/AppHeader";
import Card from "../../components/Card";
import SearchBar from "../../components/SearchBar";

import { manualSections } from "../../data/manualContent";
import { loadData, saveData, StorageKeys } from "../../services/storage";
import { colors } from "../../theme/colors";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function ManualScreen() {
    const [search, setSearch] = useState("");
    const [bookmarks, setBookmarks] = useState([]);
    const [openId, setOpenId] = useState(null); // ✅ accordion open section id

    useEffect(() => {
        const init = async () => {
            const b = await loadData(StorageKeys.MANUAL_BOOKMARKS, []);
            setBookmarks(b);
        };
        init();
    }, []);

    const toggleBookmark = async (id) => {
        let updated;
        if (bookmarks.includes(id)) updated = bookmarks.filter((x) => x !== id);
        else updated = [id, ...bookmarks];

        setBookmarks(updated);
        await saveData(StorageKeys.MANUAL_BOOKMARKS, updated);
    };

    const toggleOpen = (id) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setOpenId((prev) => (prev === id ? null : id));
    };

    const filtered = useMemo(() => {
        if (!search.trim()) return manualSections;
        const s = search.toLowerCase();
        return manualSections.filter(
            (m) => m.title.toLowerCase().includes(s) || m.content.toLowerCase().includes(s)
        );
    }, [search]);

    return (
        <View style={{ flex: 1, backgroundColor: colors.lightGray }}>
            <AppHeader title="Manual" subtitle="Buzz-Off device + beekeeping guide" />

            <SearchBar
                value={search}
                onChangeText={setSearch}
                placeholder="Search manual content..."
            />

            <FlatList
                data={filtered}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
                renderItem={({ item }) => {
                    const marked = bookmarks.includes(item.id);
                    const expanded = openId === item.id;

                    return (
                        <Card style={styles.card}>
                            {/* HEADER ROW */}
                            <TouchableOpacity onPress={() => toggleOpen(item.id)} activeOpacity={0.85}>
                                <View style={styles.row}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.title}>{item.title}</Text>

                                        {/* collapsed preview */}
                                        {!expanded && (
                                            <Text style={styles.preview} numberOfLines={2}>
                                                {item.content.replace(/\n/g, " ")}
                                            </Text>
                                        )}
                                    </View>

                                    {/* bookmark */}
                                    <TouchableOpacity
                                        onPress={() => toggleBookmark(item.id)}
                                        hitSlop={12}
                                        style={styles.bookmarkBtn}
                                    >
                                        <Text style={[styles.book, marked && { color: colors.amberDark }]}>
                                            {marked ? "★" : "☆"}
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                                {/* open/close arrow */}
                                <Text style={styles.chevron}>{expanded ? "⌃" : "⌄"}</Text>
                            </TouchableOpacity>

                            {/* CONTENT */}
                            {expanded && (
                                <View style={styles.body}>
                                    <Text style={styles.content}>{item.content}</Text>
                                </View>
                            )}
                        </Card>
                    );
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    card: { marginBottom: 12 },

    row: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 10,
    },

    title: {
        fontSize: 16,
        fontWeight: "900",
        color: colors.black,
    },

    preview: {
        marginTop: 6,
        color: colors.gray,
        lineHeight: 18,
        fontSize: 13,
    },

    bookmarkBtn: {
        paddingLeft: 8,
        paddingTop: 2,
    },

    book: {
        fontSize: 22,
        fontWeight: "900",
        color: "#9CA3AF",
    },

    chevron: {
        marginTop: 8,
        color: "#9CA3AF",
        fontSize: 14,
        fontWeight: "900",
    },

    body: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: "#E6E8EC",
    },

    content: {
        color: colors.gray,
        lineHeight: 20,
        fontSize: 14,
    },
});
