import { useEffect, useState } from 'react';
import { Package, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const API_URL = 'http://localhost:5000/api';

export const OrderHistoryPage = ({ onNavigate }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { user } = useAuth();

  useEffect(() => {
    if (user) loadOrders();
  }, [user]);

  const loadOrders = async () => {
    if (!user) return;
    setLoading(true);
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/orders`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await response.json();

    // Load order items for each order
    if (data.orders) {
      const ordersWithItems = await Promise.all(
        data.orders.map(async (order) => {
          const itemsResponse = await fetch(`${API_URL}/orders/${order.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const itemsData = await itemsResponse.json();
          return { ...order, order_items: itemsData.items || [] };
        })
      );
      setOrders(ordersWithItems);
    }
    setLoading(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'placed': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = filter === 'all'
    ? orders
    : orders.filter((order) => order.status === filter);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Please login to view your orders</p>
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

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg mb-4">You haven't placed any orders yet</p>
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
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex border-b overflow-x-auto">
            {['all', 'placed', 'delivered', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-6 py-3 font-medium whitespace-nowrap ${
                  filter === status
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
          <div className="divide-y">
            {filteredOrders.length === 0 ? (
              <div className="p-8 text-center text-gray-600">
                No orders found with status: {filter}
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="font-semibold text-gray-900">
                          Order #{order.id.slice(0, 8).toUpperCase()}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Placed on {new Date(order.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'long', year: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="mt-2 md:mt-0">
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="text-xl font-bold text-gray-900">
                        ₹{Number(order.total_amount).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {order.order_items && order.order_items.length > 0 && (
                    <div className="space-y-3 mb-4">
                      {order.order_items.slice(0, 2).map((item) => (
                        <div key={item.id} className="flex space-x-4">
                          <img
                            src={item.images?.[0] || 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg'}
                            alt={item.name}
                            className="w-16 h-16 object-contain rounded"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 line-clamp-1">{item.name}</p>
                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                            <p className="text-sm font-semibold text-gray-900">
                              ₹{Number(item.price).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                      {order.order_items.length > 2 && (
                        <p className="text-sm text-gray-600">
                          +{order.order_items.length - 2} more items
                        </p>
                      )}
                    </div>
                  )}
                  <button
                    onClick={() => onNavigate('order-confirmation', order.id)}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <span>View Details</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};