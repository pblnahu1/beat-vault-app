// src/pages/dashboard/components/DashboardSectionContent.tsx
import { Outlet } from "react-router-dom";
import { navItems } from "./navItemsDashboard";
import { ProfileConfiguration } from "../../components/ProfileConfiguration";
import { OrderHistoryComponent } from "../../components/OrderHistory";
import { ExportDataComponent } from "../ExportData";

interface DashboardSectionContentProps {
  activeSection: string;
}

export function DashboardSectionContentUsers({ activeSection }: DashboardSectionContentProps) {
  const currentSection = navItems.find(item => item.id === activeSection);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <div className="flex items-center space-x-3 mb-6">
        <span className="text-3xl">
          {currentSection?.icon}
        </span>
        <h1 className="text-2xl font-bold text-white">
          {currentSection?.label}
        </h1>
      </div>

      <div className="text-gray-400">
        {activeSection === 'profile' && <ProfileConfiguration />}
        {activeSection === 'export-data' && <ExportDataComponent />}
        {activeSection === 'orders' && <OrderHistoryComponent />}
        <Outlet />
      </div>
    </div>
  );
}