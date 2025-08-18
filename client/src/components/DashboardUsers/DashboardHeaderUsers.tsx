// src/pages/dashboard/components/DashboardHeader.tsx
import { roleNames } from "./navItemsDashboard";

interface DashboardHeaderProps {
  username: string | undefined;
  roleId: number | undefined;
  isMobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
}

export function DashboardHeaderUsers({ 
  username, 
  roleId, 
  isMobileMenuOpen, 
  onToggleMobileMenu 
}: DashboardHeaderProps) {
  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-4">
            <div className="text-lg md:text-xl font-semibold">
              <span className="text-slate-50">Administración de Cuenta</span>
              <br />
              <span className="text-indigo-300">
                Rol: {roleId ? roleNames[roleId] ?? 'Desconocido' : 'Desconocido'}
              </span>
            </div>
          </div>

          {/* User info */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block text-right">
              <p className="text-white font-medium">{username}</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-lg">
                {username?.charAt(0).toUpperCase()}
              </span>
            </div>

            {/* Mobile menu button */}
            <button
              className="sm:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors"
              onClick={onToggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span className={`block w-4 h-0.5 bg-white transform transition-transform ${isMobileMenuOpen ? 'rotate-45 translate-y-0.5' : ''}`}></span>
                <span className={`block w-4 h-0.5 bg-white my-0.5 transition-opacity ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`block w-4 h-0.5 bg-white transform transition-transform ${isMobileMenuOpen ? '-rotate-45 -translate-y-0.5' : ''}`}></span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}