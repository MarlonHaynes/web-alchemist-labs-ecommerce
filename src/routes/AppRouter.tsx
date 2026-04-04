import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/HomePage";
import ProductsPage from "../pages/ProductsPage";
import ProductDetailPage from "../pages/ProductDetailPage";
import CartPage from "../pages/CartPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/DashboardPage";
import CheckoutPage from "../pages/CheckoutPage";
import OrderSuccessPage from "../pages/OrderSuccessPage";
import NotFoundPage from "../pages/NotFoundPage";
import AdminDashboardPage from "../admin/pages/AdminDashboardPage";
import AdminProductsPage from "../admin/pages/AdminProductsPage";
import AdminOrdersPage from "../admin/pages/AdminOrdersPage";
import AdminAddProductPage from "../admin/pages/AdminAddProductPage";
import AdminEditProductPage from "../admin/pages/AdminEditProductPage";
import ProtectedRoute from "./ProtectedRoute";
import OrderDetailPage from "../pages/OrderDetailPage";
import AdminOrderDetailPage from "../admin/pages/AdminOrderDetailPage";
import AdminRoute from "./AdminRoute";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function AppRouter() {
  return (
    <>
      <ScrollToTop />

      <Routes>
        <Route
          path="/"
          element={
            <MainLayout>
              <HomePage />
            </MainLayout>
          }
        />

        <Route
          path="/products"
          element={
            <MainLayout>
              <ProductsPage />
            </MainLayout>
          }
        />

        <Route
          path="/products/:id"
          element={
            <MainLayout>
              <ProductDetailPage />
            </MainLayout>
          }
        />

        <Route
          path="/cart"
          element={
            <MainLayout>
              <CartPage />
            </MainLayout>
          }
        />

        <Route
          path="/login"
          element={
            <MainLayout>
              <LoginPage />
            </MainLayout>
          }
        />

        <Route
          path="/register"
          element={
            <MainLayout>
              <RegisterPage />
            </MainLayout>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout>
                <DashboardPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/orders/:id"
          element={
            <ProtectedRoute>
              <MainLayout>
                <OrderDetailPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <MainLayout>
                <CheckoutPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/order-success"
          element={
            <MainLayout>
              <OrderSuccessPage />
            </MainLayout>
          }
        />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <MainLayout>
                <AdminDashboardPage />
              </MainLayout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/products"
          element={
            <AdminRoute>
              <MainLayout>
                <AdminProductsPage />
              </MainLayout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/products/new"
          element={
            <AdminRoute>
              <MainLayout>
                <AdminAddProductPage />
              </MainLayout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <AdminRoute>
              <MainLayout>
                <AdminOrdersPage />
              </MainLayout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/orders/:id"
          element={
            <AdminRoute>
              <MainLayout>
                <AdminOrderDetailPage />
              </MainLayout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/products/edit/:id"
          element={
            <AdminRoute>
              <MainLayout>
                <AdminEditProductPage />
              </MainLayout>
            </AdminRoute>
          }
        />

        <Route
          path="*"
          element={
            <MainLayout>
              <NotFoundPage />
            </MainLayout>
          }
        />
      </Routes>
    </>
  );
}