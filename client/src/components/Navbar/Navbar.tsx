import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Store, UserCog2 } from 'lucide-react';
import { useCart } from '../../store/useCart';
import { LogoutButton } from '../LogoutButton';

export const Navbar: React.FC = () => {
  const items = useCart((state) => state.items);
  const itemCount = Array.isArray(items) ? items.reduce((total, item) => total + item.quantity, 0) : 0;
  const token = localStorage.getItem("authToken");

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2 text-xl font-semibold">
            <Store className="text-blue-600" />
            FluxshopApp
          </Link>

          <div className="flex gap-4 items-center">
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
              Carrito
            </Link>

            {token ? (
              <>
                <LogoutButton />
              </>
            ) : (
              <Link
                to="/dashboard-auth"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <UserCog2 />
                Cuenta
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
