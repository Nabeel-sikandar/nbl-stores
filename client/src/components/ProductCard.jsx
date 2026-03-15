// Product Card — with Quick View + Global Toast
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import { useToast } from "./Toast";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { darkMode } = useTheme();
  const { showToast } = useToast();

  const productId = product._id || product.id;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const firstAvailable = product.sizes?.find((s) => s.stock > 0);
    const size = firstAvailable?.size || "M";
    addToCart(product, size, 1);
    showToast(`${product.title} added to cart!`, "cart");
  };

  return (
    <div className={`product-card ${darkMode ? "product-card-dark" : ""}`}>
      <Link to={`/products/${productId}`} className="product-image-container">
        <img src={product.image} alt={product.title} className="product-image" loading="lazy" />
        <div className="quick-view-overlay">
          <span className="quick-view-btn font-[Inter]">Quick View</span>
        </div>
      </Link>
      <div className="product-info">
        <Link to={`/products/${productId}`} className="product-title-link">
          <h3 className="product-title font-[Inter]">{product.title}</h3>
        </Link>
        <p className="product-desc font-[Inter]">{product.description}</p>
        <div className="product-bottom">
          <p className="product-price font-[Inter]">Rs. {product.price}</p>
          <button onClick={handleAddToCart} className="add-to-cart-btn font-[Inter]">Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;