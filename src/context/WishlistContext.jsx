import { createContext, useState, useEffect, useContext } from "react";
import { toast } from 'react-toastify';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    const stored = localStorage.getItem("wishlist");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  function isWishlisted(productId) {
    return wishlist.some((item) => item._id === productId);
  }

  function toggleWishlist(product) {
    setWishlist((prev) => {
      const exists = prev.some((item) => item._id === product._id);
      if (exists) {
        toast.info(`${product.title} removed from wishlist`);
        return prev.filter((item) => item._id !== product._id);
      }
      toast.success(`${product.title} added to wishlist`);
      return [...prev, product];
    });
  }

  function removeFromWishlist(productId) {
    setWishlist((prev) => prev.filter((item) => item._id !== productId));
  }

  function clearWishlist() {
    setWishlist([]);
  }

  return (
    <WishlistContext.Provider
      value={{ wishlist, isWishlisted, toggleWishlist, removeFromWishlist, clearWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}