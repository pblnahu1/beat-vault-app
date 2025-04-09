import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Store, UserCog2 } from 'lucide-react';
import { useCart } from '../store/useCart';

export const Navbar: React.FC = () => {
  const items = useCart((state) => state.items);
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2 text-xl font-semibold">
            <Store className="text-blue-600" />
            ModernShop
          </Link>
          <Link
            to="/cart"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <div className="relative">
              <ShoppingCart />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </div>
            Cart
          </Link>

          <Link
            to="/dashboard-auth"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
              <div className="relative">
                <UserCog2 />
                {/* <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  1
                </span> */}
              </div>
              Account
          </Link>
        </div>
      </div>
    </nav>
  );
};