import { Routes, Route } from "react-router-dom";
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

export default function AppRouter() {
  return (
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
          <MainLayout>
            <AdminDashboardPage />
          </MainLayout>
        }
      />
      <Route
        path="/admin/products"
        element={
          <MainLayout>
            <AdminProductsPage />
          </MainLayout>
        }
      />
      <Route
        path="/admin/products/new"
        element={
          <MainLayout>
            <AdminAddProductPage />
          </MainLayout>
        }
      />
      <Route
        path="/admin/orders"
        element={
          <MainLayout>
            <AdminOrdersPage />
          </MainLayout>
        }
      />
      <Route
  path="/admin/orders/:id"
  element={
    <MainLayout>
      <AdminOrderDetailPage />
    </MainLayout>
  }
/>
      <Route
        path="/admin/products/edit/:id"
        element={
          <MainLayout>
            <AdminEditProductPage />
          </MainLayout>
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
  );
}