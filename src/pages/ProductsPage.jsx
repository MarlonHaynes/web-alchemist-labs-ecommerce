import { useEffect, useMemo, useState } from "react";
import { getAllCategories, getProducts } from "../services/productService";
import ProductGrid from "../components/ProductGrid";
import PageHero from "../components/PageHero";
import EmptyState from "../components/EmptyState";
import ProductFilters from "../components/ProductFilters";

const PRODUCTS_PER_PAGE = 6;

export default function ProductsPage() {
  const [productList, setProductList] = useState([]);
  const [categories, setCategories] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [sortOption, setSortOption] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);

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

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, stockFilter, sortOption]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE)
  );

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentPage]);

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
    setCurrentPage(1);
  }

  function handlePreviousPage() {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  }

  function handleNextPage() {
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
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
              Showing <strong>{paginatedProducts.length}</strong> of{" "}
              <strong>{filteredProducts.length}</strong> product
              {filteredProducts.length === 1 ? "" : "s"}
            </p>
          </div>

          {filteredProducts.length > 0 ? (
            <>
              <ProductGrid products={paginatedProducts} />

              <div
                className="catalog-pagination"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "12px",
                  marginTop: "24px",
                  flexWrap: "wrap",
                }}
              >
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>

                <span className="checkout-item-meta">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </>
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