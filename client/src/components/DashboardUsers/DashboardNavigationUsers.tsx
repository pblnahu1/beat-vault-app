// src/pages/dashboard/components/DashboardNavigation.tsx
import { navItems } from "./navItemsDashboard";
import { useManagementUsers } from "../../hooks/useManagementUsers";
import { ROLES } from "./navItemsDashboard";

interface DashboardNavigationProps {
  activeSection: string;
  isMobileMenuOpen: boolean;
  onSectionChange: (sectionId: string) => void;
}

export function DashboardNavigationUsers({ 
  activeSection, 
  isMobileMenuOpen, 
  onSectionChange 
}: DashboardNavigationProps) {
  const currentUser = useManagementUsers();
  return (
    <nav className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800 sticky top-16 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Navigation */}
        <div className="hidden sm:flex space-x-1 py-3 overflow-x-auto">
          {navItems
            .filter((item) => {
              if(item.id==='admin-products' && currentUser?.role_id !== ROLES.ADMIN){
                return false;
              }
              return true;
            })
            .map((item) => (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap
                transition-all duration-200 font-medium
                ${activeSection === item.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }
              `}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="sm:hidden py-3 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left
                  transition-all duration-200
                  ${activeSection === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }
                `}
              >
                <span className="text-xl">{item.icon}</span>
                <div>
                  <span className="font-medium block">{item.label}</span>
                  <span className="text-xs text-gray-400">{item.description}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}