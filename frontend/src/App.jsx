// src/App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import AddProduct from "./admin/pages/AddProduct";
import ProductList from "./admin/pages/ProductList";
import Header from "./components/Header";
import AdminHeader from "./admin/components/AdminHeader";
import About from "./pages/About";
import CartPage from "./pages/CartPage";
import OrdersPage from "./pages/OrdersPage";
import AdminLogin from "./admin/pages/AdminLogin";
import AdminRoute from "./admin/components/AdminRoute";
import AdminDashboard from "./admin/pages/AdminDashboard";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import UserLogin from "./pages/UserLogin";
import AdminOrders from "./admin/pages/AdminOrders";
import DeliveredOrders from "./admin/pages/DeliveredOrders";
import CancelledOrders from "./admin/pages/CancelledOrders";
import NotFound from "./pages/NotFound";
import SettingsPage from "./pages/SettingsPage";
// Helper layout for pages with headers
function Layout({ children }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {isAdminRoute ? <AdminHeader /> : <Header />}
      <main className="main-content">{children}</main>
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Public pages with layout */}
            <Route
              path="/"
              element={
                <Layout>
                  <HomePage />
                </Layout>
              }
            />
            <Route
              path="/about"
              element={
                <Layout>
                  <About />
                </Layout>
              }
            />
            <Route
              path="/cart"
              element={
                <Layout>
                  <CartPage />
                </Layout>
              }
            />
            <Route
              path="/login"
              element={
                <Layout>
                  <UserLogin />
                </Layout>
              }
            />
            <Route
              path="/orders"
              element={
                <Layout>
                  <OrdersPage />
                </Layout>
              }
            />
            <Route
              path="/settings"
              element={
                <Layout>
                  <SettingsPage />
                </Layout>
              }
            />

            {/* Admin pages with layout */}
            <Route
              path="/admin"
              element={
                <Layout>
                  <AdminDashboard />
                </Layout>
              }
            />
            <Route
              path="/admin/login"
              element={
                <Layout>
                  <AdminLogin />
                </Layout>
              }
            />
            <Route
              path="/admin/add-product"
              element={
                <Layout>
                  <AdminRoute>
                    <AddProduct />
                  </AdminRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/products"
              element={
                <Layout>
                  <AdminRoute>
                    <ProductList />
                  </AdminRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <Layout>
                  <AdminRoute>
                    <AdminOrders />
                  </AdminRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/delivered"
              element={
                <Layout>
                  <AdminRoute>
                    <DeliveredOrders />
                  </AdminRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/cancelled"
              element={
                <Layout>
                  <AdminRoute>
                    <CancelledOrders />
                  </AdminRoute>
                </Layout>
              }
            />

            {/* NotFound without layout (no header) */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
