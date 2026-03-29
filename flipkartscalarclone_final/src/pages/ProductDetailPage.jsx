import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Heart, Star, ShoppingCart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const API_URL = 'http://localhost:5000/api';

export const ProductDetailPage = ({ productId, onNavigate }) => {
  const [product, setProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistItemId, setWishlistItemId] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadProduct();
    if (user) checkWishlist();
  }, [productId, user]);

  const loadProduct = async () => {
    setLoading(true);
    const response = await fetch(`${API_URL}/products/${productId}`);
    const data = await response.json();
    if (data.product) setProduct(data.product);
    setLoading(false);
  };

  const checkWishlist = async () => {
    if (!user) return;
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/wishlist`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await response.json();
    if (data.wishlist) {
      const item = data.wishlist.find((i) => i.product_id === productId);
      setIsInWishlist(!!item);
      if (item) setWishlistItemId(item.id);
    }
  };

  const handleWishlistToggle = async () => {
    if (!user) {
      alert('Please login to add items to wishlist');
      return;
    }
    const token = localStorage.getItem('token');
    if (isInWishlist && wishlistItemId) {
      await fetch(`${API_URL}/wishlist/${wishlistItemId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsInWishlist(false);
      setWishlistItemId(null);
    } else {
      const response = await fetch(`${API_URL}/wishlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ product_id: productId })
      });
      const data = await response.json();
      setIsInWishlist(true);
      setWishlistItemId(data.item?.id);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      alert('Please login to add items to cart');
      return;
    }
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

  const handleBuyNow = async () => {
    await handleAddToCart();
    onNavigate('cart');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Product not found</p>
          <button onClick={() => onNavigate('home')} className="mt-4 text-blue-600 hover:underline">
            Go back to home
          </button>
        </div>
      </div>
    );
  }

  const images = product.images?.length > 0
    ? product.images
    : ['https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg'];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center text-blue-600 hover:underline mb-4"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to products
        </button>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                <img
                  src={images[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 p-2 rounded-full"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 p-2 rounded-full"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded border-2 overflow-hidden ${
                        index === currentImageIndex ? 'border-blue-600' : 'border-gray-200'
                      }`}
                    >
                      <img src={image} alt="" className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
              <div className="mt-6 flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 rounded-lg flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add to Cart</span>
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg"
                >
                  Buy Now
                </button>
              </div>
            </div>
            <div>
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
                <button
                  onClick={handleWishlistToggle}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <Heart className={`w-6 h-6 ${isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                </button>
              </div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex items-center space-x-1 bg-green-600 text-white px-3 py-1 rounded">
                  <span className="font-semibold">{Number(product.rating).toFixed(1)}</span>
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <span className="text-gray-600">
                  {product.reviews_count.toLocaleString()} Ratings & Reviews
                </span>
              </div>
              <div className="mb-6">
                <div className="flex items-baseline space-x-3 mb-2">
                  <span className="text-3xl font-bold text-gray-900">
                    ₹{Number(product.price).toLocaleString()}
                  </span>
                  <span className="text-lg text-gray-500 line-through">
                    ₹{Number(product.original_price).toLocaleString()}
                  </span>
                  <span className="text-lg text-green-600 font-semibold">
                    {product.discount_percentage}% off
                  </span>
                </div>
                <p className="text-sm text-gray-600">Inclusive of all taxes</p>
              </div>
              <div className="mb-6">
                <span className={`inline-block px-3 py-1 rounded text-sm font-medium ${
                  product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                </span>
              </div>
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-2">Brand</h3>
                <p className="text-gray-700">{product.brand}</p>
              </div>
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>
              {product.specifications && Object.keys(product.specifications).length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-lg mb-2">Specifications</h3>
                  <div className="space-y-2">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex border-b pb-2">
                        <span className="font-medium text-gray-600 w-1/3">{key}</span>
                        <span className="text-gray-900 w-2/3">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};