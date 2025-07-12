/* eslint-disable @typescript-eslint/no-explicit-any */
import { NavLinks } from './NavLinks';
import { AccountActions } from './AccountActions';
import { SearchBar } from '../UI/SearchComponent';
import { Store, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MobileMenu = ({ navLinks, token, username, handleSearch, setMenuOpen }: any) => (
  <div className="md:hidden bg-zinc-950/95 backdrop-blur-md fixed inset-0 z-50 flex flex-col">
    <div className="flex items-center justify-between px-4 py-4 border-b border-zinc-800">
      <Link to="/" className="flex items-center gap-2 text-xl font-semibold" onClick={() => setMenuOpen(false)}>
        <Store className="text-blue-600" />
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
        <NavLinks navLinks={navLinks} onClick={() => setMenuOpen(false)} />
      </nav>
      <div className="mt-auto flex flex-col gap-2">
        <AccountActions token={token} username={username} onClose={() => setMenuOpen(false)} />
      </div>
    </div>
  </div>
);