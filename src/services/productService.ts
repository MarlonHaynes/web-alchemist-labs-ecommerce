import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { products as localProducts } from "../data/products";

const productsCollectionRef = collection(db, "products");

export async function getProducts() {
  try {
    const q = query(productsCollectionRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return localProducts;
    }

    return snapshot.docs.map((docItem) => ({
      id: docItem.id,
      ...docItem.data(),
    }));
  } catch (error) {
    return localProducts;
  }
}

export async function getProductById(productId) {
  try {
    const productDocRef = doc(db, "products", productId);
    const snapshot = await getDoc(productDocRef);

    if (snapshot.exists()) {
      return {
        id: snapshot.id,
        ...snapshot.data(),
      };
    }
  } catch (error) {
  }

  const fallbackProduct = localProducts.find((item) => item.id === productId);
  return fallbackProduct || null;
}

export async function createProduct(productData) {
  const productRef = doc(db, "products", productData.id);

  await setDoc(productRef, {
    ...productData,
    createdAt: serverTimestamp(),
  });
}

export async function updateProduct(productId, productData) {
  const productRef = doc(db, "products", productId);

  await updateDoc(productRef, {
    ...productData,
  });
}

export async function deleteProduct(productId) {
  const productRef = doc(db, "products", productId);
  await deleteDoc(productRef);
}

export async function getFeaturedProducts(limit = 4) {
  const allProducts = await getProducts();
  return allProducts.slice(0, limit);
}

export async function getProductsByCategory(category) {
  const allProducts = await getProducts();
  return allProducts.filter((item) => item.category === category);
}

export async function getAllCategories() {
  const allProducts = await getProducts();
  return [...new Set(allProducts.map((item) => item.category))];
}

export async function validateCartStock(cartItems) {
  const allProducts = await getProducts();

  const invalidItems = cartItems.filter((cartItem) => {
    const product = allProducts.find((item) => item.id === cartItem.id);

    if (!product) {
      return true;
    }

    if (product.stock === 0) {
      return true;
    }

    if (cartItem.quantity > product.stock) {
      return true;
    }

    return false;
  });

  return {
    isValid: invalidItems.length === 0,
    invalidItems,
  };
}

export async function decrementProductStockFromOrder(orderItems) {
  for (const orderItem of orderItems) {
    const productRef = doc(db, "products", orderItem.id);
    const productSnapshot = await getDoc(productRef);

    if (!productSnapshot.exists()) {
      throw new Error(`Product not found: ${orderItem.id}`);
    }

    const productData = productSnapshot.data();
    const currentStock = Number(productData.stock ?? 0);
    const quantityOrdered = Number(orderItem.quantity ?? 0);

    if (currentStock < quantityOrdered) {
      throw new Error(
        `Insufficient stock for ${productData.title || orderItem.id}`
      );
    }

    await updateDoc(productRef, {
      stock: currentStock - quantityOrdered,
    });
  }
}

export async function getLowStockProducts(threshold = 5) {
  const allProducts = await getProducts();
  return allProducts.filter((product) => (product.stock ?? 0) <= threshold);
}