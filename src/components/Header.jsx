import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";

function Header() {
  const { isLoggedIn, user, logout } = useAuth();
  const { cartCount } = useContext(CartContext);
  const { wishlist } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();
  const showBack = location.pathname !== "/";
  const [searchInput, setSearchInput] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  function handleSearch(e) {
    e.preventDefault();
    if (searchInput.trim() === "") {
      navigate("/");
    } else {
      navigate(`/?search=${encodeURIComponent(searchInput.trim())}`);
    }
    setShowSearch(false);
  }

  return (
    <header className="w-full">
      {/* Top contact bar */}
      <div className="bg-gray-900 text-gray-300 text-xs">
        <div className="max-w-7xl mx-auto px-6 py-2 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span>📞 09012345678</span>
            <span className="hidden sm:inline">✉️ support@myshop.com</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline">Follow Us:</span>
            <span>IG</span>
            <span>YT</span>
            <span>FB</span>
            <span>TW</span>
          </div>
        </div>
      </div>

      {/* Main nav row */}
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {showBack && (
              <button
                onClick={() => navigate(-1)}
                className="text-sm text-gray-500 hover:text-black"
              >
                ←
              </button>
            )}
            <Link to="/" className="text-2xl font-bold tracking-tight text-gray-900">
              My Shop
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
            <Link to="/" className="hover:text-green-600 transition">Home</Link>
            <Link to="/?category=Men" className="hover:text-green-600 transition">Shop</Link>
            <Link to="/blog" className="hover:text-green-600 transition">Blog</Link>
            <Link to="/support" className="hover:text-green-600 transition">Contact</Link>
            {isLoggedIn && user.role === "admin" && (
              <>
                <Link to="/admin/add-product" className="text-green-700 hover:underline">
                  + Product
                </Link>
                <Link to="/admin/add-post" className="text-green-700 hover:underline">
                  + Post
                </Link>
              </>
            )}
          </nav>

          <div className="flex items-center gap-5 text-sm">
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <span className="text-gray-600 hidden sm:inline">Hi, {user.name}</span>
                <button onClick={logout} className="text-gray-500 hover:text-red-600 transition">
                  Log Out
                </button>
              </div>
            ) : (
              <Link to="/login" className="text-green-700 hover:underline font-medium">
                Login / Register
              </Link>
            )}

            <button
              onClick={() => setShowSearch((s) => !s)}
              className="text-gray-700 hover:text-green-600 transition"
              aria-label="Search"
            >
              🔍
            </button>

            <Link to="/wishlist" className="relative flex items-center text-gray-700 hover:text-green-600 transition">
              ♡
              <span className="ml-1 bg-gray-900 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {wishlist.length}
              </span>
            </Link>

            <Link to="/cart" className="relative flex items-center text-gray-700 hover:text-green-600 transition">
              🛒
              <span className="ml-1 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            </Link>
          </div>
        </div>

        {showSearch && (
          <div className="max-w-7xl mx-auto px-6 pb-4">
            <form onSubmit={handleSearch} className="flex">
              <input
                autoFocus
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search products..."
                className="w-full border rounded-l px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-600"
              />
              <button type="submit" className="bg-gray-900 text-white px-4 rounded-r text-sm">
                Search
              </button>
            </form>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;