import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import BackButton from "../components/BackButton";
import { getMyProductById, deleteMyProduct } from "../api/myBackendApi";

function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      try {
        const data = await getMyProductById(id);
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [id]);

  async function handleDelete() {
    const confirmed = window.confirm(`Delete "${product.title}"? This can't be undone.`);
    if (!confirmed) return;

    setDeleting(true);
    try {
      await deleteMyProduct(id);
      navigate("/");
    } catch (err) {
      setError(err.message);
      setDeleting(false);
    }
  }

  if (loading) return <p className="p-6">Loading product...</p>;
  if (error) return <p className="p-6 text-red-600">Something went wrong: {error}</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <BackButton />
      <img src={product.image} alt={product.title} className="h-64 w-full object-contain mb-4" />
      <h2 className="text-xl font-bold mb-2">{product.title}</h2>
      <p className="text-gray-700 mb-2">${product.price}</p>
      {product.description && (
        <p className="text-sm text-gray-500 mb-4">{product.description}</p>
      )}
      <button
        onClick={() => addToCart(product)}
        className="bg-black text-white rounded px-4 py-2 text-sm hover:bg-gray-800"
      >
        Add to Cart
      </button>

      {isLoggedIn && user.role === "admin" && (
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="mt-3 block text-sm text-red-600 hover:underline disabled:opacity-50"
        >
          {deleting ? "Deleting..." : "Delete this product"}
        </button>
      )}
    </div>
  );
}

export default ProductDetail;