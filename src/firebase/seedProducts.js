import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "./config";
import { products } from "../data/products";

export async function seedProductsToFirestore() {
  const productsCollectionRef = collection(db, "products");
  const existingSnapshot = await getDocs(productsCollectionRef);

  if (!existingSnapshot.empty) {
    return {
      seeded: false,
      message: "Products collection already contains data.",
    };
  }

  for (const product of products) {
    await setDoc(doc(db, "products", product.id), {
      ...product,
    });
  }

  return {
    seeded: true,
    message: "Products seeded successfully.",
  };
}