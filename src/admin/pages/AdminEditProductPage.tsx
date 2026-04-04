import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import LoadingState from "../../components/LoadingState";
import AdminProductForm from "../components/AdminProductForm";
import { getProductById, updateProduct } from "../../services/productService";

export default function AdminEditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      setIsLoading(true);
      const data = await getProductById(id);
      setProduct(data);
      setIsLoading(false);
    }

    loadProduct();
  }, [id]);

  async function handleUpdateProduct(productData) {
    const { id: productId, ...updateData } = productData;
    await updateProduct(id, updateData);
    navigate("/admin/products");
  }

  if (isLoading) {
    return <LoadingState message="Loading product..." />;
  }

  if (!product) {
    return <Navigate to="/admin/products" replace />;
  }

  return (
    <section className="page-section">
      <h1>Edit Product</h1>
      <p>Update an existing product in the Firestore catalog.</p>

      <div style={{ marginTop: "24px" }}>
        <AdminProductForm
          initialValues={product}
          onSubmit={handleUpdateProduct}
          submitLabel="Save Changes"
          isEditMode
        />
      </div>
    </section>
  );
}