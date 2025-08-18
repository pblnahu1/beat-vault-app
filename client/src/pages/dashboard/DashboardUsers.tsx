// src/pages/dashboard/DashboardLayout.tsx
import { useState } from "react";
import { useManagementUsers } from "../../hooks/useManagementUsers";
import { DashboardHeaderUsers, DashboardNavigationUsers, DashboardOverviewCardsUsers, DashboardSectionContentUsers } from "../../components/DashboardUsers";
// import { ROLES } from "../../components/DashboardUsers/navItemsDashboard";
// import { AdminProducts } from "../../components/ProductManagementUserAdmin/admin/AdminProducts";

export default function DashboardLayout() {
  const currentUser = useManagementUsers();
  const [activeSection, setActiveSection] = useState('allCards');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActiveSection = () => {
    if(activeSection === 'allCards') {
      return <DashboardOverviewCardsUsers onSectionChange={handleSectionChange} />
    } else {
      return <DashboardSectionContentUsers activeSection={activeSection} />
    }
  }

  return (
    <div className="min-h-screen text-white">
      <DashboardHeaderUsers
        username={currentUser?.username}
        roleId={currentUser?.role_id}
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={toggleMobileMenu}
      />

      <DashboardNavigationUsers
        activeSection={activeSection}
        isMobileMenuOpen={isMobileMenuOpen}
        onSectionChange={handleSectionChange}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isActiveSection()}
      </main>
    </div>
  );
}