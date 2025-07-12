import { Menu, X } from 'lucide-react';

interface MobileMenuButtonProps {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

export const MobileMenuButton: React.FC<MobileMenuButtonProps> = ({ menuOpen, setMenuOpen }) => (
  <button
    className="md:hidden text-slate-50 focus:outline-none"
    onClick={() => setMenuOpen(!menuOpen)}
    aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
  >
    {menuOpen ? <X size={28} /> : <Menu size={28} />}
  </button>
);