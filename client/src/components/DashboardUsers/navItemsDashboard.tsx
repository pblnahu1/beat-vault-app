import { User, HistoryIcon, LayoutDashboard, DownloadCloud } from "lucide-react";

const navItems = [
  {
    id: 'allCards',
    label: "Inicio",
    icon: <LayoutDashboard />
  },
  {
    id: 'profile',
    label: "Configuración del Perfil",
    icon: <User />,
    description: "Información personal y configuración"
  },
  {
    id: 'orders',
    label: "Historial de Compras",
    icon: <HistoryIcon />,
    description: "Revisa tus pedidos anteriores"
  },
  {
    id: 'export-data',
    label: "Exportar tus datos",
    icon: <DownloadCloud />,
    description: "Podés exportar tus datos personales en un archivo PDF o CSV"
  }
];

const roleNames: Record<number, string> = {
  1: "Administrador",
  2: "Usuario Común",
};

export {
  navItems,
  roleNames
}