import { useEffect, useState } from 'react';
import { Banner } from '../components/Home/Banner';
import { CategoryNav } from '../components/Layout/CategoryNav';
import { ProductCard } from '../components/Products/ProductCard';
import { useAuth } from '../contexts/AuthContext';
import { BASE_URL } from '../config';   // ✅ ADDED

export const HomePage = ({ onNavigate, searchQuery }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [wishlist, setWishlist] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadProducts();
    if (user) loadWishlist();
  }, [user]);

  useEffect(() => {
    filterProducts();
  }, [products, selectedCategory, searchQuery]);

  const loadProducts = async () => {
    setLoading(true);
    const response = await fetch(`${BASE_URL}/api/products`);   // ✅ FIXED
    const data = await response.json();
    if (data.products) setProducts(data.products);
    setLoading(false);
  };

  const loadWishlist = async () => {
    if (!user) return;
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/api/wishlist`, {   // ✅ FIXED
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await response.json();
    if (data.wishlist) {
      setWishlist(new Set(data.wishlist.map((item) => item.product_id)));
    }
  };

  const filterProducts = () => {
    let filtered = products;
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((p) => 
        p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    if (searchQuery) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredProducts(filtered);
  };

  const handleWishlistToggle = async (productId) => {
    if (!user) {
      alert('Please login to add items to wishlist');
      return;
    }
    const token = localStorage.getItem('token');
    const isInWishlist = wishlist.has(productId);

    if (isInWishlist) {
      const wishlistItems = await fetch(`${BASE_URL}/api/wishlist`, {   // ✅ FIXED
        headers: { Authorization: `Bearer ${token}` }
      }).then(r => r.json());

      const item = wishlistItems.wishlist.find(i => i.product_id === productId);
      if (item) {
        await fetch(`${BASE_URL}/api/wishlist/${item.id}`, {   // ✅ FIXED
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setWishlist((prev) => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    } else {
      await fetch(`${BASE_URL}/api/wishlist`, {   // ✅ FIXED
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ product_id: productId })
      });
      setWishlist((prev) => new Set([...prev, productId]));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CategoryNav
        onCategorySelect={setSelectedCategory}
        selectedCategory={selectedCategory}
      />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <Banner />
        </div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">
            {searchQuery
              ? `Search Results for "${searchQuery}"`
              : selectedCategory === 'all'
              ? 'All Products'
              : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Products`}
          </h2>
          <p className="text-gray-600">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
          </p>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg h-80 animate-pulse" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onProductClick={(id) => onNavigate('product', id)}
                onWishlistToggle={handleWishlistToggle}
                isInWishlist={wishlist.has(product.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};