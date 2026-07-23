import { Link } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(product._id);

  return (
    <div className="group relative bg-white rounded-lg overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300">
      <button
        onClick={() => toggleWishlist(product)}
        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-sm hover:scale-110 transition"
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <span className="text-base">{wishlisted ? "❤️" : "🤍"}</span>
      </button>

      <Link to={`/product/${product._id}`} className="block">
        <div className="aspect-square bg-gray-50 overflow-hidden">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4">
          {product.category && (
            <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">
              {product.category}
            </p>
          )}
          <h3 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">
            {product.title}
          </h3>
          <p className="text-green-700 font-semibold">${product.price.toFixed(2)}</p>
        </div>
      </Link>

      <div className="px-4 pb-4">
        <button
          onClick={() => addToCart(product)}
          className="w-full bg-gray-900 text-white text-sm font-medium py-2 rounded hover:bg-green-700 transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;