import { useNavigate } from "react-router-dom";
import AdminProductForm from "../components/AdminProductForm";
import { createProduct } from "../../services/productService";

export default function AdminAddProductPage() {
  const navigate = useNavigate();

  async function handleCreateProduct(productData) {
    await createProduct(productData);
    navigate("/admin/products");
  }

  return (
    <section className="page-section">
      <h1>Add Product</h1>
      <p>Create a new catalog product in Firestore.</p>

      <div style={{ marginTop: "24px" }}>
        <AdminProductForm
          onSubmit={handleCreateProduct}
          submitLabel="Create Product"
        />
      </div>
    </section>
  );
}