// frontend/src/App.tsx
import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import { useState } from 'react';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProtectedRoute from './components/ProtectedRoute'; 
import AdminLayout from './pages/admin/AdminLayout';
import DashboardOverview from './pages/admin/DashboardOverview';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

// --- IMPORTS POUR LES PAGES DU DASHBOARD ---
import AdminProducts from './pages/admin/AdminProducts';
import AdminUsers from './pages/admin/AdminUsers';
import AdminSettings from './pages/admin/AdminSettings';
import AdminStock from './pages/admin/AdminStock';
import AdminSupply from './pages/admin/AdminSupply';
import AdminSales from './pages/admin/AdminSales';
import AdminReviews from './pages/admin/AdminReviews';
import AdminNewsletters from './pages/admin/AdminNewsletters';
import SellerProducts from './pages/seller/SellerProducts';
import SellerSales from './pages/seller/SellerSales';
import SellerStock from './pages/seller/SellerStock';
import SellerSupply from './pages/seller/SellerSupply';

const AppLayout = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  type CartItem = {
    id: string | number;
    name: string;
    price: number;
    quantity: number;
    image: string;
    category?: string;
    [key: string]: any;
  };
  
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const handleAddToCart = (product: any, quantity: number) => {
    setCartItems(prevItems => {
      const itemExists = prevItems.find(item => item.id === product.id);
      if (itemExists) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevItems, { ...product, quantity }];
    });
  };

  const handleUpdateQuantity = (productId: string | number, amount: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity: Math.max(1, item.quantity + amount) } : item
      )
    );
  };

  const handleRemoveFromCart = (productId: string | number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };
  
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  if (isAdminRoute) {
    return (
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardOverview />} />
            
            {/* Routes pour l'Admin */}
            <Route path="products" element={<AdminProducts />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="stock" element={<AdminStock />} />
            <Route path="supply" element={<AdminSupply />} />
            <Route path="sales" element={<AdminSales />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="newsletters" element={<AdminNewsletters />} />
            
            {/* Routes pour le Vendeur */}
            <Route path="my-products" element={<SellerProducts />} />
            <Route path="my-sales" element={<SellerSales />} />
            <Route path="my-stock" element={<SellerStock />} />
            <Route path="my-supply" element={<SellerSupply />} />
            <Route path="my-reviews" element={<AdminReviews />} />
            
            {/* Route partagée */}
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Route>
      </Routes>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f3efe7]">
      <Header cartCount={cartCount} />
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home onAddToCart={handleAddToCart} />} />
          <Route path="/product/:productId" element={<ProductDetailPage onAddToCart={handleAddToCart} />} />
          <Route 
            path="/cart" 
            element={<CartPage 
              cartItems={cartItems} 
              onUpdateQuantity={handleUpdateQuantity} 
              onRemoveItem={handleRemoveFromCart} 
            />} 
          />
          <Route 
            path="/checkout" 
            element={<CheckoutPage onClearCart={handleClearCart} />} 
          />
          <Route path="/order-success" element={<OrderSuccessPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<LoginPage />} /> 
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#fcfaf7',
              color: '#2a363b',
              border: '1px solid #dcd6c9',
              fontFamily: 'serif',
            },
          }}
        />
        <AppLayout />
      </Router>
    </AuthProvider>
  );
}

export default App;