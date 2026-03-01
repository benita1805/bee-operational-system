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

import AppHeader from "../../src/components/AppHeader";
import Card from "../../src/components/Card";
import SearchBar from "../../src/components/SearchBar";

import { manualSections } from "../../src/data/manualContent";
import { loadData, saveData, StorageKeys } from "../../src/services/storage";
import { colors } from "../../src/theme/colors";

/* ✅ Enable animation on Android */
if (
    Platform.OS === "android" &&
    UIManager.setLayoutAnimationEnabledExperimental
) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

/* ✅ Manual section type */
type ManualSection = {
    id: string;
    title: string;
    content: string;
};

import { ScreenContainer } from "../../src/components/layout/ScreenContainer";

export default function ManualScreen() {
    const [search, setSearch] = useState<string>("");
    const [bookmarks, setBookmarks] = useState<string[]>([]);
    const [openId, setOpenId] = useState<string | null>(null);

    useEffect(() => {
        const init = async () => {
            const saved = await loadData<string[]>(
                StorageKeys.MANUAL_BOOKMARKS,
                []
            );
            setBookmarks(saved);
        };

        init();
    }, []);

    const toggleBookmark = async (id: string) => {
        const updated = bookmarks.includes(id)
            ? bookmarks.filter((x) => x !== id)
            : [id, ...bookmarks];

        setBookmarks(updated);
        await saveData(StorageKeys.MANUAL_BOOKMARKS, updated);
    };

    const toggleOpen = (id: string) => {
        LayoutAnimation.configureNext(
            LayoutAnimation.Presets.easeInEaseOut
        );
        setOpenId((prev) => (prev === id ? null : id));
    };

    const filtered = useMemo<ManualSection[]>(() => {
        if (!search.trim()) return manualSections;

        const s = search.toLowerCase();

        return manualSections.filter(
            (m) =>
                m.title.toLowerCase().includes(s) ||
                m.content.toLowerCase().includes(s)
        );
    }, [search]);

    return (
        <View style={{ flex: 1 }}>
            <AppHeader
                title="Manual"
                subtitle="Buzz-Off device & beekeeping guide"
            />

            <ScreenContainer>

                <SearchBar
                    value={search}
                    onChangeText={setSearch}
                    placeholder="Search manual content..."
                />

                <FlatList
                    data={filtered}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{
                        padding: 16,
                        paddingBottom: 40,
                    }}
                    renderItem={({ item }) => {
                        const marked = bookmarks.includes(item.id);
                        const expanded = openId === item.id;

                        return (
                            <Card style={styles.card}>
                                {/* HEADER */}
                                <TouchableOpacity
                                    activeOpacity={0.85}
                                    onPress={() => toggleOpen(item.id)}
                                >
                                    <View style={styles.row}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.title}>
                                                {item.title}
                                            </Text>

                                            {!expanded && (
                                                <Text
                                                    style={styles.preview}
                                                    numberOfLines={2}
                                                >
                                                    {item.content.replace(/\n/g, " ")}
                                                </Text>
                                            )}
                                        </View>

                                        {/* Bookmark */}
                                        <TouchableOpacity
                                            onPress={() =>
                                                toggleBookmark(item.id)
                                            }
                                            hitSlop={12}
                                            style={styles.bookmarkBtn}
                                        >
                                            <Text
                                                style={[
                                                    styles.bookmark,
                                                    marked && {
                                                        color: colors.amberDark,
                                                    },
                                                ]}
                                            >
                                                {marked ? "★" : "☆"}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>

                                    <Text style={styles.chevron}>
                                        {expanded ? "⌃" : "⌄"}
                                    </Text>
                                </TouchableOpacity>

                                {/* BODY */}
                                {expanded && (
                                    <View style={styles.body}>
                                        <Text style={styles.content}>
                                            {item.content}
                                        </Text>
                                    </View>
                                )}
                            </Card>
                        );
                    }}
                />
            </ScreenContainer>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        marginBottom: 12,
    },

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

    bookmark: {
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
