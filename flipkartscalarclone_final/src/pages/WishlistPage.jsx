import { useEffect, useState } from 'react';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const API_URL = 'https://flipkart-clone-11a9.onrender.com/api/...';

export const WishlistPage = ({ onNavigate }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) loadWishlist();
  }, [user]);

  const loadWishlist = async () => {
    if (!user) return;
    setLoading(true);
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/wishlist`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await response.json();
    if (data.wishlist) setWishlistItems(data.wishlist);
    setLoading(false);
  };

  const removeFromWishlist = async (itemId) => {
    const token = localStorage.getItem('token');
    await fetch(`${API_URL}/wishlist/${itemId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    await loadWishlist();
  };

  const addToCart = async (productId) => {
    if (!user) return;
    const token = localStorage.getItem('token');
    await fetch(`${API_URL}/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ product_id: productId, quantity: 1 })
    });
    alert('Added to cart successfully!');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Please login to view your wishlist</p>
          <button onClick={() => onNavigate('home')} className="text-blue-600 hover:underline">
            Go to home
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg mb-4">Your wishlist is empty</p>
          <button
            onClick={() => onNavigate('home')}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center space-x-2 mb-6">
          <Heart className="w-6 h-6 text-red-500" />
          <h1 className="text-2xl font-bold">My Wishlist</h1>
          <span className="text-gray-600">({wishlistItems.length} items)</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {wishlistItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all">
              <div className="relative">
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="absolute top-2 right-2 z-10 p-2 bg-white rounded-full shadow-md hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
                <div
                  onClick={() => onNavigate('product', item.product_id)}
                  className="aspect-square p-4 flex items-center justify-center bg-gray-50 cursor-pointer"
                >
                  <img
                    src={item.images?.[0] || 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg'}
                    alt={item.name}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <div className="p-4">
                <h3
                  onClick={() => onNavigate('product', item.product_id)}
                  className="font-medium text-gray-800 line-clamp-2 mb-2 min-h-[3rem] cursor-pointer hover:text-blue-600"
                >
                  {item.name}
                </h3>
                <div className="flex items-baseline space-x-2 mb-3">
                  <span className="text-xl font-bold text-gray-900">
                    ₹{Number(item.price).toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    ₹{Number(item.original_price).toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={() => addToCart(item.product_id)}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-2 rounded flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};