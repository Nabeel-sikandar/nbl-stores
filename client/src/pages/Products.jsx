// Products Page — Search, Price Filter, Sort, Category Filter, Spinner
import { useState, useEffect } from "react";
import ProductsNavbar from "../components/ProductsNavbar";
import ProductCard from "../components/ProductCard";
import Spinner from "../components/Spinner";
import Footer from "../components/Footer";
import { useTheme } from "../context/ThemeContext";
import API from "../api/axios";
import BackToTop from "../components/BackToTop";
import "./Products.css";

const categories = ["All", "Men", "Women", "Kids"];

const Products = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [maxPrice, setMaxPrice] = useState(50000);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { darkMode } = useTheme();

  // Backend se products fetch karo
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get("/products");
        setProducts(res.data.products);

        // Max price find karo
        if (res.data.products.length > 0) {
          const highest = Math.max(...res.data.products.map((p) => p.price));
          setMaxPrice(highest);
          setPriceRange([0, highest]);
        }
      } catch (error) {
        console.error("Fetch Products Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Category filter
  const filteredByCategory =
    activeCategory === "All"
      ? products
      : products.filter((product) => product.category === activeCategory);

  // Search filter
  const filteredBySearch = filteredByCategory.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Price range filter
  const filteredByPrice = filteredBySearch.filter(
    (product) => product.price >= priceRange[0] && product.price <= priceRange[1]
  );

  // Sort
  const sortedProducts = [...filteredByPrice].sort((a, b) => {
    if (sortBy === "low-to-high") return a.price - b.price;
    if (sortBy === "high-to-low") return b.price - a.price;
    if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
    return 0;
  });

  // Clear all filters
  const clearFilters = () => {
    setActiveCategory("All");
    setSortBy("default");
    setSearchQuery("");
    setPriceRange([0, maxPrice]);
  };

  const hasActiveFilters = activeCategory !== "All" || sortBy !== "default" || searchQuery !== "" || priceRange[1] < maxPrice || priceRange[0] > 0;

  return (
    <div className={`products-page ${darkMode ? "products-dark" : ""}`}>
      <ProductsNavbar />

      <div className="products-content">
        <h1 className="products-heading font-[Playfair_Display]">Our Collection</h1>
        <p className="products-subheading font-[Inter]">
          Explore our handpicked premium fashion pieces
        </p>

        {/* Search Bar */}
        <div className="search-bar-container">
          <div className="search-bar">
            <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="search-input font-[Inter]"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="search-clear">✕</button>
            )}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="category-tabs">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`category-tab font-[Inter] ${activeCategory === category ? "active-tab" : ""}`}
            >
              {category}
            </button>
          ))}
        </div>

       {/* Filter Bar — Sort + Price Range */}
<div className="filter-bar">
  <div className="filter-left">
    <span className="sort-label font-[Inter]">{sortedProducts.length} Products</span>
    {hasActiveFilters && (
      <button onClick={clearFilters} className="clear-filters-btn font-[Inter]">Clear All</button>
    )}
  </div>

  <div className="filter-right">
    {/* Price Range — Input Boxes */}
    <div className="price-filter">
      <span className="price-label font-[Inter]">Price:</span>
      <div className="price-inputs">
        <input
          type="number"
          value={priceRange[0]}
          onChange={(e) => {
            const val = parseInt(e.target.value) || 0;
            if (val < priceRange[1]) setPriceRange([val, priceRange[1]]);
          }}
          placeholder="Min"
          className="price-input font-[Inter]"
          min="0"
        />
        <span className="price-dash">—</span>
        <input
          type="number"
          value={priceRange[1]}
          onChange={(e) => {
            const val = parseInt(e.target.value) || 0;
            if (val > priceRange[0]) setPriceRange([priceRange[0], val]);
          }}
          placeholder="Max"
          className="price-input font-[Inter]"
          min="0"
        />
      </div>
    </div>

    {/* Sort */}
    <select
      value={sortBy}
      onChange={(e) => setSortBy(e.target.value)}
      className="sort-select font-[Inter]"
    >
      <option value="default">Sort: Default</option>
      <option value="low-to-high">Price: Low to High</option>
      <option value="high-to-low">Price: High to Low</option>
      <option value="newest">Newest First</option>
    </select>
  </div>
</div>
        {/* Products Grid */}
        {loading ? (
          <Spinner />
        ) : (
          <div className="products-grid">
            {sortedProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {!loading && sortedProducts.length === 0 && (
          <div className="no-products-container">
            <p className="no-products font-[Inter]">No products found.</p>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="clear-filters-btn font-[Inter]" style={{ marginTop: "12px" }}>
                Clear All Filters
              </button>
            )}
          </div>
        )}
      </div>

      <Footer />
      <BackToTop />
    </div>
  );
};

export default Products;