/* eslint-disable react-refresh/only-export-components */
import { User, HistoryIcon, LayoutDashboard, DownloadCloud, ListPlusIcon } from "lucide-react";

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
  },
  {
    id: 'admin-products',
    label: "Administración de Productos",
    icon: <ListPlusIcon />,
    description: "Sólo para usuarios administradores. Podés administrar los productos: agregar, eliminar y editar nuevos productos o existentes."
  }
];

const roleNames: Record<number, string> = {
  1: "Administrador",
  2: "Usuario Común",
};

export const ROLES = {
  ADMIN: 1,
  CUSTOMER: 2,
} as const;

export {
  navItems,
  roleNames
}