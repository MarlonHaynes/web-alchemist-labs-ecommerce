import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "../firebase/config";

const ordersCollectionRef = collection(db, "orders");

export async function createOrder(orderData) {
  const docRef = await addDoc(ordersCollectionRef, {
    ...orderData,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}

export async function getOrders() {
  const snapshot = await getDocs(ordersCollectionRef);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export async function getOrderByStripeSessionId(stripeSessionId) {
  const q = query(
    ordersCollectionRef,
    where("stripeSessionId", "==", stripeSessionId)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return null;
  }

  const existingDoc = snapshot.docs[0];

  return {
    id: existingDoc.id,
    ...existingDoc.data(),
  };
}