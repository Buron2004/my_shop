import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext, useState, useRef, useEffect } from "react";
import {
  Phone, Mail,
  Search, Heart, ShoppingCart, Menu, X, ChevronDown,
  User, Package, LayoutDashboard, LogOut, PlusCircle,
} from "lucide-react";
import { siInstagram, siYoutube, siFacebook, siX } from "simple-icons";
import BrandIcon from "./BrandIcon";
import { CartContext } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import Button from './Button';

function Header() {
  const { isLoggedIn, user, logout } = useAuth();
  const { cartCount, clearCart } = useContext(CartContext);
  const { wishlist, clearWishlist } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();
  const showBack = location.pathname !== "/";
  const [searchInput, setSearchInput] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    if (searchInput.trim() === "") {
      navigate("/");
    } else {
      navigate(`/?search=${encodeURIComponent(searchInput.trim())}`);
    }
    setShowSearch(false);
    setMobileMenuOpen(false);
  }

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  function handleLogout() {
    logout();
    clearCart();
    clearWishlist();
    setUserMenuOpen(false);
    navigate("/");
  }

  return (
    <header className="w-full">
      {/* Top contact bar */}
      <div className="bg-gray-900 text-gray-300 text-xs">
        <div className="max-w-7xl mx-auto px-6 py-2 flex justify-between items-center">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5">
              <Phone size={12} /> 09012345678
            </span>
            <span className="hidden sm:flex items-center gap-1.5">
              <Mail size={12} /> support@myshop.com
            </span>
          </div>
          <div className="flex items-center gap-3.5">
            <span className="hidden sm:inline text-gray-500">Follow Us</span>
            <BrandIcon icon={siInstagram} className="hover:text-white transition cursor-pointer" />
            <BrandIcon icon={siYoutube} className="hover:text-white transition cursor-pointer" />
            <BrandIcon icon={siFacebook} className="hover:text-white transition cursor-pointer" />
            <BrandIcon icon={siX} className="hover:text-white transition cursor-pointer" />
          </div>
        </div>
      </div>

      {/* Main nav row */}
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
          <div className="flex items-center gap-3 shrink-0">
            {showBack && (
              <button onClick={() => navigate(-1)} className="text-sm text-gray-400 hover:text-gray-800 transition">
                ←
              </button>
            )}
            <Link to="/" className="text-2xl font-bold tracking-tight text-gray-900">
              My Shop
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-gray-600">
            <Link to="/" className="hover:text-green-600 transition">Home</Link>
            <Link to="/?category=Men" className="hover:text-green-600 transition">Shop</Link>
            <Link to="/blog" className="hover:text-green-600 transition">Blog</Link>
            <Link to="/support" className="hover:text-green-600 transition">Contact</Link>
          </nav>

          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={() => setShowSearch((s) => !s)}
              className="hidden md:block text-gray-500 hover:text-green-600 transition"
              aria-label="Search"
            >
              <Search size={19} />
            </button>

            <Link to="/wishlist" className="relative text-gray-500 hover:text-green-600 transition">
              <Heart size={19} />
              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-gray-900 text-white text-[10px] font-medium rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link to="/cart" className="relative text-gray-500 hover:text-green-600 transition">
              <ShoppingCart size={19} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-600 text-white text-[10px] font-medium rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {isLoggedIn ? (
              <div className="relative hidden sm:block" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen((o) => !o)}
                  className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 transition"
                >
                  <div className="w-7 h-7 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium">{user.name.split(" ")[0]}</span>
                  <ChevronDown size={14} className={`transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-lg shadow-lg py-1.5 z-50">
                    <Link
                      to="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <User size={15} /> Profile
                    </Link>

                    {user.role === "admin" ? (
                      <>
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <LayoutDashboard size={15} /> Admin Dashboard
                        </Link>
                        <Link
                          to="/admin/add-product"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <PlusCircle size={15} /> Add Product
                        </Link>
                        <Link
                          to="/admin/add-post"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <PlusCircle size={15} /> Add Post
                        </Link>
                      </>
                    ) : (
                      <Link
                        to="/my-orders"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Package size={15} /> My Orders
                      </Link>
                    )}

                    <div className="border-t my-1.5" />
                    <Button variant="secondary" size="sm"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={15} /> Log Out
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <Button variant="primary" size="sm" asChild>
                <Link
                  to="/login"
                  //className="hidden sm:inline-block bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition"
                >
                  Login / Register
                </Link>
              </Button>
            )}

            <button
              onClick={() => setMobileMenuOpen((o) => !o)}
              className="md:hidden text-gray-700"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {showSearch && (
          <div className="max-w-7xl mx-auto px-6 pb-4 hidden md:block">
            <form onSubmit={handleSearch} className="flex">
              <input
                autoFocus
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search products..."
                className="w-full border border-gray-200 rounded-l-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-600"
              />
              <button type="submit" className="bg-gray-900 text-white px-4 rounded-r-lg text-sm">
                Search
              </button>
            </form>
          </div>
        )}

        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-white px-6 py-4 space-y-4">
            <form onSubmit={handleSearch} className="flex">
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search products..."
                className="w-full border border-gray-200 rounded-l-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-600"
              />
              <button type="submit" className="bg-gray-900 text-white px-4 rounded-r-lg text-sm">
                Go
              </button>
            </form>

            <nav className="flex flex-col gap-3 text-sm font-medium text-gray-700">
              <Link to="/" onClick={closeMobileMenu} className="hover:text-green-600">Home</Link>
              <Link to="/?category=Men" onClick={closeMobileMenu} className="hover:text-green-600">Shop</Link>
              <Link to="/blog" onClick={closeMobileMenu} className="hover:text-green-600">Blog</Link>
              <Link to="/support" onClick={closeMobileMenu} className="hover:text-green-600">Contact</Link>
              <Link to="/profile" onClick={closeMobileMenu} className="hover:text-green-600">Profile</Link>

              {isLoggedIn && user.role === "admin" && (
                <>
                  <Link to="/admin/dashboard" onClick={closeMobileMenu} className="text-green-700 font-semibold">
                    Admin Dashboard
                  </Link>
                  <Link to="/admin/add-product" onClick={closeMobileMenu} className="text-green-700">+ Add Product</Link>
                  <Link to="/admin/add-post" onClick={closeMobileMenu} className="text-green-700">+ Add Post</Link>
                </>
              )}

              {isLoggedIn && user.role !== "admin" && (
                <Link to="/my-orders" onClick={closeMobileMenu} className="text-green-700 font-semibold">
                  My Orders
                </Link>
              )}
            </nav>

            <div className="border-t pt-4">
              {isLoggedIn ? (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Hi, {user.name}</span>
                  <button onClick={handleLogout} className="text-red-600 text-sm font-medium">
                    Log Out
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="block text-center bg-green-600 text-white font-medium text-sm py-2.5 rounded-lg"
                >
                  Login / Register
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;