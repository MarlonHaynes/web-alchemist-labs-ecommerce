export default function ProductFilters({
  searchTerm,
  selectedCategory,
  stockFilter,
  sortOption,
  categories,
  onSearchChange,
  onCategoryChange,
  onStockFilterChange,
  onSortChange,
  onClearFilters,
}) {
  return (
    <div className="filters-panel">
      <div className="filter-group">
        <label htmlFor="search">Search</label>
        <input
          id="search"
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="filter-group">
        <label htmlFor="category">Category</label>
        <select
          id="category"
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="stock">Stock Status</label>
        <select
          id="stock"
          value={stockFilter}
          onChange={(e) => onStockFilterChange(e.target.value)}
        >
          <option value="all">All Products</option>
          <option value="in-stock">In Stock Only</option>
          <option value="out-of-stock">Out of Stock Only</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="sort">Sort By</label>
        <select
          id="sort"
          value={sortOption}
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="newest">Newest</option>
          <option value="price-low-high">Price: Low to High</option>
          <option value="price-high-low">Price: High to Low</option>
        </select>
      </div>

      <button type="button" className="btn btn-secondary" onClick={onClearFilters}>
        Clear Filters
      </button>
    </div>
  );
}