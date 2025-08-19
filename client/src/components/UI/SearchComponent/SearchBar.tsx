import React from 'react';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  categoryFilter: string;
  setCategoryFilter: (v: string) => void;
  categories: string[];
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  searchTerm, setSearchTerm, 
  categoryFilter, setCategoryFilter, 
  categories 
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-8">
      <input
        type="text"
        placeholder="Buscar por nombre..."
        className="p-2 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <select
        className="p-2 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)}
      >
        <option value="">Todas las categorías</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
    </div>
  );
};
