import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";

function getConfiguredAdminEmails() {
  const emails = process.env.NEXT_PUBLIC_ADMIN_EMAILS;

  const fallbackEmails = ["marlon.haynes26@outlook.com"];

  if (!emails) {
    return fallbackEmails;
  }

  const configured = emails
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  return configured.length ? configured : fallbackEmails;
}

export async function createUserProfile(user) {
  const userRef = doc(db, "users", user.uid);
  const snapshot = await getDoc(userRef);

  if (snapshot.exists()) {
    return snapshot.data();
  }

  const adminEmails = getConfiguredAdminEmails();
  const email = user.email?.toLowerCase?.() || "";
  const role = email && adminEmails.includes(email) ? "admin" : "customer";

  const profile = {
    uid: user.uid,
    email: user.email,
    role,
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