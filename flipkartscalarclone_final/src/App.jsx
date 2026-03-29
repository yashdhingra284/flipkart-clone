import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Header } from './components/Layout/Header';
import { HomePage } from './pages/HomePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { WishlistPage } from './pages/WishlistPage';
import { OrderHistoryPage } from './pages/OrderHistoryPage';
const BASE_URL = import.meta.env.VITE_API_URL;



function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      updateCartCount();
    } else {
      setCartCount(0);
    }
  }, [user]);

  const updateCartCount = async () => {
    if (!user) return;
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/cart`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await response.json();
    if (data.cart) {
      const total = data.cart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(total);
    }
  };

  const handleNavigate = (page, id) => {
    setCurrentPage(page);
    if (page === 'product' && id) setSelectedProductId(id);
    if (page === 'order-confirmation' && id) setSelectedOrderId(id);
    window.scrollTo(0, 0);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} searchQuery={searchQuery} />;
      case 'product':
        return <ProductDetailPage productId={selectedProductId} onNavigate={handleNavigate} />;
      case 'cart':
        return <CartPage onNavigate={handleNavigate} onCartUpdate={updateCartCount} />;
      case 'checkout':
        return <CheckoutPage onNavigate={handleNavigate} />;
      case 'order-confirmation':
        return <OrderConfirmationPage orderId={selectedOrderId} onNavigate={handleNavigate} />;
      case 'wishlist':
        return <WishlistPage onNavigate={handleNavigate} />;
      case 'orders':
        return <OrderHistoryPage onNavigate={handleNavigate} />;
      default:
        return <HomePage onNavigate={handleNavigate} searchQuery={searchQuery} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onNavigate={handleNavigate}
        cartCount={cartCount}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      {renderPage()}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;