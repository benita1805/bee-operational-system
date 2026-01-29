import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

export async function addFarmer(farmer) {
    const ref = await addDoc(collection(db, "farmers"), farmer);
    return ref.id;
}

export async function fetchFarmers() {
    const snapshot = await getDocs(collection(db, "farmers"));
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}
