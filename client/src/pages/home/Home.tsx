// Home.tsx
import { ProductCard } from '../../components/ProductCard/ProductCard';
import { useProducts } from '../../hooks/useProducts';
import { AboutUs } from '../../components/AboutUs';
import { WelcomeUserSection } from '../../components/WelcomeUserSection';
import { Loader } from '../../components/UI/Loader';
import { useLoader } from '../../hooks/useLoader';
import { SearchBar } from '../../components/UI/SearchComponent';
import { useState, useMemo } from 'react';

export const Home = () => {
  const { products, error } = useProducts();
  const { loading } = useLoader();

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter ? p.category === categoryFilter : true;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, categoryFilter]);

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <WelcomeUserSection />

        <div className="flex justify-between items-center flex-col md:flex-row">
          <h1 className="text-3xl font-bold mb-8 text-slate-50">Catálogo</h1>

          <div className="">
            <SearchBar 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              categories={Array.from(new Set(products.map((p) => p.category).filter(Boolean)))}
            />
          </div>
        </div>

        {loading && <Loader />}
        {error && (
          <div className="bg-red-300 border border-red-500 text-red-700 px-4 py-3 rounded mb-6">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && filteredProducts.length === 0 && (
          <p className="text-slate-50 text-center py-12">No se encontraron productos disponibles.</p>
        )}

        {!loading && filteredProducts.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <ProductCard key={`${product.id}-${index}`} product={product} />
            ))}
          </div>
        )}
      </div>
      <AboutUs />
    </>
  );
};
