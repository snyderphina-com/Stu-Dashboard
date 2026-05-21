import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export async function createUserProfile(user, extraData = {}) {
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    email: user.email,
    name: extraData.name || "",
    photoURL: user.photoURL || "",
    createdAt: new Date().toISOString(),
  });
}