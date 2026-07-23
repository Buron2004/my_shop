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
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <CartProvider>
      <WishlistProvider>
        <RouterProvider router={router} />
      </WishlistProvider>
    </CartProvider>
  </AuthProvider>
);