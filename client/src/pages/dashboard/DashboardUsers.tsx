// src/pages/dashboard/DashboardLayout.tsx
import { Outlet } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import authService from "../../services/authService";
import { useCart } from "../../store/useCart";
import { User, HistoryIcon, Heart, LayoutDashboard, DownloadCloud } from "lucide-react";
import { ExportDataComponent } from "../../components/ExportData";
import { ProfileConfiguration } from "../../components/ProfileConfiguration";
import { WishListComponent } from "../../components/WishList";
import { OrderHistoryComponent } from "../../components/OrderHistory";

export default function DashboardLayout() {

  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());
  const [activeSection, setActiveSection] = useState('allCards');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const prevUserRef = useRef(currentUser?.id_u);
  const username = currentUser?.username;
  const role_id = currentUser?.id_role;

  useEffect(() => {
    const handleStorage = () => setCurrentUser(authService.getCurrentUser());
    window.addEventListener("storage", handleStorage);

    // actualiza al montar (por si se cerró sesión en esa pestaña)
    const interval = setInterval(() => {
      setCurrentUser(authService.getCurrentUser());
    }, 1500);

    return () => {
      window.removeEventListener("storage", handleStorage);
      clearInterval(interval);
    }
  }, []);

  // Sincroniza el carrito cuando cambia el usuario
  useEffect(() => {
    if (currentUser?.id_u && prevUserRef.current !== currentUser.id_u) {
      useCart.getState().loadCart(); // o la función que corresponda para cargar el carrito
      prevUserRef.current = currentUser.id_u;
    }
    // Si no hay usuario, podrías limpiar el carrito:
    if (!currentUser) {
      useCart.getState().clearCart();
      prevUserRef.current = undefined;
    }
  }, [currentUser]);

  const navItems = [
    {
      id: 'allCards',
      label: "Inicio",
      icon: <LayoutDashboard/>
    },
    {
      id: 'profile',
      label: "Configuración del Perfil",
      icon: <User/>,
      description: "Información personal y configuración"
    },
    {
      id: 'orders',
      label: "Historial de Compras",
      icon: <HistoryIcon/>,
      description: "Revisa tus pedidos anteriores"
    },
    {
      id: 'wish-list',
      label: "Lista de Deseos",
      icon: <Heart/>,
      description: "Productos que te interesan"
    },
    {
      id: 'export-data',
      label: "Exportar tus datos",
      icon: <DownloadCloud/>,
      description: "Podés exportar tus datos personales en un archivo PDF o CSV"
    }
  ];

  const roleNames: Record<number, string> = {
    1: "Administrador",
    2: "Usuario Común",
  };

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
    setIsMobileMenuOpen(false);
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header Principal */}
      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Brand */}
            <div className="flex items-center space-x-4">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                Administración de Cuenta - Rol: {role_id ? roleNames[role_id] ?? 'Desconocido' : 'Desconocido'}
              </div>
            </div>

            {/* User info */}
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm text-gray-400">Bienvenido de vuelta</p>
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
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
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

      {/* Navigation Header */}
      <nav className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800 sticky top-16 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop Navigation */}
          <div className="hidden sm:flex space-x-1 py-3 overflow-x-auto">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSectionChange(item.id)}
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
                  onClick={() => handleSectionChange(item.id)}
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cards Grid - Solo se muestra cuando no hay una sección activa específica */}
        {activeSection === 'allCards' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {navItems.filter(item => item.id !== 'allCards').map((item) => (
              <div
                key={item.id}
                onClick={() => handleSectionChange(item.id)}
                className="bg-gray-900 border border-gray-800 rounded-xl p-6 cursor-pointer hover:bg-gray-800 hover:border-gray-700 transition-all duration-200 group"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-2xl">{item.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                      {item.label}
                    </h3>
                  </div>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {item.description}
                </p>
                <div className="mt-4 flex items-center text-blue-400 text-sm font-medium">
                  <span>Ver más</span>
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Content Area for specific sections */}
        {activeSection !== 'allCards' && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-6">
              <span className="text-3xl">
                {navItems.find(item => item.id === activeSection)?.icon}
              </span>
              <h1 className="text-2xl font-bold text-white">
                {navItems.find(item => item.id === activeSection)?.label}
              </h1>
            </div>

            <div className="text-gray-400">
              {/* Aquí renderizarías el contenido específico de cada sección */}
              {/* <p>Contenido de la sección: {activeSection}</p> */}
              {activeSection === 'profile' && <ProfileConfiguration />}
              {activeSection === 'export-data' && <ExportDataComponent />}
              {activeSection === 'orders' && <OrderHistoryComponent />}
              {activeSection === 'wish-list' && <WishListComponent />}
              {/* Puedes usar el componente Outlet aquí si necesitas routing */}
              <Outlet />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
