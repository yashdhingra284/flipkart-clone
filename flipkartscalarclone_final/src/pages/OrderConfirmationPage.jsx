import { CheckCircle, Mail } from 'lucide-react';
import { useEffect, useState } from 'react';

const API_URL = 'http://localhost:5000/api';

export const OrderConfirmationPage = ({ orderId, onNavigate }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await response.json();
    if (data.order) {
      setOrder({ ...data.order, order_items: data.items });
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Order not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-600 text-lg mb-6">Thank you for your purchase</p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <Mail className="w-5 h-5 text-blue-600" />
              <span className="text-blue-900 font-semibold">Email Confirmation Sent</span>
            </div>
            <p className="text-blue-800 text-sm">
              We've sent an order confirmation to your email address.
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div>
                <p className="text-sm text-gray-600 mb-1">Order ID</p>
                <p className="font-semibold text-gray-900 font-mono">
                  {order.id.slice(0, 8).toUpperCase()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Order Date</p>
                <p className="font-semibold text-gray-900">
                  {new Date(order.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                <p className="font-semibold text-gray-900 text-xl">
                  ₹{Number(order.total_amount).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>
          </div>
          <div className="border-t pt-6 mb-6">
            <h3 className="font-semibold text-lg mb-4 text-left">Delivery Address</h3>
            <div className="bg-gray-50 rounded-lg p-4 text-left">
              <p className="font-semibold text-gray-900">{order.shipping_address.name}</p>
              <p className="text-gray-600">{order.shipping_address.phone}</p>
              <p className="text-gray-600 mt-2">
                {order.shipping_address.address}<br />
                {order.shipping_address.city}, {order.shipping_address.state}<br />
                {order.shipping_address.pincode}
              </p>
            </div>
          </div>
          {order.order_items && order.order_items.length > 0 && (
            <div className="border-t pt-6 mb-6">
              <h3 className="font-semibold text-lg mb-4 text-left">Order Items</h3>
              <div className="space-y-3">
                {order.order_items.map((item) => (
                  <div key={item.id} className="flex space-x-4 bg-gray-50 p-4 rounded-lg">
                    <img
                      src={item.images?.[0] || 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg'}
                      alt={item.name}
                      className="w-20 h-20 object-contain rounded"
                    />
                    <div className="flex-1 text-left">
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      <p className="text-sm font-semibold text-gray-900 mt-1">
                        ₹{Number(item.price).toLocaleString()} × {item.quantity} = ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate('orders')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              View Order History
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};