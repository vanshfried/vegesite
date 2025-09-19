import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AddProduct from './admin/pages/AddProduct';
import Header from './components/Header';
import ProductList from './admin/pages/ProductList';
import About from './pages/About';
import Footer from './pages/Footer';
import PrevOrders from './pages/PrevOrder';
function App() {
  return (
    <Router>
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin/add-product" element={<AddProduct />} />
          <Route path="/admin/products" element={<ProductList />} />
          <Route path="/about" element={<About />} />
          <Route path="/previousorder" element={<PrevOrders />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}


export default App;
