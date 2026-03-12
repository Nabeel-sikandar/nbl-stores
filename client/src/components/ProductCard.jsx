// ProductCard — supports both local id and MongoDB _id
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import { Link } from "react-router-dom";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { darkMode } = useTheme();

  // MongoDB _id ya local id — dono support
  const productId = product._id || product.id;

  const handleAddToCart = () => {
    addToCart(product, "M", 1);
    alert(`${product.title} added to cart!`);
  };

  return (
    <div className={`product-card ${darkMode ? "product-card-dark" : ""}`}>
      <Link to={`/products/${productId}`} className="product-image-container">
        <img src={product.image} alt={product.title} className="product-image" />
      </Link>

      <div className="product-info">
        <Link to={`/products/${productId}`} className="product-title-link">
          <h3 className="product-title font-[Inter]">{product.title}</h3>
        </Link>
        <p className="product-desc font-[Inter]">{product.description}</p>
        <div className="product-bottom">
          <span className="product-price font-[Inter]">Rs. {product.price}</span>
          <button onClick={handleAddToCart} className="add-to-cart-btn font-[Inter]">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;