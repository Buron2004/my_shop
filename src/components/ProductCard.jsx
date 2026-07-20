import { Link } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";

function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);

  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition">
      <Link to={`/product/${product._id}`}>
        <img
          src={product.image}
          alt={product.title}
          className="h-40 w-full object-contain mb-2"
        />
        <h3 className="font-semibold text-sm line-clamp-2">{product.title}</h3>
        <p className="text-gray-700">${product.price}</p>
      </Link>
      <button
        onClick={() => addToCart(product)}
        className="mt-2 w-full bg-black text-white rounded py-1 text-sm hover:bg-gray-800"
      >
        Add to Cart
      </button>
    </div>
  );
}

export default ProductCard;