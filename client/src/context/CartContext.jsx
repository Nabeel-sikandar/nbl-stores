// CartContext — poore app mein cart data share karta hai
import { createContext, useContext, useState } from "react";

// Context create kiya
const CartContext = createContext();

// Custom hook — kisi bhi component mein cart access karne ke liye
// Usage: const { cart, addToCart, removeFromCart } = useCart();
export const useCart = () => useContext(CartContext);

// CartProvider — App ko wrap karega, saare children ko cart data milega
export const CartProvider = ({ children }) => {
  // Cart items state — array of objects
  const [cart, setCart] = useState([]);

  // Add to Cart — product + size + quantity
  const addToCart = (product, size = "M", quantity = 1) => {
    setCart((prevCart) => {
      // Check agar same product + same size already cart mein hai
      const existingIndex = prevCart.findIndex(
        (item) => item.id === product.id && item.size === size
      );

      if (existingIndex !== -1) {
        // Agar hai toh quantity increase karo
        const updatedCart = [...prevCart];
        updatedCart[existingIndex].quantity += quantity;
        return updatedCart;
      }

      // Naya item add karo
      return [...prevCart, { ...product, size, quantity }];
    });
  };

  // Remove from Cart — product id + size ke basis pe
  const removeFromCart = (productId, size) => {
    setCart((prevCart) =>
      prevCart.filter((item) => !(item.id === productId && item.size === size))
    );
  };

  // Increase quantity
  const increaseQuantity = (productId, size) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId && item.size === size
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // Decrease quantity — agar 1 hai toh remove kar do
  const decreaseQuantity = (productId, size) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === productId && item.size === size
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Total items count — navbar badge ke liye
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Total price — checkout ke liye
  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Clear cart — checkout ke baad
  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        cartCount,
        cartTotal,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};