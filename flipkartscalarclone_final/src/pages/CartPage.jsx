import { useEffect, useState } from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const API_URL = 'https://flipkart-clone-11a9.onrender.com/api/...';

export const CartPage = ({ onNavigate, onCartUpdate }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) loadCart();
  }, [user]);

  const loadCart = async () => {
    if (!user) return;
    setLoading(true);
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/cart`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await response.json();
    if (data.cart) setCartItems(data.cart);
    setLoading(false);
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    const token = localStorage.getItem('token');
    await fetch(`${API_URL}/cart/${itemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ quantity: newQuantity })
    });
    await loadCart();
    onCartUpdate();
  };

  const removeItem = async (itemId) => {
    const token = localStorage.getItem('token');
    await fetch(`${API_URL}/cart/${itemId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    await loadCart();
    onCartUpdate();
  };

  const calculateTotal = () =>
    cartItems.reduce((total, item) => total + (item.price || 0) * item.quantity, 0);

  const calculateOriginalTotal = () =>
    cartItems.reduce((total, item) => total + (item.original_price || 0) * item.quantity, 0);

  const calculateDiscount = () => calculateOriginalTotal() - calculateTotal();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Please login to view your cart</p>
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

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Your cart is empty</p>
          <button
            onClick={() => onNavigate('home')}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex space-x-4">
                  <img
                    src={item.images?.[0] || 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg'}
                    alt={item.name}
                    className="w-24 h-24 object-contain rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-2">{item.name}</h3>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-xl font-bold">₹{item.price.toLocaleString()}</span>
                      <span className="text-sm text-gray-500 line-through">
                        ₹{item.original_price.toLocaleString()}
                      </span>
                      <span className="text-sm text-green-600 font-semibold">
                        {item.discount_percentage}% off
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2 border rounded">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-2 hover:bg-gray-100"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 hover:bg-gray-100"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-700 flex items-center space-x-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
              <h2 className="text-lg font-semibold mb-4">Price Details</h2>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Price ({cartItems.length} items)</span>
                  <span>₹{calculateOriginalTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-₹{calculateDiscount().toLocaleString()}</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-semibold text-lg">
                  <span>Total Amount</span>
                  <span>₹{calculateTotal().toLocaleString()}</span>
                </div>
              </div>
              <div className="bg-green-50 text-green-700 p-3 rounded mb-4 text-sm">
                You will save ₹{calculateDiscount().toLocaleString()} on this order
              </div>
              <button
                onClick={() => onNavigate('checkout')}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};