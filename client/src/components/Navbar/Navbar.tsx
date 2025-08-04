import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, UserCog2, Menu, X } from 'lucide-react';
import { useCart } from '../../store/useCart';
import { LogoutButton } from '../LogoutButton';
import { SearchBar } from '../UI/SearchComponent';
import { ButtonGestion } from '../UI/Buttons/ButtonGestionProps';
import authService from '../../services/authService';

export const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const items = useCart((state) => state.items);
  const itemCount = Array.isArray(items) ? items.reduce((total, item) => total + item.quantity, 0) : 0;
  const token = localStorage.getItem("authToken");
  const currentUser = authService.getCurrentUser();
  const username = currentUser?.username;

  const navLinks = [
    { to: "/", label: "Inicio" },
    { to: "/cart", label: "Carrito", icon: <ShoppingCart />, badge: itemCount > 0 ? itemCount : null }
  ];

  const handleSearch = (query: string) => {
    console.log("Buscando: ", query);
  }

  return (
    <nav className="bg-zinc-950 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2 text-xl font-semibold">
            <img src="/logo_cart.svg" alt="Logo Cart" className="w-6 h-6 bg-white rounded-xl" />
            <span className="text-slate-50 uppercase">Fluxshop</span>
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex gap-8 items-center">
            <div className='w-64 mr-6'>
              <SearchBar onSearch={handleSearch} />
            </div>
            {navLinks.map(({ to, label, icon, badge }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-2 text-slate-50 hover:text-gray-400 relative"
              >
                {icon && (
                  <span className="relative">
                    {icon}
                    {badge && (
                      <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {badge}
                      </span>
                    )}
                  </span>
                )}
                {label}
              </Link>
            ))}
            {token && username ? (
              <>
                <ButtonGestion 
                  username={username} 
                  className="ml-2" 
                  children={<UserCog2 />}
                />
                <LogoutButton />
              </>
            ) : (
              <Link
                to="/api/auth"
                className="flex items-center gap-2 text-slate-50 hover:text-slate-400"
              >
                <UserCog2 />
                <span>Cuenta</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-slate-50 focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menú"
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-zinc-950/95 backdrop-blur-md fixed inset-0 z-50 flex flex-col">
          <div className="flex items-center justify-between px-4 py-4 border-b border-zinc-800">
            <Link to="/" className="flex items-center gap-2 text-xl font-semibold" onClick={() => setMenuOpen(false)}>
              <img src="/logo_cart.svg" alt="Logo Cart" className="w-6 h-6 bg-white rounded-xl" />
              <span className="text-slate-50 uppercase">Fluxshop</span>
            </Link>
            <button
              className="text-slate-50"
              onClick={() => setMenuOpen(false)}
              aria-label="Cerrar menú"
            >
              <X size={28} />
            </button>
          </div>
          <div className="px-4 py-6 flex flex-col gap-6 flex-1 overflow-y-auto">
            <SearchBar onSearch={handleSearch} />
            <nav className="flex flex-col gap-2">
              {navLinks.map(({ to, label, icon, badge }) => (
                <Link
                  key={to}
                  to={to}
                  className="flex items-center gap-3 text-lg text-slate-50 hover:bg-zinc-900 rounded-lg px-3 py-2 transition relative"
                  onClick={() => setMenuOpen(false)}
                >
                  {icon && (
                    <span className="relative">
                      {icon}
                      {badge && (
                        <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {badge}
                        </span>
                      )}
                    </span>
                  )}
                  {label}
                </Link>
              ))}
            </nav>
            <div className="mt-auto flex flex-col gap-2">
              {token && username ? (
                <>
                  <ButtonGestion 
                    username={username} 
                    className="ml-2" 
                    children="Gestioná tu cuenta"   
                  />
                  <LogoutButton />
                </>
              ) : (
                <Link
                  to="/api/auth"
                  className="flex items-center gap-2 text-slate-50 hover:bg-zinc-900 rounded-lg px-3 py-2 transition"
                  onClick={() => setMenuOpen(false)}
                >
                  <UserCog2 />
                  <span>Cuenta</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};