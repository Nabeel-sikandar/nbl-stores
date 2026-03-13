// CartContext — poore app mein cart data share karta hai
import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Get product ID — MongoDB _id ya local id
  const getProductId = (product) => product._id || product.id;

  // Add to Cart
  const addToCart = (product, size = "M", quantity = 1) => {
    setCart((prevCart) => {
      const productId = getProductId(product);

      // Check agar same product + same size already cart mein hai
      const existingIndex = prevCart.findIndex(
        (item) => getProductId(item) === productId && item.size === size
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

  // Remove from Cart
  const removeFromCart = (productId, size) => {
    setCart((prevCart) =>
      prevCart.filter((item) => !(getProductId(item) === productId && item.size === size))
    );
  };

  // Increase quantity
  const increaseQuantity = (productId, size) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        getProductId(item) === productId && item.size === size
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // Decrease quantity — agar 1 hai toh remove
  const decreaseQuantity = (productId, size) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          getProductId(item) === productId && item.size === size
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Total items count
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Total price
  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Clear cart
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