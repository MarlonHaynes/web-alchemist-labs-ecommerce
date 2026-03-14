import { useEffect, useMemo, useState } from "react";
import { getAllCategories, getProducts } from "../services/productService";
import ProductGrid from "../components/ProductGrid";
import PageHero from "../components/PageHero";
import EmptyState from "../components/EmptyState";

export default function ProductsPage() {
  const [productList, setProductList] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function loadProductsPageData() {
      const [productsData, categoriesData] = await Promise.all([
        getProducts(),
        getAllCategories(),
      ]);

      setProductList(productsData);
      setCategories(categoriesData);
    }

    loadProductsPageData();
  }, []);

  const inStockCount = useMemo(() => {
    return productList.filter((product) => product.stock > 0).length;
  }, [productList]);

  const outOfStockCount = useMemo(() => {
    return productList.filter((product) => product.stock === 0).length;
  }, [productList]);

  return (
    <div className="products-page">
      <PageHero
        eyebrow="Storefront"
        title="Explore the full Web Alchemist Labs collection"
        description="Browse premium apparel, accessories, and essentials in a production-style ecommerce storefront."
      />

      <section className="store-summary">
        <div className="summary-card">
          <span className="summary-label">Total Products</span>
          <strong className="summary-value">{productList.length}</strong>
        </div>

        <div className="summary-card">
          <span className="summary-label">In Stock</span>
          <strong className="summary-value">{inStockCount}</strong>
        </div>

        <div className="summary-card">
          <span className="summary-label">Out of Stock</span>
          <strong className="summary-value">{outOfStockCount}</strong>
        </div>

        <div className="summary-card">
          <span className="summary-label">Categories</span>
          <strong className="summary-value">{categories.length}</strong>
        </div>
      </section>

      <section className="catalog-layout">
        <aside className="catalog-sidebar">
          <div className="sidebar-panel">
            <h3>Categories</h3>

            <div className="category-list">
              {categories.map((category) => (
                <div key={category} className="category-pill">
                  {category}
                </div>
              ))}
            </div>
          </div>

          <div className="sidebar-panel">
            <h3>Catalog Status</h3>
            <p>
              Search, filtering, and sorting controls will be added in the next
              phases using this storefront structure.
            </p>
          </div>
        </aside>

        <div className="catalog-content">
          <div className="catalog-toolbar">
            <p className="catalog-results-text">
              Showing <strong>{productList.length}</strong> products
            </p>
          </div>

          {productList.length > 0 ? (
            <ProductGrid products={productList} />
          ) : (
            <EmptyState
              title="No products available"
              description="No products were found in the current storefront data source."
            />
          )}
        </div>
      </section>
    </div>
  );
}