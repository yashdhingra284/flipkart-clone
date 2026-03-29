import { Heart, Star } from 'lucide-react';
import { useState } from 'react';

export const ProductCard = ({ product, onProductClick, onWishlistToggle, isInWishlist }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group relative"
      onClick={() => onProductClick(product.id)}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onWishlistToggle(product.id);
        }}
        className="absolute top-2 right-2 z-10 p-2 bg-white rounded-full shadow-md hover:scale-110 transition-transform"
      >
        <Heart
          className={`w-5 h-5 ${isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
        />
      </button>

      <div className="aspect-square p-4 flex items-center justify-center bg-gray-50">
        {imageError ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
            <span className="text-4xl">📦</span>
          </div>
        ) : (
          <img
            src={product.images?.[0] || 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg'}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        )}
      </div>

      <div className="p-4">
        <h3 className="font-medium text-gray-800 line-clamp-2 mb-2 min-h-[3rem]">
          {product.name}
        </h3>

        <div className="flex items-center space-x-2 mb-2">
          <div className="flex items-center space-x-1 bg-green-600 text-white px-2 py-0.5 rounded text-xs">
            <span>{Number(product.rating).toFixed(1)}</span>
            <Star className="w-3 h-3 fill-current" />
          </div>
          <span className="text-gray-500 text-xs">
            ({Number(product.reviews_count).toLocaleString()})
          </span>
        </div>

        <div className="flex items-baseline space-x-2 mb-2">
          <span className="text-2xl font-bold text-gray-900">
            ₹{Number(product.price).toLocaleString()}
          </span>
          <span className="text-sm text-gray-500 line-through">
            ₹{Number(product.original_price).toLocaleString()}
          </span>
          <span className="text-sm text-green-600 font-semibold">
            {product.discount_percentage}% off
          </span>
        </div>

        {product.stock > 0 ? (
          <span className="text-xs text-green-600">In Stock</span>
        ) : (
          <span className="text-xs text-red-600">Out of Stock</span>
        )}
      </div>
    </div>
  );
};