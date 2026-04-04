import { useState } from "react";
import { seedProductsToFirestore } from "../firebase/seedProducts";

export default function SeedProductsPage() {
  const [message, setMessage] = useState("");

  const handleSeedProducts = async () => {
    try {
      const result = await seedProductsToFirestore();
      console.log("Seed success:", result);
      setMessage(result?.message || "Products seeded successfully.");
    } catch (error) {
      console.error("SEED PRODUCTS ERROR:", error);
      setMessage(`Failed to seed products: ${error.message}`);
    }
  };

  return (
    <section className="page-section">
      <h1>Seed Firestore Products</h1>
      <p>
        Use this one-time utility to copy your local mock product data into the
        Firestore products collection.
      </p>

      <div className="success-actions">
        <button type="button" className="btn btn-primary" onClick={handleSeedProducts}>
          Seed Products
        </button>
      </div>

      {message ? <p style={{ marginTop: "16px" }}>{message}</p> : null}
    </section>
  );
}