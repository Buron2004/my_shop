import ProductCard from "../components/ProductCard";
import { useWishlist } from "../context/WishlistContext";

function Wishlist() {
  const { wishlist } = useWishlist();

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-6">Your Wishlist</h2>
      {wishlist.length === 0 ? (
        <p className="text-gray-500 py-12 text-center">
          Nothing here yet — tap the heart on any product to save it.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {wishlist.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;