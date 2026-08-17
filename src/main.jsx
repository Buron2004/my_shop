import { WishlistProvider } from "./context/WishlistContext";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./Layout";
import CheckoutForm from "./components/CheckoutForm";
import "./index.css";
import AdminAddProduct from './pages/AdminAddProduct';
import OrderSuccess from "./pages/OrderSuccess";
import Wishlist from "./pages/Wishlist";
import Support from "./pages/Support";
import AdminEditProduct from "./pages/AdminEditProduct";
import BlogPost from "./pages/BlogPost";
import AdminAddPost from "./pages/AdminAddPost";
import AdminEditPost from "./pages/AdminEditPost";
import Blog from "./pages/Blog";
import VerifyOtp from "./pages/VerifyOtp";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import CustomerDashboard from "./pages/CustomerDashboard";
import CustomerProfile from "./pages/CustomerProfile";


const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/product/:id", element: <ProductDetail /> },
      { path: "/cart", element: <CheckoutForm /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/admin/add-product", element: <AdminAddProduct /> },
      { path: "/order-success", element: <OrderSuccess /> },
      { path: "/wishlist", element: <Wishlist /> },
      { path: "/support", element: <Support /> },
      { path: "/admin/edit-product/:id", element: <AdminEditProduct /> },
      { path: "/blog/:id", element: <BlogPost /> },
      { path: "/admin/add-post", element: <AdminAddPost /> },
      { path: "/admin/edit-post/:id", element: <AdminEditPost /> },
      { path: "/blog", element: <Blog /> },
      { path: "/verify-otp", element: <VerifyOtp /> },
      { path: "/forgot-password", element: <ForgotPassword /> },
      { path: "/reset-password", element: <ResetPassword /> },
      { path: "/my-orders", element: <CustomerDashboard /> },
      { path: "/profile", element: <CustomerProfile /> },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { path: "dashboard", element: <AdminDashboard /> },
      { path: "orders", element: <AdminOrders /> },
      { path: "analytics", element: <AdminAnalytics /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <RouterProvider router={router} />
          <ToastContainer position="top-right" autoClose={2500} />
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  </GoogleOAuthProvider>
);