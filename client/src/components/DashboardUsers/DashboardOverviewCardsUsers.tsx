// src/pages/dashboard/components/DashboardOverviewCards.tsx
import { navItems } from "./navItemsDashboard";

interface DashboardOverviewCardsProps {
  onSectionChange: (sectionId: string) => void;
}

export function DashboardOverviewCardsUsers({ onSectionChange }: DashboardOverviewCardsProps) {
  const cards = navItems.filter(item => item.id !== 'allCards');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((item) => (
        <div
          key={item.id}
          onClick={() => onSectionChange(item.id)}
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
  );
}