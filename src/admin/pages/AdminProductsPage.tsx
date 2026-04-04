import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LoadingState from "../../components/LoadingState";
import { deleteProduct, getProducts } from "../../services/productService";
import { formatCurrency } from "../../utils/formatCurrency";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  async function loadProducts() {
    setIsLoading(true);
    const data = await getProducts();
    setProducts(data);
    setIsLoading(false);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function handleDelete(productId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    await deleteProduct(productId);
    await loadProducts();
  }

  if (isLoading) {
    return <LoadingState message="Loading admin products..." />;
  }

  return (
    <div className="admin-products-page">
      <section className="page-hero">
        <span className="eyebrow">Product Management</span>
        <h1>Manage Catalog Products</h1>
        <p>
          Add, edit, and remove products from the Firestore product catalog.
        </p>
      </section>

      <div className="admin-page-actions">
        <Link to="/admin/products/new" className="btn btn-primary">
          Add Product
        </Link>
      </div>

      <section className="admin-table-card">
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>ID</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="admin-product-cell">
                      <img src={product.image} alt={product.title} />
                      <div>
                        <strong>{product.title}</strong>
                        <p>{product.description}</p>
                      </div>
                    </div>
                  </td>
                  <td>{product.category}</td>
                  <td>{formatCurrency(product.price)}</td>
                  <td>{product.stock}</td>
                  <td>{product.id}</td>
                  <td>
                    <div className="admin-table-actions">
                      <Link
                        to={`/admin/products/edit/${product.id}`}
                        className="btn btn-secondary"
                      >
                        Edit
                      </Link>

                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => handleDelete(product.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}