import { Smartphone, Shirt, Tv, Book, Sofa, Laptop, Camera, Headphones, Home, ShoppingBag, Utensils, Zap } from 'lucide-react';

const categories = [
  { name: 'Smartphones', icon: Smartphone, value: 'Smartphones' },
  { name: 'Laptops', icon: Laptop, value: 'Laptops' },
  { name: 'Electronics', icon: Zap, value: 'Electronics' },
  { name: 'Fashion', icon: Shirt, value: 'Fashion' },
  { name: 'Footwear', icon: ShoppingBag, value: 'Footwear' },
  { name: 'Appliances', icon: Tv, value: 'Appliances' },
  { name: 'Headphones', icon: Headphones, value: 'Headphones' },
  { name: 'Televisions', icon: Tv, value: 'Televisions' },
  { name: 'Cameras', icon: Camera, value: 'Cameras' },
  { name: 'Home', icon: Home, value: 'Home' },
  { name: 'Furniture', icon: Sofa, value: 'Furniture' },
  { name: 'Food', icon: Utensils, value: 'Food' },
  { name: 'Books', icon: Book, value: 'Books' },
];

export const CategoryNav = ({ onCategorySelect, selectedCategory }) => {
  return (
    <div className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center space-x-6 overflow-x-auto py-3 scrollbar-hide">
          <button
            onClick={() => onCategorySelect('all')}
            className={`flex flex-col items-center space-y-1 min-w-[60px] ${
              selectedCategory === 'all' ? 'text-blue-600' : 'text-gray-600'
            } hover:text-blue-600 transition-colors`}
          >
            <div className="w-12 h-12 flex items-center justify-center">
              <span className="text-2xl">🏠</span>
            </div>
            <span className="text-xs font-medium whitespace-nowrap">All</span>
          </button>
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.value}
                onClick={() => onCategorySelect(category.value)}
                className={`flex flex-col items-center space-y-1 min-w-[60px] ${
                  selectedCategory === category.value ? 'text-blue-600' : 'text-gray-600'
                } hover:text-blue-600 transition-colors`}
              >
                <div className="w-12 h-12 flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-medium whitespace-nowrap">{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};