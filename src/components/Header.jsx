// Header.jsx
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useAuth } from '../context/AuthContext';

function Header() {
  const { isLoggedIn, user, logout } = useAuth();
  const { cartCount } = useContext(CartContext);
  const navigate = useNavigate();
  const location = useLocation();

  const showBack = location.pathname !== "/"; // hide it on the homepage

  return (
    <header className="flex justify-between items-center p-4 border-b">
      <div className="flex items-center gap-3">
        {showBack && (
          <button onClick={() => navigate(-1)} className="text-sm text-gray-600 hover:text-black">
            ← Back
          </button>
        )}
        <Link to="/" className="text-lg font-bold">My Shop</Link>
      </div>
      <div className="flex items-center gap-4">
        {isLoggedIn && user.role === 'admin' && (
          <Link to="/admin/add-product" className="text-sm text-purple-700 hover:underline">
            + Add Product
          </Link>
        )}
        {isLoggedIn ? (
          <>
            <span>Hi, {user.name}</span>
            <button onClick={logout} className="text-sm text-red-600">Log Out</button>
          </>
        ) : (
          <Link to="/login">Log In</Link>
        )}
        <Link to="/cart">🛒 {cartCount}</Link>
      </div>
    </header>
  );
}

export default Header;