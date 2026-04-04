import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
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
  const q = query(ordersCollectionRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((docItem) => ({
    id: docItem.id,
    ...docItem.data(),
  }));
}

export async function getRecentOrders(limitCount = 5) {
  const q = query(
    ordersCollectionRef,
    orderBy("createdAt", "desc"),
    limit(limitCount)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((docItem) => ({
    id: docItem.id,
    ...docItem.data(),
  }));
}

export async function getOrdersByUserId(userId) {
  const q = query(
    ordersCollectionRef,
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((docItem) => ({
    id: docItem.id,
    ...docItem.data(),
  }));
}

export async function getOrderById(orderId) {
  const orderDocRef = doc(db, "orders", orderId);
  const snapshot = await getDoc(orderDocRef);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
}

export async function updateOrderStatus(orderId, orderStatus) {
  const orderRef = doc(db, "orders", orderId);

  await updateDoc(orderRef, {
    orderStatus,
  });
}

export async function updateOrderAutomationStatus(orderId, automation) {
  const orderRef = doc(db, "orders", orderId);

  await updateDoc(orderRef, {
    automation,
  });
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