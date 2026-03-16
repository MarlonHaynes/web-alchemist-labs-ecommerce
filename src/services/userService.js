import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";

export async function createUserProfile(user) {
  const userRef = doc(db, "users", user.uid);
  const snapshot = await getDoc(userRef);

  if (snapshot.exists()) {
    return snapshot.data();
  }

  const profile = {
    uid: user.uid,
    email: user.email,
    role: "customer",
    createdAt: serverTimestamp(),
  };

  await setDoc(userRef, profile);
  return profile;
}

export async function getUserProfile(uid) {
  const userRef = doc(db, "users", uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
}