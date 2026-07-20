import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createMyProduct } from '../api/myBackendApi';
import { useAuth } from '../context/AuthContext';

function AdminAddProduct() {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  // Guard: only admins should see this page's actual content
  if (!isLoggedIn || user.role !== 'admin') {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600">You don't have permission to view this page.</p>
      </div>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const newProduct = await createMyProduct({
        title,
        price: Number(price), // form inputs are always strings — convert before sending
        image,
      });
      navigate(`/product/${newProduct._id}`); // go straight to the new product's page
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-sm mx-auto">
      <h2 className="text-xl font-bold mb-4">Add a New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Product title"
          className="border p-2 w-full"
        />
        <input
          type="number"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          className="border p-2 w-full"
        />
        <input
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="Image URL"
          className="border p-2 w-full"
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white w-full py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
}

export default AdminAddProduct;