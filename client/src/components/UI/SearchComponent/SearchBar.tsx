import React, { useState } from 'react'
import { Search } from 'lucide-react'
import { SearchBarProps } from '../../../types/navBar';

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Buscar productos...",
  onSearch,
}) => {

  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query.trim());
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center bg-zinc-700 rounded-lg shadow px-2 py-1 w-full"
    >
      <input
        type="text"
        className="flex-1 bg-transparent outline-none text-slate-100 placeholder:text-slate-400 px-2"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button
        type="submit"
        className="text-blue-500 hover:text-blue-400 transition-colors p-1"
        aria-label="Buscar"
      >
        <Search size={22} />
      </button>
    </form>
  )
}
