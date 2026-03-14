import { useEffect, useMemo, useState } from "react";
import { getAllCategories, getProducts } from "../services/productService";
import ProductGrid from "../components/ProductGrid";
import PageHero from "../components/PageHero";
import EmptyState from "../components/EmptyState";
import ProductFilters from "../components/ProductFilters";

export default function ProductsPage() {
  const [productList, setProductList] = useState([]);
  const [categories, setCategories] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [sortOption, setSortOption] = useState("newest");

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

  const filteredProducts = useMemo(() => {
    let results = [...productList];

    if (searchTerm.trim()) {
      const normalizedSearch = searchTerm.toLowerCase().trim();

      results = results.filter(
        (product) =>
          product.title.toLowerCase().includes(normalizedSearch) ||
          product.description.toLowerCase().includes(normalizedSearch) ||
          product.category.toLowerCase().includes(normalizedSearch)
      );
    }

    if (selectedCategory !== "all") {
      results = results.filter((product) => product.category === selectedCategory);
    }

    if (stockFilter === "in-stock") {
      results = results.filter((product) => product.stock > 0);
    }

    if (stockFilter === "out-of-stock") {
      results = results.filter((product) => product.stock === 0);
    }

    if (sortOption === "price-low-high") {
      results.sort((a, b) => a.price - b.price);
    }

    if (sortOption === "price-high-low") {
      results.sort((a, b) => b.price - a.price);
    }

    if (sortOption === "newest") {
      results.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    return results;
  }, [productList, searchTerm, selectedCategory, stockFilter, sortOption]);

  const inStockCount = useMemo(() => {
    return productList.filter((product) => product.stock > 0).length;
  }, [productList]);

  const outOfStockCount = useMemo(() => {
    return productList.filter((product) => product.stock === 0).length;
  }, [productList]);

  function handleClearFilters() {
    setSearchTerm("");
    setSelectedCategory("all");
    setStockFilter("all");
    setSortOption("newest");
  }

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
          <span className="summary-label">Filtered Results</span>
          <strong className="summary-value">{filteredProducts.length}</strong>
        </div>
      </section>

      <section className="catalog-layout">
        <aside className="catalog-sidebar">
          <div className="sidebar-panel">
            <h3>Categories</h3>

            <div className="category-list">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={
                    selectedCategory === category
                      ? "category-pill active-category-pill"
                      : "category-pill"
                  }
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}

              <button
                type="button"
                className={
                  selectedCategory === "all"
                    ? "category-pill active-category-pill"
                    : "category-pill"
                }
                onClick={() => setSelectedCategory("all")}
              >
                all
              </button>
            </div>
          </div>

          <ProductFilters
            searchTerm={searchTerm}
            selectedCategory={selectedCategory}
            stockFilter={stockFilter}
            sortOption={sortOption}
            categories={categories}
            onSearchChange={setSearchTerm}
            onCategoryChange={setSelectedCategory}
            onStockFilterChange={setStockFilter}
            onSortChange={setSortOption}
            onClearFilters={handleClearFilters}
          />
        </aside>

        <div className="catalog-content">
          <div className="catalog-toolbar">
            <p className="catalog-results-text">
              Showing <strong>{filteredProducts.length}</strong> product
              {filteredProducts.length === 1 ? "" : "s"}
            </p>
          </div>

          {filteredProducts.length > 0 ? (
            <ProductGrid products={filteredProducts} />
          ) : (
            <EmptyState
              title="No matching products"
              description="Try changing your search term, filters, or sorting options."
            />
          )}
        </div>
      </section>
    </div>
  );
}