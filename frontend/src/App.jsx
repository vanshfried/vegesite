import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AddProduct from "./admin/pages/AddProduct";
import ProductList from "./admin/pages/ProductList";
import Header from "./components/Header";
import About from "./pages/About";
import PrevOrders from "./pages/PrevOrder";
import CartPage from "./pages/CartPage";
import AdminLogin from "./admin/pages/AdminLogin";
import AdminRoute from "./admin/components/AdminRoute";
import AdminDashboard from "./admin/pages/AdminDashboard"; // new
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import UserLogin from "./pages/UserLogin";
function App() {
  return (
    <Router>
      <AuthProvider>
      <CartProvider>
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />

            {/* Admin entry point */}
            <Route path="/admin" element={<AdminDashboard />} />

            {/* Existing admin routes */}
            <Route
              path="/admin/add-product"
              element={
                <AdminRoute>
                  <AddProduct />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <AdminRoute>
                  <ProductList />
                </AdminRoute>
              }
            />

            {/* Public pages */}
            <Route path="/about" element={<About />} />
            <Route path="/previousorder" element={<PrevOrders />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<UserLogin />} />

            {/* Optional: keep /admin/login for direct link */}
            <Route path="/admin/login" element={<AdminLogin />} />
          </Routes>
        </main>
      </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
