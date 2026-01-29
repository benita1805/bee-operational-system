import {
    addDoc,
    collection,
    onSnapshot,
    orderBy,
    query,
} from "firebase/firestore";
import { db } from "./firebase";

export function listenMessages(farmerId, callback) {
    const q = query(
        collection(db, "chats", farmerId, "messages"),
        orderBy("createdAt", "desc")
    );

    return onSnapshot(q, (snapshot) => {
        callback(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
}

export async function sendMessage(farmerId, msg) {
    await addDoc(collection(db, "chats", farmerId, "messages"), msg);
}
