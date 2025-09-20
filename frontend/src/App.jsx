import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AddProduct from "./admin/pages/AddProduct";
import Header from "./components/Header";
import ProductList from "./admin/pages/ProductList";
import About from "./pages/About";
import PrevOrders from "./pages/PrevOrder";
import CartPage from "./pages/CartPage"; // new
import { CartProvider } from "./context/CartContext"; // new

function App() {
  return (
    <Router>
      <CartProvider>
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/admin/add-product" element={<AddProduct />} />
            <Route path="/admin/products" element={<ProductList />} />
            <Route path="/about" element={<About />} />
            <Route path="/previousorder" element={<PrevOrders />} />
            <Route path="/cart" element={<CartPage />} /> {/* NEW */}
          </Routes>
        </main>
        
      </CartProvider>
    </Router>
  );
}

export default App;
