/*import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import CheckoutForm from "./components/CheckoutForm";
import { CartProvider } from "./context/CartContext";  // NEW import
import "./index.css";   // ADD THIS


const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/checkout", element: <CheckoutForm /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <CartProvider>
    <RouterProvider router={router} />
  </CartProvider>
);




// main.jsx
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import { CartProvider } from "./context/CartContext";
import Layout from "./Layout";
import "./index.css"; // don't forget this one either, from Day 5
import CheckoutForm from "./components/CheckoutForm";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/product/:id", element: <ProductDetail/> },
      { path: "/cart", element: <CheckoutForm /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
    ],
  },
]);

import { AuthProvider } from './context/AuthContext';

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  </AuthProvider>
);*/


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
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  </AuthProvider>
);