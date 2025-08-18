import { ProductCard } from '../../components/ProductCard/ProductCard';
import { useProducts } from '../../hooks/useProducts';
import { AboutUs } from '../../components/AboutUs';
import { WelcomeUserSection } from '../../components/WelcomeUserSection';
import { Loader } from '../../components/UI/Loader';
import { useLoader } from '../../hooks/useLoader';

export const Home = () => {
  const {products, error} = useProducts();
  const {loading} = useLoader();

  return (
    <>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <WelcomeUserSection />
      
      <h1 className="text-3xl font-bold mb-8 text-slate-50">Catálogo</h1>

      {loading && <Loader/>}

      {error && (
        <div className="bg-red-300 border border-red-500 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <p className="text-slate-50 text-center py-12">No se encontraron productos disponibles.</p>
      )}


      {!loading && products.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product,index) => (
            <ProductCard key={`${product.id}-${index}`} product={product} />
          ))}
        </div>
      )}
    </div>
    <AboutUs />
    </>
  );
};