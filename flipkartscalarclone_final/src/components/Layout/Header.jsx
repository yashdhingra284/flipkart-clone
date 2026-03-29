import { useState } from 'react';
import { Search, ShoppingCart, Heart, User, ChevronDown, Menu } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { LoginSignup } from '../auth/LoginSignup';

export const Header = ({ onNavigate, cartCount, searchQuery, onSearchChange }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const { user, signOut } = useAuth();

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="bg-blue-600 text-white">
          <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <button onClick={() => onNavigate('home')} className="flex items-center space-x-2">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 6L12 3L21 6V8L12 11L3 8V6Z" />
                  <path d="M3 10L12 13L21 10V12L12 15L3 12V10Z" />
                  <path d="M3 14L12 17L21 14V16L12 19L3 16V14Z" />
                </svg>
                <span className="text-xl font-bold">Flipkart</span>
              </button>
              <span className="text-xs italic">Explore Plus+</span>
            </div>

            <div className="hidden md:flex items-center space-x-6">
              {user ? (
                <div className="relative group">
                  <button className="flex items-center space-x-1 hover:bg-blue-700 px-3 py-1 rounded">
                    <User className="w-4 h-4" />
                    <span className="text-sm">{user.email?.split('@')[0]}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <button
                      onClick={() => onNavigate('orders')}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      My Orders
                    </button>
                    <button
                      onClick={signOut}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowLogin(true)}
                  className="flex items-center space-x-1 hover:bg-blue-700 px-3 py-1 rounded"
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm">Login</span>
                </button>
              )}
            </div>

            <button
              className="md:hidden"
              onClick={() => setShowMenu(!showMenu)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search for Products, Brands and More"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            onClick={() => user ? onNavigate('wishlist') : setShowLogin(true)}
            className="hidden md:flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 rounded"
          >
            <Heart className="w-5 h-5" />
            <span className="text-sm font-medium">Wishlist</span>
          </button>

          <button
            onClick={() => user ? onNavigate('cart') : setShowLogin(true)}
            className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 rounded relative"
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="text-sm font-medium">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {showMenu && (
          <div className="md:hidden bg-white border-t">
            {user ? (
              <div className="p-4 space-y-2">
                <button
                  onClick={() => {
                    onNavigate('orders');
                    setShowMenu(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded"
                >
                  My Orders
                </button>
                <button
                  onClick={() => {
                    onNavigate('wishlist');
                    setShowMenu(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded"
                >
                  Wishlist
                </button>
                <button
                  onClick={signOut}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="p-4">
                <button
                  onClick={() => {
                    setShowLogin(true);
                    setShowMenu(false);
                  }}
                  className="w-full bg-blue-600 text-white py-2 rounded"
                >
                  Login
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      {showLogin && <LoginSignup onClose={() => setShowLogin(false)} />}
    </>
  );
};