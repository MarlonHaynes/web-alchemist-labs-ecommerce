import { useEffect, useState } from "react";
import { getProducts } from "../services/productService";
import ProductGrid from "../components/ProductGrid";
import SectionHeading from "../components/SectionHeading";

export default function ProductsPage() {
  const [productList, setProductList] = useState([]);

  useEffect(() => {
    async function loadProducts() {
      const data = await getProducts();
      setProductList(data);
    }

    loadProducts();
  }, []);

  return (
    <div className="products-page">
      <section className="content-section">
        <SectionHeading
          eyebrow="Storefront"
          title="Browse the full collection"
          description="All products below currently come from the local product data system created in this phase."
        />

        <ProductGrid products={productList} />
      </section>
    </div>
  );
}